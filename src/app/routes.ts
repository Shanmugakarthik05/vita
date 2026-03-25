import { createBrowserRouter } from "react-router";
import { Layout } from "./components/Layout";
import { Home } from "./components/Home";
import { Login } from "./components/Login";
import { Results } from "./components/Results";
import { EmergencyFlow } from "./components/EmergencyFlow";
import { Dashboard } from "./components/Dashboard";
import { Donors } from "./components/Donors";
import { Inventory } from "./components/Inventory";
import { SOS } from "./components/SOS";
import { Hospitals } from "./components/Hospitals";
import { Admin } from "./components/Admin";

export const router = createBrowserRouter([
  {
    path: "/",
    Component: Layout,
    children: [
      { index: true, Component: Home },
      { path: "login", Component: Login },
      { path: "results", Component: Results },
      { path: "status", Component: EmergencyFlow },
      { path: "dashboard", Component: Dashboard },
      { path: "donors", Component: Donors },
      { path: "inventory", Component: Inventory },
      { path: "sos", Component: SOS },
      { path: "hospitals", Component: Hospitals },
      { path: "admin", Component: Admin },
    ],
  },
]);