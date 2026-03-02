import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import api from '../lib/api'
import {
    Package, ShoppingBag, DollarSign, TrendingUp,
    Plus, Edit3, Trash2, X, Save, AlertCircle, BarChart3
} from 'lucide-react'

const statCards = [
    { label: 'Total Products', icon: Package, color: 'from-violet-500 to-purple-600', key: 'products' },
    { label: 'Total Orders', icon: ShoppingBag, color: 'from-blue-500 to-cyan-600', key: 'orders' },
    { label: 'Revenue', icon: DollarSign, color: 'from-emerald-500 to-green-600', key: 'revenue' },
    { label: 'Pending Orders', icon: TrendingUp, color: 'from-amber-500 to-orange-600', key: 'pending' },
]

export default function AdminDashboard() {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const [products, setProducts] = useState([])
    const [orders, setOrders] = useState([])
    const [loading, setLoading] = useState(true)
    const [showAddForm, setShowAddForm] = useState(false)
    const [editingProduct, setEditingProduct] = useState(null)
    const [formData, setFormData] = useState({
        name: '', description: '', price: '', category: 'Electronics', in_stock: true
    })

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login')
            return
        }
        if (user && !user.is_seller) {
            navigate('/')
            return
        }
        fetchData()
    }, [isAuthenticated, user, navigate])

    const fetchData = async () => {
        setLoading(true)
        try {
            const [prodRes, orderRes] = await Promise.all([
                api.get('/api/products/products/'),
                api.get('/api/orders/orders/'),
            ])
            setProducts(prodRes.data.results || prodRes.data || [])
            setOrders(orderRes.data.results || orderRes.data || [])
        } catch (err) {
            console.error('Failed to fetch data:', err)
        } finally {
            setLoading(false)
        }
    }

    const stats = {
        products: products.length,
        orders: orders.length,
        revenue: orders.reduce((sum, o) => sum + parseFloat(o.total_price || 0), 0),
        pending: orders.filter(o => o.status === 'Pending').length,
    }

    const handleSave = async () => {
        try {
            const payload = {
                ...formData,
                price: parseFloat(formData.price),
            }
            if (editingProduct) {
                await api.put(`/api/products/products/${editingProduct.id}/`, payload)
            } else {
                await api.post('/api/products/products/', payload)
            }
            setShowAddForm(false)
            setEditingProduct(null)
            setFormData({ name: '', description: '', price: '', category: 'Electronics', in_stock: true })
            fetchData()
        } catch (err) {
            console.error('Save failed:', err)
            alert('Failed to save product. Make sure all fields are filled.')
        }
    }

    const handleDelete = async (id) => {
        if (!window.confirm('Are you sure you want to delete this product?')) return
        try {
            await api.delete(`/api/products/products/${id}/`)
            fetchData()
        } catch (err) {
            console.error('Delete failed:', err)
        }
    }

    const openEdit = (product) => {
        setEditingProduct(product)
        setFormData({
            name: product.name,
            description: product.description || '',
            price: product.price,
            category: product.category || 'Electronics',
            in_stock: product.in_stock !== false,
        })
        setShowAddForm(true)
    }

    if (loading) {
        return (
            <div className="min-h-screen flex items-center justify-center" style={{ paddingTop: '100px' }}>
                <div className="w-8 h-8 border-2 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

    return (
        <div className="min-h-screen max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pb-20" style={{ paddingTop: '100px' }}>
            {/* Header */}
            <div className="flex items-center justify-between mb-8">
                <motion.div initial={{ opacity: 0, x: -20 }} animate={{ opacity: 1, x: 0 }}>
                    <h1 className="text-3xl md:text-4xl font-black">
                        <span className="gradient-text">Seller Dashboard</span>
                    </h1>
                    <p className="text-gray-400 mt-1">Welcome back, {user?.username}</p>
                </motion.div>
                <motion.button
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    onClick={() => { setEditingProduct(null); setFormData({ name: '', description: '', price: '', category: 'Electronics', in_stock: true }); setShowAddForm(true) }}
                    className="flex items-center gap-2 px-5 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl transition-all shadow-lg shadow-violet-500/25"
                >
                    <Plus className="w-5 h-5" /> Add Product
                </motion.button>
            </div>

            {/* Stats Grid */}
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
                {statCards.map((stat, i) => {
                    const Icon = stat.icon
                    return (
                        <motion.div
                            key={stat.key}
                            initial={{ opacity: 0, y: 20 }}
                            animate={{ opacity: 1, y: 0 }}
                            transition={{ delay: i * 0.1 }}
                            className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl p-5"
                        >
                            <div className="flex items-center justify-between mb-3">
                                <div className={`w-10 h-10 rounded-xl bg-gradient-to-br ${stat.color} flex items-center justify-center`}>
                                    <Icon className="w-5 h-5 text-white" />
                                </div>
                                <BarChart3 className="w-4 h-4 text-gray-500" />
                            </div>
                            <p className="text-2xl font-bold text-white">
                                {stat.key === 'revenue' ? `Rs. ${stats[stat.key].toLocaleString()}` : stats[stat.key]}
                            </p>
                            <p className="text-sm text-gray-400">{stat.label}</p>
                        </motion.div>
                    )
                })}
            </div>

            {/* Products Table */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.4 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden"
            >
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <Package className="w-5 h-5 text-violet-400" /> Products ({products.length})
                    </h2>
                </div>

                {products.length === 0 ? (
                    <div className="p-12 text-center">
                        <AlertCircle className="w-12 h-12 text-gray-500 mx-auto mb-3" />
                        <p className="text-gray-400">No products yet. Add your first product!</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-gray-400 border-b border-white/5">
                                    <th className="p-4">Product</th>
                                    <th className="p-4">Category</th>
                                    <th className="p-4">Price</th>
                                    <th className="p-4">Stock</th>
                                    <th className="p-4">Actions</th>
                                </tr>
                            </thead>
                            <tbody>
                                {products.map((product) => (
                                    <tr key={product.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-lg bg-gradient-to-br from-violet-500/20 to-fuchsia-500/20 flex items-center justify-center flex-shrink-0">
                                                    <Package className="w-5 h-5 text-violet-400" />
                                                </div>
                                                <span className="font-medium text-white text-sm">{product.name}</span>
                                            </div>
                                        </td>
                                        <td className="p-4 text-sm text-gray-400">{product.category}</td>
                                        <td className="p-4 text-sm font-semibold text-white">Rs. {parseFloat(product.price).toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${product.in_stock !== false ? 'bg-emerald-500/20 text-emerald-400' : 'bg-red-500/20 text-red-400'}`}>
                                                {product.in_stock !== false ? 'In Stock' : 'Out of Stock'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <div className="flex items-center gap-2">
                                                <button onClick={() => openEdit(product)}
                                                    className="p-2 hover:bg-white/10 rounded-lg transition-colors text-gray-400 hover:text-white">
                                                    <Edit3 className="w-4 h-4" />
                                                </button>
                                                <button onClick={() => handleDelete(product.id)}
                                                    className="p-2 hover:bg-red-500/10 rounded-lg transition-colors text-gray-400 hover:text-red-400">
                                                    <Trash2 className="w-4 h-4" />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            {/* Recent Orders */}
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5 }}
                className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-2xl overflow-hidden mt-8"
            >
                <div className="p-6 border-b border-white/10">
                    <h2 className="text-xl font-bold text-white flex items-center gap-2">
                        <ShoppingBag className="w-5 h-5 text-blue-400" /> Recent Orders ({orders.length})
                    </h2>
                </div>
                {orders.length === 0 ? (
                    <div className="p-12 text-center">
                        <p className="text-gray-400">No orders yet.</p>
                    </div>
                ) : (
                    <div className="overflow-x-auto">
                        <table className="w-full">
                            <thead>
                                <tr className="text-left text-sm text-gray-400 border-b border-white/5">
                                    <th className="p-4">Order ID</th>
                                    <th className="p-4">Customer</th>
                                    <th className="p-4">Total</th>
                                    <th className="p-4">Payment</th>
                                    <th className="p-4">Status</th>
                                </tr>
                            </thead>
                            <tbody>
                                {orders.slice(0, 10).map((order) => (
                                    <tr key={order.id} className="border-b border-white/5 hover:bg-white/5 transition-colors">
                                        <td className="p-4 text-sm font-medium text-violet-400">#{order.id}</td>
                                        <td className="p-4 text-sm text-gray-300">{order.user}</td>
                                        <td className="p-4 text-sm font-semibold text-white">Rs. {parseFloat(order.total_price).toLocaleString()}</td>
                                        <td className="p-4">
                                            <span className="text-xs px-2 py-1 rounded-full font-medium bg-violet-500/20 text-violet-400">
                                                {order.payment_method?.toUpperCase() || 'COD'}
                                            </span>
                                        </td>
                                        <td className="p-4">
                                            <span className={`text-xs px-2 py-1 rounded-full font-medium ${order.status === 'Delivered' ? 'bg-emerald-500/20 text-emerald-400' :
                                                    order.status === 'Shipped' ? 'bg-blue-500/20 text-blue-400' :
                                                        order.status === 'Canceled' ? 'bg-red-500/20 text-red-400' :
                                                            'bg-amber-500/20 text-amber-400'
                                                }`}>
                                                {order.status}
                                            </span>
                                        </td>
                                    </tr>
                                ))}
                            </tbody>
                        </table>
                    </div>
                )}
            </motion.div>

            {/* Add/Edit Product Modal */}
            <AnimatePresence>
                {showAddForm && (
                    <motion.div
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        exit={{ opacity: 0 }}
                        className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
                        onClick={() => setShowAddForm(false)}
                    >
                        <motion.div
                            initial={{ scale: 0.9, opacity: 0 }}
                            animate={{ scale: 1, opacity: 1 }}
                            exit={{ scale: 0.9, opacity: 0 }}
                            className="bg-[#1a1a2e] border border-white/10 rounded-2xl p-6 w-full max-w-md"
                            onClick={(e) => e.stopPropagation()}
                        >
                            <div className="flex items-center justify-between mb-6">
                                <h3 className="text-xl font-bold text-white">
                                    {editingProduct ? 'Edit Product' : 'Add Product'}
                                </h3>
                                <button onClick={() => setShowAddForm(false)} className="p-2 hover:bg-white/10 rounded-lg">
                                    <X className="w-5 h-5 text-gray-400" />
                                </button>
                            </div>

                            <div className="space-y-4">
                                <input type="text" placeholder="Product Name" value={formData.name}
                                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-all" />
                                <textarea placeholder="Description" value={formData.description} rows={3}
                                    onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-all resize-none" />
                                <input type="number" placeholder="Price (Rs.)" value={formData.price}
                                    onChange={(e) => setFormData({ ...formData, price: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:border-violet-500 transition-all" />
                                <select value={formData.category}
                                    onChange={(e) => setFormData({ ...formData, category: e.target.value })}
                                    className="w-full px-4 py-3 bg-white/5 border border-white/10 rounded-xl text-white focus:outline-none focus:border-violet-500 transition-all">
                                    <option value="Electronics">Electronics</option>
                                    <option value="Clothing">Clothing</option>
                                    <option value="Home">Home & Living</option>
                                    <option value="Books">Books</option>
                                    <option value="Sports">Sports</option>
                                    <option value="Other">Other</option>
                                </select>
                                <label className="flex items-center gap-3 text-gray-300 cursor-pointer">
                                    <input type="checkbox" checked={formData.in_stock}
                                        onChange={(e) => setFormData({ ...formData, in_stock: e.target.checked })}
                                        className="w-4 h-4 rounded" />
                                    In Stock
                                </label>
                            </div>

                            <div className="flex gap-3 mt-6">
                                <button onClick={() => setShowAddForm(false)}
                                    className="flex-1 px-4 py-3 bg-white/5 border border-white/10 hover:bg-white/10 text-white font-medium rounded-xl transition-all">
                                    Cancel
                                </button>
                                <button onClick={handleSave}
                                    className="flex-1 px-4 py-3 bg-gradient-to-r from-violet-600 to-fuchsia-600 hover:from-violet-500 hover:to-fuchsia-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2">
                                    <Save className="w-4 h-4" />
                                    {editingProduct ? 'Update' : 'Create'}
                                </button>
                            </div>
                        </motion.div>
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    )
}
