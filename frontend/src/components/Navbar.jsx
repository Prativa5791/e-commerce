import React, { useState } from 'react'
import { Link, useLocation, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ShoppingCart, Menu, X, LogOut, User, LayoutDashboard } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import CartDrawer from './CartDrawer'

const NepaliStoreLogo = () => (
    <svg width="36" height="36" viewBox="0 0 36 36" fill="none" xmlns="http://www.w3.org/2000/svg">
        <defs>
            <linearGradient id="storeGrad" x1="0" y1="0" x2="36" y2="36" gradientUnits="userSpaceOnUse">
                <stop offset="0%" stopColor="#dc2626" />
                <stop offset="100%" stopColor="#b91c1c" />
            </linearGradient>
            <filter id="storeGlow">
                <feGaussianBlur stdDeviation="1.5" result="blur" />
                <feComposite in="SourceGraphic" in2="blur" operator="over" />
            </filter>
        </defs>
        <circle cx="18" cy="18" r="17" fill="url(#storeGrad)" filter="url(#storeGlow)" />
        <rect x="7" y="13" width="22" height="4" rx="1" fill="white" opacity="0.95" />
        <polygon points="5,17 18,10 31,17" fill="white" opacity="0.9" />
        <rect x="10" y="17" width="16" height="11" rx="1" fill="white" opacity="0.15" />
        <rect x="15" y="21" width="6" height="7" rx="1" fill="white" opacity="0.95" />
        <rect x="11" y="19" width="3" height="3" rx="0.5" fill="white" opacity="0.85" />
        <rect x="22" y="19" width="3" height="3" rx="0.5" fill="white" opacity="0.85" />
    </svg>
)

const navLinks = [
    { to: '/', label: 'Home' },
    { to: '/products', label: 'Products' },
    { to: '/orders', label: 'My Orders' },
]

export default function Navbar() {
    const { totalItems } = useCart()
    const { user, isAuthenticated, isSeller, isAdmin, logout } = useAuth()
    const [cartOpen, setCartOpen] = useState(false)
    const [mobileOpen, setMobileOpen] = useState(false)
    const [dropdownOpen, setDropdownOpen] = useState(false)
    const location = useLocation()
    const navigate = useNavigate()

    const handleLogout = () => {
        logout()
        setDropdownOpen(false)
        navigate('/')
    }

    return (
        <>
            <header className="fixed top-0 left-0 right-0 z-50">
                <div className="glass border-b border-white/10">
                    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                        <div className="flex items-center justify-between h-16">
                            {/* Logo */}
                            <Link to="/" className="flex items-center gap-2 group">
                                <motion.div
                                    whileHover={{ scale: 1.1, rotate: -5 }}
                                    transition={{ type: 'spring', stiffness: 400, damping: 15 }}
                                    className="drop-shadow-[0_0_10px_rgba(220,38,38,0.6)] group-hover:drop-shadow-[0_0_18px_rgba(220,38,38,0.9)] transition-all duration-300"
                                >
                                    <NepaliStoreLogo />
                                </motion.div>
                                <span className="font-bold text-lg" style={{ background: 'linear-gradient(135deg,#ef4444,#b91c1c)', WebkitBackgroundClip: 'text', WebkitTextFillColor: 'transparent' }}>Nepali Store</span>
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
                                {isAuthenticated ? (
                                    <div className="relative hidden md:block">
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            onClick={() => setDropdownOpen(!dropdownOpen)}
                                            className="flex items-center gap-2 px-3 py-2 glass rounded-xl hover:bg-white/10 transition-all duration-200"
                                        >
                                            <div className="w-7 h-7 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center">
                                                <User className="w-4 h-4 text-white" />
                                            </div>
                                            <span className="text-sm text-gray-300 font-medium">{user?.username}</span>
                                        </motion.button>

                                        <AnimatePresence>
                                            {dropdownOpen && (
                                                <motion.div
                                                    initial={{ opacity: 0, y: -8, scale: 0.95 }}
                                                    animate={{ opacity: 1, y: 0, scale: 1 }}
                                                    exit={{ opacity: 0, y: -8, scale: 0.95 }}
                                                    className="absolute right-0 mt-2 w-48 glass border border-white/10 rounded-xl overflow-hidden shadow-2xl"
                                                >
                                                    <Link
                                                        to="/profile"
                                                        onClick={() => setDropdownOpen(false)}
                                                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors border-b border-white/5"
                                                    >
                                                        <User className="w-4 h-4" />
                                                        My Profile
                                                    </Link>
                                                    {isAdmin && (
                                                        <Link
                                                            to="/admin-dashboard"
                                                            onClick={() => setDropdownOpen(false)}
                                                            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                                        >
                                                            <LayoutDashboard className="w-4 h-4" />
                                                            Admin Panel
                                                        </Link>
                                                    )}
                                                    {(isSeller || isAdmin) && (
                                                        <Link
                                                            to="/seller-dashboard"
                                                            onClick={() => setDropdownOpen(false)}
                                                            className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                                        >
                                                            <LayoutDashboard className="w-4 h-4" />
                                                            Seller Dashboard
                                                        </Link>
                                                    )}
                                                    <Link
                                                        to="/orders"
                                                        onClick={() => setDropdownOpen(false)}
                                                        className="flex items-center gap-2 px-4 py-3 text-sm text-gray-300 hover:text-white hover:bg-white/10 transition-colors"
                                                    >
                                                        <ShoppingCart className="w-4 h-4" />
                                                        My Orders
                                                    </Link>
                                                    <button
                                                        onClick={handleLogout}
                                                        className="flex items-center gap-2 px-4 py-3 text-sm text-red-400 hover:text-red-300 hover:bg-white/10 transition-colors w-full text-left border-t border-white/10"
                                                    >
                                                        <LogOut className="w-4 h-4" />
                                                        Sign Out
                                                    </button>
                                                </motion.div>
                                            )}
                                        </AnimatePresence>
                                    </div>
                                ) : (
                                    <Link
                                        to="/auth/login"
                                        className="hidden md:block text-sm text-gray-400 hover:text-white transition-colors duration-200 font-medium"
                                    >
                                        Sign In
                                    </Link>
                                )}

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
                                    {isAuthenticated ? (
                                        <>
                                            <Link to="/profile" onClick={() => setMobileOpen(false)}
                                                className="text-sm text-gray-400 hover:text-white py-2 px-3 flex items-center gap-2 border-b border-white/5 mb-1 pb-2">
                                                <User className="w-4 h-4" /> My Profile
                                            </Link>
                                            {isAdmin && (
                                                <Link to="/admin-dashboard" onClick={() => setMobileOpen(false)}
                                                    className="text-sm text-gray-400 hover:text-white py-2 px-3 flex items-center gap-2">
                                                    <LayoutDashboard className="w-4 h-4" /> Admin Panel
                                                </Link>
                                            )}
                                            {(isSeller || isAdmin) && (
                                                <Link to="/seller-dashboard" onClick={() => setMobileOpen(false)}
                                                    className="text-sm text-gray-400 hover:text-white py-2 px-3 flex items-center gap-2">
                                                    <LayoutDashboard className="w-4 h-4" /> Seller Dashboard
                                                </Link>
                                            )}
                                            <button onClick={() => { handleLogout(); setMobileOpen(false) }}
                                                className="text-sm text-red-400 hover:text-red-300 py-2 px-3 text-left flex items-center gap-2">
                                                <LogOut className="w-4 h-4" /> Sign Out
                                            </button>
                                        </>
                                    ) : (
                                        <Link to="/auth/login" onClick={() => setMobileOpen(false)}
                                            className="text-sm text-gray-400 hover:text-white py-2 px-3">
                                            Sign In
                                        </Link>
                                    )}
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
