import os
import json
import numpy as np
import torch
import logging
import chromadb
from google import genai
from google.genai import types
from chromadb.config import Settings
from transformers import BertTokenizer, BertModel
from dotenv import load_dotenv


# ------------------------------------
# Setup
# ------------------------------------
load_dotenv()
logging.basicConfig(level=logging.INFO)

# Configure Gemini
client = genai.Client(api_key=os.getenv("GEMINI_API_KEY"))


# ------------------------------------
# Load Dataset
# ------------------------------------
with open("data/Cleaned_Schemes.json", "r", encoding="utf-8") as f:
    schemes_data = json.load(f)


# ------------------------------------
# Initialize ChromaDB
# ------------------------------------
chroma_client = chromadb.Client(Settings(
    persist_directory="./chroma_db",
    anonymized_telemetry=False
))

collection = chroma_client.get_or_create_collection(
    name="government_schemes",
    metadata={"hnsw:space": "cosine"}
)


# ------------------------------------
# Load Sentence Transformer (MiniLM)
# ------------------------------------
bert_tokenizer = BertTokenizer.from_pretrained(
    "sentence-transformers/all-MiniLM-L6-v2"
)
bert_model = BertModel.from_pretrained(
    "sentence-transformers/all-MiniLM-L6-v2"
)

bert_embedding_cache = {}


# ------------------------------------
# Embedding Function
# ------------------------------------
def get_bert_embedding(text, is_query=False):

    if not is_query and text in bert_embedding_cache:
        return bert_embedding_cache[text]

    inputs = bert_tokenizer(
        text,
        return_tensors="pt",
        truncation=True,
        padding=True,
        max_length=512
    )

    with torch.no_grad():
        outputs = bert_model(**inputs)

    embedding = outputs.last_hidden_state[:, 0, :].squeeze().numpy()

    if not is_query:
        bert_embedding_cache[text] = embedding

    return embedding


# ------------------------------------
# Load Data Into ChromaDB
# ------------------------------------
def load_data_into_chroma():

    if collection.count() > 0:
        print("ChromaDB already initialized.")
        return

    print("Loading schemes into ChromaDB...")

    for idx, scheme in enumerate(schemes_data):

        combined_text = f"{scheme['Scheme Name']}. {scheme['Description']}"

        embedding = get_bert_embedding(combined_text).tolist()

        metadata = {
            "scheme_name": scheme.get("Scheme Name", ""),
            "category": scheme.get("Category", ""),
            "target_group": scheme.get("Target Group", ""),
        }

        collection.add(
            ids=[str(idx)],
            embeddings=[embedding],
            documents=[combined_text],
            metadatas=[metadata]
        )

    print("ChromaDB loaded successfully.")


load_data_into_chroma()


# ------------------------------------
# GEMINI CALL HELPER
# ------------------------------------
def ask_gemini(prompt):

    response = client.models.generate_content(
        model="gemini-2.5-flash",
        contents=prompt,
    )

    return response.text


# ------------------------------------
# TRANSLATION FUNCTIONS (Using Gemini)
# ------------------------------------
def translate_to_english(text, source_lang):

    if source_lang == "en":
        return text

    prompt = f"Translate the following text to English accurately:\n\n{text}"

    return ask_gemini(prompt)


def translate_from_english(text, target_lang):

    if target_lang == "en":
        return text

    lang_name = {
        "hi": "Hindi",
        "ta": "Tamil"
    }.get(target_lang, "English")

    prompt = f"Translate the following text to {lang_name} accurately:\n\n{text}"

    return ask_gemini(prompt)


# ------------------------------------
# RAG RESPONSE GENERATOR
# ------------------------------------
def generate_gemini_response(context, query):

    prompt = (
        "You are an official Indian Government Schemes Assistant.\n"
        "Strictly answer only using the provided scheme information.\n"
        "Do not add external knowledge.\n\n"
        f"Retrieved Scheme Information:\n{context}\n\n"
        f"User Question:\n{query}\n\n"
        "Answer clearly and concisely:"
    )

    return ask_gemini(prompt)


# ------------------------------------
# INTENT DETECTION
# ------------------------------------
def detect_intent(query):

    q = query.lower().strip()

    greetings = [
        "hi", "hello", "hey",
        "vanakkam", "namaste",
        "good morning", "good evening"
    ]

    if q in greetings:
        return "greeting"

    scheme_keywords = [
        "scheme", "yojana", "subsidy",
        "apply", "eligibility",
        "benefit", "government",
        "kisan", "loan", "farmer",
        "scholarship", "welfare",
        "education", "grant",
        "financial", "assistance"
    ]

    for word in scheme_keywords:
        if word in q:
            return "scheme_query"

    # 🔥 IMPORTANT CHANGE
    # Instead of blocking, assume it is scheme query
    return "scheme_query"

# ------------------------------------
# QUERY EXPANSION
# ------------------------------------
def expand_query(query):

    q = query.lower()

    expansion_dict = {
        "farmer": "agriculture kisan pm-kisan crop subsidy rural",
        "student": "education scholarship academic financial assistance",
        "loan": "subsidy financial support bank assistance credit",
        "women": "female empowerment self-help group shg",
        "solar": "solar panel renewable energy subsidy rooftop",
        "housing": "home housing pradhan mantri awas yojana pmay",
        "health": "medical insurance ayushman bharat health scheme",
        "pension": "retirement old age pension scheme",
        "employment": "job rojgar skill development training",
        "startup": "entrepreneur business msme mudra loan"
    }

    expanded_query = q

    for keyword, expansion in expansion_dict.items():
        if keyword in q:
            expanded_query += " " + expansion

    return expanded_query


# ------------------------------------
# MAIN CHATBOT FUNCTION
# ------------------------------------
def chatbot_response(query, language="en"):

    intent = detect_intent(query)

    # Greeting
    if intent == "greeting":
        greetings_reply = {
            "en": "Hello! How can I help you with government schemes today?",
            "ta": "வணக்கம்! அரசு திட்டங்கள் பற்றி நான் எப்படி உதவலாம்?",
            "hi": "नमस्ते! मैं सरकारी योजनाओं के बारे में आपकी कैसे मदद कर सकता हूँ?"
        }
        return greetings_reply.get(language, greetings_reply["en"])

    # Unknown
    if intent == "unknown":
        unknown_reply = {
            "en": "I can assist only with Indian Government schemes. Please ask about a scheme.",
            "ta": "நான் அரசு திட்டங்கள் பற்றியே உதவ முடியும்.",
            "hi": "मैं केवल सरकारी योजनाओं से संबंधित प्रश्नों में सहायता कर सकता हूँ।"
        }
        return unknown_reply.get(language, unknown_reply["en"])

    # Translate
    english_query = translate_to_english(query, language)

    # Expand
    expanded_query = expand_query(english_query)

    # Embed
    query_embedding = get_bert_embedding(
        expanded_query, is_query=True
    ).astype("float32")

    # Query ChromaDB
    results = collection.query(
        query_embeddings=[query_embedding.tolist()],
        n_results=3
    )

    documents = results.get("documents", [[]])[0]

    if documents and len(documents) > 0:

        retrieved_context = "\n\n".join(documents)

        english_answer = generate_gemini_response(
            retrieved_context,
            english_query
        )

        if language != "en":
            return translate_from_english(english_answer, language)

        return english_answer

    fallback = {
        "en": "The requested scheme is not available in our database.",
        "ta": "இந்த திட்டம் எங்கள் தரவுத்தளத்தில் இல்லை.",
        "hi": "यह योजना हमारे डेटाबेस में उपलब्ध नहीं है।"
    }

    return fallback.get(language, fallback["en"])