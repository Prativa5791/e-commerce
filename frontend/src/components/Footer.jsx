import React from 'react'
import { Link } from 'react-router-dom'
import { Zap, Github, Twitter, Instagram, ArrowRight } from 'lucide-react'

export default function Footer() {
    return (
        <footer className="border-t border-white/10 mt-24">
            <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
                <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
                    {/* Brand */}
                    <div className="md:col-span-2">
                        <div className="flex items-center gap-2 mb-4">
                            <div className="w-8 h-8 rounded-lg bg-gradient-to-br from-violet-500 to-purple-700 flex items-center justify-center">
                                <Zap className="w-4 h-4 text-white" />
                            </div>
                            <span className="font-bold text-xl gradient-text">NexShop</span>
                        </div>
                        <p className="text-gray-400 text-sm leading-relaxed max-w-xs">
                            Premium products. Seamless experience. Discover a new way to shop with NexShop.
                        </p>
                        {/* Newsletter */}
                        <div className="flex gap-2 mt-6">
                            <input
                                type="email"
                                placeholder="Your email..."
                                className="flex-1 px-4 py-2.5 glass rounded-xl text-sm text-white placeholder-gray-500 border-0 outline-none focus:ring-2 focus:ring-violet-500/50"
                            />
                            <button className="p-2.5 bg-violet-600 hover:bg-violet-500 text-white rounded-xl transition-colors">
                                <ArrowRight className="w-5 h-5" />
                            </button>
                        </div>
                    </div>

                    {/* Links */}
                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Shop</h4>
                        <ul className="space-y-3">
                            {['All Products', 'Electronics', 'Fashion', 'Home & Living', 'Sports', 'Beauty'].map((item) => (
                                <li key={item}>
                                    <Link to="/products" className="text-gray-400 hover:text-violet-400 text-sm transition-colors">
                                        {item}
                                    </Link>
                                </li>
                            ))}
                        </ul>
                    </div>

                    <div>
                        <h4 className="text-white font-semibold mb-4 text-sm uppercase tracking-wider">Account</h4>
                        <ul className="space-y-3">
                            {['My Orders', 'Wishlist', 'Settings', 'Help Center', 'Returns'].map((item) => (
                                <li key={item}>
                                    <a href="#" className="text-gray-400 hover:text-violet-400 text-sm transition-colors">
                                        {item}
                                    </a>
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                <div className="border-t border-white/10 mt-12 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4">
                    <p className="text-gray-500 text-sm">© 2026 NexShop. All rights reserved.</p>
                    <div className="flex items-center gap-4">
                        {[Github, Twitter, Instagram].map((Icon, i) => (
                            <a key={i} href="#" className="w-9 h-9 glass rounded-xl flex items-center justify-center text-gray-500 hover:text-violet-400 hover:bg-violet-500/10 transition-all">
                                <Icon className="w-4 h-4" />
                            </a>
                        ))}
                    </div>
                </div>
            </div>
        </footer>
    )
}
