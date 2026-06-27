import ReactDOM from "react-dom/client";
import App from "./App";
import "./index.css";

// Note: StrictMode is intentionally omitted — several showcase components run
// requestAnimationFrame loops / IntersectionObservers that double-mount awkwardly
// under StrictMode's dev double-invoke. This is a gallery, not production app code.
ReactDOM.createRoot(document.getElementById("root")!).render(<App />);
