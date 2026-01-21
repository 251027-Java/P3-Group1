// Single-SPA lifecycle exports for React MFE
// This file is the entry point when loaded as a Single-SPA application
import React from "react";
import ReactDOMClient from "react-dom/client";
import singleSpaReact from "single-spa-react";
import App from "./App";
import "./index.css";

// Create Single-SPA lifecycle functions
const lifecycles = singleSpaReact({
    React,
    ReactDOMClient,
    rootComponent: App,
    errorBoundary(err: Error, _info: React.ErrorInfo, _props: Record<string, unknown>) {
        // Customize the error boundary UI
        console.error("[React MFE] Error:", err);
        return (
            <div style={{ padding: "20px", color: "#ff6b6b", background: "#1a1a2e" }}>
                <h2>Something went wrong in the React application</h2>
                <details>
                    <summary>Error details</summary>
                    <pre>{err.message}</pre>
                </details>
            </div>
        );
    },
});

// Export lifecycle methods for Single-SPA
export const { bootstrap, mount, unmount } = lifecycles;

// Also export as default for bundlers that prefer it
export default lifecycles;
