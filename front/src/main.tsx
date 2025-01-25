import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import App from "./App.tsx";
import { createBrowserRouter, RouterProvider } from "react-router-dom";
import LocationForm from "./pages/LocationForm.tsx";
import ParametersForm from "./pages/ParametersForm.tsx";
import HeatMapPage from "./pages/HeatMapPage.tsx";
import Navbar from "./components/NavBar.tsx";

const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },
  {
    path: "/location",
    element: (
      <>
        <Navbar />
        <LocationForm />
      </>
    ),
  },
  {
    path: "/parameters",
    element: <ParametersForm />,
  },
  {
    path: "/heatmap",
    element: (
      <>
        <Navbar />
        <HeatMapPage />
      </>
    ),
  },
]);

createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <RouterProvider router={router} />
  </StrictMode>
);
