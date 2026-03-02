import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, Trash2, ShoppingBag, Plus, Minus, ArrowRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'
import { useCart } from '../context/CartContext'

export default function CartDrawer({ open, onClose }) {
    const { items, removeItem, updateQuantity, totalPrice, clearCart, totalItems } = useCart()
    const navigate = useNavigate()

    const handleCheckout = () => {
        onClose()
        navigate('/cart')
    }

    return (
        <AnimatePresence>
            {open && (
                <>
                    {/* Backdrop */}
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        onClick={onClose}
                        className="fixed inset-0 z-50 bg-black/60 backdrop-blur-sm"
                    />

                    {/* Drawer */}
                    <motion.div
                        initial={{ x: '100%' }}
                        animate={{ x: 0 }}
                        exit={{ x: '100%' }}
                        transition={{ type: 'spring', damping: 30, stiffness: 300 }}
                        className="fixed right-0 top-0 bottom-0 z-50 w-full max-w-md flex flex-col"
                        style={{ background: 'linear-gradient(135deg, #0f0f1a, #1a1a2e)' }}
                    >
                        {/* Header */}
                        <div className="flex items-center justify-between p-6 border-b border-white/10">
                            <div className="flex items-center gap-3">
                                <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center">
                                    <ShoppingBag className="w-5 h-5 text-violet-400" />
                                </div>
                                <div>
                                    <h2 className="font-bold text-white text-lg">Your Cart</h2>
                                    <p className="text-xs text-gray-400">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                                </div>
                            </div>
                            <button
                                onClick={onClose}
                                className="p-2 glass rounded-xl hover:bg-white/10 transition-all"
                            >
                                <X className="w-5 h-5 text-gray-400" />
                            </button>
                        </div>

                        {/* Items */}
                        <div className="flex-1 overflow-y-auto p-4 space-y-4">
                            <AnimatePresence mode="popLayout">
                                {items.length === 0 ? (
                                    <motion.div
                                        initial={{ opacity: 0 }}
                                        animate={{ opacity: 1 }}
                                        className="flex flex-col items-center justify-center h-60 gap-4 text-center"
                                    >
                                        <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center">
                                            <ShoppingBag className="w-10 h-10 text-gray-600" />
                                        </div>
                                        <div>
                                            <p className="text-gray-300 font-medium">Your cart is empty</p>
                                            <p className="text-gray-500 text-sm mt-1">Add some products to get started</p>
                                        </div>
                                        <button
                                            onClick={onClose}
                                            className="px-6 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl transition-colors"
                                        >
                                            Continue Shopping
                                        </button>
                                    </motion.div>
                                ) : (
                                    items.map((item) => (
                                        <motion.div
                                            key={item.id}
                                            layout
                                            initial={{ opacity: 0, x: 50 }}
                                            animate={{ opacity: 1, x: 0 }}
                                            exit={{ opacity: 0, x: -50 }}
                                            className="glass rounded-2xl p-4 flex gap-4"
                                        >
                                            <img
                                                src={item.image}
                                                alt={item.name}
                                                className="w-20 h-20 object-cover rounded-xl flex-shrink-0"
                                            />
                                            <div className="flex-1 min-w-0">
                                                <p className="text-white font-medium text-sm line-clamp-2 mb-1">{item.name}</p>
                                                <p className="text-violet-400 font-bold">${item.price.toFixed(2)}</p>
                                                <div className="flex items-center justify-between mt-3">
                                                    <div className="flex items-center gap-2">
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                            className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                                        >
                                                            <Minus className="w-3 h-3" />
                                                        </button>
                                                        <span className="text-white font-medium w-6 text-center text-sm">{item.quantity}</span>
                                                        <button
                                                            onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                            className="w-7 h-7 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                                        >
                                                            <Plus className="w-3 h-3" />
                                                        </button>
                                                    </div>
                                                    <button
                                                        onClick={() => removeItem(item.id)}
                                                        className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all"
                                                    >
                                                        <Trash2 className="w-4 h-4" />
                                                    </button>
                                                </div>
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </AnimatePresence>
                        </div>

                        {/* Footer */}
                        {items.length > 0 && (
                            <div className="p-6 border-t border-white/10 space-y-4">
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Subtotal</span>
                                    <span className="text-white font-medium">${totalPrice.toFixed(2)}</span>
                                </div>
                                <div className="flex justify-between text-sm text-gray-400">
                                    <span>Shipping</span>
                                    <span className="text-emerald-400 font-medium">Free</span>
                                </div>
                                <div className="flex justify-between font-bold text-white text-lg border-t border-white/10 pt-4">
                                    <span>Total</span>
                                    <span className="gradient-text">${totalPrice.toFixed(2)}</span>
                                </div>
                                <motion.button
                                    whileHover={{ scale: 1.02 }}
                                    whileTap={{ scale: 0.98 }}
                                    onClick={handleCheckout}
                                    className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 glow-purple"
                                >
                                    Checkout Now
                                    <ArrowRight className="w-5 h-5" />
                                </motion.button>
                                <button
                                    onClick={clearCart}
                                    className="w-full py-2 text-gray-500 hover:text-red-400 text-sm font-medium transition-colors"
                                >
                                    Clear Cart
                                </button>
                            </div>
                        )}
                    </motion.div>
                </>
            )}
        </AnimatePresence>
    )
}
