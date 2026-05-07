import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser } from "../services/loginService";
import { useAuth } from "../context/authContext";

export function useLoginForm() {
    const navigate = useNavigate();
    const { login } = useAuth();

    const [formData, setFormData] = useState({
        correo: "",
        contrasena: "",
    });

    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [showPassword, setShowPassword] = useState(false);

    const handleChange = (e) => {
        const { name, value } = e.target;

        setFormData((prev) => ({
            ...prev,
            [name]: value,
        }));
    };

    const togglePassword = () => {
        setShowPassword((prev) => !prev);
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        setLoading(true);
        setError(null);

        try {
            const response = await loginUser(formData);

            const { token, ...userData } = response.data;

            if (!token) {
                throw new Error("Token no recibido");
            }

            login(userData, token);

            navigate("/");

        } catch (err) {
            console.error(err);

            // Manejo fino de errores del backend
            if (err.response?.data) {
                setError(err.response.data);
            } else {
                setError("Error al iniciar sesión");
            }
        } finally {
            setLoading(false);
        }
    };

    return {
        formData,
        handleChange,
        handleSubmit,
        showPassword,
        togglePassword,
        loading,
        error,
    };
}