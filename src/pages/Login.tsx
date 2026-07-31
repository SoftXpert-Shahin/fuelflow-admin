import { useState } from "react";
import { Navigate } from "react-router-dom";
import { signIn } from "../services/auth";
import { useAuth } from "../context/AuthContext";
import "../styles/Login.css";

export default function Login() {
    const { user } = useAuth();

    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState("");

    if (user) {
        return <Navigate to="/admin/dashboard" replace />;
    }

    async function handleLogin(e: React.FormEvent) {
        e.preventDefault();

        setLoading(true);
        setError("");

        const { error } = await signIn(email, password);

        if (error) {
            setError(error.message);
        }

        setLoading(false);
    }

    return (
        <div className="login-page">

            <form
                className="login-card"
                onSubmit={handleLogin}
            >

                <h1>FuelFlow Admin</h1>

                <p>Sign in to continue</p>

                <input
                    type="email"
                    placeholder="Email"
                    value={email}
                    onChange={(e)=>setEmail(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    value={password}
                    onChange={(e)=>setPassword(e.target.value)}
                />

                {error && (
                    <div className="error">
                        {error}
                    </div>
                )}

                <button disabled={loading}>
                    {loading ? "Signing In..." : "Login"}
                </button>

            </form>

        </div>
    );
}