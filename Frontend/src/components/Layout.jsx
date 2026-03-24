// src/components/Layout.jsx
"use client"

import Header from "./Header"
import { motion } from "framer-motion"

const Layout = ({ children, onNavigate }) => {
  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50"
    >
      <Header onNavigate={onNavigate} />
      <main>{children}</main>
    </motion.div>
  )
}

export default Layout
