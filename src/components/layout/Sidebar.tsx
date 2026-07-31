import {
    NavLink,
    useNavigate,
} from "react-router-dom";

import {
    MdDashboard,
    MdPeople,
    MdLocalShipping,
    MdPayments,
    MdSettings,
    MdNotifications,
    MdLocalGasStation,
    MdBarChart,
    MdLogout,
    MdLocalOffer,
} from "react-icons/md";

import { supabase } from "../../services/supabase";
import { MdPhotoLibrary } from "react-icons/md";
const menus = [
    {
        name: "Dashboard",
        icon: <MdDashboard size={22} />,
        path: "/admin/dashboard",
    },
    {
        name: "Orders",
        icon: <MdLocalShipping size={22} />,
        path: "/admin/orders",
    },
    {
        name: "Drivers",
        icon: <MdPeople size={22} />,
        path: "/admin/drivers",
    },
    {
        name: "Customers",
        icon: <MdPeople size={22} />,
        path: "/admin/customers",
    },
    {
        name: "Pricing",
        icon: <MdLocalOffer size={22} />,
        path: "/admin/pricing",
    },
    {
        name: "Promotions",
        icon: <MdPhotoLibrary size={22} />,
        path: "/admin/promotions",
    },
    {
        name: "Fuel Stations",
        icon: <MdLocalGasStation size={22} />,
        path: "/admin/stations",
    },
    {
        name: "Payments",
        icon: <MdPayments size={22} />,
        path: "/admin/payments",
    },
    {
        name: "Reports",
        icon: <MdBarChart size={22} />,
        path: "/admin/reports",
    },
    {
        name: "Notifications",
        icon: <MdNotifications size={22} />,
        path: "/admin/notifications",
    },
    {
        name: "Settings",
        icon: <MdSettings size={22} />,
        path: "/admin/settings",
    },
];

export default function Sidebar() {
    const navigate = useNavigate();

    async function logout() {
        await supabase.auth.signOut();
        navigate("/", {
            replace: true,
        });
    }

    return (
        <aside
            style={{
                width: 270,
                height: "100vh",
                position: "fixed",
                left: 0,
                top: 0,
                background: "linear-gradient(180deg, rgba(17, 24, 39, 0.95) 0%, rgba(11, 15, 25, 0.98) 100%)",
                backdropFilter: "blur(20px)",
                borderRight: "1px solid rgba(255, 255, 255, 0.07)",
                display: "flex",
                flexDirection: "column",
                zIndex: 1000,
                boxShadow: "10px 0 30px rgba(0, 0, 0, 0.4)",
            }}
        >
            {/* Logo */}
            <div
                style={{
                    height: 72,
                    display: "flex",
                    alignItems: "center",
                    paddingLeft: 28,
                    borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
                    fontSize: 22,
                    fontWeight: 800,
                    color: "#FFFFFF",
                    letterSpacing: "0.5px",
                    gap: "10px",
                }}
            >
                <div style={{ width: "32px", height: "32px", borderRadius: "8px", background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)", display: "flex", alignItems: "center", justifyContent: "center", boxShadow: "0 4px 12px rgba(37, 99, 235, 0.4)" }}>
                    <MdLocalGasStation size={18} color="#ffffff" />
                </div>
                Fuel<span style={{ background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Flow</span>
            </div>

            {/* Menu Links Container with Scroll Customization */}
            <div
                style={{
                    flex: 1,
                    padding: "16px",
                    overflowY: "auto",
                    scrollbarWidth: "none",
                }}
            >
                {menus.map((menu) => (
                    <NavLink
                        key={menu.path}
                        to={menu.path}
                        style={({ isActive }) => ({
                            display: "flex",
                            alignItems: "center",
                            gap: 14,
                            padding: "13px 16px",
                            marginBottom: 6,
                            borderRadius: 12,
                            textDecoration: "none",
                            color: isActive
                                ? "#FFFFFF"
                                : "#94A3B8",
                            background: isActive
                                ? "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)"
                                : "transparent",
                            fontWeight: isActive ? 600 : 500,
                            fontSize: "14px",
                            boxShadow: isActive ? "0 4px 12px rgba(37, 99, 235, 0.3)" : "none",
                            transition: "all 0.2s ease",
                        })}
                    >
                        {menu.icon}
                        {menu.name}
                    </NavLink>
                ))}
            </div>

            {/* Logout Section */}
            <div
                style={{
                    padding: 16,
                    borderTop: "1px solid rgba(255, 255, 255, 0.07)",
                    background: "rgba(11, 15, 25, 0.5)",
                }}
            >
                <button
                    onClick={logout}
                    style={{
                        width: "100%",
                        height: 46,
                        border: "1px solid rgba(239, 68, 68, 0.3)",
                        borderRadius: 12,
                        cursor: "pointer",
                        background: "rgba(239, 68, 68, 0.1)",
                        color: "#f87171",
                        fontWeight: 600,
                        fontSize: "14px",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        gap: 10,
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.background = "#dc2626";
                        e.currentTarget.style.color = "#ffffff";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.background = "rgba(239, 68, 68, 0.1)";
                        e.currentTarget.style.color = "#f87171";
                    }}
                >
                    <MdLogout size={18} />
                    Logout
                </button>
            </div>
        </aside>
    );
}