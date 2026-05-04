"use client"

import { useState, useEffect } from "react"
import { Button } from "./ui/button"
import { Heart, Share2, Calendar, Package, MessageCircle, ChevronLeft, ChevronRight } from "lucide-react"
import { motion } from "framer-motion"
import BASE_URL from "../config/api"

const ItemDetailPage = ({ itemId, onNavigate }) => {
  const [selectedImageIndex, setSelectedImageIndex] = useState(0)
  const [isLiked, setIsLiked] = useState(false)
  const [showSwapModal, setShowSwapModal] = useState(false)

  const [itemData, setItemData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [userInfo, setUserInfo] = useState(null);
  const [userItems, setUserItems] = useState([]);
  const [selectedOfferedItemId, setSelectedOfferedItemId] = useState(null);

  useEffect(() => {
    const fetchItemDetails = async () => {
      try {
        const res = await fetch(`${BASE_URL}/items/detail/${itemId}`)
        if (!res.ok) throw new Error("Item not found")
        const data = await res.json()
        console.log(data)
        // Convert raw image strings into objects: { url: "..." }
        const processed = {
          ...data,
          images: (data.images || []).map((url) => ({ url })),
        }

        setItemData(processed)
      } catch (err) {
        setError(err.message)
      } finally {
        setLoading(false)
      }
    }

    if (itemId) {
      fetchItemDetails()
    }
  }, [itemId])

  const handleSwapRequest = async () => {
  const uid = localStorage.getItem("userId")
  if (!uid) return alert("You must be logged in")

  try {
    const [userInfoRes, userItemsRes] = await Promise.all([
       fetch(`${BASE_URL}/users/info`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({ uid }),
        }),
      fetch(`${BASE_URL}/items/user`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ uid: uid }),
      }),
    ])

    if (!userInfoRes.ok || !userItemsRes.ok) throw new Error("Failed to fetch user info or items")

    const userInfoData = await userInfoRes.json()
    const userItemsData = await userItemsRes.json()

    setUserInfo(userInfoData)
    setUserItems(userItemsData)
    setShowSwapModal(true)
  } catch (error) {
    console.error(error)
    alert("Failed to load swap options.")
  }
}

  const nextImage = () => {
    setSelectedImageIndex((prev) => (prev + 1) % (itemData?.images?.length || 1))
  }

  const prevImage = () => {
    setSelectedImageIndex((prev) => (prev - 1 + (itemData?.images?.length || 1)) % (itemData?.images?.length || 1))
  }

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center text-gray-400">Loading item details...</div>
  }

  if (error || !itemData) {
    return (
      <div className="min-h-screen flex items-center justify-center text-red-500">
        Error: {error || "Item not found"}
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
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-8">
          <div className="space-y-4">
            <motion.div
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5 }}
              className="relative bg-white rounded-lg shadow-xl overflow-hidden border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            >
              <img
                src={itemData.images[selectedImageIndex]?.url || "/placeholder.svg"}
                alt={itemData.title}
                className="w-full h-96 object-cover"
              />
              <button
                onClick={prevImage}
                className="absolute left-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-gray-200 transition-colors dark:bg-gray-800/80 dark:hover:bg-gray-700"
                aria-label="Previous image"
              >
                <ChevronLeft className="w-5 h-5 text-gray-900 dark:text-gray-50" />
              </button>
              <button
                onClick={nextImage}
                className="absolute right-2 top-1/2 transform -translate-y-1/2 bg-white/80 rounded-full p-2 shadow-md hover:bg-gray-200 transition-colors dark:bg-gray-800/80 dark:hover:bg-gray-700"
                aria-label="Next image"
              >
                <ChevronRight className="w-5 h-5 text-gray-900 dark:text-gray-50" />
              </button>
              <div className="absolute top-4 right-4 flex space-x-2">
                <button
                  onClick={() => setIsLiked(!isLiked)}
                  className="bg-white/80 rounded-full p-2 shadow-md hover:bg-gray-200 transition-colors dark:bg-gray-800/80 dark:hover:bg-gray-700"
                  aria-label="Like item"
                >
                  <Heart
                    className={`w-5 h-5 ${isLiked ? "text-red-500 fill-current" : "text-gray-500 dark:text-gray-400"}`}
                  />
                </button>
                <button
                  className="bg-white/80 rounded-full p-2 shadow-md hover:bg-gray-200 transition-colors dark:bg-gray-800/80 dark:hover:bg-gray-700"
                  aria-label="Share item"
                >
                  <Share2 className="w-5 h-5 text-gray-500 dark:text-gray-400" />
                </button>
              </div>
            </motion.div>

            <div className="grid grid-cols-4 gap-2">
              {itemData.images.map((image, index) => (
                <motion.button
                  key={index}
                  onClick={() => setSelectedImageIndex(index)}
                  initial={{ opacity: 0, scale: 0.8 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.2, delay: index * 0.05 }}
                  whileHover={{ scale: 1.05 }}
                  className={`relative rounded-lg overflow-hidden border-2 ${
                    selectedImageIndex === index
                      ? "border-emerald-600 dark:border-emerald-500"
                      : "border-gray-200 hover:border-emerald-600/50 dark:border-gray-700 dark:hover:border-emerald-500/50"
                  } transition-colors`}
                  aria-label={`View image ${index + 1}`}
                >
                  <img
                    src={image.url || "/placeholder.svg"}
                    alt={`${itemData.title} ${index + 1}`}
                    className="w-full h-20 object-cover"
                  />
                </motion.button>
              ))}
            </div>
          </div>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
            >
              <h1 className="text-3xl font-bold text-gray-900 mb-2 dark:text-gray-50">{itemData.title}</h1>
              <div className="flex items-center space-x-4 text-sm text-gray-500 mb-4 dark:text-gray-400">
                <span className="flex items-center">
                  <Calendar className="w-4 h-4 mr-1" />
                  Listed {new Date(itemData.createdAt).toLocaleDateString()}
                </span>
                <span>{itemData.views} views</span>
                <span>{itemData.likes} likes</span>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white rounded-lg p-4 shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            >
              <div className="flex justify-between items-center mb-4">
                <div>
                  <span className="text-3xl font-bold text-emerald-600 dark:text-emerald-500">
                    {itemData.points} pts
                  </span>
                  <span
                    className={`ml-3 px-3 py-1 rounded-full text-sm font-medium ${
                      itemData.status === "available"
                        ? "bg-emerald-600/20 text-emerald-800 dark:bg-emerald-500/20 dark:text-emerald-200"
                        : "bg-red-500/20 text-red-700 dark:text-red-300"
                    }`}
                  >
                    {itemData.status === "available" ? "Available" : "Unavailable"}
                  </span>
                </div>
              </div>

              <div className="grid grid-cols-1 gap-4 mb-4">
                <Button
                  onClick={handleSwapRequest}
                  className="bg-emerald-600 hover:bg-emerald-700 text-white shadow-md dark:bg-emerald-500 dark:hover:bg-emerald-600"
                  disabled={itemData.status !== "available"}
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Swap Request
                </Button>
                
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white rounded-lg p-4 shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 dark:text-gray-50">Item Details</h3>
              <div className="grid grid-cols-2 gap-4 text-sm">
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Category:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-50">{itemData.category}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Size:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-50">{itemData.size}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Condition:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-50">{itemData.condition}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Brand:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-50">{itemData.brand}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Color:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-50">{itemData.color}</span>
                </div>
                <div>
                  <span className="text-gray-500 dark:text-gray-400">Material:</span>
                  <span className="ml-2 font-medium text-gray-900 dark:text-gray-50">{itemData.material}</span>
                </div>
              </div>

              <div className="mt-4">
                <span className="text-gray-500 text-sm dark:text-gray-400">Tags:</span>
                <div className="flex flex-wrap gap-2 mt-2">
                  {itemData.tags.map((tag, index) => (
                    <span
                      key={index}
                      className="px-2 py-1 bg-gray-100 text-gray-500 text-xs rounded-full dark:bg-gray-700 dark:text-gray-400"
                    >
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>
            </motion.div>

            {/* <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              className="bg-white rounded-lg p-4 shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
            >
              <h3 className="text-lg font-semibold text-gray-900 mb-3 dark:text-gray-50">Seller Information</h3>
              <div className="flex items-center space-x-4">
                <img
                  src={itemData.uploader.avatarUrl || "/placeholder.svg"}
                  alt={itemData.uploader.name}
                  className="w-12 h-12 rounded-full object-cover border-2 border-gray-200 shadow-sm dark:border-gray-700"
                />
                <div className="flex-1">
                  <h4 className="font-semibold text-gray-900 dark:text-gray-50">{itemData.uploader.name}</h4>
                  <div className="flex items-center space-x-4 text-sm text-gray-500 dark:text-gray-400">
                    <span className="flex items-center">
                      <Star className="w-4 h-4 text-yellow-500 fill-current mr-1" />
                      {itemData.uploader.rating}
                    </span>
                    <span>{itemData.uploader.totalSwaps} swaps</span>
                    <span className="flex items-center">
                      <MapPin className="w-4 h-4 mr-1" />
                      {itemData.uploader.location}
                    </span>
                  </div>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="bg-white border-gray-200 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-700"
                >
                  View Profile
                </Button>
              </div>
            </motion.div> */}
          </div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.5 }}
          className="bg-white rounded-lg p-6 shadow-md mb-8 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-3 dark:text-gray-50">Description</h3>
          <p className="text-gray-500 leading-relaxed dark:text-gray-400">{itemData.description}</p>
        </motion.div>

        {/* <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.6 }}
          className="bg-white rounded-lg p-6 shadow-md border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        >
          <h3 className="text-lg font-semibold text-gray-900 mb-6 dark:text-gray-50">Similar Items</h3>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {relatedItems.map((item, index) => (
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
                className="border border-gray-200 rounded-lg overflow-hidden cursor-pointer bg-white dark:border-gray-700 dark:bg-gray-800"
              >
                <img src={item.image || "/placeholder.svg"} alt={item.title} className="w-full h-40 object-cover" />
                <div className="p-4">
                  <h4 className="font-semibold text-gray-900 mb-2 truncate dark:text-gray-50">{item.title}</h4>
                  <div className="flex justify-between items-center">
                    <span className="text-lg font-bold text-emerald-600 dark:text-emerald-500">{item.points} pts</span>
                    <span className="text-sm text-gray-500 dark:text-gray-400">{item.condition}</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        </motion.div> */}
      </div>

      {showSwapModal && (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
          className="fixed inset-0 bg-gray-900/80 backdrop-blur-sm flex items-center justify-center z-50"
        >
          <motion.div
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.9 }}
            transition={{ duration: 0.3 }}
            className="bg-white rounded-lg p-6 max-w-2xl w-full mx-4 max-h-[90vh] overflow-y-auto shadow-xl border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
          >
            <h3 className="text-lg font-semibold text-gray-900 mb-4 dark:text-gray-50">Request Swap</h3>

            <div className="mb-6">
              <label className="block text-sm font-medium text-gray-900 mb-3 dark:text-gray-50">
                Choose swap method:
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <label className="border-2 border-emerald-600 rounded-lg p-4 bg-emerald-600/10 cursor-pointer flex items-start shadow-sm dark:border-emerald-500 dark:bg-emerald-500/10">
                  <input type="radio" name="swapMode" value="direct" defaultChecked className="mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-50">Direct Item Swap</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">Exchange one of your items for this item</p>
                  </div>
                </label>
                <label className="border-2 border-gray-200 rounded-lg p-4 bg-gray-100 cursor-pointer flex items-start shadow-sm dark:border-gray-700 dark:bg-gray-700">
                  <input type="radio" name="swapMode" value="points" className="mr-3 mt-1" />
                  <div>
                    <h4 className="font-semibold text-gray-900 dark:text-gray-50">Redeem with Points</h4>
                    <p className="text-sm text-gray-500 dark:text-gray-400">
                      Use {itemData.requiresPoints} points to get this item
                    </p>
                  </div>
                </label>
              </div>
            </div>

            <div className="mb-6">
              <h4 className="font-medium text-gray-900 mb-3 dark:text-gray-50">Select item to offer (Direct Swap):</h4>
              <div className="grid grid-cols-2 md:grid-cols-3 gap-3 max-h-48 overflow-y-auto border border-gray-200 rounded-lg p-2 bg-gray-100 dark:border-gray-700 dark:bg-gray-700">
                {userItems.map((item) => (
  <label
    key={item._id}
    className={`border rounded-lg p-2 cursor-pointer flex flex-col items-center text-center shadow-sm ${
      selectedOfferedItemId === item._id
        ? "border-emerald-600 dark:border-emerald-500"
        : "border-gray-200 hover:border-emerald-600 dark:border-gray-700 dark:hover:border-emerald-500"
    } bg-white dark:bg-gray-800 transition`}
  >
    <input
      type="radio"
      name="offeredItem"
      value={item._id}
      className="sr-only"
      checked={selectedOfferedItemId === item._id}
      onChange={() => setSelectedOfferedItemId(item._id)}
    />
    <img
      src={item.images?.[0] || "/placeholder.svg"}
      alt={item.title}
      className="w-full h-20 object-cover rounded mb-2"
    />
    <p className="text-xs font-medium text-gray-900 truncate dark:text-gray-50">{item.title}</p>
    <p className="text-xs text-emerald-600 dark:text-emerald-500">{item.points} pts</p>
  </label>
))}

              </div>
            </div>

            

            <div className="mb-6 p-3 bg-gray-100 rounded-lg border border-gray-200 shadow-inner dark:bg-gray-700 dark:border-gray-600">
              <div className="flex justify-between items-center">
                <span className="text-sm text-gray-500 dark:text-gray-400">Your current points balance:</span>
                <span className="font-semibold text-emerald-600 dark:text-emerald-500">145 pts</span>
              </div>
              <div className="flex justify-between items-center mt-1">
                <span className="text-sm text-gray-500 dark:text-gray-400">Cost of this item:</span>
                <span className="font-semibold text-gray-900 dark:text-gray-50">{itemData.points} pts</span>
              </div>
              
            </div>

            <div className="flex space-x-3">
              <Button
                onClick={() => setShowSwapModal(false)}
                variant="outline"
                className="flex-1 bg-white border-gray-200 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
  onClick={async () => {
    const requesterUid = localStorage.getItem("userId")
    const requestedItemId = itemData._id
    const offeredItemId = selectedOfferedItemId

    if (!requesterUid || !requestedItemId || !offeredItemId) {
      return alert("Please select your item to offer.")
    }

    try {
      const res = await fetch(`${BASE_URL}/swap/request`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          requesterUid,
          requestedItemId,
          offeredItemId,
        }),
      })

      const result = await res.json()
      if (res.ok) {
        alert("Swap completed successfully!")
        setShowSwapModal(false)
      } else {
        alert(result.error || "Swap failed.")
      }
    } catch (error) {
      console.error(error)
      alert("Error submitting swap request.")
    }
  }}
  disabled={!selectedOfferedItemId}
  className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md dark:bg-emerald-500 dark:hover:bg-emerald-600"
>
  Send Request
</Button>

            </div>
          </motion.div>
        </motion.div>
      )}
    </motion.div>
  )
}

export default ItemDetailPage
