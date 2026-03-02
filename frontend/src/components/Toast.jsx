import React from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { CheckCircle2 } from 'lucide-react'

export default function Toast({ visible, message }) {
    return (
        <AnimatePresence>
            {visible && (
                <motion.div
                    initial={{ opacity: 0, y: 40, scale: 0.9 }}
                    animate={{ opacity: 1, y: 0, scale: 1 }}
                    exit={{ opacity: 0, y: 20, scale: 0.9 }}
                    className="fixed bottom-6 right-6 z-[100] flex items-center gap-3 px-5 py-4 glass rounded-2xl border border-violet-500/30 shadow-2xl max-w-sm"
                    style={{ backdropFilter: 'blur(16px)' }}
                >
                    <div className="w-8 h-8 bg-emerald-500/20 rounded-xl flex items-center justify-center flex-shrink-0">
                        <CheckCircle2 className="w-4 h-4 text-emerald-400" />
                    </div>
                    <p className="text-white text-sm font-medium">{message}</p>
                </motion.div>
            )}
        </AnimatePresence>
    )
}
