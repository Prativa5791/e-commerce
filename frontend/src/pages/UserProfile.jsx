import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { User, Mail, Phone, MapPin, Package, ShoppingBag, Calendar, ChevronRight, X, Receipt, CreditCard, Truck, Hash } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function UserProfile() {
    const { user, isAuthenticated } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [selectedOrder, setSelectedOrder] = useState(null)
    const navigate = useNavigate()

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login')
            return
        }

        const fetchOrders = async () => {
            try {
                const res = await api.get('/orders/')
                setOrders(res.data)
            } catch (err) {
                console.error("Failed to fetch orders:", err)
            } finally {
                setLoading(false)
            }
        }

        fetchOrders()
    }, [isAuthenticated, navigate])

    const getStatusColor = (status) => {
        const colors = {
            'Pending': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
            'Confirmed': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
            'Processing': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
            'Shipped': 'bg-violet-500/20 text-violet-400 border-violet-500/30',
            'Out for Delivery': 'bg-orange-500/20 text-orange-400 border-orange-500/30',
            'Delivered': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
            'Canceled': 'bg-red-500/20 text-red-400 border-red-500/30',
        }
        return colors[status] || 'bg-gray-500/20 text-gray-400'
    }

    const getPaymentLabel = (method) => {
        const labels = { cod: 'Cash on Delivery', esewa: 'eSewa', khalti: 'Khalti' }
        return labels[method] || method
    }

    return (
        <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" style={{ paddingTop: '100px' }}>
            <motion.h1
                initial={{ opacity: 0, y: -20 }}
                animate={{ opacity: 1, y: 0 }}
                className="text-3xl md:text-4xl font-black mb-8"
            >
                <span className="gradient-text">My Profile</span>
            </motion.h1>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Profile Details */}
                <motion.div
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.1 }}
                    className="lg:col-span-1 space-y-6"
                >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl relative overflow-hidden">
                        <div className="absolute -top-10 -right-10 p-8 opacity-5 pointer-events-none">
                            <User className="w-48 h-48" />
                        </div>

                        <div className="flex flex-col items-center text-center mb-8 relative z-10">
                            <div className="w-24 h-24 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center mb-4 shadow-lg shadow-violet-500/25">
                                <span className="text-4xl font-bold text-white uppercase">{user?.username?.[0] || 'U'}</span>
                            </div>
                            <h2 className="text-2xl font-bold text-white">{user?.username}</h2>
                            <p className="text-violet-400 font-medium text-sm mt-1">Valued Customer</p>
                        </div>

                        <div className="space-y-6 relative z-10">
                            <div className="flex items-center gap-4 text-gray-300 bg-white/5 p-4 rounded-2xl border border-white/5">
                                <div className="p-3 bg-violet-500/20 rounded-xl text-violet-400">
                                    <Mail className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-gray-500 mb-1">Email Address</p>
                                    <p className="font-medium text-white truncate">{user?.email || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300 bg-white/5 p-4 rounded-2xl border border-white/5">
                                <div className="p-3 bg-emerald-500/20 rounded-xl text-emerald-400">
                                    <Phone className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-gray-500 mb-1">Mobile Number</p>
                                    <p className="font-medium text-white truncate">{user?.mobile || 'Not provided'}</p>
                                </div>
                            </div>
                            <div className="flex items-center gap-4 text-gray-300 bg-white/5 p-4 rounded-2xl border border-white/5">
                                <div className="p-3 bg-fuchsia-500/20 rounded-xl text-fuchsia-400">
                                    <MapPin className="w-5 h-5" />
                                </div>
                                <div className="overflow-hidden">
                                    <p className="text-xs text-gray-500 mb-1">Shipping Location</p>
                                    <p className="font-medium text-white truncate">{user?.location || 'Not provided'}</p>
                                </div>
                            </div>
                        </div>
                    </div>
                </motion.div>

                {/* Bought Products / Orders */}
                <motion.div
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: 0.2 }}
                    className="lg:col-span-2 space-y-6"
                >
                    <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-8 shadow-2xl h-full">
                        <div className="flex items-center justify-between mb-8">
                            <h2 className="text-2xl font-bold text-white flex items-center gap-3">
                                <ShoppingBag className="w-6 h-6 text-violet-400" /> Bought Products
                            </h2>
                            <button onClick={() => navigate('/orders')} className="text-sm text-violet-400 hover:text-violet-300 transition-colors flex items-center gap-1 group">
                                View Full History <ChevronRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                            </button>
                        </div>

                        {loading ? (
                            <div className="flex flex-col items-center justify-center py-12 gap-4">
                                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                                <p className="text-gray-400">Loading your purchases...</p>
                            </div>
                        ) : orders.length === 0 ? (
                            <div className="flex flex-col items-center justify-center py-16 text-center border-2 border-dashed border-white/10 rounded-3xl bg-white/5">
                                <Package className="w-16 h-16 text-gray-500 mb-4" />
                                <h3 className="text-xl font-bold text-white mb-2">No purchases yet</h3>
                                <p className="text-gray-400 mb-6 max-w-sm">Looks like you haven't bought anything. Start exploring our store!</p>
                                <button onClick={() => navigate('/products')} className="px-8 py-3 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-xl transition-all shadow-[0_0_20px_rgba(139,92,246,0.3)]">
                                    Browse Products
                                </button>
                            </div>
                        ) : (
                            <div className="space-y-6 max-h-[600px] overflow-y-auto pr-2 custom-scrollbar">
                                {orders.map((order, i) => (
                                    <motion.div
                                        key={order.id}
                                        initial={{ opacity: 0, y: 10 }}
                                        animate={{ opacity: 1, y: 0 }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-violet-500/30 transition-all cursor-pointer group"
                                        onClick={() => setSelectedOrder(order)}
                                    >
                                        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
                                            <div>
                                                <p className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                                                    <Calendar className="w-4 h-4" /> {new Date(order.ordered_at || order.created_at).toLocaleDateString()}
                                                </p>
                                                <h4 className="text-white font-medium">Order <span className="text-violet-400">#{order.id}</span></h4>
                                            </div>
                                            <div className="text-right flex items-center gap-3">
                                                <div>
                                                    <span className={`inline-block px-3 py-1 rounded-full text-xs font-semibold border mb-1 uppercase tracking-wider ${getStatusColor(order.status)}`}>
                                                        {order.status}
                                                    </span>
                                                    <p className="text-emerald-400 font-bold">Rs. {Number(order.total_price || order.total_amount || 0).toLocaleString()}</p>
                                                </div>
                                                <div className="hidden md:flex items-center gap-1 text-gray-500 group-hover:text-violet-400 transition-colors">
                                                    <Receipt className="w-5 h-5" />
                                                    <span className="text-xs font-medium">View Bill</span>
                                                </div>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            {order.items?.map((item, idx) => (
                                                <div key={idx} className="flex items-center gap-4 bg-black/20 p-3 rounded-xl">
                                                    <div className="w-12 h-12 rounded-lg bg-white/5 overflow-hidden flex-shrink-0">
                                                        {item.product_image ? (
                                                            <img src={item.product_image} alt={item.product_name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                                                        ) : (
                                                            <div className="w-full h-full bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20" />
                                                        )}
                                                    </div>
                                                    <div className="flex-1 min-w-0">
                                                        <p className="text-sm font-medium text-white truncate">{item.product_name}</p>
                                                        <p className="text-xs text-gray-400 flex gap-3">
                                                            <span>Qty: {item.quantity}</span>
                                                            <span className="text-gray-500">|</span>
                                                            <span>Rs. {Number(item.price_at_purchase || item.price || 0).toLocaleString()} each</span>
                                                        </p>
                                                    </div>
                                                </div>
                                            ))}
                                        </div>
                                    </motion.div>
                                ))}
                            </div>
                        )}
                    </div>
                </motion.div>
            </div>

            {/* ─── BILL MODAL ─────────────────────────────────────────────── */}
            <AnimatePresence>
                {selectedOrder && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4"
                        onClick={() => setSelectedOrder(null)}
                    >
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, y: 30 }}
                            animate={{ opacity: 1, scale: 1, y: 0 }}
                            exit={{ opacity: 0, scale: 0.9, y: 30 }}
                            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
                            className="bg-[#0f0f1a] border border-white/15 rounded-3xl shadow-2xl w-full max-w-lg max-h-[90vh] overflow-y-auto"
                            onClick={(e) => e.stopPropagation()}
                        >
                            {/* Bill Header */}
                            <div className="relative p-6 pb-4 border-b border-white/10">
                                <div className="absolute top-0 left-0 right-0 h-1 bg-gradient-to-r from-violet-600 via-fuchsia-500 to-pink-500 rounded-t-3xl" />
                                <button
                                    onClick={() => setSelectedOrder(null)}
                                    className="absolute top-4 right-4 p-2 glass rounded-xl hover:bg-white/10 transition-all"
                                >
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                                <div className="flex items-center gap-3 mb-2">
                                    <div className="p-2.5 bg-violet-500/20 rounded-xl">
                                        <Receipt className="w-6 h-6 text-violet-400" />
                                    </div>
                                    <div>
                                        <h3 className="text-xl font-black text-white">Invoice / Bill</h3>
                                        <p className="text-gray-500 text-sm">Order #{selectedOrder.id}</p>
                                    </div>
                                </div>
                            </div>

                            {/* Customer Info */}
                            <div className="p-6 pb-3 space-y-3">
                                <div className="grid grid-cols-2 gap-3">
                                    <div className="bg-white/5 p-3 rounded-xl">
                                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><User className="w-3 h-3" /> Customer</p>
                                        <p className="text-white font-medium text-sm">{selectedOrder.user || user?.username}</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl">
                                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Calendar className="w-3 h-3" /> Date</p>
                                        <p className="text-white font-medium text-sm">{new Date(selectedOrder.ordered_at || selectedOrder.created_at).toLocaleDateString()}</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl">
                                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><CreditCard className="w-3 h-3" /> Payment</p>
                                        <p className="text-white font-medium text-sm">{getPaymentLabel(selectedOrder.payment_method)}</p>
                                    </div>
                                    <div className="bg-white/5 p-3 rounded-xl">
                                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Hash className="w-3 h-3" /> Status</p>
                                        <span className={`inline-block px-2 py-0.5 rounded-lg text-xs font-semibold border ${getStatusColor(selectedOrder.status)}`}>
                                            {selectedOrder.status}
                                        </span>
                                    </div>
                                </div>

                                {/* Shipping */}
                                {(selectedOrder.shipping_name || selectedOrder.shipping_address) && (
                                    <div className="bg-white/5 p-3 rounded-xl">
                                        <p className="text-xs text-gray-500 mb-1 flex items-center gap-1"><Truck className="w-3 h-3" /> Shipping To</p>
                                        <p className="text-white font-medium text-sm">{selectedOrder.shipping_name}</p>
                                        {selectedOrder.shipping_address && <p className="text-gray-400 text-xs">{selectedOrder.shipping_address}</p>}
                                        {selectedOrder.shipping_phone && <p className="text-gray-400 text-xs">{selectedOrder.shipping_phone}</p>}
                                    </div>
                                )}
                            </div>

                            {/* Items Table */}
                            <div className="px-6 pb-3">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left text-xs text-gray-500 pb-2 font-medium">Item</th>
                                            <th className="text-center text-xs text-gray-500 pb-2 font-medium">Qty</th>
                                            <th className="text-right text-xs text-gray-500 pb-2 font-medium">Price</th>
                                            <th className="text-right text-xs text-gray-500 pb-2 font-medium">Total</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {selectedOrder.items?.map((item, idx) => (
                                            <tr key={idx} className="border-b border-white/5">
                                                <td className="py-3">
                                                    <div className="flex items-center gap-2">
                                                        {item.product_image && (
                                                            <img src={item.product_image} alt="" className="w-8 h-8 rounded-lg object-cover" />
                                                        )}
                                                        <span className="text-sm text-white truncate max-w-[150px]">{item.product_name}</span>
                                                    </div>
                                                </td>
                                                <td className="text-center text-sm text-gray-300 py-3">{item.quantity}</td>
                                                <td className="text-right text-sm text-gray-300 py-3">Rs. {Number(item.price_at_purchase || item.price || 0).toLocaleString()}</td>
                                                <td className="text-right text-sm text-white font-medium py-3">Rs. {(Number(item.price_at_purchase || item.price || 0) * item.quantity).toLocaleString()}</td>
                                            </tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>

                            {/* Totals */}
                            <div className="mx-6 mb-6 p-4 bg-gradient-to-br from-violet-600/10 to-fuchsia-600/10 border border-violet-500/20 rounded-2xl">
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-400 text-sm">Subtotal</span>
                                    <span className="text-white font-medium">Rs. {Number(selectedOrder.total_price || selectedOrder.total_amount || 0).toLocaleString()}</span>
                                </div>
                                <div className="flex justify-between items-center mb-2">
                                    <span className="text-gray-400 text-sm">Shipping</span>
                                    <span className="text-emerald-400 font-medium text-sm">Free</span>
                                </div>
                                <div className="border-t border-white/10 pt-2 mt-2 flex justify-between items-center">
                                    <span className="text-white font-bold text-lg">Total</span>
                                    <span className="text-2xl font-black gradient-text">Rs. {Number(selectedOrder.total_price || selectedOrder.total_amount || 0).toLocaleString()}</span>
                                </div>
                            </div>

                            {/* Footer */}
                            <div className="px-6 pb-6 text-center">
                                <p className="text-gray-600 text-xs">Thank you for shopping with Nepali Store 🇳🇵</p>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
