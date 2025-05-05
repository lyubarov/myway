import { defineConfig } from "vite";
import react from "@vitejs/plugin-react-swc";
import path from "path";

// https://vite.dev/config/
export default defineConfig({
  build: {
    outDir: 'dist',
    emptyOutDir: true
  },
  plugins: [react()],
  resolve: {
    alias: [
      {
        find: "~components",
        replacement: path.resolve(__dirname, "src/components"),
      },
      {
        find: "~screens",
        replacement: path.resolve(__dirname, "src/screens"),
      },
      {
        find: "~navigation",
        replacement: path.resolve(__dirname, "src/navigation"),
      },
      {
        find: "~appTypes",
        replacement: path.resolve(__dirname, "src/appTypes"),
      },
      {
        find: "~utils",
        replacement: path.resolve(__dirname, "src/utils"),
      },
    ],
  },
});
