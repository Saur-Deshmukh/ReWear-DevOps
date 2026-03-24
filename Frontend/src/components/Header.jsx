"use client"

import { Button } from "./ui/button"
import { Search, User, LogOut } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { signOut } from "firebase/auth"
import { auth } from "../config/firebase"
import { isAdmin } from "../utils/adminUtils"

const Header = ({ onNavigate }) => {
  const { user } = useAuth()

  const handleLogout = async () => {
    try {
      await signOut(auth)
      onNavigate("/") // Redirect to home after logout
    } catch (error) {
      console.error("Error signing out:", error)
    }
  }

  return (
    <header className="bg-white shadow-sm border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex justify-between items-center h-16">
          <div className="flex items-center space-x-3">
            <button onClick={() => onNavigate("/")} className="flex items-center space-x-3 group">
              <img src="/logo.png" alt="ReWear" className="h-8 w-8 rounded" />
              <h1 className="text-2xl font-bold text-emerald-600 dark:text-emerald-500 group-hover:text-emerald-700 dark:group-hover:text-emerald-600 transition-colors">
                ReWear
              </h1>
            </button>
          </div>
          <nav className="flex items-center space-x-4 md:space-x-8">
            <Button
              variant="ghost"
              onClick={() => onNavigate("/")}
              className="hidden md:inline-flex text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
            >
              Home
            </Button>
            <Button
              variant="ghost"
              onClick={() => onNavigate("/browse-items")}
              className="hidden md:inline-flex text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
            >
              Browse
            </Button>
            {user ? (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate("/dashboard")}
                  className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                >
                  <User className="w-4 h-4 mr-1" />
                  Dashboard
                </Button>
                {isAdmin(user) && (
                  <Button
                    variant="ghost"
                    onClick={() => onNavigate("/admin")}
                    className="text-emerald-600 hover:text-emerald-700 dark:text-emerald-500 dark:hover:text-emerald-600"
                  >
                    Admin Panel
                  </Button>
                )}
                <Button
                  variant="ghost"
                  onClick={handleLogout}
                  className="text-gray-500 hover:text-red-500 dark:text-gray-400 dark:hover:text-red-400"
                >
                  <LogOut className="w-4 h-4 mr-1" />
                  Logout
                </Button>
              </>
            ) : (
              <>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate("/login")}
                  className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                >
                  Login
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => onNavigate("/signup")}
                  className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
                >
                  Sign Up
                </Button>
              </>
            )}
            <div className="relative hidden sm:block">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-gray-500 dark:text-gray-400" />
              <input
                type="text"
                placeholder="Search items..."
                className="pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-emerald-500"
              />
            </div>
          </nav>
        </div>
      </div>
    </header>
  )
}

export default Header
