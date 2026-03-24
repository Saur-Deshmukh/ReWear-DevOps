"use client"

import { useState, useEffect } from "react"
import { AuthProvider, useAuth } from "./contexts/AuthContext"
import Layout from "./components/Layout"
import LandingPage from "./components/LandingPage"
import LoginPage from "./components/LoginPage"
import SignupPage from "./components/SignupPage"
import UserDashboard from "./components/UserDashboard"
import AddNewItemPage from "./components/AddNewItemPage"
import ItemDetailPage from "./components/ItemDetailPage"
import BrowseItemsPage from "./components/BrowseItemsPage"
import AdminPanel from "./components/AdminPanel"
import SwapManagement from "./components/SwapManagement" // Import SwapManagement
import { isAdmin } from "./utils/adminUtils"

function AppContent() {
  const [currentPath, setCurrentPath] = useState(window.location.pathname)
  const { user, loading } = useAuth()

  useEffect(() => {
    const handlePopState = () => {
      setCurrentPath(window.location.pathname)
    }

    window.addEventListener("popstate", handlePopState)
    return () => window.removeEventListener("popstate", handlePopState)
  }, [])

  const navigate = (path) => {
    window.history.pushState({}, "", path)
    setCurrentPath(path)
  }

  // Handle redirects after login/logout and for protected routes
  useEffect(() => {
    if (!loading) {
      const currentRoute = window.location.pathname
      const protectedRoutes = ["/dashboard", "/add-item", "/admin", "/swap-management"]

      if (user) {
        // User is logged in
        if (currentRoute === "/login" || currentRoute === "/signup") {
          if (isAdmin(user)) {
            navigate("/admin") // Admin goes to admin panel
          } else {
            navigate("/") // Regular user goes to homepage
          }
        }
      } else {
        // User is not logged in
        // Redirect to login if trying to access protected route or item detail page
        if (protectedRoutes.includes(currentRoute) || currentRoute.startsWith("/item/")) {
          navigate("/login")
        }
      }
    }
  }, [user, loading, currentPath])

  const renderPage = () => {
    if (currentPath === "/") {
      return <LandingPage onNavigate={navigate} />
    } else if (currentPath === "/login") {
      return <LoginPage onNavigate={navigate} />
    } else if (currentPath === "/signup") {
      return <SignupPage onNavigate={navigate} />
    } else if (currentPath === "/dashboard") {
      return <UserDashboard onNavigate={navigate} />
    } else if (currentPath === "/add-item") {
      return <AddNewItemPage onNavigate={navigate} />
    } else if (currentPath.startsWith("/item/")) {
      const itemId = currentPath.split("/")[2]
      return <ItemDetailPage itemId={itemId} onNavigate={navigate} />
    } else if (currentPath === "/browse-items") {
      return <BrowseItemsPage onNavigate={navigate} />
    } else if (currentPath === "/admin") {
      return <AdminPanel onNavigate={navigate} />
    } else if (currentPath === "/swap-management") {
      return <SwapManagement onNavigate={navigate} />
    }
    return <LandingPage onNavigate={navigate} /> // Fallback
  }

  return <Layout onNavigate={navigate}>{renderPage()}</Layout>
}

function App() {
  return (
    <AuthProvider>
      <AppContent />
    </AuthProvider>
  )
}

export default App
