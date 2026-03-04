import React, { useState, useEffect, useCallback } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { ArrowRight, ShoppingBag, Zap, Star, Shield, Truck, RefreshCw, Search, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { FEATURED_PRODUCTS, PRODUCTS } from '../data/products'
import { productsApi } from '../lib/api'

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: { staggerChildren: 0.1 },
    },
}

const itemVariants = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } },
}

const FEATURES = [
    { icon: Truck, title: 'Free Shipping', desc: 'On orders over $50' },
    { icon: Shield, title: 'Secure Payment', desc: '100% protected transactions' },
    { icon: RefreshCw, title: 'Easy Returns', desc: '30-day return policy' },
    { icon: Star, title: 'Top Rated', desc: '4.8/5 average rating' },
]

const BANNERS = [
    {
        title: 'New Arrivals',
        subtitle: 'Electronics',
        desc: 'Discover the latest tech gadgets',
        color: 'from-violet-600/30 to-blue-600/20',
        image: PRODUCTS[6].image,
        link: '/products',
    },
    {
        title: 'Summer Sale',
        subtitle: 'Fashion',
        desc: 'Up to 40% off selected items',
        color: 'from-pink-600/30 to-rose-600/20',
        image: PRODUCTS[2].image,
        link: '/products',
    },
]

export default function Home() {
    const navigate = useNavigate()
    return (
        <div className="min-h-screen">
            {/* Hero Section */}
            <section className="hero-bg relative overflow-hidden pt-32 pb-24 px-4">
                {/* Floating orbs */}
                <div className="absolute top-20 left-1/4 w-72 h-72 bg-violet-600/20 rounded-full blur-3xl animate-float pointer-events-none" />
                <div className="absolute bottom-10 right-1/4 w-56 h-56 bg-pink-600/15 rounded-full blur-3xl animate-float pointer-events-none" style={{ animationDelay: '1.5s' }} />
                <div className="absolute top-40 right-10 w-40 h-40 bg-blue-600/15 rounded-full blur-2xl animate-float pointer-events-none" style={{ animationDelay: '0.8s' }} />

                <div className="max-w-7xl mx-auto">
                    <div className="grid lg:grid-cols-2 gap-12 items-center">
                        <motion.div
                            variants={containerVariants}
                            initial="hidden"
                            animate="visible"
                            className="space-y-6"
                        >
                            <motion.div variants={itemVariants}>
                                <span className="inline-flex items-center gap-2 px-4 py-2 glass rounded-full text-sm text-violet-300 border border-violet-500/30">
                                    <Zap className="w-4 h-4" />
                                    Premium Shopping Experience
                                </span>
                            </motion.div>

                            <motion.h1 variants={itemVariants} className="text-5xl lg:text-7xl font-black leading-tight">
                                <span className="text-white">Shop the</span>
                                <br />
                                <span className="gradient-text">Future</span>
                                <br />
                                <span className="text-white">Today</span>
                            </motion.h1>

                            <motion.p variants={itemVariants} className="text-gray-400 text-lg leading-relaxed max-w-md">
                                Discover premium products curated for the modern lifestyle. From cutting-edge electronics to timeless fashion — all in one place.
                            </motion.p>

                            <motion.div variants={itemVariants} className="flex flex-wrap gap-4">
                                <Link to="/products">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="flex items-center gap-2 px-8 py-4 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 text-white font-bold rounded-2xl transition-all duration-300 glow-purple shadow-2xl"
                                    >
                                        <ShoppingBag className="w-5 h-5" />
                                        Shop Now
                                        <ArrowRight className="w-5 h-5" />
                                    </motion.button>
                                </Link>
                                <Link to="/products">
                                    <motion.button
                                        whileHover={{ scale: 1.05 }}
                                        whileTap={{ scale: 0.95 }}
                                        className="px-8 py-4 glass hover:bg-white/10 text-white font-semibold rounded-2xl transition-all duration-300"
                                    >
                                        View All Products
                                    </motion.button>
                                </Link>
                            </motion.div>

                            {/* Stats */}
                            <motion.div variants={itemVariants} className="flex gap-8 pt-4">
                                {[['10K+', 'Products'], ['50K+', 'Customers'], ['4.9★', 'Rating']].map(([val, label]) => (
                                    <div key={label}>
                                        <p className="text-2xl font-black gradient-text">{val}</p>
                                        <p className="text-gray-500 text-sm">{label}</p>
                                    </div>
                                ))}
                            </motion.div>
                        </motion.div>

                        {/* Hero Product Showcase */}
                        <motion.div
                            initial={{ opacity: 0, scale: 0.9, rotate: -3 }}
                            animate={{ opacity: 1, scale: 1, rotate: 0 }}
                            transition={{ duration: 0.8, delay: 0.3 }}
                            className="hidden lg:block relative"
                        >
                            <div className="grid grid-cols-2 gap-4">
                                {FEATURED_PRODUCTS.slice(0, 4).map((p, i) => (
                                    <motion.div
                                        key={p.id}
                                        animate={{ y: [0, -10, 0] }}
                                        transition={{ duration: 3 + i * 0.5, repeat: Infinity, ease: 'easeInOut', delay: i * 0.3 }}
                                        className="glass rounded-2xl overflow-hidden aspect-square"
                                    >
                                        <img src={p.image} alt={p.name} className="w-full h-full object-cover opacity-80 hover:opacity-100 transition-opacity duration-300" />
                                    </motion.div>
                                ))}
                            </div>
                            {/* Glow behind grid */}
                            <div className="absolute inset-0 -z-10 blur-3xl bg-violet-600/20 scale-75" />
                        </motion.div>
                    </div>
                </div>
            </section>



            {/* Feature Badges */}
            <section className="py-12 border-y border-white/10 mt-8">
                <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
                    <div className="grid grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURES.map(({ icon: Icon, title, desc }, i) => (
                            <motion.div
                                key={title}
                                initial={{ opacity: 0, y: 20 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                                className="flex gap-4 items-start"
                            >
                                <div className="w-10 h-10 bg-violet-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                                    <Icon className="w-5 h-5 text-violet-400" />
                                </div>
                                <div>
                                    <p className="text-white font-semibold text-sm">{title}</p>
                                    <p className="text-gray-500 text-xs mt-0.5">{desc}</p>
                                </div>
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Featured Products */}
            <section className="py-20 px-4">
                <div className="max-w-7xl mx-auto">
                    <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        whileInView={{ opacity: 1, y: 0 }}
                        viewport={{ once: true }}
                        className="flex items-end justify-between mb-10"
                    >
                        <div>
                            <p className="text-violet-400 text-sm uppercase tracking-widest font-semibold mb-2">Handpicked</p>
                            <h2 className="text-4xl font-black text-white">Featured Products</h2>
                        </div>
                        <Link to="/products">
                            <motion.button
                                whileHover={{ scale: 1.05 }}
                                className="hidden sm:flex items-center gap-2 text-violet-400 hover:text-violet-300 font-semibold text-sm transition-colors"
                            >
                                View all <ArrowRight className="w-4 h-4" />
                            </motion.button>
                        </Link>
                    </motion.div>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
                        {FEATURED_PRODUCTS.map((product, i) => (
                            <motion.div
                                key={product.id}
                                initial={{ opacity: 0, y: 30 }}
                                whileInView={{ opacity: 1, y: 0 }}
                                viewport={{ once: true }}
                                transition={{ delay: i * 0.1 }}
                            >
                                <ProductCard product={product} />
                            </motion.div>
                        ))}
                    </div>
                </div>
            </section>

            {/* Promo Banners */}
            <section className="py-10 px-4">
                <div className="max-w-7xl mx-auto grid md:grid-cols-2 gap-6">
                    {BANNERS.map((b, i) => (
                        <motion.div
                            key={b.title}
                            initial={{ opacity: 0, x: i === 0 ? -30 : 30 }}
                            whileInView={{ opacity: 1, x: 0 }}
                            viewport={{ once: true }}
                            whileHover={{ scale: 1.02 }}
                            className={`relative overflow-hidden rounded-3xl bg-gradient-to-br ${b.color} border border-white/10 p-8 cursor-pointer`}
                        >
                            <div className="relative z-10">
                                <p className="text-sm text-gray-400 uppercase tracking-wider font-semibold">{b.subtitle}</p>
                                <h3 className="text-3xl font-black text-white mt-1">{b.title}</h3>
                                <p className="text-gray-300 mt-2 text-sm">{b.desc}</p>
                                <Link to={b.link}>
                                    <button className="mt-6 flex items-center gap-2 px-5 py-2.5 bg-white/10 hover:bg-white/20 text-white text-sm font-semibold rounded-xl transition-all">
                                        Shop Now <ArrowRight className="w-4 h-4" />
                                    </button>
                                </Link>
                            </div>
                            <div className="absolute right-0 bottom-0 w-48 h-48 opacity-50">
                                <img src={b.image} alt="" className="w-full h-full object-cover rounded-tl-3xl" />
                            </div>
                        </motion.div>
                    ))}
                </div>
            </section>
        </div>
    )
}
