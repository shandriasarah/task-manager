import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.jsx";
import TaskPages from "./pages/TaskPages.jsx";
import AuthGate from "./componentes/AuthGate.jsx";
import "./index.css";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <AuthGate>
        <App />
      </AuthGate>
    ),
  },
  {
    path: "/tasks",
    element: (
      <AuthGate>
        <TaskPages />
      </AuthGate>
    ),
  },
]);

createRoot(document.getElementById("root")).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>,
);
