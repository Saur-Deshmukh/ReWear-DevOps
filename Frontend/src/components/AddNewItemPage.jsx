"use client"

import { useState } from "react"
import { Button } from "./ui/button"
import { Upload, X, Plus, ImageIcon } from "lucide-react"
import { motion } from "framer-motion"

const AddNewItemPage = ({ onNavigate }) => {
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    category: "",
    type: "",
    size: "",
    condition: "",
    brand: "",
    color: "",
    material: "",
    points: "",
    tags: [],
  })

  const [images, setImages] = useState([])
  const [newTag, setNewTag] = useState("")
  const [isSubmitting, setIsSubmitting] = useState(false)

  const categories = ["Dresses", "Tops", "Bottoms", "Outerwear", "Shoes", "Accessories", "Bags", "Jewelry"]
  const sizes = ["XS", "S", "M", "L", "XL", "XXL", "One Size"]
  const conditions = ["Like New", "Excellent", "Good", "Fair"]
  const types = ["Casual", "Formal", "Business", "Party", "Sports", "Vintage"]

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }))
  }

  const handleImageUpload = (e) => {
    const files = Array.from(e.target.files)
    files.forEach((file) => {
      const reader = new FileReader()
      reader.onload = (event) => {
        setImages((prev) => [
          ...prev,
          {
            id: Date.now() + Math.random(),
            url: event.target.result,
            file: file,
          },
        ])
      }
      reader.readAsDataURL(file)
    })
  }

  const removeImage = (imageId) => {
    setImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const addTag = () => {
    if (newTag.trim() && !formData.tags.includes(newTag.trim())) {
      setFormData((prev) => ({
        ...prev,
        tags: [...prev.tags, newTag.trim()],
      }))
      setNewTag("")
    }
  }

  const removeTag = (tagToRemove) => {
    setFormData((prev) => ({
      ...prev,
      tags: prev.tags.filter((tag) => tag !== tagToRemove),
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsSubmitting(true)

    const basePoints = 10
    const bonusPoints = formData.condition === "Like New" ? 5 : formData.condition === "Excellent" ? 3 : 0
    const totalPointsEarned = basePoints + bonusPoints

    try {
      // ✅ 1️⃣ Create FormData
      const data = new FormData()

      // ✅ 2️⃣ Append form fields
      Object.keys(formData).forEach((key) => {
        if (key === "tags") {
          data.append(key, JSON.stringify(formData[key]))
        } else {
          data.append(key, formData[key])
        }
      })

      // ✅ 3️⃣ Append uploaderUid from localStorage
      const uploaderUid = localStorage.getItem("userId")
      if (!uploaderUid) {
        alert("You must be logged in to upload an item.")
        return
      }
      data.append("uploaderUid", uploaderUid)

      // ✅ 4️⃣ Append calculated points
      data.append("pointsEarned", totalPointsEarned)

      // ✅ 5️⃣ Append images
      images.forEach((imageObj) => {
        data.append("images", imageObj.file)
      })

      // ✅ 6️⃣ Send to Flask backend
      const response = await fetch("https://se-lab-deployment.onrender.com/api/items/add", {
        method: "POST",
        body: data,
      })

      if (response.ok) {
        alert(`Item listed successfully! You earned ${totalPointsEarned} points.`)
        onNavigate("/dashboard")
      } else {
        console.error(await response.text())
        alert("Failed to upload item. Please try again.")
      }
    } catch (error) {
      console.error(error)
      alert("An error occurred. Please try again.")
    } finally {
      setIsSubmitting(false)
    }
  }

  const isFormValid = () => {
    return (
      formData.title &&
      formData.description &&
      formData.category &&
      formData.size &&
      formData.condition &&
      formData.points &&
      images.length > 0
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
      className="min-h-screen bg-gray-50 text-gray-900 dark:bg-gray-900 dark:text-gray-50"
    >
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="bg-white rounded-lg shadow-xl p-6 border border-gray-200 dark:bg-gray-800 dark:border-gray-700"
        >
          <h2 className="text-2xl font-bold text-gray-900 mb-6 dark:text-gray-50">List New Item</h2>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 dark:text-gray-50">
                Images <span className="text-red-500">*</span>
              </label>
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <motion.div
                  whileHover={{ scale: 1.02 }}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center hover:border-emerald-600 transition-colors dark:border-gray-600 dark:hover:border-emerald-500"
                >
                  <input
                    type="file"
                    multiple
                    accept="image/*"
                    onChange={handleImageUpload}
                    className="hidden"
                    id="image-upload"
                  />
                  <label htmlFor="image-upload" className="cursor-pointer block">
                    <Upload className="w-12 h-12 text-gray-500 mx-auto mb-4 dark:text-gray-400" />
                    <p className="text-gray-500 mb-2 dark:text-gray-400">Click to upload images</p>
                    <p className="text-sm text-gray-500 dark:text-gray-400">PNG, JPG up to 10MB each</p>
                  </label>
                </motion.div>

                <div className="grid grid-cols-2 gap-4">
                  {images.map((image) => (
                    <motion.div
                      key={image.id}
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={{ opacity: 1, scale: 1 }}
                      exit={{ opacity: 0, scale: 0.8 }}
                      transition={{ duration: 0.2 }}
                      className="relative group"
                    >
                      <img
                        src={image.url || "/placeholder.svg"}
                        alt="Preview"
                        className="w-full h-32 object-cover rounded-lg border border-gray-200 dark:border-gray-700"
                      />
                      <button
                        type="button"
                        onClick={() => removeImage(image.id)}
                        className="absolute -top-2 -right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity shadow-md"
                        aria-label="Remove image"
                      >
                        <X className="w-4 h-4" />
                      </button>
                    </motion.div>
                  ))}
                  {images.length === 0 && (
                    <div className="col-span-2 flex items-center justify-center h-32 border-2 border-dashed border-gray-200 rounded-lg bg-gray-100 dark:bg-gray-700 dark:border-gray-600">
                      <div className="text-center text-gray-500 dark:text-gray-400">
                        <ImageIcon className="w-8 h-8 mx-auto mb-2" />
                        <p className="text-sm">No images uploaded</p>
                      </div>
                    </div>
                  )}
                </div>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 dark:text-gray-50">
                  Title <span className="text-red-500">*</span>
                </label>
                <input
                  type="text"
                  name="title"
                  value={formData.title}
                  onChange={handleInputChange}
                  placeholder="e.g., Vintage Floral Maxi Dress"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-emerald-500"
                  required
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 dark:text-gray-50">
                  Points <span className="text-red-500">*</span>
                </label>
                <input
                  type="number"
                  name="points"
                  value={formData.points}
                  onChange={handleInputChange}
                  placeholder="e.g., 35"
                  min="1"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-emerald-500"
                  required
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 dark:text-gray-50">
                Description <span className="text-red-500">*</span>
              </label>
              <textarea
                name="description"
                value={formData.description}
                onChange={handleInputChange}
                placeholder="Describe your item in detail..."
                rows={4}
                className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-emerald-500"
                required
              />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 dark:text-gray-50">
                  Category <span className="text-red-500">*</span>
                </label>
                <select
                  name="category"
                  value={formData.category}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-emerald-500"
                  required
                >
                  <option value="">Select Category</option>
                  {categories.map((category) => (
                    <option key={category} value={category}>
                      {category}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 dark:text-gray-50">Type</label>
                <select
                  name="type"
                  value={formData.type}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-emerald-500"
                >
                  <option value="">Select Type</option>
                  {types.map((type) => (
                    <option key={type} value={type}>
                      {type}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 dark:text-gray-50">
                  Size <span className="text-red-500">*</span>
                </label>
                <select
                  name="size"
                  value={formData.size}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-emerald-500"
                  required
                >
                  <option value="">Select Size</option>
                  {sizes.map((size) => (
                    <option key={size} value={size}>
                      {size}
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 dark:text-gray-50">
                  Condition <span className="text-red-500">*</span>
                </label>
                <select
                  name="condition"
                  value={formData.condition}
                  onChange={handleInputChange}
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-emerald-500"
                  required
                >
                  <option value="">Select Condition</option>
                  {conditions.map((condition) => (
                    <option key={condition} value={condition}>
                      {condition}
                    </option>
                  ))}
                </select>
              </div>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 dark:text-gray-50">Brand</label>
                <input
                  type="text"
                  name="brand"
                  value={formData.brand}
                  onChange={handleInputChange}
                  placeholder="e.g., Zara"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 dark:text-gray-50">Color</label>
                <input
                  type="text"
                  name="color"
                  value={formData.color}
                  onChange={handleInputChange}
                  placeholder="e.g., Floral Print"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-emerald-500"
                />
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-900 mb-2 dark:text-gray-50">Material</label>
                <input
                  type="text"
                  name="material"
                  value={formData.material}
                  onChange={handleInputChange}
                  placeholder="e.g., Cotton Blend"
                  className="w-full p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-emerald-500"
                />
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-900 mb-2 dark:text-gray-50">Tags</label>
              <div className="flex flex-wrap gap-2 mb-3">
                {formData.tags.map((tag, index) => (
                  <motion.span
                    key={index}
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={{ opacity: 1, scale: 1 }}
                    exit={{ opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="inline-flex items-center px-3 py-1 bg-emerald-600/20 text-emerald-800 text-sm rounded-full shadow-sm dark:bg-emerald-500/20 dark:text-emerald-200"
                  >
                    #{tag}
                    <button
                      type="button"
                      onClick={() => removeTag(tag)}
                      className="ml-2 text-emerald-800/80 hover:text-emerald-800 transition-colors dark:text-emerald-200/80 dark:hover:text-emerald-200"
                      aria-label={`Remove tag ${tag}`}
                    >
                      <X className="w-3 h-3" />
                    </button>
                  </motion.span>
                ))}
              </div>
              <div className="flex gap-2">
                <input
                  type="text"
                  value={newTag}
                  onChange={(e) => setNewTag(e.target.value)}
                  placeholder="Add a tag"
                  className="flex-1 p-3 border border-gray-200 rounded-lg focus:ring-2 focus:ring-emerald-600 focus:border-transparent outline-none bg-gray-100 text-gray-900 dark:bg-gray-700 dark:border-gray-600 dark:text-gray-50 dark:focus:ring-emerald-500"
                  onKeyPress={(e) => e.key === "Enter" && (e.preventDefault(), addTag())}
                />
                <Button
                  type="button"
                  onClick={addTag}
                  variant="outline"
                  className="bg-white border-gray-200 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-700"
                >
                  <Plus className="w-4 h-4" />
                </Button>
              </div>
            </div>

            <div className="bg-emerald-600/10 border border-emerald-600/30 rounded-lg p-4 shadow-sm dark:bg-emerald-500/10 dark:border-emerald-500/30">
              <h4 className="font-medium text-emerald-800 mb-2 dark:text-emerald-200">💰 Earn Points for Listing</h4>
              <div className="text-sm text-emerald-800/80 space-y-1 dark:text-emerald-200/80">
                <p>• Base reward: 10 points</p>
                <p>
                  • Condition bonus:{" "}
                  {formData.condition === "Like New"
                    ? "5 points"
                    : formData.condition === "Excellent"
                      ? "3 points"
                      : "0 points"}
                </p>
                <p className="font-medium text-emerald-800 dark:text-emerald-200">
                  Total you'll earn:{" "}
                  {10 + (formData.condition === "Like New" ? 5 : formData.condition === "Excellent" ? 3 : 0)} points
                </p>
              </div>
              <p className="text-xs text-emerald-800/70 mt-2 dark:text-emerald-200/70">
                ⏳ Points will be added after admin approval
              </p>
            </div>

            <div className="flex gap-4 pt-6">
              <Button
                type="button"
                onClick={() => onNavigate("/dashboard")}
                variant="outline"
                className="flex-1 bg-white border-gray-200 text-gray-900 hover:bg-gray-200 dark:bg-gray-800 dark:border-gray-700 dark:text-gray-50 dark:hover:bg-gray-700"
              >
                Cancel
              </Button>
              <Button
                type="submit"
                disabled={!isFormValid() || isSubmitting}
                className="flex-1 bg-emerald-600 hover:bg-emerald-700 text-white shadow-md dark:bg-emerald-500 dark:hover:bg-emerald-600"
              >
                {isSubmitting ? "Listing Item..." : "List Item"}
              </Button>
            </div>
          </form>
        </motion.div>
      </div>
    </motion.div>
  )
}

export default AddNewItemPage
