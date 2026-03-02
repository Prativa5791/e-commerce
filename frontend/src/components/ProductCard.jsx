import React, { useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Star, ShoppingCart, Eye, Heart } from 'lucide-react'
import { useCart } from '../context/CartContext'
import { getBadgeColor } from '../data/products'
import Toast from './Toast'

export default function ProductCard({ product }) {
    const navigate = useNavigate()
    const { addItem } = useCart()
    const [liked, setLiked] = useState(false)
    const [toastVisible, setToastVisible] = useState(false)

    const handleAddToCart = (e) => {
        e.preventDefault()
        addItem(product)
        setToastVisible(true)
        setTimeout(() => setToastVisible(false), 3000)
    }

    // Support both API (snake_case) and legacy mock (camelCase) data
    const imageUrl = product.image_url || product.image || ''
    const originalPrice = product.original_price ?? product.originalPrice ?? null
    const reviewsCount = product.reviews_count ?? product.reviews ?? 0
    const inStock = product.in_stock ?? product.inStock ?? true

    const discount = originalPrice
        ? Math.round(((originalPrice - product.price) / originalPrice) * 100)
        : null

    return (
        <>
            <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                whileHover={{ y: -8 }}
                className="group relative glass rounded-2xl overflow-hidden product-card-hover cursor-pointer"
            >
                <Link to={`/products/${product.id}`} className="block">
                    {/* Image */}
                    <div className="relative overflow-hidden aspect-square bg-gradient-to-br from-gray-900 to-gray-800">
                        <img
                            src={imageUrl}
                            alt={product.name}
                            className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500"
                            loading="lazy"
                            onError={(e) => { e.target.src = 'https://images.unsplash.com/photo-1560393464-5c69a73c5770?w=500&h=500&fit=crop' }}
                        />
                        {/* Overlay on hover */}
                        <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />

                        {/* Quick actions on hover */}
                        <div className="absolute bottom-4 left-0 right-0 flex justify-center gap-2 translate-y-4 opacity-0 group-hover:translate-y-0 group-hover:opacity-100 transition-all duration-300">
                            <motion.button
                                whileTap={{ scale: 0.9 }}
                                onClick={handleAddToCart}
                                className="flex items-center gap-2 px-4 py-2 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl shadow-lg transition-colors"
                            >
                                <ShoppingCart className="w-4 h-4" />
                                Add to Cart
                            </motion.button>
                        </div>

                        {/* Badges */}
                        <div className="absolute top-3 left-3 flex flex-col gap-1.5">
                            {product.badge && (
                                <span className={`px-2.5 py-1 text-xs font-semibold rounded-lg border backdrop-blur-sm ${getBadgeColor(product.badge)}`}>
                                    {product.badge}
                                </span>
                            )}
                            {discount && (
                                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-red-500/80 text-white backdrop-blur-sm">
                                    -{discount}%
                                </span>
                            )}
                            {!inStock && (
                                <span className="px-2.5 py-1 text-xs font-semibold rounded-lg bg-gray-700 text-gray-300 backdrop-blur-sm">
                                    Out of Stock
                                </span>
                            )}
                        </div>

                        {/* Wishlist */}
                        <button
                            onClick={(e) => { e.preventDefault(); setLiked(!liked) }}
                            className="absolute top-3 right-3 p-2 glass rounded-xl hover:bg-white/20 transition-all"
                        >
                            <Heart className={`w-4 h-4 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                        </button>
                    </div>

                    {/* Info */}
                    <div className="p-4">
                        <p className="text-xs text-gray-500 mb-1 font-medium uppercase tracking-wider">{product.category}</p>
                        <h3 className="text-white font-semibold text-sm mb-2 line-clamp-2 group-hover:text-violet-300 transition-colors">
                            {product.name}
                        </h3>

                        {/* Rating */}
                        <div className="flex items-center gap-1.5 mb-3">
                            <div className="flex items-center gap-0.5">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-3 h-3 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-xs text-gray-400">({reviewsCount.toLocaleString()})</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center justify-between">
                            <div className="flex items-center gap-2">
                                <span className="text-xl font-bold text-white">${Number(product.price).toFixed(2)}</span>
                                {originalPrice && (
                                    <span className="text-sm text-gray-500 line-through">${Number(originalPrice).toFixed(2)}</span>
                                )}
                            </div>
                            <button
                                onClick={(e) => { e.preventDefault(); navigate(`/products/${product.id}`) }}
                                className="p-2 glass rounded-xl hover:bg-violet-500/20 hover:text-violet-400 transition-all text-gray-500"
                            >
                                <Eye className="w-4 h-4" />
                            </button>
                        </div>
                    </div>
                </Link>
            </motion.div>

            <Toast visible={toastVisible} message={`"${product.name}" added to cart!`} />
        </>
    )
}
