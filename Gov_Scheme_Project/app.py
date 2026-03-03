from flask import Flask, request, jsonify, render_template
from flask_cors import CORS
from chatbot import chatbot_response

app = Flask(__name__)

# Allow React / Vite frontend
CORS(
    app,
    resources={r"/chatbot": {"origins": "http://localhost:5173"}}
)

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chatbot', methods=['POST'])
def handle_chatbot():
    data = request.get_json()

    query = data.get('message')
    language = data.get('language', 'en')  # en | ta | hi

    if not query:
        return jsonify({"reply": "No query received"}), 400

    response = chatbot_response(query, language)
    return jsonify({"reply": response})

if __name__ == '__main__':
    app.run(debug=True, host='0.0.0.0', port=5000)
