import React, { createContext, useContext, useReducer, useEffect } from 'react'

const CartContext = createContext()

const cartReducer = (state, action) => {
    switch (action.type) {
        case 'ADD_ITEM': {
            const existing = state.items.find((i) => i.id === action.payload.id)
            if (existing) {
                return {
                    ...state,
                    items: state.items.map((i) =>
                        i.id === action.payload.id ? { ...i, quantity: i.quantity + 1 } : i
                    ),
                }
            }
            return { ...state, items: [...state.items, { ...action.payload, quantity: 1 }] }
        }
        case 'REMOVE_ITEM':
            return { ...state, items: state.items.filter((i) => i.id !== action.payload) }
        case 'UPDATE_QUANTITY':
            return {
                ...state,
                items: state.items.map((i) =>
                    i.id === action.payload.id ? { ...i, quantity: action.payload.quantity } : i
                ).filter((i) => i.quantity > 0),
            }
        case 'CLEAR_CART':
            return { ...state, items: [] }
        case 'LOAD_CART':
            return { ...state, items: action.payload }
        default:
            return state
    }
}

export function CartProvider({ children }) {
    const [state, dispatch] = useReducer(cartReducer, { items: [] })

    // Persist to localStorage
    useEffect(() => {
        const saved = localStorage.getItem('cart')
        if (saved) {
            dispatch({ type: 'LOAD_CART', payload: JSON.parse(saved) })
        }
    }, [])

    useEffect(() => {
        localStorage.setItem('cart', JSON.stringify(state.items))
    }, [state.items])

    const addItem = (product) => dispatch({ type: 'ADD_ITEM', payload: product })
    const removeItem = (id) => dispatch({ type: 'REMOVE_ITEM', payload: id })
    const updateQuantity = (id, quantity) => dispatch({ type: 'UPDATE_QUANTITY', payload: { id, quantity } })
    const clearCart = () => dispatch({ type: 'CLEAR_CART' })

    const totalItems = state.items.reduce((sum, i) => sum + i.quantity, 0)
    const totalPrice = state.items.reduce((sum, i) => sum + i.price * i.quantity, 0)

    return (
        <CartContext.Provider value={{ items: state.items, addItem, removeItem, updateQuantity, clearCart, totalItems, totalPrice }}>
            {children}
        </CartContext.Provider>
    )
}

export const useCart = () => {
    const ctx = useContext(CartContext)
    if (!ctx) throw new Error('useCart must be used within CartProvider')
    return ctx
}
