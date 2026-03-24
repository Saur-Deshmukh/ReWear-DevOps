// Simple client-side router
export class Router {
  constructor() {
    this.routes = new Map()
    this.currentRoute = "/"
    this.listeners = []

    // Listen for browser back/forward
    window.addEventListener("popstate", (e) => {
      this.navigate(window.location.pathname, false)
    })
  }

  addRoute(path, component) {
    this.routes.set(path, component)
  }

  navigate(path, pushState = true) {
    this.currentRoute = path
    if (pushState) {
      window.history.pushState({}, "", path)
    }
    this.notifyListeners()
  }

  getCurrentRoute() {
    return this.currentRoute
  }

  subscribe(listener) {
    this.listeners.push(listener)
    return () => {
      this.listeners = this.listeners.filter((l) => l !== listener)
    }
  }

  notifyListeners() {
    this.listeners.forEach((listener) => listener(this.currentRoute))
  }
}

export const router = new Router()
