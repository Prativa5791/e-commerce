import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Zap, Eye, EyeOff, ArrowRight, Mail, Lock, User } from 'lucide-react'

function AuthInput({ icon: Icon, type, placeholder, value, onChange }) {
    const [show, setShow] = useState(false)
    const isPassword = type === 'password'
    return (
        <div className="relative">
            <Icon className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
            <input
                type={isPassword && show ? 'text' : type}
                placeholder={placeholder}
                value={value}
                onChange={onChange}
                className="w-full pl-11 pr-11 py-3.5 glass rounded-2xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
            />
            {isPassword && (
                <button
                    type="button"
                    onClick={() => setShow(!show)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-300 transition-colors"
                >
                    {show ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
            )}
        </div>
    )
}

function Login() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ email: '', password: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setLoading(true)
        setError('')
        // Simulate auth — replace with real API when backend auth is ready
        await new Promise((r) => setTimeout(r, 1000))
        if (form.email && form.password) {
            localStorage.setItem('auth_user', JSON.stringify({ email: form.email, name: 'User' }))
            navigate('/')
        } else {
            setError('Please fill in all fields.')
        }
        setLoading(false)
    }

    return (
        <div className="min-h-screen hero-bg flex items-center justify-center px-4 pt-16">
            <div className="absolute top-20 left-1/3 w-72 h-72 bg-violet-600/15 rounded-full blur-3xl pointer-events-none" />
            <div className="absolute bottom-20 right-1/3 w-56 h-56 bg-pink-600/10 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-md"
            >
                {/* Card */}
                <div className="glass rounded-3xl p-8 shadow-2xl border border-white/10">
                    {/* Logo */}
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center mx-auto mb-4 glow-purple">
                            <Zap className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-white">Welcome back</h1>
                        <p className="text-gray-400 text-sm mt-2">Sign in to your NexShop account</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AuthInput
                            icon={Mail}
                            type="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        <AuthInput
                            icon={Lock}
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />

                        {error && (
                            <motion.p
                                initial={{ opacity: 0, y: -5 }}
                                animate={{ opacity: 1, y: 0 }}
                                className="text-red-400 text-sm text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 glow-purple mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Sign In <ArrowRight className="w-5 h-5" /></>
                            )}
                        </motion.button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Don't have an account?{' '}
                        <Link to="/register" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                            Sign up
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

function Register() {
    const navigate = useNavigate()
    const [form, setForm] = useState({ name: '', email: '', password: '', confirm: '' })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        if (form.password !== form.confirm) {
            setError('Passwords do not match.')
            return
        }
        setLoading(true)
        await new Promise((r) => setTimeout(r, 1000))
        localStorage.setItem('auth_user', JSON.stringify({ email: form.email, name: form.name }))
        navigate('/')
        setLoading(false)
    }

    return (
        <div className="min-h-screen hero-bg flex items-center justify-center px-4 pt-16">
            <div className="absolute top-20 right-1/3 w-72 h-72 bg-purple-600/15 rounded-full blur-3xl pointer-events-none" />

            <motion.div
                initial={{ opacity: 0, y: 30, scale: 0.97 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                className="w-full max-w-md"
            >
                <div className="glass rounded-3xl p-8 shadow-2xl border border-white/10">
                    <div className="text-center mb-8">
                        <div className="w-14 h-14 rounded-2xl bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center mx-auto mb-4 glow-purple">
                            <Zap className="w-7 h-7 text-white" />
                        </div>
                        <h1 className="text-3xl font-black text-white">Create account</h1>
                        <p className="text-gray-400 text-sm mt-2">Join NexShop today</p>
                    </div>

                    <form onSubmit={handleSubmit} className="space-y-4">
                        <AuthInput
                            icon={User}
                            type="text"
                            placeholder="Full name"
                            value={form.name}
                            onChange={(e) => setForm({ ...form, name: e.target.value })}
                        />
                        <AuthInput
                            icon={Mail}
                            type="email"
                            placeholder="Email address"
                            value={form.email}
                            onChange={(e) => setForm({ ...form, email: e.target.value })}
                        />
                        <AuthInput
                            icon={Lock}
                            type="password"
                            placeholder="Password"
                            value={form.password}
                            onChange={(e) => setForm({ ...form, password: e.target.value })}
                        />
                        <AuthInput
                            icon={Lock}
                            type="password"
                            placeholder="Confirm password"
                            value={form.confirm}
                            onChange={(e) => setForm({ ...form, confirm: e.target.value })}
                        />

                        {error && (
                            <motion.p
                                initial={{ opacity: 0 }}
                                animate={{ opacity: 1 }}
                                className="text-red-400 text-sm text-center"
                            >
                                {error}
                            </motion.p>
                        )}

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            type="submit"
                            disabled={loading}
                            className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 glow-purple mt-2"
                        >
                            {loading ? (
                                <div className="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                            ) : (
                                <>Create Account <ArrowRight className="w-5 h-5" /></>
                            )}
                        </motion.button>
                    </form>

                    <p className="text-center text-gray-500 text-sm mt-6">
                        Already have an account?{' '}
                        <Link to="/login" className="text-violet-400 hover:text-violet-300 font-semibold transition-colors">
                            Sign in
                        </Link>
                    </p>
                </div>
            </motion.div>
        </div>
    )
}

// Default export: renders Login or Register based on path
export default function Auth() {
    const { pathname } = useLocation()
    return pathname === '/register' ? <Register /> : <Login />
}
