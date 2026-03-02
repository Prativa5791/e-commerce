import React, { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Package, Clock, CheckCircle, Truck, XCircle, RefreshCw, AlertCircle } from 'lucide-react'
import { ordersApi } from '../lib/api'

const STATUS_ICON = {
    Pending: Clock,
    Shipped: Truck,
    Delivered: CheckCircle,
    Canceled: XCircle,
}

const STATUS_COLOR = {
    Pending: 'text-amber-400 bg-amber-400/10 border-amber-500/30',
    Shipped: 'text-blue-400 bg-blue-400/10 border-blue-500/30',
    Delivered: 'text-emerald-400 bg-emerald-400/10 border-emerald-500/30',
    Canceled: 'text-red-400 bg-red-400/10 border-red-500/30',
}

function OrderCard({ order, index }) {
    const StatusIcon = STATUS_ICON[order.status] || Package
    const statusClass = STATUS_COLOR[order.status] || 'text-gray-400 bg-gray-400/10 border-gray-500/30'

    return (
        <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: index * 0.08 }}
            className="glass rounded-2xl p-6 hover:bg-white/10 transition-all duration-300"
        >
            <div className="flex flex-wrap items-start justify-between gap-4 mb-5">
                <div>
                    <div className="flex items-center gap-2 mb-1">
                        <Package className="w-4 h-4 text-violet-400" />
                        <span className="text-violet-400 text-sm font-semibold">Order #{order.id}</span>
                    </div>
                    <p className="text-white font-bold text-lg">
                        ${parseFloat(order.total_price).toFixed(2)}
                    </p>
                    <p className="text-gray-500 text-xs mt-1">
                        By: {order.user} · {new Date(order.ordered_at).toLocaleDateString('en-US', {
                            year: 'numeric', month: 'long', day: 'numeric'
                        })}
                    </p>
                </div>
                <span className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold border ${statusClass}`}>
                    <StatusIcon className="w-3.5 h-3.5" />
                    {order.status}
                </span>
            </div>

            {order.items && order.items.length > 0 && (
                <div className="space-y-2.5">
                    <p className="text-xs text-gray-500 uppercase tracking-wider font-semibold">Items</p>
                    {order.items.map((item) => (
                        <div key={item.id} className="flex justify-between items-center bg-white/5 px-4 py-2.5 rounded-xl">
                            <span className="text-gray-300 text-sm">{item.product_name || `Product #${item.product}`}</span>
                            <div className="text-right">
                                <span className="text-gray-400 text-xs mr-3">x{item.quantity}</span>
                                <span className="text-white font-semibold text-sm">${parseFloat(item.price_at_purchase).toFixed(2)}</span>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </motion.div>
    )
}

export default function Orders() {
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [error, setError] = useState(null)

    const fetchOrders = async () => {
        setLoading(true)
        setError(null)
        try {
            const res = await ordersApi.getAll()
            setOrders(res.data)
        } catch (err) {
            setError('Could not connect to the server. Make sure Django is running on port 8000.')
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => { fetchOrders() }, [])

    return (
        <div className="min-h-screen pt-24 pb-20 px-4">
            <div className="max-w-4xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="flex items-center justify-between mb-10"
                >
                    <div>
                        <p className="text-violet-400 text-sm uppercase tracking-widest font-semibold mb-1">History</p>
                        <h1 className="text-4xl font-black text-white">My Orders</h1>
                        <p className="text-gray-500 mt-1">Fetched live from Django backend</p>
                    </div>
                    <motion.button
                        whileHover={{ scale: 1.05, rotate: 180 }}
                        whileTap={{ scale: 0.95 }}
                        onClick={fetchOrders}
                        className="p-3 glass rounded-2xl hover:bg-white/10 text-gray-400 hover:text-violet-400 transition-all"
                        title="Refresh orders"
                    >
                        <RefreshCw className="w-5 h-5" />
                    </motion.button>
                </motion.div>

                {/* Loading */}
                {loading && (
                    <div className="space-y-4">
                        {[1, 2, 3].map((i) => (
                            <div key={i} className="glass rounded-2xl p-6 shimmer-bg h-36" />
                        ))}
                    </div>
                )}

                {/* Error */}
                {error && !loading && (
                    <motion.div
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        className="glass rounded-2xl p-8 text-center border border-red-500/20"
                    >
                        <div className="w-16 h-16 bg-red-500/10 rounded-2xl flex items-center justify-center mx-auto mb-4">
                            <AlertCircle className="w-8 h-8 text-red-400" />
                        </div>
                        <h3 className="text-white font-bold text-lg mb-2">Connection Error</h3>
                        <p className="text-gray-400 text-sm mb-6">{error}</p>
                        <div className="bg-black/30 rounded-xl p-4 text-left mb-6">
                            <p className="text-xs text-gray-500 mb-2 font-medium uppercase tracking-wider">Start the backend:</p>
                            <code className="text-xs text-violet-300 font-mono">
                                cd ecommerce_web && python manage.py runserver
                            </code>
                        </div>
                        <button
                            onClick={fetchOrders}
                            className="px-6 py-3 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-colors"
                        >
                            Retry
                        </button>
                    </motion.div>
                )}

                {/* Empty */}
                {!loading && !error && orders.length === 0 && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="text-center py-20"
                    >
                        <div className="w-24 h-24 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-6">
                            <Package className="w-12 h-12 text-gray-600" />
                        </div>
                        <h3 className="text-2xl font-bold text-white mb-2">No orders yet</h3>
                        <p className="text-gray-400 mb-6">Your order history will appear here after you place an order.</p>
                    </motion.div>
                )}

                {/* Orders */}
                {!loading && !error && orders.length > 0 && (
                    <div className="space-y-4">
                        {orders.map((order, i) => (
                            <OrderCard key={order.id} order={order} index={i} />
                        ))}
                    </div>
                )}
            </div>
        </div>
    )
}
