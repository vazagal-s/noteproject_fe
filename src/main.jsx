import './resources/style.css'
import javascriptLogo from './resources/javascript.svg'
import viteLogo from '/vite.svg'
import n4wLogo from '/n4w.png'
import { setupCounter } from './components/counter.js'


import React from "react";
import ReactDOM from "react-dom/client";
import App from "./App";
import { AuthProvider } from "./contexts/AuthContext";

ReactDOM.createRoot(document.getElementById("root")).render(
  <AuthProvider>
    <App />
  </AuthProvider>
);