"use client"

import { useState } from "react"
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth"
import { auth, googleProvider } from "../config/firebase"
import { Button } from "./ui/button"
import { User, Mail, Lock, Chrome } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { motion } from "framer-motion"

const LoginPage = ({ onNavigate }) => {
  // Changed prop name from onSwitchToSignup to onNavigate
  const [email, setEmail] = useState("")
  const [password, setPassword] = useState("")
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const { user } = useAuth()

  if (user) {
    return (
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
        className="min-h-screen bg-gray-50 flex items-center justify-center p-4 dark:bg-gray-900"
      >
        <motion.div
          initial={{ opacity: 0, scale: 0.9 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-center bg-white p-8 rounded-lg shadow-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-emerald-600 mb-4 dark:text-emerald-500">Welcome back!</h2>
          <p className="text-gray-500 dark:text-gray-400">You are already logged in as {user.email}</p>
          <Button onClick={() => onNavigate("/")} className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white">
            Go to Homepage
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  const handleEmailLogin = async (e) => {
    e.preventDefault()
    setLoading(true)
    setError("")

    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password)
      const uid = userCredential.user.uid
      localStorage.setItem("userId", uid) // Store uid
      // Redirect logic is now handled by App.jsx's useEffect
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  const handleGoogleLogin = async () => {
    setLoading(true)
    setError("")

    try {
      await signInWithPopup(auth, googleProvider)
      // Redirect logic is now handled by App.jsx's useEffect
    } catch (error) {
      setError(error.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 flex items-center justify-center p-4 dark:bg-gray-900"
    >
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.1 }}
        className="w-full max-w-md"
      >
        <div className="text-center mb-8">
          <h1 className="text-4xl font-extrabold text-gray-900 mb-2 dark:text-gray-50">ReWear</h1>
          <p className="text-gray-500 dark:text-gray-400">Community Clothing Exchange</p>
        </div>

        <div className="bg-white rounded-2xl shadow-xl p-8 border border-gray-200 dark:bg-gray-800 dark:border-gray-700">
          <div className="text-center mb-6">
            <h2 className="text-2xl font-semibold text-gray-900 mb-2 dark:text-gray-50">Welcome Back</h2>
            <p className="text-gray-500 dark:text-gray-400">Sign in to your account</p>
          </div>

          <div className="flex justify-center mb-6">
            <div className="w-20 h-20 bg-gray-100 rounded-full flex items-center justify-center border-2 border-gray-200 shadow-inner dark:bg-gray-700 dark:border-gray-600">
              <User className="w-8 h-8 text-gray-500 dark:text-gray-400" />
            </div>
          </div>

          {error && (
            <motion.div
              initial={{ opacity: 0, y: -10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3 }}
              className="mb-4 p-3 bg-red-500/10 border border-red-500/30 rounded-lg text-red-500 text-sm"
            >
              {error}
            </motion.div>
          )}

          <form onSubmit={handleEmailLogin} className="space-y-4">
            <div className="relative">
              <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
              <input
                type="email"
                placeholder="Email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-emerald-500"
                required
              />
            </div>

            <div className="relative">
              <Lock className="absolute left-3 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-500 dark:text-gray-400" />
              <input
                type="password"
                placeholder="Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full pl-10 pr-4 py-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none transition-all bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-emerald-500"
                required
              />
            </div>

            <Button
              type="submit"
              disabled={loading}
              className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-lg font-medium transition-colors shadow-md dark:bg-emerald-500 dark:hover:bg-emerald-600"
            >
              {loading ? "Signing in..." : "Login"}
            </Button>
          </form>

          <div className="flex items-center my-6">
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
            <span className="px-4 text-gray-500 text-sm dark:text-gray-400">or</span>
            <div className="flex-1 border-t border-gray-200 dark:border-gray-700"></div>
          </div>

          <Button
            onClick={handleGoogleLogin}
            disabled={loading}
            variant="outline"
            className="w-full border-gray-200 hover:bg-gray-200 text-gray-900 py-3 rounded-lg font-medium transition-colors bg-white shadow-sm dark:border-gray-700 dark:hover:bg-gray-700 dark:text-gray-50 dark:bg-gray-800"
          >
            <Chrome className="w-5 h-5 mr-2" />
            Continue with Google
          </Button>

          <div className="text-center mt-6">
            <p className="text-gray-500 dark:text-gray-400">
              Don't have an account?{" "}
              <button
                onClick={() => onNavigate("/signup")} // Use onNavigate for signup
                className="text-emerald-600 hover:text-emerald-700 font-medium transition-colors dark:text-emerald-500 dark:hover:text-emerald-600"
              >
                Sign up
              </button>
            </p>
          </div>
        </div>
      </motion.div>
    </motion.div>
  )
}

export default LoginPage
