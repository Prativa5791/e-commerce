import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { productsApi, ordersApi } from '../lib/api'
import {
    Package, ShoppingCart, DollarSign, TrendingUp,
    Plus, Edit3, Trash2, X, Save, Eye, Clock,
    CheckCircle, Truck, AlertCircle, BarChart3,
    ArrowUpRight, ArrowDownRight, Tag
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

const emptyProduct = {
    name: '', category: 'Other', price: '', original_price: '',
    description: '', image_url: '', badge: '', in_stock: true,
}

export default function SellerDashboard() {
    const { isAuthenticated, isSeller, isAdmin } = useAuth()
    const navigate = useNavigate()

    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [tab, setTab] = useState('overview')
    const [loading, setLoading] = useState(true)
    const [showModal, setShowModal] = useState(false)
    const [editProduct, setEditProduct] = useState(null)
    const [form, setForm] = useState(emptyProduct)
    const [saving, setSaving] = useState(false)
    const [error, setError] = useState('')

    useEffect(() => {
        if (!isAuthenticated) { navigate('/auth/login'); return }
        if (!isSeller && !isAdmin) { navigate('/'); return }
        fetchData()
    }, [isAuthenticated, isSeller, isAdmin])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [prodRes, orderRes] = await Promise.all([
                productsApi.getAll(),
                ordersApi.allOrders().catch(() => ({ data: [] })),
            ])
            setProducts(prodRes.data?.results || prodRes.data || [])
            setOrders(orderRes.data?.results || orderRes.data || [])
        } catch (err) {
            console.error('Failed to load dashboard data', err)
        } finally {
            setLoading(false)
        }
    }

    const totalRevenue = orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0)
    const pendingOrders = orders.filter(o => o.status === 'Pending').length
    const deliveredOrders = orders.filter(o => o.status === 'Delivered').length

    const stats = [
        { label: 'Products', value: products.length, icon: Package, color: 'from-violet-500 to-purple-600', change: '+3' },
        { label: 'Total Orders', value: orders.length, icon: ShoppingCart, color: 'from-blue-500 to-cyan-600', change: '+12' },
        { label: 'Revenue', value: `Rs. ${totalRevenue.toLocaleString()}`, icon: DollarSign, color: 'from-emerald-500 to-green-600', change: '+8%' },
        { label: 'Pending', value: pendingOrders, icon: Clock, color: 'from-amber-500 to-orange-600', change: pendingOrders > 0 ? 'Action needed' : 'All clear' },
    ]

    // Product CRUD
    const openAddModal = () => { setEditProduct(null); setForm(emptyProduct); setShowModal(true); setError('') }
    const openEditModal = (p) => {
        setEditProduct(p)
        setForm({
            name: p.name, category: p.category, price: p.price,
            original_price: p.original_price || '', description: p.description,
            image_url: p.image_url || '', badge: p.badge || '', in_stock: p.in_stock,
        })
        setShowModal(true)
        setError('')
    }

    const handleSave = async () => {
        if (!form.name || !form.price) { setError('Name and price are required'); return }
        setSaving(true)
        setError('')
        try {
            const payload = { ...form, price: parseFloat(form.price) }
            if (payload.original_price) payload.original_price = parseFloat(payload.original_price)
            else delete payload.original_price

            if (editProduct) {
                await productsApi.update(editProduct.id, payload)
            } else {
                await productsApi.create(payload)
            }
            setShowModal(false)
            fetchData()
        } catch (err) {
            setError(err.response?.data?.detail || 'Failed to save product')
        } finally {
            setSaving(false)
        }
    }

    const handleDelete = async (id) => {
        if (!confirm('Delete this product?')) return
        try {
            await productsApi.delete(id)
            fetchData()
        } catch (err) {
            alert('Failed to delete product')
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

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: '100px' }}>
                <div className="flex flex-col items-center gap-4">
                    <div className="w-12 h-12 rounded-full border-4 border-violet-500 border-t-transparent animate-spin" />
                    <p className="text-gray-400">Loading dashboard...</p>
                </div>
            </div>
        )
    }

    return (
        <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" style={{ paddingTop: '100px' }}>
            {/* Header */}
            <motion.div initial={{ opacity: 0, y: -20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
                <h1 className="text-3xl md:text-4xl font-black">
                    <span className="gradient-text">Seller Dashboard</span>
                </h1>
                <p className="text-gray-400 mt-2">Manage your products and track orders</p>
            </motion.div>

            {/* Stat Cards */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {stats.map((s, i) => (
                    <motion.div
                        key={s.label}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{ delay: i * 0.08 }}
                        className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all group"
                    >
                        <div className="flex items-center justify-between mb-3">
                            <div className={`w-11 h-11 rounded-xl bg-gradient-to-br ${s.color} flex items-center justify-center shadow-lg`}>
                                <s.icon className="w-5 h-5 text-white" />
                            </div>
                            <span className="text-xs text-emerald-400 font-medium flex items-center gap-1">
                                <ArrowUpRight className="w-3 h-3" />{s.change}
                            </span>
                        </div>
                        <p className="text-2xl font-bold text-white">{s.value}</p>
                        <p className="text-sm text-gray-400">{s.label}</p>
                    </motion.div>
                ))}
            </div>

            {/* Tabs */}
            <div className="flex gap-2 mb-6 overflow-x-auto pb-2">
                {['overview', 'products', 'orders'].map(t => (
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
                        {/* Recent Orders */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <ShoppingCart className="w-5 h-5 text-violet-400" /> Recent Orders
                            </h3>
                            <div className="space-y-3">
                                {orders.slice(0, 5).map(o => (
                                    <div key={o.id} className="flex items-center justify-between p-3 bg-white/5 rounded-xl border border-white/5">
                                        <div>
                                            <p className="text-sm font-medium text-white">Order #{o.id}</p>
                                            <p className="text-xs text-gray-400">{o.user} • {new Date(o.ordered_at).toLocaleDateString()}</p>
                                        </div>
                                        <div className="text-right">
                                            <p className="text-sm font-semibold text-white">Rs. {parseFloat(o.total_price).toLocaleString()}</p>
                                            <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[o.status] || 'bg-gray-500/20 text-gray-400'}`}>
                                                {o.status}
                                            </span>
                                        </div>
                                    </div>
                                ))}
                                {orders.length === 0 && <p className="text-gray-500 text-sm text-center py-4">No orders yet</p>}
                            </div>
                        </div>

                        {/* Order Status Breakdown */}
                        <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-6">
                            <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                <BarChart3 className="w-5 h-5 text-violet-400" /> Status Breakdown
                            </h3>
                            <div className="space-y-3">
                                {Object.keys(statusColors).map(st => {
                                    const count = orders.filter(o => o.status === st).length
                                    const pct = orders.length ? Math.round((count / orders.length) * 100) : 0
                                    return (
                                        <div key={st} className="flex items-center gap-3">
                                            <span className={`text-xs px-2 py-1 rounded-full border whitespace-nowrap ${statusColors[st]}`}>{st}</span>
                                            <div className="flex-1 h-2 bg-white/5 rounded-full overflow-hidden">
                                                <motion.div
                                                    initial={{ width: 0 }}
                                                    animate={{ width: `${pct}%` }}
                                                    transition={{ duration: 0.8, delay: 0.2 }}
                                                    className="h-full bg-gradient-to-r from-violet-500 to-fuchsia-500 rounded-full"
                                                />
                                            </div>
                                            <span className="text-xs text-gray-400 w-12 text-right">{count} ({pct}%)</span>
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    </motion.div>
                )}

                {tab === 'products' && (
                    <motion.div key="products" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <div className="flex items-center justify-between mb-4">
                            <h3 className="text-lg font-bold text-white">{products.length} Products</h3>
                            <button onClick={openAddModal}
                                className="px-4 py-2.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl flex items-center gap-2 text-sm transition-all shadow-lg shadow-violet-500/25">
                                <Plus className="w-4 h-4" /> Add Product
                            </button>
                        </div>
                        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                            {products.map((p, i) => (
                                <motion.div key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden group hover:border-violet-500/30 transition-all">
                                    <div className="h-40 bg-gradient-to-br from-violet-500/10 to-fuchsia-500/10 relative overflow-hidden">
                                        {p.image_url ? (
                                            <img src={p.image_url} alt={p.name} className="w-full h-full object-cover" />
                                        ) : (
                                            <div className="w-full h-full flex items-center justify-center">
                                                <Package className="w-12 h-12 text-gray-600" />
                                            </div>
                                        )}
                                        {p.badge && (
                                            <span className="absolute top-3 left-3 px-2 py-1 text-xs font-bold bg-violet-600 text-white rounded-lg">{p.badge}</span>
                                        )}
                                        <div className="absolute top-3 right-3 flex gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                                            <button onClick={() => openEditModal(p)}
                                                className="p-2 bg-white/10 backdrop-blur rounded-lg hover:bg-violet-500/50 transition-colors">
                                                <Edit3 className="w-4 h-4 text-white" />
                                            </button>
                                            <button onClick={() => handleDelete(p.id)}
                                                className="p-2 bg-white/10 backdrop-blur rounded-lg hover:bg-red-500/50 transition-colors">
                                                <Trash2 className="w-4 h-4 text-white" />
                                            </button>
                                        </div>
                                    </div>
                                    <div className="p-4">
                                        <div className="flex items-center justify-between mb-1">
                                            <p className="text-sm font-semibold text-white truncate">{p.name}</p>
                                            <span className={`w-2 h-2 rounded-full ${p.in_stock ? 'bg-emerald-400' : 'bg-red-400'}`} />
                                        </div>
                                        <p className="text-xs text-gray-400 mb-2">{p.category}</p>
                                        <div className="flex items-center justify-between">
                                            <p className="text-lg font-bold gradient-text">Rs. {parseFloat(p.price).toLocaleString()}</p>
                                            {p.original_price && (
                                                <p className="text-xs text-gray-500 line-through">Rs. {parseFloat(p.original_price).toLocaleString()}</p>
                                            )}
                                        </div>
                                    </div>
                                </motion.div>
                            ))}
                        </div>
                    </motion.div>
                )}

                {tab === 'orders' && (
                    <motion.div key="orders" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
                        <h3 className="text-lg font-bold text-white mb-4">{orders.length} Orders</h3>
                        <div className="space-y-3">
                            {orders.map((o, i) => (
                                <motion.div key={o.id}
                                    initial={{ opacity: 0, y: 15 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.04 }}
                                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all">
                                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
                                        <div>
                                            <div className="flex items-center gap-3 mb-1">
                                                <p className="font-bold text-white">Order #{o.id}</p>
                                                <span className={`text-xs px-2 py-0.5 rounded-full border ${statusColors[o.status]}`}>{o.status}</span>
                                            </div>
                                            <p className="text-sm text-gray-400">
                                                {o.user} • {new Date(o.ordered_at).toLocaleDateString()} • {o.items?.length || 0} items
                                            </p>
                                            {o.shipping_address && (
                                                <p className="text-xs text-gray-500 mt-1">📍 {o.shipping_address}</p>
                                            )}
                                        </div>
                                        <div className="flex items-center gap-3">
                                            <p className="text-lg font-bold text-white">Rs. {parseFloat(o.total_price).toLocaleString()}</p>
                                            <select
                                                value={o.status}
                                                onChange={(e) => handleStatusUpdate(o.id, e.target.value)}
                                                className="bg-white/5 border border-white/10 rounded-xl px-3 py-2 text-sm text-white focus:outline-none focus:border-violet-500 cursor-pointer"
                                            >
                                                {['Pending', 'Confirmed', 'Processing', 'Shipped', 'Out for Delivery', 'Delivered', 'Canceled'].map(s => (
                                                    <option key={s} value={s} className="bg-gray-900">{s}</option>
                                                ))}
                                            </select>
                                        </div>
                                    </div>
                                    {/* Order Items */}
                                    {o.items && o.items.length > 0 && (
                                        <div className="mt-3 pt-3 border-t border-white/5 flex flex-wrap gap-2">
                                            {o.items.map((item, idx) => (
                                                <span key={idx} className="text-xs bg-white/5 border border-white/5 px-2 py-1 rounded-lg text-gray-300">
                                                    {item.product_name || `Product #${item.product}`} × {item.quantity}
                                                </span>
                                            ))}
                                        </div>
                                    )}
                                </motion.div>
                            ))}
                            {orders.length === 0 && (
                                <div className="text-center py-12">
                                    <ShoppingCart className="w-16 h-16 text-gray-600 mx-auto mb-4" />
                                    <p className="text-gray-400 text-lg">No orders yet</p>
                                </div>
                            )}
                        </div>
                    </motion.div>
                )}
            </AnimatePresence>

            {/* Product Modal */}
            <AnimatePresence>
                {showModal && (
                    <motion.div
                        initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm"
                        onClick={() => setShowModal(false)}>
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            onClick={(e) => e.stopPropagation()}
                            className="w-full max-w-lg bg-[#12121a] border border-white/10 rounded-2xl p-6 shadow-2xl max-h-[85vh] overflow-y-auto">
                            <div className="flex items-center justify-between mb-6">
                                <h2 className="text-xl font-bold text-white">{editProduct ? 'Edit Product' : 'Add Product'}</h2>
                                <button onClick={() => setShowModal(false)} className="p-2 hover:bg-white/10 rounded-xl transition-colors">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <input type="text" placeholder="Product Name *" value={form.name}
                                    onChange={(e) => setForm({ ...form, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-all" />
                                <div className="grid grid-cols-2 gap-3">
                                    <select value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })}
                                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500">
                                        {['Electronics', 'Fashion', 'Home & Living', 'Sports', 'Beauty', 'Other'].map(c => (
                                            <option key={c} value={c} className="bg-gray-900">{c}</option>
                                        ))}
                                    </select>
                                    <select value={form.badge} onChange={(e) => setForm({ ...form, badge: e.target.value })}
                                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500">
                                        <option value="" className="bg-gray-900">No Badge</option>
                                        {['Best Seller', 'New', 'Sale', 'Premium'].map(b => (
                                            <option key={b} value={b} className="bg-gray-900">{b}</option>
                                        ))}
                                    </select>
                                </div>
                                <div className="grid grid-cols-2 gap-3">
                                    <input type="number" placeholder="Price *" value={form.price}
                                        onChange={(e) => setForm({ ...form, price: e.target.value })}
                                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-all" />
                                    <input type="number" placeholder="Original Price" value={form.original_price}
                                        onChange={(e) => setForm({ ...form, original_price: e.target.value })}
                                        className="px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-all" />
                                </div>
                                <input type="url" placeholder="Image URL" value={form.image_url}
                                    onChange={(e) => setForm({ ...form, image_url: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-all" />
                                <textarea placeholder="Description" value={form.description} rows={3}
                                    onChange={(e) => setForm({ ...form, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-all resize-none" />
                                <label className="flex items-center gap-3 cursor-pointer">
                                    <input type="checkbox" checked={form.in_stock}
                                        onChange={(e) => setForm({ ...form, in_stock: e.target.checked })}
                                        className="w-5 h-5 rounded bg-white/5 border-white/10 text-violet-500 focus:ring-violet-500" />
                                    <span className="text-sm text-gray-300">In Stock</span>
                                </label>

                                {error && (
                                    <div className="p-3 bg-red-500/10 border border-red-500/30 rounded-xl text-red-400 text-sm">{error}</div>
                                )}

                                <button onClick={handleSave} disabled={saving}
                                    className="w-full py-3.5 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl flex items-center justify-center gap-2 transition-all disabled:opacity-50 shadow-lg shadow-violet-500/25">
                                    <Save className="w-5 h-5" />
                                    {saving ? 'Saving...' : editProduct ? 'Update Product' : 'Add Product'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
