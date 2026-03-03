import React, { createContext, useContext, useState, useEffect } from 'react'
import api from '../lib/api'

const AuthContext = createContext(null)

export function AuthProvider({ children }) {
    const [user, setUser] = useState(() => {
        const stored = localStorage.getItem('user')
        return stored ? JSON.parse(stored) : null
    })
    const [token, setToken] = useState(() => localStorage.getItem('token') || null)
    const [loading, setLoading] = useState(false)

    useEffect(() => {
        if (token) {
            localStorage.setItem('token', token)
        } else {
            localStorage.removeItem('token')
            localStorage.removeItem('user')
        }
    }, [token])

    useEffect(() => {
        if (user) {
            localStorage.setItem('user', JSON.stringify(user))
        }
    }, [user])

    const login = async (username, password) => {
        const res = await api.post('/accounts/users/login/', { username, password })
        setToken(res.data.token)
        setUser(res.data.user)
        return res.data
    }

    const register = async (username, email, password, mobile) => {
        const payload = { username, email, password }
        if (mobile) payload.mobile = parseInt(mobile)
        const res = await api.post('/accounts/users/register/', payload)
        setToken(res.data.token)
        setUser(res.data.user)
        return res.data
    }

    const logout = () => {
        setUser(null)
        setToken(null)
        localStorage.removeItem('token')
        localStorage.removeItem('user')
    }

    return (
        <AuthContext.Provider value={{
            user, token, loading, login, register, logout,
            isAuthenticated: !!token,
            isLoggedIn: !!token,
            isSeller: !!(user?.is_seller),
            isAdmin: !!(user?.is_staff),
        }}>
            {children}
        </AuthContext.Provider>
    )
}

export function useAuth() {
    const ctx = useContext(AuthContext)
    if (!ctx) throw new Error('useAuth must be used within AuthProvider')
    return ctx
}
