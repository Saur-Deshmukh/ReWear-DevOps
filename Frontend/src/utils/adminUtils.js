// Admin configuration
export const ADMIN_USER_ID = "j2JaGqIxNIWjw1TEvRDZqEjRqxA2"

export const isAdmin = (user) => {
  return user && user.uid === ADMIN_USER_ID
}

export const requireAdmin = (user) => {
  if (!isAdmin(user)) {
    throw new Error("Admin access required")
  }
}
