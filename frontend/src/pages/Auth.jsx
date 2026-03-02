import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import { motion } from "framer-motion";
import { authApi } from "../lib/api";

/* ─── Login ──────────────────────────────────────────────────────────────── */
function Login() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", password: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await authApi.login(form.username, form.password);
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user ?? { username: form.username }));
            navigate("/products");
        } catch (err) {
            const msg =
                err?.response?.data?.non_field_errors?.[0] ||
                err?.response?.data?.detail ||
                "Login failed. Please check your credentials.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
                <h1 className="text-3xl font-bold text-white text-center mb-2">Welcome Back</h1>
                <p className="text-purple-200 text-center mb-8 text-sm">Sign in to your account</p>

                {error && (
                    <div className="bg-red-500/20 border border-red-400 text-red-200 rounded-lg px-4 py-3 mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-5">
                    <div>
                        <label className="block text-purple-100 text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            placeholder="Enter your username"
                            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-purple-100 text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder="Enter your password"
                            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg"
                    >
                        {loading ? "Signing in…" : "Sign In"}
                    </button>
                </form>

                <p className="text-center text-purple-200 text-sm mt-6">
                    Don&apos;t have an account?{" "}
                    <Link to="/auth/register" className="text-purple-400 hover:text-purple-300 font-semibold underline">
                        Register
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}

/* ─── Register ───────────────────────────────────────────────────────────── */
function Register() {
    const navigate = useNavigate();
    const [form, setForm] = useState({ username: "", email: "", password: "", mobile: "" });
    const [error, setError] = useState("");
    const [loading, setLoading] = useState(false);

    const handleChange = (e) =>
        setForm((prev) => ({ ...prev, [e.target.name]: e.target.value }));

    const handleSubmit = async (e) => {
        e.preventDefault();
        setError("");
        setLoading(true);
        try {
            const { data } = await authApi.register(
                form.username,
                form.email,
                form.password,
                form.mobile
            );
            localStorage.setItem("token", data.token);
            localStorage.setItem("user", JSON.stringify(data.user ?? { username: form.username }));
            navigate("/products");
        } catch (err) {
            const errData = err?.response?.data;
            const msg = errData
                ? Object.values(errData).flat().join(" ")
                : "Registration failed. Please try again.";
            setError(msg);
        } finally {
            setLoading(false);
        }
    };

    return (
        <motion.div
            className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-purple-900 to-slate-900 px-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
        >
            <div className="bg-white/10 backdrop-blur-md rounded-2xl shadow-2xl p-8 w-full max-w-md border border-white/20">
                <h1 className="text-3xl font-bold text-white text-center mb-2">Create Account</h1>
                <p className="text-purple-200 text-center mb-8 text-sm">Join Nepali Store today</p>

                {error && (
                    <div className="bg-red-500/20 border border-red-400 text-red-200 rounded-lg px-4 py-3 mb-6 text-sm">
                        {error}
                    </div>
                )}

                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <label className="block text-purple-100 text-sm font-medium mb-1">Username</label>
                        <input
                            type="text"
                            name="username"
                            value={form.username}
                            onChange={handleChange}
                            required
                            placeholder="Choose a username"
                            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-purple-100 text-sm font-medium mb-1">Email</label>
                        <input
                            type="email"
                            name="email"
                            value={form.email}
                            onChange={handleChange}
                            required
                            placeholder="your@email.com"
                            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-purple-100 text-sm font-medium mb-1">Mobile (optional)</label>
                        <input
                            type="tel"
                            name="mobile"
                            value={form.mobile}
                            onChange={handleChange}
                            placeholder="+977 98XXXXXXXX"
                            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                        />
                    </div>
                    <div>
                        <label className="block text-purple-100 text-sm font-medium mb-1">Password</label>
                        <input
                            type="password"
                            name="password"
                            value={form.password}
                            onChange={handleChange}
                            required
                            placeholder="Create a strong password"
                            className="w-full bg-white/10 border border-white/20 text-white placeholder-white/40 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
                        />
                    </div>
                    <button
                        type="submit"
                        disabled={loading}
                        className="w-full py-3 px-4 bg-purple-600 hover:bg-purple-500 disabled:bg-purple-800 text-white font-semibold rounded-lg transition-all duration-200 shadow-lg mt-2"
                    >
                        {loading ? "Creating account…" : "Create Account"}
                    </button>
                </form>

                <p className="text-center text-purple-200 text-sm mt-6">
                    Already have an account?{" "}
                    <Link to="/auth/login" className="text-purple-400 hover:text-purple-300 font-semibold underline">
                        Sign In
                    </Link>
                </p>
            </div>
        </motion.div>
    );
}

/* ─── Auth (router outlet) ───────────────────────────────────────────────── */
export default function Auth() {
    // The route path determines which form to show
    const path = window.location.pathname;
    if (path.includes("register")) return <Register />;
    return <Login />;
}
