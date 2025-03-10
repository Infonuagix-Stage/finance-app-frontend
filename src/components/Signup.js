import { useAuth0 } from "@auth0/auth0-react";

const Signup = () => {
  const { loginWithRedirect } = useAuth0();

  return (
    <button
      onClick={() => loginWithRedirect({ screen_hint: "signup" })}
      className="bg-green-600 text-white px-4 py-2 rounded"
    >
      Sign Up
    </button>
  );
};

export default Signup;




// import React, { useState } from "react";
// import axios from "axios";
// import Navbar from "./layouts/Navbar";

// const Signup = () => {
//   const [formData, setFormData] = useState({
//     name: "",
//     email: "",
//     password: "",
//   });
//   const [message, setMessage] = useState("");
//   const [loading, setLoading] = useState(false);

//   const handleChange = (e) => {
//     setFormData({ ...formData, [e.target.name]: e.target.value });
//   };

//   const handleSubmit = async (e) => {
//     e.preventDefault();
//     setMessage("");
//     setLoading(true);

//     try {
//       // Register the user
//       const registerResponse = await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/register`,
//         formData,
//         {
//           headers: { "Content-Type": "application/json" },
//         }
//       );
//       console.log("Register Response:", registerResponse.data);

//       // Automatically log in the user after successful registration
//       const loginResponse = await axios.post(
//         `${process.env.REACT_APP_BACKEND_URL}/api/v1/auth/login`,
//         {
//           email: formData.email,
//           password: formData.password,
//         }
//       );
//       console.log("Token reçu après connexion :", loginResponse.data.token);

//       // Store the JWT token in localStorage
//       localStorage.setItem("token", loginResponse.data.token);

//       // Redirect to dashboard
//       window.location.href = "/dashboard";
//     } catch (error) {
//       console.error("Erreur API:", error);
//     } finally {
//       setLoading(false);
//     }
//   };

//   return (
//     <div className="min-h-screen flex flex-col items-center justify-center bg-gray-900 text-gray-200 px-4">
//       <Navbar />
//       <div className="w-full max-w-md bg-gray-800 p-8 rounded-xl shadow-lg border border-gray-700">
//         <h2 className="text-3xl font-semibold text-center mb-6 text-gray-100">
//           Inscription
//         </h2>
//         <form onSubmit={handleSubmit} className="space-y-5">
//           <div>
//             <label className="block text-gray-400 mb-2">Nom</label>
//             <input
//               type="text"
//               name="name"
//               placeholder="Votre nom"
//               value={formData.name}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-gray-400 mb-2">Email</label>
//             <input
//               type="email"
//               name="email"
//               placeholder="Votre email"
//               value={formData.email}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             />
//           </div>
//           <div>
//             <label className="block text-gray-400 mb-2">Mot de passe</label>
//             <input
//               type="password"
//               name="password"
//               placeholder="Votre mot de passe"
//               value={formData.password}
//               onChange={handleChange}
//               required
//               className="w-full px-4 py-3 rounded-lg bg-gray-700 border border-gray-600 text-gray-200 focus:ring-2 focus:ring-blue-500 focus:outline-none"
//             />
//           </div>
//           <button
//             type="submit"
//             disabled={loading}
//             className={`w-full py-3 rounded-lg text-white font-semibold text-lg transition ${
//               loading
//                 ? "bg-gray-600 cursor-not-allowed"
//                 : "bg-blue-600 hover:bg-blue-700"
//             }`}
//           >
//             {loading ? "Inscription..." : "S'inscrire"}
//           </button>
//         </form>
//         {message && (
//           <p className="mt-4 text-center text-sm font-medium text-gray-300">
//             {message}
//           </p>
//         )}
//         <p className="mt-4 text-center text-gray-400 text-sm">
//           Vous avez déjà un compte ?{" "}
//           <a href="/login" className="text-blue-500 hover:underline">
//             Connectez-vous
//           </a>
//         </p>
//       </div>
//     </div>
//   );
// };

// export default Signup;
