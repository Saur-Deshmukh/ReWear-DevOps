"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Search, ChevronLeft, ChevronRight, Star, MapPin, Plus } from "lucide-react"
import { useAuth } from "../contexts/AuthContext"
import { motion } from "framer-motion" // Import motion

const LandingPage = ({ onNavigate }) => {
  const [currentSlide, setCurrentSlide] = useState(0)
  const { user } = useAuth()

  const featuredItems = [
    {
      id: 1,
      title: "Vintage Denim Jacket",
      image: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=400&h=400&fit=crop",
      points: 25,
      location: "New York",
      rating: 4.8,
    },
    {
      id: 2,
      title: "Designer Summer Dress",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=400&h=400&fit=crop",
      points: 35,
      location: "Los Angeles",
      rating: 4.9,
    },
    {
      id: 3,
      title: "Leather Boots",
      image: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=400&h=400&fit=crop",
      points: 40,
      location: "Chicago",
      rating: 4.7,
    },
    {
      id: 4,
      title: "Wool Sweater",
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=400&h=400&fit=crop",
      points: 20,
      location: "Seattle",
      rating: 4.6,
    },
  ]

  const categories = [
    { name: "Dresses", icon: "👗", count: 234 },
    { name: "Tops", icon: "👕", count: 456 },
    { name: "Bottoms", icon: "👖", count: 189 },
    { name: "Outerwear", icon: "🧥", count: 123 },
    { name: "Shoes", icon: "👠", count: 345 },
    { name: "Accessories", icon: "👜", count: 267 },
  ]

  const productListings = [
    {
      id: 1,
      title: "Floral Maxi Dress",
      image: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop",
      points: 30,
      size: "M",
      condition: "Like New",
      liked: false,
      approved: true,
      status: "available",
    },
    {
      id: 2,
      title: "Classic White Shirt",
      image: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?w=300&h=400&fit=crop",
      points: 15,
      size: "S",
      condition: "Good",
      liked: true,
      approved: true,
      status: "available",
    },
    {
      id: 3,
      title: "Black Skinny Jeans",
      image: "https://images.unsplash.com/photo-1541099649105-f69ad21f3246?w=300&h=400&fit=crop",
      points: 25,
      size: "L",
      condition: "Excellent",
      liked: false,
      approved: true,
      status: "available",
    },
    {
      id: 4,
      title: "Cozy Knit Cardigan",
      image: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop",
      points: 28,
      size: "M",
      condition: "Like New",
      liked: true,
      approved: true,
      status: "available",
    },
  ].filter((item) => item.approved && item.status === "available")

  const nextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % featuredItems.length)
  }

  const prevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + featuredItems.length) % featuredItems.length)
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50"
    >

      <section className="py-12">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <motion.h2
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="text-4xl font-bold text-gray-900 mb-4 dark:text-gray-50"
            >
              Sustainable Fashion Through Community Exchange
            </motion.h2>
            <motion.p
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="text-xl text-gray-500 mb-8 dark:text-gray-400"
            >
              Give your clothes a second life and discover unique pieces from others
            </motion.p>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex flex-col sm:flex-row gap-4 justify-center"
            >
              <Button
                onClick={() => onNavigate(user ? "/dashboard" : "/login")}
                className="bg-emerald-600 hover:bg-emerald-700 text-white px-8 py-3 text-lg shadow-md dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                Start Swapping
              </Button>
              <Button
                onClick={() => onNavigate("/browse-items")}
                variant="outline"
                className="border-emerald-600 text-emerald-600 px-8 py-3 text-lg bg-white hover:bg-gray-200 shadow-md dark:border-emerald-500 dark:text-emerald-500 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                Browse Items
              </Button>
              <Button
                onClick={() => onNavigate(user ? "/add-item" : "/login")}
                variant="outline"
                className="border-emerald-600 text-emerald-600 px-8 py-3 text-lg bg-white hover:bg-gray-200 shadow-md dark:border-emerald-500 dark:text-emerald-500 dark:bg-gray-800 dark:hover:bg-gray-700"
              >
                List an Item
              </Button>
            </motion.div>
          </div>

          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.5, delay: 0.4 }}
            className="relative bg-white rounded-lg shadow-xl p-6 mb-12 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
          >
            <h3 className="text-2xl font-semibold text-gray-900 mb-6 text-center dark:text-gray-50">Featured Items</h3>
            <div className="relative overflow-hidden">
              <div
                className="flex transition-transform duration-300 ease-in-out"
                style={{ transform: `translateX(-${currentSlide * 100}%)` }}
              >
                {featuredItems.map((item) => (
                  <div key={item.id} className="w-full flex-shrink-0 px-4">
                    <motion.div
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.5 }}
                      className="bg-gray-100 rounded-lg p-6 text-center shadow-inner dark:bg-gray-700"
                    >
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-48 h-48 object-cover rounded-lg mx-auto mb-4 border border-gray-200 dark:border-gray-600"
                      />
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-50">{item.title}</h4>
                      <div className="flex items-center justify-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                        <span className="flex items-center">
                          <Star className="w-4 h-4 text-yellow-500 mr-1" />
                          {item.rating}
                        </span>
                        <span className="flex items-center">
                          <MapPin className="w-4 h-4 mr-1" />
                          {item.location}
                        </span>
                        <span className="font-semibold text-emerald-600 dark:text-emerald-500">{item.points} pts</span>
                      </div>
                    </motion.div>
                  </div>
                ))}
              </div>
              <button
                onClick={prevSlide}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors dark:bg-gray-800/80 dark:hover:bg-gray-700"
                aria-label="Previous slide"
              >
                <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-50" />
              </button>
              <button
                onClick={nextSlide}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-lg hover:bg-gray-200 transition-colors dark:bg-gray-800/80 dark:hover:bg-gray-700"
                aria-label="Next slide"
              >
                <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-50" />
              </button>
            </div>
          </motion.div>
        </div>
      </section>

      <section className="py-12 bg-white dark:bg-gray-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-12">
            <h3 className="text-2xl font-semibold text-gray-900 mb-4 dark:text-gray-50">How ReWear Points Work</h3>
            <p className="text-gray-500 dark:text-gray-400">Earn points by listing items, spend them to get new ones</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              className="text-center bg-gray-100 p-6 rounded-lg shadow-md border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
            >
              <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Plus className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-50">List Items</h4>
              <p className="text-gray-500 dark:text-gray-400">
                Upload your clothes and earn 10-15 points per item after approval
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              className="text-center bg-gray-100 p-6 rounded-lg shadow-md border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
            >
              <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Search className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-50">Browse & Swap</h4>
              <p className="text-gray-500 dark:text-gray-400">
                Find items you love and request swaps with your items or points
              </p>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{
                y: -5,
                boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
              }}
              className="text-center bg-gray-100 p-6 rounded-lg shadow-md border border-gray-200 dark:bg-gray-700 dark:border-gray-600"
            >
              <div className="w-16 h-16 bg-emerald-600/20 rounded-full flex items-center justify-center mx-auto mb-4">
                <Star className="w-8 h-8 text-emerald-600" />
              </div>
              <h4 className="text-lg font-semibold text-gray-900 mb-2 dark:text-gray-50">Build Reputation</h4>
              <p className="text-gray-500 dark:text-gray-400">
                Complete swaps to earn ratings and unlock premium features
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <section className="py-12 bg-emerald-600 text-white dark:bg-emerald-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-8">
            <h3 className="text-2xl font-semibold mb-4">Our Impact Together</h3>
            <p className="text-white/80">Making fashion more sustainable, one swap at a time</p>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 text-center">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <div className="text-4xl font-bold mb-2">12,450</div>
              <div className="text-white/80">Items Exchanged</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <div className="text-4xl font-bold mb-2">8,230</div>
              <div className="text-white/80">Active Members</div>
            </motion.div>
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
            >
              <div className="text-4xl font-bold mb-2">15.6 tons</div>
              <div className="text-white/80">Textile Waste Saved</div>
            </motion.div>
          </div>
        </div>
      </section>
    </motion.div>
  )
}

export default LandingPage
