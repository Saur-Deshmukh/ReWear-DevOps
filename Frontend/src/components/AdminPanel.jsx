"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Users, Package, ShoppingCart, Eye, Ban, Check, X, AlertTriangle } from "lucide-react"
import { isAdmin } from "../utils/adminUtils"
import { useAuth } from "../contexts/AuthContext"
import { motion } from "framer-motion"

const AdminPanel = ({ onNavigate }) => {
  const [activeTab, setActiveTab] = useState("users")
  const { user } = useAuth()

  if (!isAdmin(user)) {
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
          <AlertTriangle className="w-16 h-16 text-red-500 mx-auto mb-4 animate-bounce" />
          <h2 className="text-2xl font-bold text-gray-900 mb-2 dark:text-gray-50">Access Denied</h2>
          <p className="text-gray-500 mb-4 dark:text-gray-400">You don't have permission to access the admin panel.</p>
          <Button onClick={() => onNavigate("/")} className="bg-emerald-600 hover:bg-emerald-700 text-white">
            Go Back Home
          </Button>
        </motion.div>
      </motion.div>
    )
  }

  const mockUsers = [
    {
      uid: "user_123",
      name: "Sarah Johnson",
      email: "sarah.johnson@email.com",
      avatarUrl: "",
      createdAt: "2024-01-15T10:00:00Z",
      stats: {
        itemsUploaded: 23,
        swapsCompleted: 15,
      },
      role: "user",
      points: 145,
      status: "Active",
    },
    {
      uid: "user_456",
      name: "Mike Chen",
      email: "mike.chen@email.com",
      avatarUrl: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      createdAt: "2024-01-10T11:00:00Z",
      stats: {
        itemsUploaded: 15,
        swapsCompleted: 10,
      },
      role: "user",
      points: 89,
      status: "Active",
    },
    {
      uid: "user_789",
      name: "Emma Wilson",
      email: "emma.wilson@email.com",
      avatarUrl: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      createdAt: "2024-01-20T12:00:00Z",
      stats: {
        itemsUploaded: 31,
        swapsCompleted: 25,
      },
      role: "user",
      points: 203,
      status: "Suspended",
    },
    {
      uid: "user_321",
      name: "John Davis",
      email: "john.davis@email.com",
      avatarUrl: "", // No avatar URL for this user
      createdAt: "2024-01-05T09:00:00Z",
      stats: {
        itemsUploaded: 8,
        swapsCompleted: 5,
      },
      role: "user",
      points: 42,
      status: "Active",
    },
  ]

  const mockListings = [
    {
      _id: "item_1",
      title: "Vintage Floral Maxi Dress",
      images: [{ url: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop" }],
      uploaderUid: "user_123",
      uploaderName: "Sarah Johnson",
      createdAt: "2024-01-22T10:00:00Z",
      status: "available",
      approved: false,
      visibility: "public",
      requiresPoints: 35,
      category: "Dresses",
      reports: 0,
    },
    {
      _id: "item_2",
      title: "Designer Leather Jacket",
      images: [{ url: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop" }],
      uploaderUid: "user_456",
      uploaderName: "Mike Chen",
      createdAt: "2024-01-21T11:00:00Z",
      status: "available",
      approved: true,
      visibility: "public",
      requiresPoints: 65,
      category: "Outerwear",
      reports: 0,
    },
    {
      _id: "item_3",
      title: "Suspicious Item Title",
      images: [{ url: "https://images.unsplash.com/photo-1434389677669-e08b4cac3105?w=300&h=400&fit=crop" }],
      uploaderUid: "user_789",
      uploaderName: "Emma Wilson",
      createdAt: "2024-01-20T12:00:00Z",
      status: "available",
      approved: false,
      visibility: "hidden",
      requiresPoints: 25,
      category: "Accessories",
      reports: 3,
    },
    {
      _id: "item_4",
      title: "Classic White Sneakers",
      images: [{ url: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop" }],
      uploaderUid: "user_321",
      uploaderName: "John Davis",
      createdAt: "2024-01-19T13:00:00Z",
      status: "redeemed",
      approved: true,
      visibility: "public",
      requiresPoints: 30,
      category: "Shoes",
      reports: 0,
    },
  ]

  const mockSwaps = [
    {
      _id: "swap_001",
      itemId: "item_2",
      ownerUid: "user_456",
      requesterUid: "user_123",
      mode: "points",
      pointsCharged: 65,
      status: "completed",
      timestamps: {
        requestedAt: "2024-01-22T10:30:00Z",
        respondedAt: "2024-01-22T11:00:00Z",
        completedAt: "2024-01-23T15:00:00Z",
      },
      itemTitle: "Designer Leather Jacket",
      itemImage: "https://images.unsplash.com/photo-1551028719-00167b16eac5?w=300&h=400&fit=crop",
      ownerName: "Mike Chen",
      requesterName: "Sarah Johnson",
    },
    {
      _id: "swap_002",
      itemId: "item_4",
      ownerUid: "user_321",
      requesterUid: "user_789",
      mode: "direct",
      offeredItemId: "item_offered_by_emma",
      status: "pending",
      timestamps: {
        requestedAt: "2024-01-21T14:20:00Z",
        respondedAt: null,
        completedAt: null,
      },
      itemTitle: "Classic White Sneakers",
      itemImage: "https://images.unsplash.com/photo-1549298916-b41d501d3772?w=300&h=400&fit=crop",
      ownerName: "John Davis",
      requesterName: "Emma Wilson",
      offeredItemTitle: "Emma's Vintage Scarf",
    },
    {
      _id: "swap_003",
      itemId: "item_1",
      ownerUid: "user_123",
      requesterUid: "user_321",
      mode: "points",
      pointsCharged: 35,
      status: "disputed",
      timestamps: {
        requestedAt: "2024-01-20T09:15:00Z",
        respondedAt: "2024-01-20T10:00:00Z",
        completedAt: null,
      },
      itemTitle: "Vintage Floral Maxi Dress",
      itemImage: "https://images.unsplash.com/photo-1595777457583-95e059d581b8?w=300&h=400&fit=crop",
      ownerName: "Sarah Johnson",
      requesterName: "John Davis",
    },
  ]

  const handleUserAction = (uid, action) => {
    alert(`${action} user ${uid} - Database integration pending`)
  }

  const handleListingAction = (itemId, action) => {
    alert(`${action} listing ${itemId} - Database integration pending`)
  }

  const handleSwapAction = (swapId, action) => {
    alert(`${action} swap ${swapId} - Database integration pending`)
  }

  const getStatusColor = (status) => {
    switch (status) {
      case "Active":
      case "approved":
      case "completed":
      case "available":
        return "bg-emerald-600/20 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200"
      case "pending":
      case "In Progress":
        return "bg-yellow-500/20 text-yellow-700 dark:text-yellow-300"
      case "Suspended":
      case "disputed":
      case "redeemed":
      case "hidden":
        return "bg-red-500/20 text-red-700 dark:text-red-300"
      default:
        return "bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400"
    }
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50"
    >
      <div className="bg-white border-b border-gray-200 dark:bg-gray-800 dark:border-gray-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex space-x-8">
            <button
              onClick={() => setActiveTab("users")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "users"
                  ? "border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200 dark:text-gray-400 dark:hover:text-gray-50 dark:hover:border-gray-700"
              }`}
            >
              <Users className="w-5 h-5 inline mr-2" />
              Manage Users
            </button>
            <button
              onClick={() => setActiveTab("swaps")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "swaps"
                  ? "border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200 dark:text-gray-400 dark:hover:text-gray-50 dark:hover:border-gray-700"
              }`}
            >
              <ShoppingCart className="w-5 h-5 inline mr-2" />
              Manage Swaps
            </button>
            <button
              onClick={() => setActiveTab("listings")}
              className={`py-4 px-1 border-b-2 font-medium text-sm transition-colors ${
                activeTab === "listings"
                  ? "border-emerald-600 text-emerald-600 dark:border-emerald-500 dark:text-emerald-500"
                  : "border-transparent text-gray-500 hover:text-gray-900 hover:border-gray-200 dark:text-gray-400 dark:hover:text-gray-50 dark:hover:border-gray-700"
              }`}
            >
              <Package className="w-5 h-5 inline mr-2" />
              Manage Listings
            </button>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {activeTab === "users" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Manage Users</h3>
            </div>
            <div className="divide-y divide-gray-200 dark:divide-gray-700">
              {mockUsers.map((user, index) => (
                <motion.div
                  key={user.uid}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  className="p-6 flex flex-col md:flex-row items-center md:space-x-4 space-y-4 md:space-y-0"
                >
                  <div className="w-16 h-16 rounded-full object-cover border-2 border-emerald-600/30 shadow-sm dark:border-emerald-500/30 flex items-center justify-center bg-gray-200 dark:bg-gray-700 text-gray-600 dark:text-gray-300 text-xl font-bold">
                    {user.avatarUrl ? (
                      <img
                        src={user.avatarUrl || "/placeholder.svg"}
                        alt={user.name}
                        className="w-full h-full rounded-full object-cover"
                      />
                    ) : (
                      <span>{user.name ? user.name.charAt(0).toUpperCase() : "U"}</span>
                    )}
                  </div>
                  <div className="flex-1 bg-gray-100 rounded-lg p-4 w-full shadow-inner dark:bg-gray-700">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                      <div>
                        <h4 className="font-semibold text-gray-900 dark:text-gray-50">{user.name}</h4>
                        <p className="text-gray-500 dark:text-gray-400">{user.email}</p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Joined: {new Date(user.createdAt).toLocaleDateString()}
                        </p>
                      </div>
                      <div>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Items Uploaded: {user.stats.itemsUploaded}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">
                          Swaps Completed: {user.stats.swapsCompleted}
                        </p>
                        <p className="text-sm text-gray-500 dark:text-gray-400">Points: {user.points}</p>
                        <span
                          className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(
                            user.status,
                          )} mt-1`}
                        >
                          {user.status}
                        </span>
                      </div>
                    </div>
                  </div>
                  <div className="flex flex-col space-y-2 w-full md:w-auto">
                    <Button
                      onClick={() => handleUserAction(user.uid, "View Profile")}
                      size="sm"
                      variant="outline"
                      className="bg-white border-gray-200 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-700"
                    >
                      <Eye className="w-4 h-4 mr-1" />
                      View
                    </Button>
                    <Button
                      onClick={() => handleUserAction(user.uid, user.status === "Active" ? "Suspend" : "Activate")}
                      size="sm"
                      variant="outline"
                      className={
                        user.status === "Active"
                          ? "border-red-500/50 text-red-500 bg-white hover:bg-red-500/10 dark:bg-gray-800 dark:border-red-500/50 dark:text-red-400 dark:hover:bg-red-500/10"
                          : "border-emerald-600/50 text-emerald-600 bg-white hover:bg-emerald-600/10 dark:bg-gray-800 dark:border-emerald-500/50 dark:text-emerald-500 dark:hover:bg-emerald-500/10"
                      }
                    >
                      {user.status === "Active" ? <Ban className="w-4 h-4 mr-1" /> : <Check className="w-4 h-4 mr-1" />}
                      {user.status === "Active" ? "Suspend" : "Activate"}
                    </Button>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}

        {activeTab === "swaps" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Manage Swaps</h3>
            </div>
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200 dark:divide-gray-700">
                <thead className="bg-gray-100 dark:bg-gray-700">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Swap ID
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Item
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Owner
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Requester
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Type
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Date
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Status
                    </th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider dark:text-gray-400">
                      Actions
                    </th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200 dark:bg-gray-800 dark:divide-gray-700">
                  {mockSwaps.map((swap, index) => (
                    <motion.tr
                      key={swap._id}
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      transition={{ duration: 0.3, delay: index * 0.05 }}
                    >
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium text-gray-900 dark:text-gray-50">
                        {swap._id.slice(-4)}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-50">
                        {swap.itemTitle}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-50">
                        {swap.ownerName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-50">
                        {swap.requesterName}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-50">
                        {swap.mode === "points" ? `${swap.pointsCharged} pts` : "Direct Swap"}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-900 dark:text-gray-50">
                        {new Date(swap.timestamps.requestedAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap">
                        <span className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(swap.status)}`}>
                          {swap.status}
                        </span>
                      </td>
                      <td className="px-6 py-4 whitespace-nowrap text-sm font-medium space-x-2">
                        <Button
                          onClick={() => handleSwapAction(swap._id, "View Details")}
                          size="sm"
                          variant="outline"
                          className="bg-white border-gray-200 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-700"
                        >
                          View
                        </Button>
                        {swap.status === "disputed" && (
                          <Button
                            onClick={() => handleSwapAction(swap._id, "Resolve")}
                            size="sm"
                            className="bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Resolve
                          </Button>
                        )}
                      </td>
                    </motion.tr>
                  ))}
                </tbody>
              </table>
            </div>
          </motion.div>
        )}

        {activeTab === "listings" && (
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="bg-white rounded-lg shadow-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
          >
            <div className="px-6 py-4 border-b border-gray-200 dark:border-gray-700">
              <div className="flex justify-between items-center">
                <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-50">Manage Listings</h3>
                <div className="flex space-x-2 text-sm">
                  <span className="px-2 py-1 bg-yellow-500/20 text-yellow-700 rounded dark:text-yellow-300">
                    {mockListings.filter((item) => !item.approved).length} Pending Approval
                  </span>
                  <span className="px-2 py-1 bg-red-500/20 text-red-700 rounded dark:text-red-300">
                    {mockListings.filter((item) => item.reports > 0).length} Reported
                  </span>
                </div>
              </div>
            </div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 p-6">
              {mockListings.map((listing, index) => (
                <motion.div
                  key={listing._id}
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.3, delay: index * 0.05 }}
                  whileHover={{
                    y: -5,
                    boxShadow: "0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)",
                  }}
                  className="border border-gray-200 rounded-lg overflow-hidden bg-white shadow-md dark:border-gray-700 dark:bg-gray-800"
                >
                  <img
                    src={listing.images[0]?.url || "/placeholder.svg"}
                    alt={listing.title}
                    className="w-full h-48 object-cover"
                  />
                  <div className="p-4">
                    <h4 className="font-semibold text-gray-900 mb-2 dark:text-gray-50">{listing.title}</h4>
                    <div className="text-sm text-gray-500 space-y-1 mb-3 dark:text-gray-400">
                      <p>By: {listing.uploaderName}</p>
                      <p>Category: {listing.category}</p>
                      <p>Points: {listing.requiresPoints}</p>
                      <p>Date: {new Date(listing.createdAt).toLocaleDateString()}</p>
                      {listing.reports > 0 && <p className="text-red-500">Reports: {listing.reports}</p>}
                    </div>
                    <div className="flex justify-between items-center mb-3">
                      <div className="flex space-x-1">
                        <span
                          className={`px-2 py-1 rounded-full text-xs font-medium ${getStatusColor(listing.status)}`}
                        >
                          {listing.status}
                        </span>
                        {!listing.approved && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-yellow-500/20 text-yellow-700 dark:text-yellow-300">
                            Pending
                          </span>
                        )}
                        {listing.visibility === "hidden" && (
                          <span className="px-2 py-1 rounded-full text-xs font-medium bg-gray-100 text-gray-500 dark:bg-gray-700 dark:text-gray-400">
                            Hidden
                          </span>
                        )}
                      </div>
                    </div>
                    <div className="flex space-x-2">
                      {!listing.approved && (
                        <>
                          <Button
                            onClick={() => handleListingAction(listing._id, "Approve")}
                            size="sm"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            <Check className="w-4 h-4 mr-1" />
                            Approve
                          </Button>
                          <Button
                            onClick={() => handleListingAction(listing._id, "Reject")}
                            size="sm"
                            variant="outline"
                            className="flex-1 border-red-500/50 text-red-500 bg-white hover:bg-red-500/10 dark:bg-gray-800 dark:border-red-500/50 dark:text-red-400 dark:hover:bg-red-500/10"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Reject
                          </Button>
                        </>
                      )}
                      {listing.reports > 0 && (
                        <>
                          <Button
                            onClick={() => handleListingAction(listing._id, "Review")}
                            size="sm"
                            className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white"
                          >
                            Review
                          </Button>
                          <Button
                            onClick={() => handleListingAction(listing._id, "Remove")}
                            size="sm"
                            variant="outline"
                            className="flex-1 border-red-500/50 text-red-500 bg-white hover:bg-red-500/10 dark:bg-gray-800 dark:border-red-500/50 dark:text-red-400 dark:hover:bg-red-500/10"
                          >
                            <X className="w-4 h-4 mr-1" />
                            Remove
                          </Button>
                        </>
                      )}
                      {listing.approved && listing.reports === 0 && (
                        <Button
                          onClick={() => handleListingAction(listing._id, "Hide")}
                          size="sm"
                          variant="outline"
                          className="w-full border-gray-200 text-gray-500 bg-white hover:bg-gray-200 dark:border-gray-700 dark:text-gray-400 dark:bg-gray-800 dark:hover:bg-gray-700"
                        >
                          <Ban className="w-4 h-4 mr-1" />
                          Hide
                        </Button>
                      )}
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </div>
    </motion.div>
  )
}

export default AdminPanel
