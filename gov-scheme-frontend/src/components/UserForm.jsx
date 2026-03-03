export default function UserForm({ onSubmit }) {
  const [form, setForm] = useState({
    age: "",
    income: "",
    category: "",
    location: ""
  });

  return (
    <div className="bg-white p-6 rounded shadow">
      <input placeholder="Age" onChange={e => setForm({...form, age: e.target.value})}/>
      <input placeholder="Income" />
      <select>
        <option>SC</option>
        <option>ST</option>
        <option>OBC</option>
        <option>General</option>
      </select>
      <input placeholder="Location" />

      <button onClick={() => onSubmit(form)}>Continue</button>
    </div>
  );
}
