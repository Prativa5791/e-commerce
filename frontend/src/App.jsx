import React from 'react'
import { BrowserRouter, Routes, Route, useLocation } from 'react-router-dom'
import { AnimatePresence, motion } from 'framer-motion'
import { CartProvider } from './context/CartContext'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import Home from './pages/Home'
import Products from './pages/Products'
import ProductDetail from './pages/ProductDetail'
import Cart from './pages/Cart'
import Orders from './pages/Orders'
import Auth from './pages/Auth'

const pageVariants = {
  initial: { opacity: 0, y: 20 },
  animate: { opacity: 1, y: 0, transition: { duration: 0.35, ease: 'easeOut' } },
  exit: { opacity: 0, y: -10, transition: { duration: 0.2, ease: 'easeIn' } },
}

function AnimatedRoutes() {
  const location = useLocation()

  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        variants={pageVariants}
        initial="initial"
        animate="animate"
        exit="exit"
      >
        <Routes location={location}>
          <Route path="/" element={<Home />} />
          <Route path="/products" element={<Products />} />
          <Route path="/products/:id" element={<ProductDetail />} />
          <Route path="/cart" element={<Cart />} />
          <Route path="/orders" element={<Orders />} />
          <Route path="/login" element={<Auth />} />
          <Route path="/register" element={<Auth />} />
          {/* 404 fallback */}
          <Route path="*" element={
            <div className="min-h-screen flex flex-col items-center justify-center text-center px-4">
              <h1 className="text-8xl font-black gradient-text mb-4">404</h1>
              <p className="text-gray-400 text-xl mb-8">Page not found</p>
              <a href="/" className="px-8 py-4 bg-violet-600 hover:bg-violet-500 text-white font-bold rounded-2xl transition-colors">
                Go Home
              </a>
            </div>
          } />
        </Routes>
      </motion.div>
    </AnimatePresence>
  )
}

export default function App() {
  return (
    <BrowserRouter>
      <CartProvider>
        <div className="min-h-screen bg-[#0a0a0f] text-white">
          <Navbar />
          <main>
            <AnimatedRoutes />
          </main>
          <Footer />
        </div>
      </CartProvider>
    </BrowserRouter>
  )
}
