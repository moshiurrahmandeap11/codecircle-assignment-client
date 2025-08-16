import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import "./index.css";
import App from "./App.jsx";
import { RouterProvider } from "react-router";
import router from "./route/Router/Router.jsx";
import AuthProvider from "./contexts/AuthProvider/AuthProvider.jsx";
import 'aos/dist/aos.css';
import Aos from "aos";
import { Toaster } from "react-hot-toast";
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';


const queryClient = new QueryClient();

  Aos.init({ duration: 800, once: false });

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <AuthProvider>
      <QueryClientProvider client={queryClient}>

      <RouterProvider router={router}></RouterProvider>
      </QueryClientProvider>
      <Toaster position="top-center" reverseOrder={false} />
    </AuthProvider>
  </StrictMode>
);
