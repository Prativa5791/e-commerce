import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X } from 'lucide-react'
import { useCart } from '../context/CartContext'
import CartDrawer from './CartDrawer'

// P-gemstone logo — visually inspired by "Prativa" without using the name
const PGemLogo = () => (
    <svg width="32" height="32" viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="gemGrad" x1="0" y1="0" x2="32" y2="32" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#a855f7" />
                <stop offset="50%" stopColor="#ec4899" />
                <stop offset="100%" stopColor="#7c3aed" />
            </linearGradient>
            <linearGradient id="gemHighlight" x1="0" y1="0" x2="16" y2="16" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="rgba(255,255,255,0.4)" />
                <stop offset="100%" stopColor="rgba(255,255,255,0)" />
            </linearGradient>
            <filter id="gemGlow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        {/* Hexagonal gemstone shape */}
        <polygon
            points="16,2 28,9 28,23 16,30 4,23 4,9"
            fill="url(#gemGrad)"
            filter="url(#gemGlow)"
        />
        {/* Inner facet highlight */}
        <polygon
            points="16,4 26,10 26,22 16,28 6,22 6,10"
            fill="url(#gemHighlight)"
            opacity="0.3"
        />
        {/* Face cut lines */}
        <line x1="16" y1="2" x2="16" y2="30" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <line x1="4" y1="9" x2="28" y2="23" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        <line x1="28" y1="9" x2="4" y2="23" stroke="rgba(255,255,255,0.15)" strokeWidth="0.5" />
        {/* "P" letter */}
        <text x="11" y="21" fontFamily="'Inter', sans-serif" fontWeight="700" fontSize="13" fill="white" letterSpacing="-0.5">P</text>
    </svg>
)

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/orders', label: 'My Orders' },
]

export default function Navbar() {
    const { totalItems } = useCart()
    const [cartOpen, setCartOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const location = useLocation()

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50">
                <div className="glass border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-2 group">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: 5 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                    className="drop-shadow-[0_0_8px_rgba(168,85,247,0.7)] group-hover:drop-shadow-[0_0_14px_rgba(236,72,153,0.8)] transition-all duration-300"
                                >
                                    <PGemLogo />
                                </motion.div>
                                <span className="font-bold text-lg gradient-text">NexShop</span>
                            </Link>

                            {/* Desktop Nav */}
                            <nav className="hidden md:flex items-center gap-8">
                                {navLinks.map((link) => (
                                    <Link
                                        key={link.to}
                                        to={link.to}
                                        className={`text-sm font-medium transition-colors duration-200 relative ${location.pathname === link.to
                                            ? 'text-violet-400'
                                            : 'text-gray-400 hover:text-white'
                                            }`}
                                    >
                                        {link.label}
                                        {location.pathname === link.to && (
                                            <motion.div
                                                layoutId="nav-indicator"
                                                className="absolute -bottom-1 left-0 right-0 h-0.5 bg-gradient-to-r from-violet-500 to-purple-500 rounded-full"
                                            />
                                        )}
                                    </Link>
                                ))}
                            </nav>

                            {/* Actions */}
                            <div className="flex items-center gap-3">
                                <Link
                                    to="/login"
                                    className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium"
                                >
                                    Sign In
                                </Link>

                                {/* Cart Button */}
                                <motion.button
                                    whileHover={{ scale: 1.05 }}
                                    whileTap={{ scale: 0.95 }}
                                    onClick={() => setCartOpen(true)}
                                    className="relative p-2.5 glass rounded-xl hover:bg-white/10 transition-all duration-200"
                                    aria-label="Open cart"
                                >
                                    <ShoppingCart className="w-5 h-5 text-gray-300" />
                                    <AnimatePresence>
                                        {totalItems > 0 && (
                                            <motion.span
                                                key="cart-badge"
                                                initial={{ scale: 0 }}
                                                animate={{ scale: 1 }}
                                                exit={{ scale: 0 }}
                                                className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 rounded-full text-xs font-bold text-white flex items-center justify-center"
                                            >
                                                {totalItems > 9 ? '9+' : totalItems}
                                            </motion.span>
                                        )}
                                    </AnimatePresence>
                                </motion.button>

                                {/* Mobile Menu Toggle */}
                                <button
                                    className="md:hidden p-2 glass rounded-xl hover:bg-white/10 transition-all"
                                    onClick={() => setMobileOpen(!mobileOpen)}
                                >
                                    {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
                                </button>
                            </div>
                        </div>
                    </div>

                    {/* Mobile Nav */}
                    <AnimatePresence>
                        {mobileOpen && (
                            <motion.nav
                                initial={{ height: 0, opacity: 0 }}
                                animate={{ height: 'auto', opacity: 1 }}
                                exit={{ height: 0, opacity: 0 }}
                                className="md:hidden overflow-hidden border-t border-white/10"
                            >
                                <div className="px-4 py-4 flex flex-col gap-3">
                                    {navLinks.map((link) => (
                                        <Link
                                            key={link.to}
                                            to={link.to}
                                            onClick={() => setMobileOpen(false)}
                                            className={`text-sm font-medium py-2 px-3 rounded-lg transition-colors ${location.pathname === link.to
                                                ? 'bg-violet-500/20 text-violet-400'
                                                : 'text-gray-400 hover:text-white hover:bg-white/5'
                                                }`}
                                        >
                                            {link.label}
                                        </Link>
                                    ))}
                                    <Link
                                        to="/login"
                                        onClick={() => setMobileOpen(false)}
                                        className="text-sm text-gray-400 hover:text-white py-2 px-3"
                                    >
                                        Sign In
                                    </Link>
                                </div>
                            </motion.nav>
                        )}
                    </AnimatePresence>
                </div>
            </header>

            <CartDrawer open={cartOpen} onClose={() => setCartOpen(false)} />
        </>
    )
}
