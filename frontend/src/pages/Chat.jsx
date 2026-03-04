import React, { useEffect, useState, useRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { useAuth } from '../context/AuthContext'
import { chatApi } from '../lib/api'
import { useNavigate, useLocation } from 'react-router-dom'
import {
    MessageCircle, Send, ArrowLeft, User, Package,
    Clock, CheckCircle2, Search, Plus, ChevronRight, MessageSquare
} from 'lucide-react'

export default function Chat() {
    const { user, isAuthenticated } = useAuth()
    const navigate = useNavigate()
    const location = useLocation()
    const messagesEndRef = useRef(null)

    const [rooms, setRooms] = useState([])
    const [activeRoom, setActiveRoom] = useState(null)
    const [messages, setMessages] = useState([])
    const [newMessage, setNewMessage] = useState('')
    const [loading, setLoading] = useState(true)
    const [sending, setSending] = useState(false)
    const [messagesLoading, setMessagesLoading] = useState(false)
    const [showSidebar, setShowSidebar] = useState(true)
    const [pollInterval, setPollInterval] = useState(null)

    useEffect(() => {
        if (!isAuthenticated) {
            navigate('/auth/login')
            return
        }
        fetchRooms()
    }, [isAuthenticated])

    // Auto-scroll to bottom
    useEffect(() => {
        messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' })
    }, [messages])

    // Polling for new messages
    useEffect(() => {
        if (activeRoom) {
            const interval = setInterval(() => {
                fetchMessages(activeRoom.id, true)
            }, 5000)
            setPollInterval(interval)
            return () => clearInterval(interval)
        }
    }, [activeRoom?.id])

    // If navigated from product page with seller info
    useEffect(() => {
        if (location.state?.sellerId) {
            const createAndSelectRoom = async () => {
                try {
                    const res = await chatApi.createRoom({
                        seller: location.state.sellerId,
                        product: location.state.productId
                    })
                    // Add room to list if not present, then select it
                    setRooms(prev => {
                        if (!prev.find(r => r.id === res.data.id)) {
                            return [res.data, ...prev]
                        }
                        return prev
                    })
                    // Select it explicitly
                    handleSelectRoom(res.data)
                    // Clear the location state so we don't re-create endlessly
                    navigate(location.pathname, { replace: true })
                } catch (err) {
                    console.error('Failed to create room', err)
                }
            }
            createAndSelectRoom()
        }
    }, [location.state])

    const fetchRooms = async () => {
        try {
            const res = await chatApi.getRooms()
            setRooms(res.data)
        } catch (err) {
            console.error('Failed to fetch rooms', err)
        } finally {
            setLoading(false)
        }
    }

    const fetchMessages = async (roomId, silent = false) => {
        if (!silent) setMessagesLoading(true)
        try {
            const res = await chatApi.getMessages(roomId)
            setMessages(res.data)
        } catch (err) {
            console.error('Failed to fetch messages', err)
        } finally {
            if (!silent) setMessagesLoading(false)
        }
    }

    const handleSelectRoom = async (room) => {
        setActiveRoom(room)
        setShowSidebar(false)
        await fetchMessages(room.id)
    }

    const handleSend = async (e) => {
        e.preventDefault()
        if (!newMessage.trim() || !activeRoom || sending) return

        setSending(true)
        try {
            const res = await chatApi.sendMessage(activeRoom.id, newMessage.trim())
            setMessages((prev) => [...prev, res.data])
            setNewMessage('')
            // Refresh room list to update last message
            fetchRooms()
        } catch (err) {
            console.error('Failed to send message', err)
        } finally {
            setSending(false)
        }
    }

    const getOtherUser = (room) => {
        if (room.buyer_username === user?.username) return room.seller_username
        return room.buyer_username
    }

    const formatTime = (dateStr) => {
        const d = new Date(dateStr)
        return d.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })
    }

    const formatDate = (dateStr) => {
        const d = new Date(dateStr)
        const today = new Date()
        if (d.toDateString() === today.toDateString()) return 'Today'
        const yesterday = new Date(today)
        yesterday.setDate(yesterday.getDate() - 1)
        if (d.toDateString() === yesterday.toDateString()) return 'Yesterday'
        return d.toLocaleDateString([], { month: 'short', day: 'numeric' })
    }

    return (
        <div className="min-h-screen pt-20">
            <div className="max-w-7xl mx-auto px-4 pb-10">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="bg-white/5 backdrop-blur-xl border border-white/10 rounded-3xl shadow-2xl overflow-hidden"
                    style={{ height: 'calc(100vh - 120px)' }}
                >
                    <div className="flex h-full">
                        {/* ─── Sidebar (Room List) ────────────────────────── */}
                        <div className={`${showSidebar ? 'flex' : 'hidden md:flex'} flex-col w-full md:w-[340px] border-r border-white/10 bg-white/[0.02]`}>
                            {/* Header */}
                            <div className="p-5 border-b border-white/10 flex items-center justify-between">
                                <h2 className="text-lg font-bold text-white flex items-center gap-2">
                                    <MessageCircle className="w-5 h-5 text-violet-400" />
                                    Messages
                                </h2>
                                <span className="bg-violet-500/20 text-violet-400 text-xs font-bold px-2.5 py-1 rounded-full">
                                    {rooms.length}
                                </span>
                            </div>

                            {/* Search rooms (visual) */}
                            <div className="p-3 border-b border-white/5">
                                <div className="flex items-center gap-2 bg-white/5 rounded-xl px-3 py-2.5 border border-white/5">
                                    <Search className="w-4 h-4 text-gray-500" />
                                    <input
                                        type="text"
                                        placeholder="Search conversations..."
                                        className="bg-transparent text-white text-sm placeholder-gray-500 flex-1 focus:outline-none"
                                    />
                                </div>
                            </div>

                            {/* Rooms */}
                            <div className="flex-1 overflow-y-auto">
                                {loading ? (
                                    <div className="flex items-center justify-center py-20">
                                        <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                                    </div>
                                ) : rooms.length === 0 ? (
                                    <div className="flex flex-col items-center justify-center py-16 px-6 text-center">
                                        <MessageSquare className="w-16 h-16 text-gray-700 mb-4" />
                                        <h3 className="text-white font-bold mb-2">No conversations yet</h3>
                                        <p className="text-gray-500 text-sm mb-4">Start a chat from any product page by clicking "Chat with Seller"</p>
                                        <button
                                            onClick={() => navigate('/products')}
                                            className="px-5 py-2 bg-violet-600 hover:bg-violet-500 text-white font-semibold text-sm rounded-xl transition-all"
                                        >
                                            Browse Products
                                        </button>
                                    </div>
                                ) : (
                                    rooms.map((room) => (
                                        <motion.div
                                            key={room.id}
                                            initial={{ opacity: 0 }}
                                            animate={{ opacity: 1 }}
                                            className={`flex items-center gap-3 p-4 border-b border-white/5 cursor-pointer transition-all hover:bg-white/5 ${activeRoom?.id === room.id ? 'bg-violet-500/10 border-l-2 border-l-violet-500' : ''}`}
                                            onClick={() => handleSelectRoom(room)}
                                        >
                                            <div className="relative">
                                                <div className="w-11 h-11 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm uppercase flex-shrink-0">
                                                    {getOtherUser(room)?.[0] || '?'}
                                                </div>
                                                {room.unread_count > 0 && (
                                                    <div className="absolute -top-1 -right-1 w-5 h-5 bg-violet-500 rounded-full flex items-center justify-center">
                                                        <span className="text-[10px] font-bold text-white">{room.unread_count}</span>
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex-1 min-w-0">
                                                <div className="flex justify-between items-center mb-0.5">
                                                    <p className="text-white font-semibold text-sm truncate">{getOtherUser(room)}</p>
                                                    {room.last_message && (
                                                        <span className="text-[10px] text-gray-500 flex-shrink-0 ml-2">
                                                            {formatDate(room.last_message.created_at)}
                                                        </span>
                                                    )}
                                                </div>
                                                {room.product_name && (
                                                    <p className="text-violet-400 text-xs truncate flex items-center gap-1 mb-0.5">
                                                        <Package className="w-3 h-3" /> {room.product_name}
                                                    </p>
                                                )}
                                                {room.last_message && (
                                                    <p className="text-gray-500 text-xs truncate">
                                                        {room.last_message.sender_username === user?.username ? 'You: ' : ''}
                                                        {room.last_message.message}
                                                    </p>
                                                )}
                                            </div>
                                        </motion.div>
                                    ))
                                )}
                            </div>
                        </div>

                        {/* ─── Chat Area ──────────────────────────────────── */}
                        <div className={`${!showSidebar ? 'flex' : 'hidden md:flex'} flex-col flex-1`}>
                            {activeRoom ? (
                                <>
                                    {/* Chat header */}
                                    <div className="px-5 py-4 border-b border-white/10 flex items-center gap-4">
                                        <button
                                            onClick={() => setShowSidebar(true)}
                                            className="md:hidden p-2 glass rounded-xl"
                                        >
                                            <ArrowLeft className="w-4 h-4 text-white" />
                                        </button>
                                        <div className="w-10 h-10 rounded-full bg-gradient-to-br from-violet-500 to-fuchsia-500 flex items-center justify-center text-white font-bold text-sm uppercase">
                                            {getOtherUser(activeRoom)?.[0] || '?'}
                                        </div>
                                        <div className="flex-1">
                                            <p className="text-white font-semibold">{getOtherUser(activeRoom)}</p>
                                            {activeRoom.product_name && (
                                                <p className="text-violet-400 text-xs flex items-center gap-1">
                                                    <Package className="w-3 h-3" /> {activeRoom.product_name}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* Messages */}
                                    <div className="flex-1 overflow-y-auto p-5 space-y-3">
                                        {messagesLoading ? (
                                            <div className="flex items-center justify-center py-20">
                                                <div className="w-8 h-8 border-4 border-violet-500 border-t-transparent rounded-full animate-spin" />
                                            </div>
                                        ) : messages.length === 0 ? (
                                            <div className="flex flex-col items-center justify-center h-full text-center">
                                                <MessageSquare className="w-16 h-16 text-gray-700 mb-4" />
                                                <h3 className="text-white font-semibold mb-1">Start the conversation</h3>
                                                <p className="text-gray-500 text-sm">Say hello to {getOtherUser(activeRoom)}!</p>
                                            </div>
                                        ) : (
                                            messages.map((msg, i) => {
                                                const isMine = msg.sender_username === user?.username
                                                return (
                                                    <motion.div
                                                        key={msg.id}
                                                        initial={{ opacity: 0, y: 10 }}
                                                        animate={{ opacity: 1, y: 0 }}
                                                        transition={{ delay: i * 0.02 }}
                                                        className={`flex ${isMine ? 'justify-end' : 'justify-start'}`}
                                                    >
                                                        <div className={`max-w-[75%] ${isMine ? 'order-2' : 'order-1'}`}>
                                                            <div className={`px-4 py-3 rounded-2xl text-sm leading-relaxed ${isMine
                                                                ? 'bg-gradient-to-r from-violet-600 to-purple-600 text-white rounded-br-md'
                                                                : 'bg-white/10 text-gray-200 rounded-bl-md'
                                                                }`}>
                                                                {msg.message}
                                                            </div>
                                                            <div className={`flex items-center gap-1 mt-1 ${isMine ? 'justify-end' : 'justify-start'}`}>
                                                                <span className="text-[10px] text-gray-600">{formatTime(msg.created_at)}</span>
                                                                {isMine && (
                                                                    <CheckCircle2 className={`w-3 h-3 ${msg.is_read ? 'text-blue-400' : 'text-gray-600'}`} />
                                                                )}
                                                            </div>
                                                        </div>
                                                    </motion.div>
                                                )
                                            })
                                        )}
                                        <div ref={messagesEndRef} />
                                    </div>

                                    {/* Message input */}
                                    <form
                                        onSubmit={handleSend}
                                        className="p-4 border-t border-white/10 flex items-center gap-3"
                                    >
                                        <input
                                            type="text"
                                            value={newMessage}
                                            onChange={(e) => setNewMessage(e.target.value)}
                                            placeholder="Type a message..."
                                            className="flex-1 bg-white/5 border border-white/10 rounded-xl px-4 py-3 text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-violet-500/50 focus:border-violet-500/50 text-sm transition-all"
                                        />
                                        <motion.button
                                            whileHover={{ scale: 1.05 }}
                                            whileTap={{ scale: 0.95 }}
                                            type="submit"
                                            disabled={!newMessage.trim() || sending}
                                            className="p-3 bg-gradient-to-r from-violet-600 to-purple-600 hover:from-violet-500 hover:to-purple-500 rounded-xl text-white disabled:opacity-40 disabled:cursor-not-allowed transition-all shadow-lg shadow-violet-500/20"
                                        >
                                            {sending ? (
                                                <div className="w-5 h-5 border-2 border-white border-t-transparent rounded-full animate-spin" />
                                            ) : (
                                                <Send className="w-5 h-5" />
                                            )}
                                        </motion.button>
                                    </form>
                                </>
                            ) : (
                                <div className="flex-1 flex flex-col items-center justify-center text-center px-8">
                                    <div className="w-24 h-24 bg-violet-500/10 rounded-full flex items-center justify-center mb-6">
                                        <MessageCircle className="w-12 h-12 text-violet-400" />
                                    </div>
                                    <h2 className="text-2xl font-black text-white mb-2">Your Messages</h2>
                                    <p className="text-gray-500 max-w-sm text-sm leading-relaxed">
                                        Select a conversation to start chatting, or chat with a seller from any product page.
                                    </p>
                                </div>
                            )}
                        </div>
                    </div>
                </motion.div>
            </div>
        </div>
    )
}
