import { useState } from "react";
import { signUp } from "../firebase/auth";
import { useNavigate } from "react-router-dom";

export default function RegisterPage() {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();

    const user = await signUp(email, password, displayName);

    console.log("Registered successfully:", user);
    if (user) navigate("/");
  };

  return (
    <div className="h-[100vh] flex items-center">
      <img
        src="../../assets/icons/backTitle.png"
        alt="back"
        className="absolute bottom-0"
      />
      <div className="max-w-md mx-auto px-8 py-10 bg-white min-w-[720px] relative z-20">
        <h2 className="text-2xl font-bold mb-4 text-black text-center">
          Будь ласка, введіть свої дані для входу
        </h2>
        <form onSubmit={handleRegister}>
          <div className="mb-4">
            <label
              htmlFor="name"
              className="block text-sm font-medium text-gray-700"
            >
              Ім'я:
            </label>
            <input
              type="text"
              id="name"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              required
              className="mt-1 bg-gray-200 text-black block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="email"
              className="block text-sm font-medium text-gray-700"
            >
              Пошта:
            </label>
            <input
              type="email"
              id="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="mt-1 bg-gray-200 text-black block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <div className="mb-4">
            <label
              htmlFor="password"
              className="block text-sm font-medium text-gray-700"
            >
              Пароль:
            </label>
            <input
              type="password"
              id="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="mt-1 bg-gray-200 text-black block w-full px-3 py-2 border border-gray-300 focus:outline-none focus:ring-indigo-500 focus:border-indigo-500"
            />
          </div>
          <button
            type="submit"
            className="w-full py-2 px-4 bg-black text-white hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-opacity-50"
          >
            Реєстрація
          </button>
        </form>
        <p className="text-black text-center mt-3">або</p>
        <button
          onClick={() => navigate("/login")}
          className="mt-4 w-full py-2 px-4 bg-gray-200 text-gray-700  hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Вхід
        </button>
      </div>
    </div>
  );
}
