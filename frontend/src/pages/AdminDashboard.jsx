import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { authApi, productsApi, ordersApi } from '../lib/api'
import {
    Users, ShoppingCart, Package, DollarSign, TrendingUp,
    Shield, UserCheck, UserX, BarChart3, Activity,
    Clock, CheckCircle, Truck, XCircle, Eye,
    ArrowUpRight, Crown, Store, AlertTriangle
} from 'lucide-react'

const statusColors = {
    'Pending': 'bg-amber-500/20 text-amber-400 border-amber-500/30',
    'Confirmed': 'bg-blue-500/20 text-blue-400 border-blue-500/30',
    'Processing': 'bg-cyan-500/20 text-cyan-400 border-cyan-500/30',
    'Shipped': 'bg-indigo-500/20 text-indigo-400 border-indigo-500/30',
    'Out for Delivery': 'bg-purple-500/20 text-purple-400 border-purple-500/30',
    'Delivered': 'bg-emerald-500/20 text-emerald-400 border-emerald-500/30',
    'Canceled': 'bg-red-500/20 text-red-400 border-red-500/30',
}

export default function AdminDashboard() {
    const { isAuthenticated, isAdmin } = useAuth()
    const navigate = useNavigate()

    const [users, setUsers] = useState([])
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [analytics, setAnalytics] = useState(null)
    const [tab, setTab] = useState('overview')
    const [loading, setLoading] = useState(true)

    useEffect(() => {
        if (!isAuthenticated) { navigate('/auth/login'); return }
        if (!isAdmin) { navigate('/'); return }
        fetchData()
    }, [isAuthenticated, isAdmin])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [usersRes, prodRes, ordersRes, analyticsRes] = await Promise.all([
                authApi.allUsers().catch(() => ({ data: [] })),
                productsApi.getAll().catch(() => ({ data: [] })),
                ordersApi.allOrders().catch(() => ({ data: [] })),
                ordersApi.analytics().catch(() => ({ data: null })),
            ])
            setUsers(usersRes.data || [])
            setProducts(prodRes.data?.results || prodRes.data || [])
            setOrders(ordersRes.data?.results || ordersRes.data || [])
            setAnalytics(analyticsRes.data)
        } catch (err) {
            console.error('Admin data load failed:', err)
        } finally {
            setLoading(false)
        }
    }

    const handleToggleSeller = async (userId) => {
        try {
            await authApi.toggleSeller(userId)
            fetchData()
        } catch (err) {
            alert('Failed to update user')
        }
    }

    const handleStatusUpdate = async (orderId, newStatus) => {
        try {
            await ordersApi.updateStatus(orderId, { status: newStatus })
            fetchData()
        } catch (err) {
            alert('Failed to update order status')
        }
    }

    const totalRevenue = analytics?.total_revenue || orders.reduce((s, o) => s + parseFloat(o.total_price || 0), 0)
    const sellerCount = users.filter(u => u.is_seller).length
    const activeUsers = users.filter(u => u.is_active).length

    const stats = [
        { label: 'Total Users', value: users.length, icon: Users, color: 'from-violet-500 to-purple-600', sub: `${sellerCount} sellers` },
        { label: 'Products', value: products.length, icon: Package, color: 'from-blue-500 to-cyan-600', sub: 'Listed items' },
        { label: 'Total Orders', value: analytics?.total_orders || orders.length, icon: ShoppingCart, color: 'from-emerald-500 to-green-600', sub: `${analytics?.pending_orders || 0} pending` },
        { label: 'Revenue', value: `Rs. ${Number(totalRevenue).toLocaleString()}`, icon: DollarSign, color: 'from-amber-500 to-orange-600', sub: `${analytics?.delivered_orders || 0} delivered` },
    ]

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: '100px' }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
                    <p className="text-gray-400">Loading admin panel...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" style={{ paddingTop: '100px' }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <div className="flex items-center gap-3 mb-2">
                    <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-amber-500 to-orange-600 flex items-center justify-center">
                        <Crown className="w-5 h-5 text-white" />
                    </div>
                    <h1 className="text-3xl md:text-4xl font-black">
                        <span className="gradient-text">Admin Dashboard</span>
                    </h1>
                </div>
                <p className="text-gray-400 mt-1">Platform governance & analytics</p>
            </motion.div>

            {/* Stats */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (
                    <motion.div key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                                <s.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs text-gray-400">{s.sub}</span>
                        </div>
                        <p className="text-2xl font-bold text-white">{s.value}</p>
                        <p className="text-sm text-gray-400">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['overview', 'users', 'orders', 'products'].map(t => (
                    <button key={t} onClick={() => setTab(t)}
                        className={`px-5 py-2.5 rounded-xl font-semibold text-sm capitalize whitespace-nowrap transition-all ${tab === t
                                ? 'bg-gradient-to-r from-violet-600 to-fuchsia-600 text-white shadow-lg shadow-violet-500/25'
                                : 'bg-white/5 text-gray-400 hover:bg-white/10 hover:text-white border border-white/10'
                            }`}>
                        {t}
                    </button>
                ))}
            </div>

            {/* Tab Content */}
            <AnimatePresence mode="wait">
                {tab === 'overview' && (
                    <motion.div key="overview" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                        {/* Revenue by Status */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-violet-400" /> Order Status Breakdown
                            </h3>
                            <div className="space-y-3">
                                {analytics?.status_breakdown && Object.entries(analytics.status_breakdown).map(([st, data]) => {
                                    const pct = analytics.total_orders ? Math.round((data.count / analytics.total_orders) * 100) : 0
                                    return (
                                        <div key={st}>
                                            <div className="flex items-center justify-between mb-1">
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[st] || 'bg-gray-500/20 text-gray-400'}`}>{st}</span>
                                                <span className="text-xs text-gray-400">{data.count} orders • Rs. {Number(data.revenue).toLocaleString()}</span>
                                            </div>
                                            <div className="h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.8, delay: 0.1 }}
                                                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full" />
                                            </div>
                                        </div>
                                    )
                                })}
                                {!analytics?.status_breakdown && (
                                    <p className="text-gray-500 text-sm text-center py-6">No analytics data available</p>
                                )}
                            </div>
                        </div>

                        {/* Recent Activity */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <Activity className="w-5 h-5 text-violet-400" /> Recent Orders
                            </h3>
                            <div className="space-y-3">
                                {(analytics?.recent_orders || orders.slice(0, 8)).map(o => (
                                    <div key={o.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div className="flex items-center gap-3">
                                            <div className="w-9 h-9 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center">
                                                <ShoppingCart className="w-4 h-4 text-violet-400" />
                                            </div>
                                            <div>
                                                <p className="text-sm font-medium text-white">#{o.id} — {o.user}</p>
                                                <p className="text-xs text-gray-500">{new Date(o.ordered_at).toLocaleDateString()}</p>
                                            </div>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-white">Rs. {parseFloat(o.total_price).toLocaleString()}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[o.status]}`}>{o.status}</span>
                                        </div>
                                    </div>
                                ))}
                                {orders.length === 0 && <p className="text-gray-500 text-sm text-center py-6">No orders yet</p>}
                            </div>
                        </div>

                        {/* Quick Stats Grid */}
                        <div className="lg:col-span-2 grid grid-cols-2 sm:grid-cols-4 gap-4">
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                <p className="text-3xl font-black text-emerald-400">{analytics?.delivered_orders || 0}</p>
                                <p className="text-xs text-gray-400 mt-1">Delivered</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                <p className="text-3xl font-black text-amber-400">{analytics?.pending_orders || 0}</p>
                                <p className="text-xs text-gray-400 mt-1">Pending</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                <p className="text-3xl font-black text-red-400">{analytics?.canceled_orders || 0}</p>
                                <p className="text-xs text-gray-400 mt-1">Canceled</p>
                            </div>
                            <div className="bg-white/5 border border-white/10 rounded-2xl p-4 text-center">
                                <p className="text-3xl font-black text-violet-400">{activeUsers}</p>
                                <p className="text-xs text-gray-400 mt-1">Active Users</p>
                            </div>
                        </div>
                    </motion.div>
                )}

                {tab === 'users' && (
                    <motion.div key="users" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <h3 className="text-lg font-bold text-white mb-4">{users.length} Registered Users</h3>
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden">
                            <div className="overflow-x-auto">
                                <table className="w-full">
                                    <thead>
                                        <tr className="border-b border-white/10">
                                            <th className="text-left text-xs text-gray-400 font-semibold px-5 py-3">User</th>
                                            <th className="text-left text-xs text-gray-400 font-semibold px-5 py-3">Email</th>
                                            <th className="text-left text-xs text-gray-400 font-semibold px-5 py-3">Joined</th>
                                            <th className="text-center text-xs text-gray-400 font-semibold px-5 py-3">Role</th>
                                            <th className="text-center text-xs text-gray-400 font-semibold px-5 py-3">Actions</th>
                                        </tr>
                                    </thead>
                                    <tbody>
                                        {users.map((u, i) => (
                                            <motion.tr key={u.id}
                                                initial={{ opacity: 0 }}
                                                animate={{ opacity: 1 }}
                                                transition={{ delay: i * 0.03 }}
                                                className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                                <td className="px-5 py-3.5">
                                                    <div className="flex items-center gap-3">
                                                        <div className="w-9 h-9 rounded-xl bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm">
                                                            {u.username.charAt(0).toUpperCase()}
                                                        </div>
                                                        <div>
                                                            <p className="text-sm font-medium text-white">{u.username}</p>
                                                            {u.is_staff && <span className="text-[10px] text-amber-400 font-medium">ADMIN</span>}
                                                        </div>
                                                    </div>
                                                </td>
                                                <td className="px-5 py-3.5 text-sm text-gray-400">{u.email || '—'}</td>
                                                <td className="px-5 py-3.5 text-sm text-gray-400">
                                                    {new Date(u.date_joined).toLocaleDateString()}
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    {u.is_seller ? (
                                                        <span className="text-xs px-2.5 py-1 rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 font-medium">
                                                            Seller
                                                        </span>
                                                    ) : (
                                                        <span className="text-xs px-2.5 py-1 rounded-full bg-gray-500/20 text-gray-400 border border-gray-500/30 font-medium">
                                                            Customer
                                                        </span>
                                                    )}
                                                </td>
                                                <td className="px-5 py-3.5 text-center">
                                                    <button
                                                        onClick={() => handleToggleSeller(u.id)}
                                                        className={`text-xs px-3 py-1.5 rounded-lg font-medium transition-all ${u.is_seller
                                                                ? 'bg-red-500/10 text-red-400 hover:bg-red-500/20 border border-red-500/20'
                                                                : 'bg-emerald-500/10 text-emerald-400 hover:bg-emerald-500/20 border border-emerald-500/20'
                                                            }`}>
                                                        {u.is_seller ? 'Remove Seller' : 'Make Seller'}
                                                    </button>
                                                </td>
                                            </motion.tr>
                                        ))}
                                    </tbody>
                                </table>
                            </div>
                        </div>
                    </motion.div>
                )}

                {tab === 'orders' && (
                    <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <h3 className="text-lg font-bold text-white mb-4">{orders.length} Total Orders</h3>
                        <div className="space-y-3">
                            {orders.map((o, i) => (
                                <motion.div key={o.id}
                                    initial={{ opacity: 0, y: 10 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.03 }}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <p className="font-bold text-white">Order #{o.id}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[o.status]}`}>{o.status}</span>
                                                <span className={`text-xs px-2 py-0.5 rounded-full ${o.payment_status === 'paid' ? 'bg-emerald-500/20 text-emerald-400' : 'bg-amber-500/20 text-amber-400'
                                                    }`}>
                                                    {o.payment_status} ({o.payment_method})
                                                </span>
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                {o.user} • {new Date(o.ordered_at).toLocaleString()} • {o.items?.length || 0} items
                                            </p>
                                            {o.shipping_name && (
                                                <p className="text-xs text-gray-500 mt-1">
                                                    👤 {o.shipping_name} • 📍 {o.shipping_address} • 📞 {o.shipping_phone}
                                                </p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-lg font-bold text-white whitespace-nowrap">Rs. {parseFloat(o.total_price).toLocaleString()}</p>
                                            <select value={o.status}
                                                onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                                                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer">
                                                {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Canceled'].map(s => (
                                                    <option key={s} value={s} className="bg-gray-900">{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {o.items && o.items.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                                            {o.items.map((item, idx) => (
                                                <span key={idx} className="text-xs bg-white/5 border border-white/5 px-2.5 py-1 rounded-lg text-gray-300">
                                                    {item.product_name || `#${item.product}`} × {item.quantity} — Rs. {parseFloat(item.price_at_purchase).toLocaleString()}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {orders.length === 0 && (
                                <div className="text-center py-16">
                                    <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400">No orders on the platform yet</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}

                {tab === 'products' && (
                    <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <h3 className="text-lg font-bold text-white mb-4">{products.length} Products on Platform</h3>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map((p, i) => (
                                <motion.div key={p.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden hover:border-white/20 transition-all">
                                    <div className="h-36 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 relative">
                                        {p.image_url ? (
                                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-10 h-10 text-gray-600" />
                                            </div>
                                        )}
                                        {p.badge && (
                                            <span className="absolute top-2 left-2 px-2 py-0.5 text-xs font-bold bg-violet-600 text-white rounded-lg">{p.badge}</span>
                                        )}
                                    </div>
                                    <div className="p-4">
                                        <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                                        <div className="flex items-center justify-between mt-2">
                                            <p className="text-lg font-bold gradient-text">Rs. {parseFloat(p.price).toLocaleString()}</p>
                                            <span className={`w-2 h-2 rounded-full ${p.in_stock ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                        </div>
                                        <p className="text-xs text-gray-500 mt-1">{p.category} • ⭐ {p.rating}</p>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
