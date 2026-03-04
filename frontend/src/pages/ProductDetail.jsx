import React, { useState, useEffect } from 'react'
import { useParams, Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { Star, ShoppingCart, Heart, ArrowLeft, Check, Truck, Shield, RefreshCw, Zap, Send, MessageCircle, User } from 'lucide-react'
import { PRODUCTS, getBadgeColor } from '../data/products'
import { useCart } from '../context/CartContext'
import { useAuth } from '../context/AuthContext'
import { reviewsApi, chatApi } from '../lib/api'
import Toast from '../components/Toast'
import ProductCard from '../components/ProductCard'

export default function ProductDetail() {
    const { id } = useParams()
    const navigate = useNavigate()
    const { addItem } = useCart()
    const { isAuthenticated, user } = useAuth()
    const [product, setProduct] = useState(null)
    const [productLoading, setProductLoading] = useState(true)
    const [quantity, setQuantity] = useState(1)
    const [liked, setLiked] = useState(false)
    const [added, setAdded] = useState(false)
    const [toast, setToast] = useState(false)
    const [toastMsg, setToastMsg] = useState('')

    // Reviews state
    const [reviews, setReviews] = useState([])
    const [reviewsCount, setReviewsCount] = useState(0)
    const [avgRating, setAvgRating] = useState(0)
    const [newRating, setNewRating] = useState(5)
    const [newComment, setNewComment] = useState('')
    const [hoverRating, setHoverRating] = useState(0)
    const [submittingReview, setSubmittingReview] = useState(false)
    const [reviewsLoading, setReviewsLoading] = useState(true)

    // Fetch product
    useEffect(() => {
        setProductLoading(true)
        productsApi.getById(id)
            .then((res) => {
                setProduct(res.data)
            })
            .catch(() => {
                const p = PRODUCTS.find((p) => p.id === Number(id))
                if (p) setProduct(p)
            })
            .finally(() => setProductLoading(false))
    }, [id])

    // Fetch reviews
    useEffect(() => {
        if (product) {
            setReviewsLoading(true)
            reviewsApi.getByProduct(product.id)
                .then((res) => {
                    setReviews(res.data.reviews || [])
                    setReviewsCount(res.data.count || 0)
                    setAvgRating(res.data.average_rating || 0)
                })
                .catch(() => { })
                .finally(() => setReviewsLoading(false))
        }
    }, [product?.id])

    if (productLoading) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="w-12 h-12 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
            </div>
        )
    }

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

    // Support both API and generic mock fields
    const imageUrl = product.image_url || product.image || ''
    const originalPrice = product.original_price ?? product.originalPrice ?? null
    const thePrice = product.price
    const reviewsC = product.reviews_count ?? product.reviews ?? 0
    const inStock = product.in_stock ?? product.inStock ?? true
    const productFeatures = product.features || []

    const related = PRODUCTS.filter((p) => p.category === product.category && p.id !== product.id).slice(0, 4)
    const discount = originalPrice
        ? Math.round(((originalPrice - thePrice) / originalPrice) * 100)
        : null

    const handleAddToCart = () => {
        for (let i = 0; i < quantity; i++) addItem(product)
        setAdded(true)
        setToastMsg(`Added ${quantity}x "${product.name}" to cart!`)
        setToast(true)
        setTimeout(() => { setAdded(false); setToast(false) }, 3000)
    }

    const handleBuyNow = () => {
        navigate('/checkout', {
            state: {
                buyNowItem: {
                    id: product.id,
                    name: product.name,
                    price: Number(thePrice),
                    image: imageUrl,
                    quantity: quantity,
                }
            }
        })
    }

    const handleSubmitReview = async (e) => {
        e.preventDefault()
        if (!isAuthenticated) {
            navigate('/auth/login')
            return
        }
        setSubmittingReview(true)
        try {
            await reviewsApi.create({
                product: product.id,
                rating: newRating,
                comment: newComment,
            })
            // Refresh reviews
            const res = await reviewsApi.getByProduct(product.id)
            setReviews(res.data.reviews || [])
            setReviewsCount(res.data.count || 0)
            setAvgRating(res.data.average_rating || 0)
            setNewComment('')
            setNewRating(5)
            setToastMsg('Review submitted successfully!')
            setToast(true)
            setTimeout(() => setToast(false), 3000)
        } catch (err) {
            setToastMsg(err.response?.data?.detail || 'Failed to submit review')
            setToast(true)
            setTimeout(() => setToast(false), 3000)
        } finally {
            setSubmittingReview(false)
        }
    }

    const handleStartChat = async () => {
        if (!isAuthenticated) {
            navigate('/auth/login')
            return
        }
        // Navigate to chat
        const sellerId = product.seller || 1 // fallback to 1 if mock
        navigate('/chat', { state: { productId: product.id, productName: product.name, sellerId } })
    }

    const displayRating = avgRating > 0 ? avgRating : (product.rating || 0)
    const displayCount = reviewsCount > 0 ? reviewsCount : reviewsC

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
                            <img src={imageUrl} alt={product.name} className="w-full h-full object-cover" />
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
                                        className={`w-5 h-5 ${i < Math.floor(displayRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`}
                                    />
                                ))}
                            </div>
                            <span className="text-white font-bold">{displayRating}</span>
                            <span className="text-gray-400 text-sm">({displayCount.toLocaleString()} reviews)</span>
                        </div>

                        {/* Price */}
                        <div className="flex items-center gap-4">
                            <span className="text-5xl font-black gradient-text">${Number(thePrice).toFixed(2)}</span>
                            {originalPrice && (
                                <div>
                                    <p className="text-gray-500 line-through text-lg">${Number(originalPrice).toFixed(2)}</p>
                                    <p className="text-emerald-400 text-sm font-semibold">Save ${(Number(originalPrice) - Number(thePrice)).toFixed(2)}</p>
                                </div>
                            )}
                        </div>

                        <p className="text-gray-400 leading-relaxed">{product.description}</p>

                        {/* Features */}
                        <div className="grid grid-cols-2 gap-3">
                            {productFeatures.map((feat) => (
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
                                disabled={!inStock}
                                className={`flex-1 flex items-center justify-center gap-3 py-4 font-bold text-white rounded-2xl transition-all duration-300 ${added
                                    ? 'bg-emerald-600'
                                    : !inStock
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
                                            {inStock ? 'Add to Cart' : 'Out of Stock'}
                                        </motion.span>
                                    )}
                                </AnimatePresence>
                            </motion.button>

                            {/* Buy Now Button */}
                            <motion.button
                                whileHover={{ scale: 1.03 }}
                                whileTap={{ scale: 0.97 }}
                                onClick={handleBuyNow}
                                disabled={!inStock}
                                className={`flex items-center justify-center gap-2 px-6 py-4 font-bold text-white rounded-2xl transition-all duration-300 ${!inStock
                                    ? 'bg-gray-700 cursor-not-allowed opacity-60'
                                    : 'bg-gradient-to-r from-amber-500 to-orange-600 hover:from-amber-400 hover:to-orange-500 shadow-lg shadow-amber-500/25'
                                    }`}
                            >
                                <Zap className="w-5 h-5" />
                                Buy Now
                            </motion.button>
                        </div>

                        {/* Chat with Seller */}
                        <motion.button
                            whileHover={{ scale: 1.02 }}
                            whileTap={{ scale: 0.98 }}
                            onClick={handleStartChat}
                            className="w-full flex items-center justify-center gap-3 py-3.5 glass hover:bg-white/10 text-white font-semibold rounded-2xl transition-all border border-white/10 hover:border-violet-500/30"
                        >
                            <MessageCircle className="w-5 h-5 text-violet-400" />
                            Chat with Seller
                        </motion.button>

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

                {/* ─── Reviews Section ─────────────────────────────────────────── */}
                <motion.section
                    initial={{ opacity: 0, y: 30 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="mt-20"
                >
                    <div className="flex items-center justify-between mb-8">
                        <h2 className="text-3xl font-black text-white flex items-center gap-3">
                            <Star className="w-7 h-7 text-amber-400" />
                            Customer Reviews
                        </h2>
                        {reviewsCount > 0 && (
                            <div className="flex items-center gap-3 glass px-4 py-2 rounded-xl">
                                <span className="text-2xl font-black text-white">{avgRating}</span>
                                <div className="flex gap-0.5">
                                    {[...Array(5)].map((_, i) => (
                                        <Star key={i} className={`w-4 h-4 ${i < Math.round(avgRating) ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
                                    ))}
                                </div>
                                <span className="text-gray-400 text-sm">({reviewsCount})</span>
                            </div>
                        )}
                    </div>

                    <div className="grid lg:grid-cols-3 gap-8">
                        {/* Write a Review */}
                        <motion.div
                            initial={{ opacity: 0, x: -20 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            className="lg:col-span-1"
                        >
                            <div className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl p-6 shadow-2xl sticky top-24">
                                <h3 className="text-lg font-bold text-white mb-4 flex items-center gap-2">
                                    <Send className="w-5 h-5 text-violet-400" />
                                    Write a Review
                                </h3>

                                {!isAuthenticated ? (
                                    <div className="text-center py-6">
                                        <p className="text-gray-400 mb-4">Sign in to leave a review</p>
                                        <Link to="/auth/login">
                                            <button className="px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white font-semibold rounded-xl transition-all">
                                                Sign In
                                            </button>
                                        </Link>
                                    </div>
                                ) : (
                                    <form onSubmit={handleSubmitReview} className="space-y-4">
                                        {/* Star selector */}
                                        <div>
                                            <label className="text-sm text-gray-400 mb-2 block">Your Rating</label>
                                            <div className="flex gap-1">
                                                {[1, 2, 3, 4, 5].map((star) => (
                                                    <button
                                                        key={star}
                                                        type="button"
                                                        onClick={() => setNewRating(star)}
                                                        onMouseEnter={() => setHoverRating(star)}
                                                        onMouseLeave={() => setHoverRating(0)}
                                                        className="p-1 transition-transform hover:scale-125"
                                                    >
                                                        <Star
                                                            className={`w-7 h-7 transition-colors ${star <= (hoverRating || newRating)
                                                                ? 'fill-amber-400 text-amber-400'
                                                                : 'text-gray-600'
                                                                }`}
                                                        />
                                                    </button>
                                                ))}
                                            </div>
                                        </div>

                                        {/* Comment */}
                                        <div>
                                            <label className="text-sm text-gray-400 mb-2 block">Your Comment</label>
                                            <textarea
                                                value={newComment}
                                                onChange={(e) => setNewComment(e.target.value)}
                                                placeholder="Share your experience with this product..."
                                                rows={4}
                                                className="w-full bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 resize-none transition-all"
                                            />
                                        </div>

                                        <motion.button
                                            whileHover={{ scale: 1.02 }}
                                            whileTap={{ scale: 0.98 }}
                                            type="submit"
                                            disabled={submittingReview}
                                            className="w-full py-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold rounded-xl transition-all flex items-center justify-center gap-2 disabled:opacity-60"
                                        >
                                            {submittingReview ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <>
                                                    <Send className="w-4 h-4" />
                                                    Submit Review
                                                </>
                                            )}
                                        </motion.button>
                                    </form>
                                )}
                            </div>
                        </motion.div>

                        {/* Reviews List */}
                        <div className="lg:col-span-2 space-y-4">
                            {reviewsLoading ? (
                                <div className="flex items-center justify-center py-12">
                                    <div className="w-10 h-10 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                                </div>
                            ) : reviews.length === 0 ? (
                                <div className="flex flex-col items-center justify-center py-16 text-center bg-white/5 border border-white/10 rounded-3xl">
                                    <Star className="w-12 h-12 text-gray-600 mb-3" />
                                    <h3 className="text-lg font-bold text-white mb-1">No reviews yet</h3>
                                    <p className="text-gray-500 text-sm">Be the first to review this product!</p>
                                </div>
                            ) : (
                                reviews.map((review, i) => (
                                    <motion.div
                                        key={review.id}
                                        initial={{ opacity: 0, y: 15 }}
                                        whileInView={{ opacity: 1, y: 0 }}
                                        viewport={{ once: true }}
                                        transition={{ delay: i * 0.05 }}
                                        className="bg-white/5 border border-white/10 rounded-2xl p-5 hover:border-white/20 transition-all"
                                    >
                                        <div className="flex items-start justify-between mb-3">
                                            <div className="flex items-center gap-3">
                                                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm uppercase">
                                                    {review.user_username?.[0] || 'U'}
                                                </div>
                                                <div>
                                                    <p className="text-white font-semibold">{review.user_username}</p>
                                                    <p className="text-gray-500 text-xs">{new Date(review.created_at).toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}</p>
                                                </div>
                                            </div>
                                            <div className="flex gap-0.5">
                                                {[...Array(5)].map((_, si) => (
                                                    <Star key={si} className={`w-4 h-4 ${si < review.rating ? 'fill-amber-400 text-amber-400' : 'text-gray-600'}`} />
                                                ))}
                                            </div>
                                        </div>
                                        {review.comment && (
                                            <p className="text-gray-300 text-sm leading-relaxed pl-[52px]">{review.comment}</p>
                                        )}
                                    </motion.div>
                                ))
                            )}
                        </div>
                    </div>
                </motion.section>

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

            <Toast visible={toast} message={toastMsg} />
        </div>
    )
}
