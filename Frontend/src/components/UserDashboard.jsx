"use client"
import { useEffect, useState } from "react"
import { Button } from "./ui/button"
import { Package, ShoppingBag, Plus, Eye, MessageCircle, History, TrendingUp } from "lucide-react"
import { motion } from "framer-motion"
import BASE_URL from "../config/api"

const UserDashboard = ({ onNavigate }) => {
  const [myListings, setMyListings] = useState([]) // Initialize as empty array
  const [userData, setUserInfo] = useState(null)
  const [activeTab, setActiveTab] = useState("overview")
  const [isLoading, setIsLoading] = useState(true) // Add loading state

  useEffect(() => {
    const fetchUserInfo = async () => {
      try {
        const uid = localStorage.getItem("userId")
        if (!uid) {
          console.error("No UID found in local storage")
          setIsLoading(false)
          return
        }

        const res = await fetch(`${BASE_URL}/users/info`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid }),
        })

        if (!res.ok) {
          throw new Error("Failed to fetch user info")
        }

        const data = await res.json()
        console.log("✅ User info from backend:", data)
        setUserInfo(data)
      } catch (error) {
        console.error("Error fetching user info:", error)
      } finally {
        setIsLoading(false)
      }
    }

    fetchUserInfo()
  }, [])

  // Fetch user items
  async function fetchUserItems() {
    try {
      const userId = localStorage.getItem("userId")
      if (!userId) throw new Error("No userId found in local storage")

      const response = await fetch(`${BASE_URL}/items/user`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ uid: userId }),
      })

      if (!response.ok) {
        console.error("Failed to fetch listings", response.status)
        return
      }

      const data = await response.json()
      console.log("Fetched items:", data)
      // Ensure data is an array
      setMyListings(Array.isArray(data) ? data : [])
    } catch (error) {
      console.error("Error fetching listings", error)
      setMyListings([]) // Set to empty array on error
    }
  }

  useEffect(() => {
    fetchUserItems()
  }, [])

  const incomingSwapRequests = [
    {
      _id: "swap_001",
      itemId: "item_1",
      itemTitle: "Vintage Floral Dress",
      itemImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop",
      requesterName: "Emma Wilson",
      requesterUid: "user_456",
      mode: "direct",
      offeredItemTitle: "Silk Scarf Collection",
      offeredItemImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=400&fit=crop",
      status: "pending",
      requestedAt: "2024-01-22",
    },
    {
      _id: "swap_002",
      itemId: "item_2",
      itemTitle: "Designer Handbag",
      itemImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=400&fit=crop",
      requesterName: "Mike Chen",
      requesterUid: "user_789",
      mode: "points",
      pointsOffered: 50,
      status: "pending",
      requestedAt: "2024-01-21",
    },
  ]

  const outgoingSwapRequests = [
    {
      _id: "swap_003",
      itemId: "item_5",
      itemTitle: "Leather Boots",
      itemImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop",
      ownerName: "Lisa Park",
      ownerUid: "user_321",
      mode: "direct",
      offeredItemTitle: "Vintage Jacket",
      offeredItemImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop",
      status: "pending",
      requestedAt: "2024-01-20",
    },
  ]

  const pointsHistory = [
    {
      _id: "log_1",
      delta: +15,
      source: "upload_bonus",
      description: "Item uploaded: Vintage Floral Dress",
      createdAt: "2024-01-22T10:00:00Z",
    },
    {
      _id: "log_2",
      delta: -30,
      source: "redeem_item",
      description: "Redeemed: Silk Blouse",
      createdAt: "2024-01-20T15:00:00Z",
    },
    {
      _id: "log_3",
      delta: +25,
      source: "swap_completed",
      description: "Swap completed: Designer Handbag",
      createdAt: "2024-01-18T11:00:00Z",
    },
    {
      _id: "log_4",
      delta: +10,
      source: "upload_bonus",
      description: "Item uploaded: Wool Winter Coat",
      createdAt: "2024-01-15T09:00:00Z",
    },
    {
      _id: "log_5",
      delta: -20,
      source: "redeem_item",
      description: "Redeemed: Summer Sandals",
      createdAt: "2024-01-12T14:00:00Z",
    },
  ]

  const getStatusColor = (status) => {
    switch (status) {
      case "available":
        return "bg-emerald-600/20 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200"
      case "pendingSwap":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
      case "redeemed":
        return "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
      case "removed":
        return "bg-red-500/20 text-red-700 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
    }
  }

  const handleSwapResponse = (swapId, response) => {
    alert(`${response} swap request ${swapId} - Database integration pending`)
  }

  const handleCancelSwapRequest = (swapId) => {
    alert(`Cancelled swap request ${swapId} - Database integration pending`)
  }

  // Show loading state
  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-emerald-600 mx-auto mb-4"></div>
          <p className="text-gray-600 dark:text-gray-400">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50"
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-xl p-6 mb-8 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="flex flex-col lg:flex-row gap-6 items-center lg:items-start">
            <div className="flex-shrink-0">
              <div className="w-32 h-32 rounded-full flex items-center justify-center border-2 border-gray-200 shadow-inner dark:bg-gray-700 dark:border-gray-600 bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-5xl font-bold">
                {userData?.avatarUrl ? (
                  <img
                    src={userData.avatarUrl || "/placeholder.svg"}
                    alt={userData.name}
                    className="w-full h-full rounded-full object-cover"
                  />
                ) : (
                  <span>{userData?.name ? userData.name.charAt(0).toUpperCase() : "U"}</span>
                )}
              </div>
            </div>

            {userData ? (
              <div className="flex-1">
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Name</label>
                      <div className="text-lg font-semibold text-gray-900 dark:text-gray-50">{userData.name}</div>
                    </div>
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Email</label>
                      <div className="text-gray-900 dark:text-gray-50">{userData.email}</div>
                    </div>
                  </div>

                  <div className="space-y-3">
                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Points Balance</label>
                      <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
                        {userData.points || 0} pts
                      </div>
                    </div>

                    <div>
                      <label className="text-sm font-medium text-gray-500 dark:text-gray-400">Member Since</label>
                      <div className="text-gray-700 dark:text-gray-300">{userData.createdAt}</div>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <div>Loading user info...</div>
            )}
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="bg-white rounded-lg shadow-xl mb-8 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-8 px-6 overflow-x-auto">
              <button
                onClick={() => setActiveTab("overview")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "overview"
                    ? "border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200 dark:text-gray-400 dark:hover:text-gray-50 dark:hover:border-gray-700"
                }`}
              >
                <Package className="w-5 h-5 inline mr-2" />
                My Listings ({myListings.length})
              </button>
              <button
                onClick={() => setActiveTab("swaps")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "swaps"
                    ? "border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200 dark:text-gray-400 dark:hover:text-gray-50 dark:hover:border-gray-700"
                }`}
              >
                <ShoppingBag className="w-5 h-5 inline mr-2" />
                My Swaps
              </button>
              <button
                onClick={() => setActiveTab("points")}
                className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                  activeTab === "points"
                    ? "border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500"
                    : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200 dark:text-gray-400 dark:hover:text-gray-50 dark:hover:border-gray-700"
                }`}
              >
                <History className="w-5 h-5 inline mr-2" />
                Points History
              </button>
            </div>
          </div>

          <div className="p-6">
            {activeTab === "overview" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-50">
                    My Listings ({myListings.length})
                  </h3>
                  <Button
                    onClick={() => onNavigate("/add-item")}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md dark:bg-emerald-500 dark:hover:bg-emerald-600"
                  >
                    <Plus className="w-4 h-4 mr-2" />
                    Add New
                  </Button>
                </div>

                {myListings.length === 0 ? (
                  <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                    <Package className="w-12 h-12 mx-auto mb-4 text-gray-500/50 dark:text-gray-400/50" />
                    <p>No listings yet. Start by adding your first item!</p>
                  </div>
                ) : (
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                    {myListings.map((item, index) => (
                      <motion.div
                        key={item._id}
                        initial={{ opacity: 0, scale: 0.95 }}
                        animate={{ opacity: 1, scale: 1 }}
                        transition={{ duration: 0.3, delay: index * 0.05 }}
                        whileHover={{
                          y: -5,
                          boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                        }}
                        className="border border-gray-200 rounded-lg overflow-hidden bg-white dark:border-gray-700 dark:bg-gray-800"
                      >
                        <img
                          src={item.images?.[0] || "/placeholder.svg"}
                          alt={item.title}
                          className="w-full h-40 object-cover"
                        />
                        <div className="p-4">
                          <h4 className="font-semibold text-gray-900 mb-2 truncate dark:text-gray-50">{item.title}</h4>
                          <div className="flex justify-between items-center mb-2">
                            <span className="text-lg font-bold text-emerald-600 dark:text-emerald-500">
                              {item.points || 0} pts
                            </span>
                            <div className="flex space-x-1">
                              <span
                                className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(item.status)}`}
                              >
                                {item.status}
                              </span>
                              {!item.approved && (
                                <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                                  Pending Approval
                                </span>
                              )}
                            </div>
                          </div>
                          <div className="flex justify-between text-sm text-gray-500 mb-3 dark:text-gray-400">
                            <span>{item.views || 0} views</span>
                            <span>{item.likes || 0} likes</span>
                            {item.swapRequests?.length > 0 && (
                              <span className="text-emerald-600 font-medium dark:text-emerald-500">
                                {item.swapRequests.length} requests
                              </span>
                            )}
                          </div>
                          <div className="flex gap-2">
                            <Button
                              onClick={() => onNavigate(`/item/${item._id}`)}
                              size="sm"
                              variant="outline"
                              className="flex-1 bg-white border-gray-200 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-700"
                            >
                              <Eye className="w-3 h-3 mr-1" />
                              View
                            </Button>
                          </div>
                        </div>
                      </motion.div>
                    ))}
                  </div>
                )}
              </motion.div>
            )}

            {activeTab === "swaps" && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.5 }}
                className="space-y-8"
              >
                <div className="flex justify-between items-center">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">My Swaps</h3>
                  <Button
                    onClick={() => onNavigate("/swap-management")}
                    size="sm"
                    className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md dark:bg-emerald-500 dark:hover:bg-emerald-600"
                  >
                    <MessageCircle className="w-4 h-4 mr-2" />
                    Manage All Swaps
                  </Button>
                </div>
                <div className="text-center py-8 text-gray-500 dark:text-gray-400">
                  <ShoppingBag className="w-12 h-12 mx-auto mb-4 text-gray-500/50 dark:text-gray-400/50" />
                  <p>View and manage all your incoming and outgoing swap requests here.</p>
                </div>
              </motion.div>
            )}

            {activeTab === "points" && (
              <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.5 }}>
                <div className="flex justify-between items-center mb-6">
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Points History</h3>
                  <div className="text-right">
                    <div className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
                      {userData.points} pts
                    </div>
                    <div className="text-sm text-gray-500 dark:text-gray-400">Current Balance</div>
                  </div>
                </div>
                <div className="space-y-3">
                  {pointsHistory.map((transaction, index) => (
                    <motion.div
                      key={transaction._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                      whileHover={{ y: -3, boxShadow: "0 5px 10px -2px rgba(0, 0, 0, 0.05)" }}
                      className="flex items-center justify-between p-4 border border-gray-200 rounded-lg bg-white shadow-sm dark:border-gray-800 dark:bg-gray-800"
                    >
                      <div className="flex items-center space-x-3">
                        <div
                          className={`p-2 rounded-full ${
                            transaction.delta > 0 ? "bg-emerald-600/10" : "bg-red-500/10"
                          }`}
                        >
                          {transaction.delta > 0 ? (
                            <TrendingUp className="w-4 h-4 text-emerald-600" />
                          ) : (
                            <TrendingUp className="w-4 h-4 text-red-500 rotate-180" />
                          )}
                        </div>
                        <div>
                          <p className="font-medium text-gray-900 dark:text-gray-50">{transaction.description}</p>
                          <p className="text-sm text-gray-500 dark:text-gray-400">
                            {new Date(transaction.createdAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div
                        className={`text-lg font-semibold ${
                          transaction.delta > 0 ? "text-emerald-600 dark:text-emerald-500" : "text-red-500"
                        }`}
                      >
                        {transaction.delta > 0 ? "+" : ""}
                        {transaction.delta} pts
                      </div>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default UserDashboard
