import React from "react";
import ReactDOM from "react-dom/client";
import { BrowserRouter } from "react-router-dom";
import App from "./App";
import "./index.css";
import { ToastContainer } from "react-toastify";
import { LoaderProvider } from "./context/LoaderContext";
import "slick-carousel/slick/slick.css"; 
import "slick-carousel/slick/slick-theme.css";

document.title = import.meta.env.VITE_APP_NAME || "Default Title";

ReactDOM.createRoot(document.getElementById("root")!).render(
  <React.StrictMode>
    <BrowserRouter>
    <LoaderProvider>

          <ToastContainer position="top-right" autoClose={3000} style={{zIndex:'1000000'}} />
      <App />
    </LoaderProvider>
    </BrowserRouter>
  </React.StrictMode>
);
