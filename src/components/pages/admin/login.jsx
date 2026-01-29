import { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
    const [user, setUser] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState("");

    const navigate = useNavigate();

    const VALID_USER = "admin";
    const VALID_PASS = "claveadmin";

    const handleSubmit = (e) => {
        e.preventDefault();

        if (user === VALID_USER && password === VALID_PASS) {
            localStorage.setItem("adminAuth", "true");
            setError("");
            navigate("dashboard");
        } else {
            setError("Usuario o clave incorrectos");
        }
    };

    return (
        <div className="min-h-screen bg-gradient-to-b from-gray-50 to-white flex items-center justify-center p-4">
            <div className="max-w-md w-full">
                

                {/* Formulario */}
                <div className="bg-white rounded-xl shadow-lg border border-gray-100 overflow-hidden">
                    <div className="p-8">
                        <h2 className="text-2xl font-bold text-gray-900 mb-2">
                            Inicio de Sesión
                        </h2>
                        <p className="text-gray-600 mb-6">
                            Ingresa tus credenciales para acceder al panel
                        </p>

                        <form onSubmit={handleSubmit}>
                            {/* Usuario */}
                            <div className="mb-6">
                                <label className="block text-gray-900 font-medium mb-2">
                                    Usuario
                                </label>
                                <div className="relative">
                                    <input
                                        type="text"
                                        value={user}
                                        onChange={(e) => setUser(e.target.value)}
                                        className="w-full p-3.5 pl-12 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                                        placeholder="admin"
                                        required
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Clave */}
                            <div className="mb-6">
                                <label className="block text-gray-900 font-medium mb-2">
                                    Contraseña
                                </label>
                                <div className="relative">
                                    <input
                                        type="password"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        className="w-full p-3.5 pl-12 rounded-xl border border-gray-300 bg-white text-gray-900 placeholder-gray-500 focus:outline-none focus:border-red-500 focus:ring-2 focus:ring-red-100 transition-all"
                                        placeholder="••••••••"
                                        required
                                    />
                                    <div className="absolute left-3 top-1/2 transform -translate-y-1/2">
                                        <svg className="w-5 h-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
                                        </svg>
                                    </div>
                                </div>
                            </div>

                            {/* Mensaje de error */}
                            {error && (
                                <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg">
                                    <p className="text-red-700 font-medium flex items-center gap-2">
                                        <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 20 20">
                                            <path fillRule="evenodd" d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a1 1 0 000 2v3a1 1 0 001 1h1a1 1 0 100-2v-3a1 1 0 00-1-1H9z" clipRule="evenodd" />
                                        </svg>
                                        {error}
                                    </p>
                                </div>
                            )}

                            {/* Botón */}
                            <button
                                type="submit"
                                className="w-full bg-gradient-to-r from-red-600 to-red-500 text-white py-3.5 px-6 rounded-xl font-semibold hover:from-red-700 hover:to-red-600 active:from-red-800 active:to-red-700 shadow-lg hover:shadow-xl transition-all duration-300"
                            >
                                <span className="flex items-center justify-center gap-2">
                                    Iniciar Sesión
                                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 16l-4-4m0 0l4-4m-4 4h14m-5 4v1a3 3 0 01-3 3H6a3 3 0 01-3-3V7a3 3 0 013-3h7a3 3 0 013 3v1" />
                                    </svg>
                                </span>
                            </button>
                        </form>

            
                    </div>
                    
                    {/* Barra decorativa inferior */}
                    <div className="h-1 bg-gradient-to-r from-red-500 via-gray-400 to-black opacity-60"></div>
                </div>


                {/* Decoración sutil */}
                <div className="hidden md:block fixed bottom-0 left-0 right-0 h-1 bg-gradient-to-r from-transparent via-red-500 to-transparent opacity-20"></div>
            </div>
        </div>
    );
};

export default Login;