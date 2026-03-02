import React, { useState } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X, Zap } from 'lucide-react'
import { useCart } from '../context/CartContext'
import CartDrawer from './CartDrawer'

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
                                <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center shadow-lg group-hover:shadow-violet-500/50 transition-shadow duration-300">
                                    <Zap className="w-4 h-4 text-white" />
                                </div>
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
