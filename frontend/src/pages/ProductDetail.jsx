import React, { useState } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShoppingCart, Heart, ArrowLeft, Check, Truck, Shield, RefreshCw, Zap } from 'lucide-react'
import { PRODUCTS, getBadgeColor } from '../data/products'
import { useCart } from '../context/CartContext'
import Toast from '../components/Toast'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addItem } = useCart()
    const [quantity, setQuantity] = useState(1)
    const [liked, setLiked] = useState(false)
    const [added, setAdded] = useState(false)
    const [toast, setToast] = useState(false)

    const product = PRODUCTS.find((p) => p.id === Number(id))

    if (!product) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-white mb-4">Product not found</h2>
                    <Link to="/products">
                        <button className="px-6 py-3 bg-violet-600 text-white rounded-xl">Back to Products</button>
                    </Link>
                </div>
            </div>
        )
    }

    const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    const discount = product.originalPrice
        ? Math.round(((product.originalPrice - product.price) / product.originalPrice) * 100)
        : null

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) addItem(product)
        setAdded(true)
        setToast(true)
        setTimeout(() => { setAdded(false); setToast(false) }, 3000)
    }

    const handleBuyNow = () => {
        navigate('/checkout', {
            state: {
                buyNowItem: {
                    id: product.id,
                    name: product.name,
                    price: product.price,
                    image: product.image,
                    quantity: quantity,
                }
            }
        })
    }

    return (
        <div className="min-h-screen pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Back */}
                <motion.button
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    onClick={() => navigate(-1)}
                    className="flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8 group"
                >
                    <ArrowLeft className="w-4 h-4 group-hover:-translate-x-1 transition-transform" />
                    Back
                </motion.button>

                {/* Product detail */}
                <div className="grid lg:grid-cols-2 gap-12">
                    {/* Image */}
                    <motion.div
                        initial={{ opacity: 0, x: -30 }}
                        animate={{ opacity: 1, x: 0 }}
                        className="relative"
                    >
                        <div className="aspect-square rounded-3xl overflow-hidden glass">
                            <img src={product.image} alt={product.name} className="w-full h-full object-cover" />
                        </div>
                        {/* Badges */}
                        <div className="absolute top-4 left-4 flex gap-2">
                            {product.badge && (
                                <span className={`px-3 py-1 text-sm font-semibold rounded-xl border backdrop-blur-sm ${getBadgeColor(product.badge)}`}>
                                    {product.badge}
                                </span>
                            )}
                            {discount && (
                                <span className="px-3 py-1 text-sm font-semibold rounded-xl bg-red-500/80 text-white backdrop-blur-sm">
                                    -{discount}%
                                </span>
                            )}
                        </div>
                        {/* Wishlist */}
                        <button
                            onClick={() => setLiked(!liked)}
                            className="absolute top-4 right-4 p-3 glass rounded-2xl hover:bg-white/20 transition-all"
                        >
                            <Heart className={`w-5 h-5 transition-colors ${liked ? 'fill-red-500 text-red-500' : 'text-gray-400'}`} />
                        </button>
                    </motion.div>

                    {/* Info */}
                    <motion.div
                        initial={{ opacity: 0, x: 30 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: 0.1 }}
                        className="space-y-6"
                    >
                        <div>
                            <p className="text-violet-400 text-sm uppercase tracking-wider font-semibold mb-2">{product.category}</p>
                            <h1 className="text-4xl font-black text-white leading-tight">{product.name}</h1>
                        </div>

                        {/* Rating */}
                        <div className="flex items-center gap-3">
                            <div className="flex items-center gap-1">
                                {[...Array(5)].map((_, i) => (
                                    <Star
                                        key={i}
                                        className={`w-5 h-5 ${i < Math.floor(product.rating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-white font-bold">{product.rating}</span>
                            <span className="text-gray-400 text-sm">({product.reviews.toLocaleString()} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-4">
                            <span className="text-5xl font-black gradient-text">${product.price.toFixed(2)}</span>
                            {product.originalPrice && (
                                <div>
                                    <p className="text-gray-500 line-through text-lg">${product.originalPrice.toFixed(2)}</p>
                                    <p className="text-emerald-400 text-sm font-semibold">Save ${(product.originalPrice - product.price).toFixed(2)}</p>
                                </div>
                            )}
                        </div>

                        <p className="text-gray-400 leading-relaxed">{product.description}</p>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3">
                            {product.features.map((feat) => (
                                <div key={feat} className="flex items-center gap-2 glass px-4 py-2.5 rounded-xl">
                                    <Check className="w-4 h-4 text-violet-400 flex-shrink-0" />
                                    <span className="text-gray-300 text-sm">{feat}</span>
                                </div>
                            ))}
                        </div>

                        {/* Quantity + CTA */}
                        <div className="flex gap-4 items-center">
                            <div className="flex items-center gap-3 glass px-4 py-3 rounded-2xl">
                                <button
                                    onClick={() => setQuantity(Math.max(1, quantity - 1))}
                                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center font-bold text-white transition-colors"
                                >
                                    -
                                </button>
                                <span className="text-white font-bold w-8 text-center text-lg">{quantity}</span>
                                <button
                                    onClick={() => setQuantity(quantity + 1)}
                                    className="w-8 h-8 bg-white/10 hover:bg-white/20 rounded-lg flex items-center justify-center font-bold text-white transition-colors"
                                >
                                    +
                                </button>
                            </div>

                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleAddToCart}
                                disabled={!product.inStock}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 font-bold text-white rounded-2xl transition-all duration-300 ${added
                                    ? 'bg-emerald-600'
                                    : !product.inStock
                                        ? 'bg-gray-700 cursor-not-allowed opacity-60'
                                        : 'bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 glow-purple'
                                    }`}
                            >
                                <AnimatePresence mode="wait">
                                    {added ? (
                                        <motion.span key="check" initial={{ opacity: 0, scale: 0 }} animate={{ opacity: 1, scale: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                            <Check className="w-5 h-5" /> Added to Cart!
                                        </motion.span>
                                    ) : (
                                        <motion.span key="cart" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }} className="flex items-center gap-2">
                                            <ShoppingCart className="w-5 h-5" />
                                            {product.inStock ? 'Add to Cart' : 'Out of Stock'}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            {/* Buy Now Button */}
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleBuyNow}
                                disabled={!product.inStock}
                                className={`flex items-center justify-center gap-2 px-6 py-4 font-bold text-white rounded-2xl transition-all duration-300 ${!product.inStock
                                        ? 'bg-gray-700 cursor-not-allowed opacity-60'
                                        : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/25'
                                    }`}
                            >
                                <Zap className="w-5 h-5" />
                                Buy Now
                            </motion.button>
                        </div>

                        {/* Guarantees */}
                        <div className="grid grid-cols-3 gap-3 pt-2">
                            {[
                                { icon: Truck, text: 'Free Delivery' },
                                { icon: Shield, text: 'Secure Checkout' },
                                { icon: RefreshCw, text: 'Easy Returns' },
                            ].map(({ icon: Icon, text }) => (
                                <div key={text} className="flex flex-col items-center gap-2 glass py-3 px-2 rounded-2xl text-center">
                                    <Icon className="w-5 h-5 text-violet-400" />
                                    <span className="text-xs text-gray-400">{text}</span>
                                </div>
                            ))}
                        </div>
                    </motion.div>
                </div>

                {/* Related Products */}
                {related.length > 0 && (
                    <section className="mt-20">
                        <h2 className="text-3xl font-black text-white mb-8">Related Products</h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                            {related.map((p, i) => (
                                <motion.div
                                    key={p.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    whileInView={{ opacity: 1, y: 0 }}
                                    viewport={{ once: true }}
                                    transition={{ delay: i * 0.1 }}
                                >
                                    <ProductCard product={p} />
                                </motion.div>
                            ))}
                        </div>
                    </section>
                )}
            </div>

            <Toast visible={toast} message={`Added ${quantity}x "${product.name}" to cart!`} />
        </div>
    )
}
