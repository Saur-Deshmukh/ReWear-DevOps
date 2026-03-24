"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { MessageCircle, CheckCircle, XCircle, Clock, Package, ArrowRight } from "lucide-react"
import { motion } from "framer-motion"

const SwapManagement = ({ onNavigate }) => {
  const [activeFilter, setActiveFilter] = useState("all")
  const [activeTab, setActiveTab] = useState("all") // Declare activeTab variable

  const swaps = [
    {
      _id: "swap_001",
      itemId: "item_123",
      ownerUid: "user_123",
      requesterUid: "user_456",
      mode: "direct",
      offeredItemId: "item_456",
      status: "pending",
      timestamps: {
        requestedAt: "2024-01-22T10:30:00Z",
        respondedAt: null,
        completedAt: null,
      },
      itemTitle: "Vintage Floral Dress",
      itemImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop",
      ownerName: "Sarah Johnson",
      ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      requesterName: "Emma Wilson",
      requesterAvatar: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      offeredItemTitle: "Silk Scarf Collection",
      offeredItemImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=400&fit=crop",
      messages: [
        {
          from: "user_456",
          message: "Hi! I love your vintage dress. Would you be interested in swapping for my silk scarf collection?",
          timestamp: "2024-01-22T10:30:00Z",
        },
      ],
    },
    {
      _id: "swap_002",
      itemId: "item_789",
      ownerUid: "user_123",
      requesterUid: "user_789",
      mode: "points",
      pointsCharged: 50,
      status: "accepted",
      timestamps: {
        requestedAt: "2024-01-21T14:20:00Z",
        respondedAt: "2024-01-21T16:45:00Z",
        completedAt: null,
      },
      itemTitle: "Designer Handbag",
      itemImage: "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=300&h=400&fit=crop",
      ownerName: "Sarah Johnson",
      ownerAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      requesterName: "Mike Chen",
      requesterAvatar: "", // No avatar URL for this user
      messages: [
        {
          from: "user_789",
          message: "I'd like to redeem this handbag for 50 points. Is it still available?",
          timestamp: "2024-01-21T14:20:00Z",
        },
        {
          from: "user_123",
          message: "Yes, it's available! I accept your points offer.",
          timestamp: "2024-01-21T16:45:00Z",
        },
      ],
    },
    {
      _id: "swap_003",
      itemId: "item_321",
      ownerUid: "user_321",
      requesterUid: "user_123",
      mode: "direct",
      offeredItemId: "item_654",
      status: "completed",
      timestamps: {
        requestedAt: "2024-01-18T09:15:00Z",
        respondedAt: "2024-01-18T11:30:00Z",
        completedAt: "2024-01-20T15:00:00Z",
      },
      itemTitle: "Leather Boots",
      itemImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop",
      ownerName: "Lisa Park",
      ownerAvatar: "https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face",
      requesterName: "Sarah Johnson",
      requesterAvatar: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      offeredItemTitle: "Winter Coat",
      offeredItemImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop",
      messages: [
        {
          from: "user_123",
          message: "Would you swap your boots for my winter coat?",
          timestamp: "2024-01-18T09:15:00Z",
        },
        {
          from: "user_321",
          message: "Perfect! I've been looking for a coat like that.",
          timestamp: "2024-01-18T11:30:00Z",
        },
      ],
    },
  ]

  const filteredSwaps = swaps.filter((swap) => {
    if (activeFilter === "all") return true
    return swap.status === activeFilter
  })

  const getStatusColor = (status) => {
    switch (status) {
      case "pending":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
      case "accepted":
        return "bg-emerald-600/20 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200"
      case "completed":
        return "bg-emerald-600/20 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200"
      case "cancelled":
        return "bg-red-500/20 text-red-700 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
    }
  }

  const getStatusIcon = (status) => {
    switch (status) {
      case "pending":
        return <Clock className="w-4 h-4" />
      case "accepted":
        return <CheckCircle className="w-4 h-4" />
      case "completed":
        return <Package className="w-4 h-4" />
      case "cancelled":
        return <XCircle className="w-4 h-4" />
      default:
        return <MessageCircle className="w-4 h-4" />
    }
  }

  const handleSwapAction = (swapId, action) => {
    alert(`${action} swap ${swapId} - Database integration pending`)
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
          className="bg-white rounded-lg shadow-xl mb-8 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        >
          <div className="border-b border-gray-200 dark:border-gray-700">
            <div className="flex space-x-8 px-6">
              {[
                { key: "all", label: "All Swaps", count: swaps.length },
                { key: "pending", label: "Pending", count: swaps.filter((s) => s.status === "pending").length },
                { key: "accepted", label: "Accepted", count: swaps.filter((s) => s.status === "accepted").length },
                { key: "completed", label: "Completed", count: swaps.filter((s) => s.status === "completed").length },
              ].map((filter) => (
                <button
                  key={filter.key}
                  onClick={() => {
                    setActiveFilter(filter.key)
                    setActiveTab(filter.key) // Update activeTab when filter changes
                  }}
                  className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                    activeTab === filter.key
                      ? "border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500"
                      : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200 dark:text-gray-400 dark:hover:text-gray-50 dark:hover:border-gray-700"
                  }`}
                >
                  {filter.label} ({filter.count})
                </button>
              ))}
            </div>
          </div>

          <div className="p-6">
            <div className="space-y-6">
              {filteredSwaps.map((swap, index) => (
                <motion.div
                  key={swap._id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                  className="border border-gray-200 rounded-lg p-6 bg-white dark:border-gray-700 dark:bg-gray-800"
                >
                  <div className="flex items-center justify-between mb-4">
                    <div className="flex items-center space-x-3">
                      <div className={`p-2 rounded-full ${getStatusColor(swap.status)}`}>
                        {getStatusIcon(swap.status)}
                      </div>
                      <div>
                        <h3 className="font-semibold text-gray-900 dark:text-gray-50">Swap #{swap._id.slice(-4)}</h3>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Requested {new Date(swap.timestamps.requestedAt).toLocaleDateString()}
                        </p>
                      </div>
                    </div>
                    <span className={`px-3 py-1 rounded-full text-sm font-medium ${getStatusColor(swap.status)}`}>
                      {swap.status}
                    </span>
                  </div>

                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-4 items-center">
                    <div className="text-center">
                      <img
                        src={swap.itemImage || "/placeholder.svg"}
                        alt={swap.itemTitle}
                        className="w-24 h-24 object-cover rounded-lg mx-auto mb-2 border border-gray-200 dark:border-gray-700"
                      />
                      <h4 className="font-medium text-gray-900 dark:text-gray-50">{swap.itemTitle}</h4>
                      <div className="flex items-center justify-center space-x-2 mt-1">
                        <div className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold">
                          {swap.ownerAvatar ? (
                            <img
                              src={swap.ownerAvatar || "/placeholder.svg"}
                              alt={swap.ownerName}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span>{swap.ownerName ? swap.ownerName.charAt(0).toUpperCase() : "U"}</span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{swap.ownerName}</span>
                      </div>
                    </div>

                    <div className="flex items-center justify-center">
                      <div className="text-center">
                        <ArrowRight className="w-8 h-8 text-gray-500 mx-auto mb-2 dark:text-gray-400" />
                        <span className="text-sm font-medium text-gray-500 dark:text-gray-400">
                          {swap.mode === "direct" ? "Item Swap" : "Points Redemption"}
                        </span>
                      </div>
                    </div>

                    <div className="text-center">
                      {swap.mode === "direct" ? (
                        <>
                          <img
                            src={swap.offeredItemImage || "/placeholder.svg"}
                            alt={swap.offeredItemTitle}
                            className="w-24 h-24 object-cover rounded-lg mx-auto mb-2 border border-gray-200 dark:border-gray-700"
                          />
                          <h4 className="font-medium text-gray-900 dark:text-gray-50">{swap.offeredItemTitle}</h4>
                        </>
                      ) : (
                        <>
                          <div className="w-24 h-24 bg-emerald-600/10 rounded-lg mx-auto mb-2 flex items-center justify-center dark:bg-emerald-500/10">
                            <span className="text-2xl font-bold text-emerald-600 dark:text-emerald-500">
                              {swap.pointsCharged}
                            </span>
                          </div>
                          <h4 className="font-medium text-gray-900 dark:text-gray-50">Points</h4>
                        </>
                      )}
                      <div className="flex items-center justify-center space-x-2 mt-1">
                        <div className="w-6 h-6 rounded-full border border-gray-200 dark:border-gray-700 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xs font-bold">
                          {swap.requesterAvatar ? (
                            <img
                              src={swap.requesterAvatar || "/placeholder.svg"}
                              alt={swap.requesterName}
                              className="w-full h-full rounded-full object-cover"
                            />
                          ) : (
                            <span>{swap.requesterName ? swap.requesterName.charAt(0).toUpperCase() : "U"}</span>
                          )}
                        </div>
                        <span className="text-sm text-gray-500 dark:text-gray-400">{swap.requesterName}</span>
                      </div>
                    </div>
                  </div>

                  {swap.messages.length > 0 && (
                    <div className="bg-gray-100 rounded-lg p-3 mb-4 border border-gray-200 shadow-inner dark:bg-gray-700 dark:border-gray-600">
                      <div className="flex items-start space-x-3">
                        <MessageCircle className="w-4 h-4 text-gray-500 mt-1 dark:text-gray-400" />
                        <div className="flex-1">
                          <p className="text-sm text-gray-900 dark:text-gray-50">
                            {swap.messages[swap.messages.length - 1].message}
                          </p>
                          <p className="text-xs text-gray-500 mt-1 dark:text-gray-400">
                            {new Date(swap.messages[swap.messages.length - 1].timestamp).toLocaleString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  )}

                  <div className="flex space-x-3">
                    <Button
                      onClick={() => onNavigate(`/swap/${swap._id}`)}
                      variant="outline"
                      size="sm"
                      className="bg-white border-gray-200 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-700"
                    >
                      View Details
                    </Button>

                    {swap.status === "pending" && (
                      <>
                        <Button
                          onClick={() => handleSwapAction(swap._id, "Accept")}
                          size="sm"
                          className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600"
                        >
                          <CheckCircle className="w-4 h-4 mr-1" />
                          Accept
                        </Button>
                        <Button
                          onClick={() => handleSwapAction(swap._id, "Reject")}
                          size="sm"
                          variant="outline"
                          className="border-red-500/50 text-red-500 bg-white hover:bg-red-500/10 dark:bg-gray-800 dark:border-red-500/50 dark:text-red-400 dark:hover:bg-red-500/10"
                        >
                          <XCircle className="w-4 h-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}

                    {swap.status === "accepted" && (
                      <Button
                        onClick={() => handleSwapAction(swap._id, "Mark Complete")}
                        size="sm"
                        className="bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600"
                      >
                        <Package className="w-4 h-4 mr-1" />
                        Mark Complete
                      </Button>
                    )}

                    {swap.status === "completed" && (
                      <Button
                        onClick={() => handleSwapAction(swap._id, "Leave Review")}
                        size="sm"
                        variant="outline"
                        className="bg-white border-gray-200 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-700"
                      >
                        Leave Review
                      </Button>
                    )}
                  </div>
                </motion.div>
              ))}

              {filteredSwaps.length === 0 && (
                <div className="text-center py-12">
                  <MessageCircle className="w-16 h-16 text-gray-500/50 mx-auto mb-4 dark:text-gray-400/50" />
                  <h3 className="text-lg font-medium text-gray-900 mb-2 dark:text-gray-50">No swaps found</h3>
                  <p className="text-gray-500 dark:text-gray-400">
                    {activeFilter === "all"
                      ? "You haven't made any swap requests yet."
                      : `No ${activeFilter} swaps at the moment.`}
                  </p>
                  <Button
                    onClick={() => onNavigate("/")}
                    className="mt-4 bg-emerald-600 hover:bg-emerald-700 text-white dark:bg-emerald-500 dark:hover:bg-emerald-600"
                  >
                    Browse Items
                  </Button>
                </div>
              )}
            </div>
          </div>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default SwapManagement
