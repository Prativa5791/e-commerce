import React, { useState, useEffect } from 'react'
import { useNavigate, useLocation } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { useCart } from '../context/CartContext'
import api from '../lib/api'
import {
    MapPin, Phone, User, CreditCard, Truck,
    ChevronRight, ShieldCheck, CheckCircle, AlertCircle, Banknote
} from 'lucide-react'

const paymentMethods = [
    {
        id: 'cod',
        label: 'Cash on Delivery',
        description: 'Pay when you receive your order',
        icon: Banknote,
        color: 'from-green-500 to-emerald-600',
    },
    {
        id: 'esewa',
        label: 'eSewa',
        description: 'Pay via eSewa digital wallet',
        icon: CreditCard,
        color: 'from-green-400 to-lime-500',
    },
    {
        id: 'khalti',
        label: 'Khalti',
        description: 'Pay via Khalti digital wallet',
        icon: CreditCard,
        color: 'from-purple-500 to-violet-600',
    },
]

export default function Checkout() {
    const { isAuthenticated } = useAuth()
    const { items: cartItems, totalPrice, clearCart } = useCart()
    const navigate = useNavigate()
    const location = useLocation()

    // Support "Buy Now" flow — single item passed via state
    const buyNowItem = location.state?.buyNowItem
    const items = buyNowItem ? [buyNowItem] : cartItems
    const total = buyNowItem
        ? Number(buyNowItem.price) * (buyNowItem.quantity || 1)
        : totalPrice

    const [form, setForm] = useState({
        shipping_name: '',
        shipping_address: '',
        shipping_phone: '',
        payment_method: 'cod',
    })
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState('')
    const [success, setSuccess] = useState(false)
    const [orderId, setOrderId] = useState(null)

    useEffect(() => {
        if (!isAuthenticated) navigate('/auth/login')
    }, [isAuthenticated, navigate])

    if (items.length === 0 && !success) {
        return (
            <div className="min-h-screen flex flex-col items-center justify-center gap-4 px-4" style={{ paddingTop: '100px' }}>
                <AlertCircle className="w-16 h-16 text-gray-500" />
                <h2 className="text-2xl font-bold text-white">Nothing to checkout</h2>
                <p className="text-gray-400">Add items to your cart first</p>
                <button onClick={() => navigate('/products')}
                    className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-colors">
                    Browse Products
                </button>
            </div>
        )
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError('')
        setLoading(true)

        try {
            const checkoutItems = items.map(item => ({
                product_id: item.id,
                quantity: item.quantity || 1,
            }))

            const res = await api.post('/orders/orders/checkout/', {
                items: checkoutItems,
                ...form,
            })

            setOrderId(res.data.id)
            setSuccess(true)

            // Clear the cart only if it was a cart checkout (not Buy Now)
            if (!buyNowItem && clearCart) {
                clearCart()
            }

            // If payment method is eSewa or Khalti, simulate redirect
            if (form.payment_method === 'esewa' || form.payment_method === 'khalti') {
                // In production, you'd redirect to eSewa/Khalti payment gateway
                // For now, we mark it as a successful payment simulation
                console.log(`Redirecting to ${form.payment_method} payment gateway...`)
            }
        } catch (err) {
            setError(err.response?.data?.error || 'Checkout failed. Please try again.')
        } finally {
            setLoading(false)
        }
    }

    if (success) {
        return (
            <div className="min-h-screen flex items-center justify-center p-4" style={{ paddingTop: '100px' }}>
                <motion.div
                    initial={{ opacity: 0, scale: 0.9 }}
                    animate={{ opacity: 1, scale: 1 }}
                    className="w-full max-w-md text-center"
                >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl">
                        <motion.div
                            initial={{ scale: 0 }}
                            animate={{ scale: 1 }}
                            transition={{ type: 'spring', stiffness: 200, damping: 15, delay: 0.2 }}
                            className="w-20 h-20 mx-auto mb-6 rounded-full bg-gradient-to-br from-green-500 to-emerald-600 flex items-center justify-center"
                        >
                            <CheckCircle className="w-10 h-10 text-white" />
                        </motion.div>
                        <h2 className="text-3xl font-bold text-white mb-2">Order Placed!</h2>
                        <p className="text-gray-400 mb-2">
                            Your order <span className="text-violet-400 font-semibold">#{orderId}</span> has been placed successfully.
                        </p>
                        <p className="text-gray-500 text-sm mb-6">
                            {form.payment_method === 'cod'
                                ? 'You can pay when the order is delivered.'
                                : `Payment processed via ${form.payment_method === 'esewa' ? 'eSewa' : 'Khalti'}.`}
                        </p>
                        <div className="flex flex-col gap-3">
                            <button onClick={() => navigate('/orders')}
                                className="px-6 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl transition-all">
                                View My Orders
                            </button>
                            <button onClick={() => navigate('/products')}
                                className="px-6 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium rounded-xl transition-all">
                                Continue Shopping
                            </button>
                        </div>
                    </div>
                </motion.div>
            </div>
        )
    }

    return (
        <div className="min-h-screen max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" style={{ paddingTop: '100px' }}>
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-black mb-8"
            >
                <span className="gradient-text">Checkout</span>
            </motion.h1>

            <form onSubmit={handleSubmit}>
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                    {/* Left: Shipping & Payment */}
                    <div className="lg:col-span-2 space-y-6">
                        {/* Shipping Info */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg"
                        >
                            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                                <Truck className="w-5 h-5 text-violet-400" /> Shipping Information
                            </h2>

                            <div className="space-y-4">
                                <div className="relative">
                                    <User className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
                                    <input type="text" placeholder="Full Name" value={form.shipping_name}
                                        onChange={(e) => setForm({ ...form, shipping_name: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                        required />
                                </div>
                                <div className="relative">
                                    <MapPin className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
                                    <input type="text" placeholder="Shipping Address" value={form.shipping_address}
                                        onChange={(e) => setForm({ ...form, shipping_address: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                        required />
                                </div>
                                <div className="relative">
                                    <Phone className="w-5 h-5 text-gray-500 absolute left-4 top-1/2 transform -translate-y-1/2" />
                                    <input type="tel" placeholder="Phone Number" value={form.shipping_phone}
                                        onChange={(e) => setForm({ ...form, shipping_phone: e.target.value })}
                                        className="w-full pl-12 pr-4 py-3.5 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 focus:ring-1 focus:ring-violet-500 transition-all"
                                        required />
                                </div>
                            </div>
                        </motion.div>

                        {/* Payment Method */}
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.1 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg"
                        >
                            <h2 className="text-xl font-bold text-white mb-5 flex items-center gap-2">
                                <CreditCard className="w-5 h-5 text-violet-400" /> Payment Method
                            </h2>

                            <div className="space-y-3">
                                {paymentMethods.map((method) => {
                                    const Icon = method.icon
                                    const selected = form.payment_method === method.id
                                    return (
                                        <motion.label
                                            key={method.id}
                                            whileHover={{ scale: 1.01 }}
                                            whileTap={{ scale: 0.99 }}
                                            className={`flex items-center gap-4 p-4 rounded-xl border cursor-pointer transition-all ${selected
                                                ? 'border-violet-500 bg-violet-500/10 shadow-[0_0_20px_rgba(139,92,246,0.15)]'
                                                : 'border-white/10 bg-white/5 hover:border-white/20'
                                                }`}
                                        >
                                            <input type="radio" name="payment_method"
                                                value={method.id}
                                                checked={selected}
                                                onChange={(e) => setForm({ ...form, payment_method: e.target.value })}
                                                className="sr-only" />
                                            <div className={`w-12 h-12 rounded-xl bg-gradient-to-br ${method.color} flex items-center justify-center flex-shrink-0`}>
                                                <Icon className="w-6 h-6 text-white" />
                                            </div>
                                            <div className="flex-1">
                                                <p className="font-semibold text-white">{method.label}</p>
                                                <p className="text-sm text-gray-400">{method.description}</p>
                                            </div>
                                            {selected && (
                                                <motion.div initial={{ scale: 0 }} animate={{ scale: 1 }}>
                                                    <CheckCircle className="w-6 h-6 text-violet-400" />
                                                </motion.div>
                                            )}
                                        </motion.label>
                                    )
                                })}
                            </div>
                        </motion.div>
                    </div>

                    {/* Right: Order Summary */}
                    <div className="lg:col-span-1">
                        <motion.div
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: 0.2 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6 shadow-lg sticky top-24"
                        >
                            <h2 className="text-xl font-bold text-white mb-5">Order Summary</h2>

                            <div className="space-y-4 mb-6 max-h-64 overflow-y-auto">
                                {items.map((item, idx) => (
                                    <div key={idx} className="flex items-center gap-3">
                                        <div className="w-14 h-14 rounded-xl bg-white/5 flex items-center justify-center overflow-hidden flex-shrink-0">
                                            {item.image ? (
                                                <img src={item.image} alt={item.name} className="w-full h-full object-cover" />
                                            ) : (
                                                <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20" />
                                            )}
                                        </div>
                                        <div className="flex-1 min-w-0">
                                            <p className="text-sm font-medium text-white truncate">{item.name}</p>
                                            <p className="text-xs text-gray-400">Qty: {item.quantity || 1}</p>
                                        </div>
                                        <p className="text-sm font-semibold text-white">
                                            Rs. {((item.price) * (item.quantity || 1)).toLocaleString()}
                                        </p>
                                    </div>
                                ))}
                            </div>

                            <div className="border-t border-white/10 pt-4 space-y-2">
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Subtotal</span>
                                    <span className="text-white">Rs. {total.toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between text-sm">
                                    <span className="text-gray-400">Shipping</span>
                                    <span className="text-emerald-400">Free</span>
                                </div>
                                <div className="flex justify-between text-lg font-bold pt-2 border-t border-white/10">
                                    <span className="text-white">Total</span>
                                    <span className="gradient-text">Rs. {total.toLocaleString()}</span>
                                </div>
                            </div>

                            {error && (
                                <motion.div
                                    initial={{ opacity: 0 }}
                                    animate={{ opacity: 1 }}
                                    className="mt-4 p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm"
                                >
                                    {error}
                                </motion.div>
                            )}

                            <motion.button
                                whileHover={{ scale: 1.02 }}
                                whileTap={{ scale: 0.98 }}
                                type="submit"
                                disabled={loading}
                                className="w-full mt-6 py-4 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-50 shadow-lg shadow-violet-500/25"
                            >
                                <ShieldCheck className="w-5 h-5" />
                                {loading ? 'Placing Order...' : `Place Order — Rs. ${total.toLocaleString()}`}
                                <ChevronRight className="w-5 h-5" />
                            </motion.button>

                            <p className="text-center text-xs text-gray-500 mt-3 flex items-center justify-center gap-1">
                                <ShieldCheck className="w-3 h-3" /> Secure checkout
                            </p>
                        </motion.div>
                    </div>
                </div>
            </form>
        </div>
    )
}
