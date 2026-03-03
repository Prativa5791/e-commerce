import React, { useEffect, useState } from 'react'
import { motion } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import { User, Mail, Phone, MapPin, Package, ShoppingBag, Calendar, ChevronRight } from 'lucide-react'
import { useNavigate } from 'react-router-dom'

export default function UserProfile() {
    const { user, isAuthenticated } = useAuth()
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
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
                                        className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group"
                                    >
                                        <div className="flex flex-wrap md:flex-nowrap items-center justify-between gap-4 mb-4 pb-4 border-b border-white/10">
                                            <div>
                                                <p className="text-sm text-gray-400 flex items-center gap-2 mb-1">
                                                    <Calendar className="w-4 h-4" /> {new Date(order.created_at).toLocaleDateString()}
                                                </p>
                                                <h4 className="text-white font-medium">Order <span className="text-violet-400">#{order.id}</span></h4>
                                            </div>
                                            <div className="text-right">
                                                <span className="inline-block px-3 py-1 rounded-full text-xs font-semibold bg-white/10 text-white mb-1 uppercase tracking-wider">
                                                    {order.status}
                                                </span>
                                                <p className="text-emerald-400 font-bold">Rs. {Number(order.total_amount).toLocaleString()}</p>
                                            </div>
                                        </div>
                                        <div className="space-y-3">
                                            {order.items.map((item, idx) => (
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
                                                            <span>Rs. {Number(item.price).toLocaleString()} each</span>
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
        </div>
    )
}
