import { Routes, Route, Navigate } from "react-router-dom";

import Login from "../pages/Login";
import Dashboard from "../pages/Dashboard";
import Orders from "../pages/Orders";
 import Drivers from "../pages/Drivers";
import Customers from "../pages/Customers";
import FuelStations from "../pages/FuelStations";
import Payments from "../pages/Payments";
import Reports from "../pages/Reports";
import Notifications from "../pages/Notifications";
import Settings from "../pages/Settings";
import OrderDetails from "../pages/OrderDetails";
import AdminLayout from "../components/layout/AdminLayout";
import ProtectedRoute from "./ProtectedRoute";
import Pricing from "../pages/Pricing";
import Promotions from "../pages/Promotions";
export default function AppRoutes() {
    return (
        <Routes>

            {/* Login */}
            <Route
                path="/"
                element={<Login />}
            />

            {/* Admin */}
            <Route
                path="/admin"
                element={
                    <ProtectedRoute>
                        <AdminLayout />
                    </ProtectedRoute>
                }
            >

                {/* Default */}
                <Route
                    index
                    element={
                        <Navigate
                            to="dashboard"
                            replace
                        />
                    }
                />

                {/* Dashboard */}
                <Route
                    path="dashboard"
                    element={<Dashboard />}
                />

                {/* Orders */}
                <Route
                    path="orders"
                    element={<Orders />}
                />
                <Route
    path="orders/:id"
    element={<OrderDetails />}
/>

                {/* Customers */}
                <Route
                    path="customers"
                    element={<Customers />}
                />

                {/* Drivers */}
                <Route
                    path="drivers"
                    element={<Drivers />}
                />

                {/* Fuel Stations */}
                <Route
                    path="stations"
                    element={<FuelStations />}
                />
<Route
    path="promotions"
    element={<Promotions />}
/>

                 {/* payments */}

                     <Route
                    path="payments"
                    element={<Payments />}
                />

                 {/* Reports */}

                 <Route
                    path="reports"
                    element={<Reports />}
                />
                {/* Notifications */}
                <Route
                    path="notifications"
                    element={<Notifications />}
                />
 
                {/* Settings */}
                <Route
                    path="settings"
                    element={<Settings />}
                />



    <Route path="pricing" element={<Pricing />} />


            </Route>

            {/* 404 */}
            <Route
                path="*"
                element={
                    <Navigate
                        to="/"
                        replace
                    />
                }
            />
      

        </Routes>
    );
}