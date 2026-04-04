"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Heart, Package, Filter, X } from "lucide-react"
import { motion } from "framer-motion"
import BASE_URL from "../config/api"

const BrowseItemsPage = ({ onNavigate }) => {
  const [allItems, setAllItems] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)

  useEffect(() => {
    const fetchItems = async () => {
      try {
        const res = await fetch(`${BASE_URL}/items/available`)
        if (!res.ok) throw new Error("Failed to fetch items")
        const data = await res.json()

        // Optional: map _id to id and ensure 'image' field exists
        const processed = data.map((item) => ({
          ...item,
          id: item._id, // map MongoDB _id to 'id'
          image: item.images?.[0] || "/placeholder.svg", // pick first image or fallback
          liked: false, // default
        }))

        setAllItems(processed)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    fetchItems()
  }, [])

  const [filters, setFilters] = useState({
    search: "",
    categories: [],
    sizes: [],
    conditions: [],
    minPoints: "",
    maxPoints: "",
  })
  const [filteredItems, setFilteredItems] = useState(allItems)

  const availableCategories = [...new Set(allItems.map((item) => item.category))]
  const availableSizes = [...new Set(allItems.map((item) => item.size))].sort((a, b) => {
    const order = ["XS", "S", "M", "L", "XL", "XXL", "One Size"]
    return order.indexOf(a) - order.indexOf(b)
  })
  const availableConditions = ["Like New", "Excellent", "Good", "Fair"]

  useEffect(() => {
    const applyFilters = () => {
      let items = allItems.slice()

      // Search filter
      if (filters.search) {
        const searchTerm = filters.search.toLowerCase()
        items = items.filter(
          (item) =>
            item.title.toLowerCase().includes(searchTerm) ||
            item.description.toLowerCase().includes(searchTerm) ||
            item.tags?.some((tag) => tag.toLowerCase().includes(searchTerm)),
        )
      }

      // Category filter
      if (filters.categories.length > 0) {
        items = items.filter((item) => filters.categories.includes(item.category))
      }

      // Size filter
      if (filters.sizes.length > 0) {
        items = items.filter((item) => filters.sizes.includes(item.size))
      }

      // Condition filter
      if (filters.conditions.length > 0) {
        items = items.filter((item) => filters.conditions.includes(item.condition))
      }

      // Points range filter
      if (filters.minPoints !== "") {
        items = items.filter((item) => item.points >= Number(filters.minPoints))
      }
      if (filters.maxPoints !== "") {
        items = items.filter((item) => item.points <= Number(filters.maxPoints))
      }

      setFilteredItems(items)
    }

    applyFilters()
  }, [filters, allItems])

  const handleFilterChange = (e) => {
    const { name, value, type, checked } = e.target

    if (type === "checkbox") {
      setFilters((prev) => ({
        ...prev,
        [name]: checked ? [...prev[name], value] : prev[name].filter((item) => item !== value),
      }))
    } else {
      setFilters((prev) => ({
        ...prev,
        [name]: value,
      }))
    }
  }

  const clearFilter = (filterType, valueToRemove = null) => {
    setFilters((prev) => {
      if (valueToRemove) {
        return {
          ...prev,
          [filterType]: prev[filterType].filter((val) => val !== valueToRemove),
        }
      } else if (filterType === "search" || filterType === "minPoints" || filterType === "maxPoints") {
        return {
          ...prev,
          [filterType]: "",
        }
      } else {
        return {
          ...prev,
          [filterType]: [],
        }
      }
    })
  }

  const clearAllFilters = () => {
    setFilters({
      search: "",
      categories: [],
      sizes: [],
      conditions: [],
      minPoints: "",
      maxPoints: "",
    })
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 grid grid-cols-1 lg:grid-cols-4 gap-8">
        {/* Filters Sidebar */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="lg:col-span-1 bg-white rounded-lg shadow-xl p-6 border border-gray-200 h-fit sticky top-8 dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-bold text-gray-900 flex items-center dark:text-gray-50">
              <Filter className="w-5 h-5 mr-2" />
              Filters
            </h2>
            <Button
              onClick={clearAllFilters}
              variant="ghost"
              size="sm"
              className="text-gray-500 hover:text-emerald-600 dark:text-gray-400 dark:hover:text-emerald-500"
            >
              Clear All
            </Button>
          </div>

          {/* Active Filters Display */}
          <div className="mb-6">
            <h3 className="text-sm font-medium text-gray-500 mb-2 dark:text-gray-400">Active Filters</h3>
            <div className="flex flex-wrap gap-2">
              {filters.search && (
                <span className="inline-flex items-center px-3 py-1 bg-emerald-600/20 text-emerald-800 text-sm rounded-full dark:bg-emerald-500/20 dark:text-emerald-200">
                  Search: {filters.search}
                  <button
                    onClick={() => clearFilter("search")}
                    className="ml-2 text-emerald-800/80 hover:text-emerald-800 dark:text-emerald-200/80 dark:hover:text-emerald-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.categories.map((cat) => (
                <span
                  key={cat}
                  className="inline-flex items-center px-3 py-1 bg-emerald-600/20 text-emerald-800 text-sm rounded-full dark:bg-emerald-500/20 dark:text-emerald-200"
                >
                  {cat}
                  <button
                    onClick={() => clearFilter("categories", cat)}
                    className="ml-2 text-emerald-800/80 hover:text-emerald-800 dark:text-emerald-200/80 dark:hover:text-emerald-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.sizes.map((size) => (
                <span
                  key={size}
                  className="inline-flex items-center px-3 py-1 bg-emerald-600/20 text-emerald-800 text-sm rounded-full dark:bg-emerald-500/20 dark:text-emerald-200"
                >
                  {size}
                  <button
                    onClick={() => clearFilter("sizes", size)}
                    className="ml-2 text-emerald-800/80 hover:text-emerald-800 dark:text-emerald-200/80 dark:hover:text-emerald-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.conditions.map((cond) => (
                <span
                  key={cond}
                  className="inline-flex items-center px-3 py-1 bg-emerald-600/20 text-emerald-800 text-sm rounded-full dark:bg-emerald-500/20 dark:text-emerald-200"
                >
                  {cond}
                  <button
                    onClick={() => clearFilter("conditions", cond)}
                    className="ml-2 text-emerald-800/80 hover:text-emerald-800 dark:text-emerald-200/80 dark:hover:text-emerald-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              ))}
              {filters.minPoints && (
                <span className="inline-flex items-center px-3 py-1 bg-emerald-600/20 text-emerald-800 text-sm rounded-full dark:bg-emerald-500/20 dark:text-emerald-200">
                  Min Pts: {filters.minPoints}
                  <button
                    onClick={() => clearFilter("minPoints")}
                    className="ml-2 text-emerald-800/80 hover:text-emerald-800 dark:text-emerald-200/80 dark:hover:text-emerald-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {filters.maxPoints && (
                <span className="inline-flex items-center px-3 py-1 bg-emerald-600/20 text-emerald-800 text-sm rounded-full dark:bg-emerald-500/20 dark:text-emerald-200">
                  Max Pts: {filters.maxPoints}
                  <button
                    onClick={() => clearFilter("maxPoints")}
                    className="ml-2 text-emerald-800/80 hover:text-emerald-800 dark:text-emerald-200/80 dark:hover:text-emerald-200"
                  >
                    <X className="w-3 h-3" />
                  </button>
                </span>
              )}
              {Object.values(filters).every(
                (val) => (Array.isArray(val) && val.length === 0) || (typeof val === "string" && val === ""),
              ) && <p className="text-gray-500 text-sm dark:text-gray-400">No filters applied</p>}
            </div>
          </div>

          {/* Category Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 dark:text-gray-50">Category</h3>
            <div className="space-y-2">
              {availableCategories.map((category) => (
                <label key={category} className="flex items-center text-gray-900 cursor-pointer dark:text-gray-50">
                  <input
                    type="checkbox"
                    name="categories"
                    value={category}
                    checked={filters.categories.includes(category)}
                    onChange={handleFilterChange}
                    className="mr-2 accent-emerald-600 dark:accent-emerald-500"
                  />
                  {category}
                </label>
              ))}
            </div>
          </div>

          {/* Size Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 dark:text-gray-50">Size</h3>
            <div className="grid grid-cols-3 gap-2">
              {availableSizes.map((size) => (
                <label
                  key={size}
                  className={`flex items-center justify-center p-2 border rounded-md text-sm cursor-pointer transition-colors ${
                    filters.sizes.includes(size)
                      ? "bg-emerald-600 text-white border-emerald-600 dark:bg-emerald-500 dark:border-emerald-500"
                      : "bg-gray-100 border-gray-200 text-gray-900 hover:bg-gray-200 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:hover:bg-gray-600"
                  }`}
                >
                  <input
                    type="checkbox"
                    name="sizes"
                    value={size}
                    checked={filters.sizes.includes(size)}
                    onChange={handleFilterChange}
                    className="sr-only"
                  />
                  {size}
                </label>
              ))}
            </div>
          </div>

          {/* Condition Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 dark:text-gray-50">Condition</h3>
            <div className="space-y-2">
              {availableConditions.map((condition) => (
                <label key={condition} className="flex items-center text-gray-900 cursor-pointer dark:text-gray-50">
                  <input
                    type="checkbox"
                    name="conditions"
                    value={condition}
                    checked={filters.conditions.includes(condition)}
                    onChange={handleFilterChange}
                    className="mr-2 accent-emerald-600 dark:accent-emerald-500"
                  />
                  {condition}
                </label>
              ))}
            </div>
          </div>

          {/* Points Range Filter */}
          <div className="mb-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-3 dark:text-gray-50">Points Range</h3>
            <div className="flex items-center space-x-2">
              <input
                type="number"
                name="minPoints"
                placeholder="Min"
                value={filters.minPoints}
                onChange={handleFilterChange}
                className="w-1/2 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-emerald-500"
              />
              <span className="text-gray-500 dark:text-gray-400">-</span>
              <input
                type="number"
                name="maxPoints"
                placeholder="Max"
                value={filters.maxPoints}
                onChange={handleFilterChange}
                className="w-1/2 p-2 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-emerald-500"
              />
            </div>
          </div>
        </motion.div>

        {/* Item Listings */}
        <div className="lg:col-span-3">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white rounded-lg shadow-xl p-6 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
          >
            <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-50">
              Browse Items ({filteredItems.length} found)
            </h2>
            {filteredItems.length === 0 ? (
              <div className="text-center py-12 text-gray-500 dark:text-gray-400">
                <Package className="w-16 h-16 mx-auto mb-4 text-gray-500/50 dark:text-gray-400/50" />
                <p className="text-lg font-medium">No items match your filters.</p>
                <p>Try adjusting your search or clearing some filters.</p>
                <Button
                  onClick={clearAllFilters}
                  className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600"
                >
                  Clear All Filters
                </Button>
              </div>
            ) : (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
                {filteredItems.map((item, index) => (
                  <motion.div
                    key={item.id}
                    onClick={() => onNavigate(`/item/${item.id}`)}
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                    whileHover={{
                      y: -5,
                      boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                    }}
                    className="bg-white rounded-lg shadow-md overflow-hidden border border-gray-200 cursor-pointer dark:bg-gray-800 dark:border-gray-700"
                  >
                    <div className="relative">
                      <img
                        src={item.image || "/placeholder.svg"}
                        alt={item.title}
                        className="w-full h-48 object-cover"
                      />
                      <button
                        className="absolute top-2 right-2 p-2 bg-white/80 rounded-full shadow-md hover:bg-gray-200 dark:bg-gray-800/80 dark:hover:bg-gray-700"
                        onClick={(e) => {
                          e.stopPropagation()
                          // Handle like functionality here
                          alert(`Liked/unliked ${item.title}`)
                        }}
                      >
                        <Heart
                          className={`w-4 h-4 ${item.liked ? "text-red-500 fill-current" : "text-gray-500 dark:text-gray-400"}`}
                        />
                      </button>
                    </div>
                    <div className="p-4">
                      <h4 className="text-lg font-semibold text-gray-900 mb-2 truncate dark:text-gray-50">
                        {item.title}
                      </h4>
                      <div className="flex justify-between items-center text-sm text-gray-500 mb-2 dark:text-gray-400">
                        <span>Size: {item.size}</span>
                        <span>{item.condition}</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-lg font-bold text-emerald-600 dark:text-emerald-500">
                          {item.points} pts
                        </span>
                        <Button
                          onClick={(e) => {
                            e.stopPropagation()
                            onNavigate(`/item/${item._id}`)
                          }}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600"
                        >
                          View Details
                        </Button>
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            )}
          </motion.div>
        </div>
      </div>
    </motion.div>
  )
}

export default BrowseItemsPage
