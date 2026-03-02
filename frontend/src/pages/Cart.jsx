import React from 'react'
import { motion } from 'framer-motion'
import { Link } from 'react-router-dom'
import { ShoppingBag, Trash2, Plus, Minus, ArrowRight, ShoppingCart } from 'lucide-react'
import { useCart } from '../context/CartContext'

export default function Cart() {
    const { items, removeItem, updateQuantity, totalPrice, clearCart, totalItems } = useCart()

    if (items.length === 0) {
        return (
            <div className="min-h-screen pt-24 pb-20 px-4 flex items-center justify-center">
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="text-center"
                >
                    <div className="w-28 h-28 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                        <ShoppingCart className="w-14 h-14 text-gray-600" />
                    </div>
                    <h2 className="text-3xl font-black text-white mb-3">Your cart is empty</h2>
                    <p className="text-gray-400 mb-8">Looks like you haven't added anything yet.</p>
                    <Link to="/products">
                        <motion.button
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className="flex items-center gap-2 mx-auto px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all glow-purple"
                        >
                            <ShoppingBag className="w-5 h-5" />
                            Start Shopping
                        </motion.button>
                    </Link>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-4">
            <div className="max-w-5xl mx-auto">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10 flex items-center justify-between"
                >
                    <div>
                        <p className="text-violet-400 text-sm uppercase tracking-widest font-semibold mb-1">Review</p>
                        <h1 className="text-4xl font-black text-white">Shopping Cart</h1>
                        <p className="text-gray-500 mt-1">{totalItems} {totalItems === 1 ? 'item' : 'items'}</p>
                    </div>
                    <button
                        onClick={clearCart}
                        className="flex items-center gap-2 text-gray-500 hover:text-red-400 text-sm transition-colors glass px-4 py-2 rounded-xl"
                    >
                        <Trash2 className="w-4 h-4" />
                        Clear All
                    </button>
                </motion.div>

                <div className="grid lg:grid-cols-3 gap-8">
                    {/* Items */}
                    <div className="lg:col-span-2 space-y-4">
                        {items.map((item, i) => (
                            <motion.div
                                key={item.id}
                                initial={{ opacity: 0, x: -20 }}
                                animate={{ opacity: 1, x: 0 }}
                                exit={{ opacity: 0, x: 20 }}
                                transition={{ delay: i * 0.05 }}
                                className="glass rounded-2xl p-5 flex gap-5"
                            >
                                <Link to={`/products/${item.id}`}>
                                    <img
                                        src={item.image}
                                        alt={item.name}
                                        className="w-24 h-24 object-cover rounded-xl flex-shrink-0 hover:opacity-80 transition-opacity"
                                    />
                                </Link>
                                <div className="flex-1 min-w-0">
                                    <div className="flex items-start justify-between gap-2">
                                        <Link to={`/products/${item.id}`}>
                                            <p className="text-white font-semibold hover:text-violet-300 transition-colors line-clamp-2">
                                                {item.name}
                                            </p>
                                        </Link>
                                        <button
                                            onClick={() => removeItem(item.id)}
                                            className="p-1.5 text-gray-500 hover:text-red-400 hover:bg-red-400/10 rounded-lg transition-all flex-shrink-0"
                                        >
                                            <Trash2 className="w-4 h-4" />
                                        </button>
                                    </div>
                                    <p className="text-gray-500 text-sm mt-0.5">{item.category}</p>
                                    <div className="flex items-center justify-between mt-4">
                                        <div className="flex items-center gap-3">
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity - 1)}
                                                className="w-8 h-8 glass hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                            >
                                                <Minus className="w-3.5 h-3.5" />
                                            </button>
                                            <span className="text-white font-bold w-6 text-center">{item.quantity}</span>
                                            <button
                                                onClick={() => updateQuantity(item.id, item.quantity + 1)}
                                                className="w-8 h-8 glass hover:bg-white/20 rounded-lg flex items-center justify-center transition-colors"
                                            >
                                                <Plus className="w-3.5 h-3.5" />
                                            </button>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-xl font-black text-white">${(item.price * item.quantity).toFixed(2)}</p>
                                            <p className="text-xs text-gray-500">${item.price.toFixed(2)} each</p>
                                        </div>
                                    </div>
                                </div>
                            </motion.div>
                        ))}
                    </div>

                    {/* Order Summary */}
                    <motion.div
                        initial={{ opacity: 0, x: 20 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.2 }}
                        className="glass rounded-3xl p-6 h-fit sticky top-24 space-y-5"
                    >
                        <h2 className="text-xl font-black text-white">Order Summary</h2>
                        <div className="space-y-3">
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Subtotal ({totalItems} items)</span>
                                <span className="text-white font-medium">${totalPrice.toFixed(2)}</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Shipping</span>
                                <span className="text-emerald-400 font-semibold">Free</span>
                            </div>
                            <div className="flex justify-between text-sm">
                                <span className="text-gray-400">Discount</span>
                                <span className="text-gray-400">-</span>
                            </div>
                            <div className="border-t border-white/10 pt-3 flex justify-between">
                                <span className="text-white font-bold text-lg">Total</span>
                                <span className="text-2xl font-black gradient-text">${totalPrice.toFixed(2)}</span>
                            </div>
                        </div>

                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            className="w-full py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 flex items-center justify-center gap-2 glow-purple"
                        >
                            Proceed to Checkout
                            <ArrowRight className="w-5 h-5" />
                        </motion.button>

                        <Link to="/products">
                            <button className="w-full py-3 text-gray-400 hover:text-white text-sm font-medium transition-colors">
                                ← Continue Shopping
                            </button>
                        </Link>

                        {/* Trust badges */}
                        <div className="border-t border-white/10 pt-4">
                            <p className="text-xs text-gray-600 text-center">🔒 Secure checkout powered by SSL encryption</p>
                        </div>
                    </motion.div>
                </div>
            </div>
        </div>
    )
}
