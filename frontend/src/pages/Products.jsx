import React, { useState, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Search, SlidersHorizontal, X } from 'lucide-react'
import ProductCard from '../components/ProductCard'
import { PRODUCTS, CATEGORIES } from '../data/products'

export default function Products() {
    const [search, setSearch] = useState('')
    const [category, setCategory] = useState('All')
    const [sortBy, setSortBy] = useState('default')
    const [showFilters, setShowFilters] = useState(false)

    const filtered = useMemo(() => {
        let arr = [...PRODUCTS]
        if (category !== 'All') arr = arr.filter((p) => p.category === category)
        if (search) arr = arr.filter((p) => p.name.toLowerCase().includes(search.toLowerCase()))
        if (sortBy === 'price-asc') arr.sort((a, b) => a.price - b.price)
        if (sortBy === 'price-desc') arr.sort((a, b) => b.price - a.price)
        if (sortBy === 'rating') arr.sort((a, b) => b.rating - a.rating)
        if (sortBy === 'reviews') arr.sort((a, b) => b.reviews - a.reviews)
        return arr
    }, [search, category, sortBy])

    return (
        <div className="min-h-screen pt-24 pb-20 px-4">
            <div className="max-w-7xl mx-auto">
                {/* Header */}
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="mb-10"
                >
                    <p className="text-violet-400 text-sm uppercase tracking-widest font-semibold mb-2">Catalog</p>
                    <h1 className="text-4xl font-black text-white mb-1">All Products</h1>
                    <p className="text-gray-500">{filtered.length} items found</p>
                </motion.div>

                {/* Controls */}
                <motion.div
                    initial={{ opacity: 0, y: 15 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.1 }}
                    className="flex flex-col sm:flex-row gap-4 mb-8"
                >
                    {/* Search */}
                    <div className="relative flex-1">
                        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-500" />
                        <input
                            type="text"
                            placeholder="Search products..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            className="w-full pl-11 pr-4 py-3 glass rounded-2xl text-white placeholder-gray-500 text-sm focus:outline-none focus:ring-2 focus:ring-violet-500/50 transition-all"
                        />
                        {search && (
                            <button onClick={() => setSearch('')} className="absolute right-3 top-1/2 -translate-y-1/2">
                                <X className="w-4 h-4 text-gray-500 hover:text-white" />
                            </button>
                        )}
                    </div>

                    {/* Sort */}
                    <select
                        value={sortBy}
                        onChange={(e) => setSortBy(e.target.value)}
                        className="px-4 py-3 glass rounded-2xl text-white text-sm appearance-none focus:outline-none focus:ring-2 focus:ring-violet-500/50 min-w-40 bg-transparent"
                    >
                        <option value="default" className="bg-gray-900">Default</option>
                        <option value="price-asc" className="bg-gray-900">Price: Low to High</option>
                        <option value="price-desc" className="bg-gray-900">Price: High to Low</option>
                        <option value="rating" className="bg-gray-900">Top Rated</option>
                        <option value="reviews" className="bg-gray-900">Most Reviewed</option>
                    </select>
                </motion.div>

                {/* Category Pills */}
                <div className="flex gap-2 flex-wrap mb-8">
                    {CATEGORIES.map((cat) => (
                        <motion.button
                            key={cat}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            onClick={() => setCategory(cat)}
                            className={`px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200 ${category === cat
                                    ? 'bg-violet-600 text-white shadow-lg shadow-violet-500/25'
                                    : 'glass text-gray-400 hover:text-white hover:bg-white/10'
                                }`}
                        >
                            {cat}
                        </motion.button>
                    ))}
                </div>

                {/* Product Grid */}
                <AnimatePresence mode="wait">
                    {filtered.length === 0 ? (
                        <motion.div
                            key="empty"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="text-center py-24"
                        >
                            <div className="w-20 h-20 bg-white/5 rounded-3xl flex items-center justify-center mx-auto mb-4">
                                <Search className="w-10 h-10 text-gray-600" />
                            </div>
                            <p className="text-gray-400 text-lg font-medium">No products found</p>
                            <p className="text-gray-600 text-sm mt-1">Try adjusting your search or filters</p>
                            <button
                                onClick={() => { setSearch(''); setCategory('All') }}
                                className="mt-6 px-6 py-2.5 bg-violet-600 hover:bg-violet-500 text-white text-sm font-medium rounded-xl transition-colors"
                            >
                                Clear Filters
                            </button>
                        </motion.div>
                    ) : (
                        <motion.div
                            key="grid"
                            initial={{ opacity: 0 }}
                            animate={{ opacity: 1 }}
                            exit={{ opacity: 0 }}
                            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
                        >
                            {filtered.map((product, i) => (
                                <motion.div
                                    key={product.id}
                                    initial={{ opacity: 0, y: 20 }}
                                    animate={{ opacity: 1, y: 0 }}
                                    transition={{ delay: i * 0.05 }}
                                >
                                    <ProductCard product={product} />
                                </motion.div>
                            ))}
                        </motion.div>
                    )}
                </AnimatePresence>
            </div>
        </div>
    )
}
