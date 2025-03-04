import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.tsx";
import SocketProvider from "./context/socket.tsx";
import { Toaster } from "react-hot-toast";

createRoot(document.getElementById("root")!).render(
  <SocketProvider>
    <Toaster />
    <App />
  </SocketProvider>
);
