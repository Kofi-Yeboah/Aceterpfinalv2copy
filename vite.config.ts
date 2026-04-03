import path from "path"
import { defineConfig } from "vite"
import react from "@vitejs/plugin-react"
import tailwindcss from "@tailwindcss/vite"

const ReactDevToolsPlugin = () => ({
  name: "react-devtools",
  transformIndexHtml(html: string) {
    if (process.env.NODE_ENV === "development") {
      return html.replace(
        "<head>",
        `<head><script>window.__REACT_DEVTOOLS_GLOBAL_HOOK__ = window.__REACT_DEVTOOLS_GLOBAL_HOOK__ || { isDisabled: false };</script>`
      )
    }
    return html
  },
})

export default defineConfig({
  plugins: [
    tailwindcss(),
    react(),
    ReactDevToolsPlugin(),
  ],
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
})
