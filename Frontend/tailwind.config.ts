import type { Config } from "tailwindcss"
import defaultConfig from "shadcn/ui/tailwind.config"

const config = {
  ...defaultConfig,
  content: [...defaultConfig.content, "./pages/**/*.{js,jsx}", "./src/**/*.{js,jsx}", "*.{js,ts,jsx,tsx,mdx}"],
  theme: {
    ...defaultConfig.theme,
    container: {
      center: true,
      padding: "2rem",
      screens: {
        "2xl": "1400px",
      },
    },
    extend: {
      ...defaultConfig.theme.extend,
      colors: {
        ...defaultConfig.theme.extend.colors,
        // Define a vibrant and professional color palette directly
        // Primary: A vibrant green/teal for main actions and branding
        primary: {
          DEFAULT: "#059669", // emerald-600
          foreground: "#ffffff", // white
        },
        // Secondary: A lighter shade for secondary actions
        secondary: {
          DEFAULT: "#d1fae5", // emerald-100
          foreground: "#065f46", // emerald-900
        },
        // Accent: For hover states and subtle highlights
        accent: {
          DEFAULT: "#e5e7eb", // gray-200
          foreground: "#1f2937", // gray-800
        },
        // Destructive: For error states and warnings
        destructive: {
          DEFAULT: "#ef4444", // red-500
          foreground: "#ffffff", // white
        },
        // Backgrounds and text for light mode
        background: "#f9fafb", // gray-50
        foreground: "#111827", // gray-900
        card: "#ffffff", // white
        "card-foreground": "#111827", // gray-900
        popover: "#ffffff", // white
        "popover-foreground": "#111827", // gray-900
        border: "#e5e7eb", // gray-200
        input: "#f3f4f6", // gray-100
        ring: "#6b7280", // gray-500
        muted: "#f3f4f6", // gray-100
        "muted-foreground": "#6b7280", // gray-500
      },
      borderRadius: {
        lg: "0.625rem", // Keeping original radius value
        md: "calc(0.625rem - 2px)",
        sm: "calc(0.625rem - 4px)",
      },
      keyframes: {
        "accordion-down": {
          from: { height: "0" },
          to: { height: "var(--radix-accordion-content-height)" },
        },
        "accordion-up": {
          from: { height: "var(--radix-accordion-content-height)" },
          to: { height: "0" },
        },
        "fade-in": {
          from: { opacity: "0" },
          to: { opacity: "1" },
        },
        "slide-in-up": {
          from: { transform: "translateY(20px)", opacity: "0" },
          to: { transform: "translateY(0)", opacity: "1" },
        },
        "scale-in": {
          from: { transform: "scale(0.95)", opacity: "0" },
          to: { transform: "scale(1)", opacity: "1" },
        },
      },
      animation: {
        "accordion-down": "accordion-down 0.2s ease-out",
        "accordion-up": "accordion-up 0.2s ease-out",
        "fade-in": "fade-in 0.5s ease-out forwards",
        "slide-in-up": "slide-in-up 0.6s ease-out forwards",
        "scale-in": "scale-in 0.3s ease-out forwards",
      },
    },
  },
  plugins: [...defaultConfig.plugins, require("tailwindcss-animate")],
} satisfies Config

export default config
