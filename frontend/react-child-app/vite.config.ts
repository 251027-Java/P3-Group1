import { defineConfig } from "vite";
import react from "@vitejs/plugin-react";
import path from "path";
import { fileURLToPath } from "url";

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// https://vite.dev/config/
export default defineConfig(({ mode }) => {
  const isSingleSpa = mode === "single-spa";

  return {
    plugins: [
      react({
        babel: {
          plugins: [["babel-plugin-react-compiler"]],
        },
      }),
    ],
    resolve: {
      alias: {
        // This forces the app to use the React version in the project's node_modules
        react: path.resolve(__dirname, "./node_modules/react"),
        "react-dom": path.resolve(__dirname, "./node_modules/react-dom"),
        "react-router-dom": path.resolve(
          __dirname,
          "./node_modules/react-router-dom"
        ),
      },
    },
    build: {
      // Output configuration for Single-SPA
      lib: isSingleSpa
        ? {
          entry: path.resolve(__dirname, "src/single-spa-entry.tsx"),
          name: "gamehubReactUsers",
          fileName: () => "gamehub-react-users.js",
          formats: ["system"],
        }
        : undefined,
      rollupOptions: isSingleSpa
        ? {
          // Mark React as external when building for Single-SPA (shared via import map)
          external: ["react", "react-dom", "react-dom/client"],
          output: {
            globals: {
              react: "React",
              "react-dom": "ReactDOM",
              "react-dom/client": "ReactDOM",
            },
          },
        }
        : {},
      target: "esnext",
      minify: true,
    },
    server: {
      port: 3000,
      cors: true,
      headers: {
        "Access-Control-Allow-Origin": "*",
      },
    },
    preview: {
      port: 3000,
      cors: true,
    },
  };
});
