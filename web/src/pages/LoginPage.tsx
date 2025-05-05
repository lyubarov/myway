import { useState } from "react";
import { signIn } from "../firebase/auth";
import { useNavigate } from "react-router-dom";
import img from "../../assets/icons/backTitle.png";

export default function LoginPage() {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!isLoggedIn) {
      setIsLoggedIn(true);
      await signIn(email, password);
      navigate("/");
    }
  };

  return (
    <div className="h-[100vh] flex items-center">
      <img src={img} alt="back" className="absolute bottom-0" />
      <div className="max-w-md mx-auto px-8 py-10 bg-white min-w-[720px] relative z-20">
        <h2 className="text-2xl font-bold mb-4 text-black text-center">
          Будь ласка, введіть свої дані для входу
        </h2>
        <form onSubmit={handleLogin}>
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
            Вхід
          </button>
        </form>
        {/* <p className="text-black text-center mt-3 ">або</p>
        <button
          onClick={() => navigate("/register")}
          className="mt-4 w-full py-2 px-4 bg-gray-200 text-gray-700 rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500"
        >
          Реєстрація
        </button> */}
      </div>
    </div>
  );
}
