import { useEffect, useState } from "react";
import {
    MdNotifications,
    MdSearch,
    MdCircle,
} from "react-icons/md";

import { supabase } from "../../services/supabase";

export default function Topbar() {
    const [adminName, setAdminName] = useState("Administrator");

    useEffect(() => {
        loadAdmin();
    }, []);

    async function loadAdmin() {
        try {
            const {
                data: { user },
            } = await supabase.auth.getUser();

            if (!user) return;

            const { data } = await supabase
                .from("profiles")
                .select("full_name")
                .eq("id", user.id)
                .single();

            if (data?.full_name) {
                setAdminName(data.full_name);
            }
        } catch (error) {
            console.error("Failed to load admin profile", error);
        }
    }

    const today = new Date().toLocaleDateString(undefined, {
        weekday: "long",
        day: "numeric",
        month: "long",
        year: "numeric",
    });

    return (
        <header
            style={{
                height: "72px",
                position: "sticky",
                top: 0,
                background: "linear-gradient(90deg, rgba(17, 24, 39, 0.95) 0%, rgba(11, 15, 25, 0.98) 100%)",
                backdropFilter: "blur(20px)",
                borderBottom: "1px solid rgba(255, 255, 255, 0.07)",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                padding: "0 32px",
                zIndex: 900,
                boxShadow: "0 10px 30px rgba(0, 0, 0, 0.3)",
                boxSizing: "border-box",
            }}
        >
            {/* Left Section */}
            <div>
                <h2
                    style={{
                        margin: 0,
                        color: "#FFFFFF",
                        fontSize: "20px",
                        fontWeight: 800,
                        letterSpacing: "-0.01em",
                    }}
                >
                    FuelFlow <span style={{ background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Admin</span>
                </h2>

                <p
                    style={{
                        margin: "3px 0 0",
                        color: "#94A3B8",
                        fontSize: "13px",
                        fontWeight: 500,
                    }}
                >
                    {today}
                </p>
            </div>

            {/* Right Section */}
            <div
                style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "20px",
                }}
            >
                {/* Search Bar */}
                <div
                    style={{
                        width: "280px",
                        height: "42px",
                        background: "rgba(17, 24, 39, 0.8)",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        display: "flex",
                        alignItems: "center",
                        paddingInline: "14px",
                        gap: "10px",
                        transition: "all 0.2s ease",
                    }}
                >
                    <MdSearch
                        color="#94A3B8"
                        size={18}
                    />

                    <input
                        placeholder="Search system..."
                        style={{
                            flex: 1,
                            border: "none",
                            outline: "none",
                            background: "transparent",
                            color: "#FFFFFF",
                            fontSize: "14px",
                            fontFamily: "'Inter', system-ui, sans-serif",
                        }}
                    />
                </div>

                {/* Notifications Button */}
                <button
                    style={{
                        width: "42px",
                        height: "42px",
                        borderRadius: "12px",
                        border: "1px solid rgba(255, 255, 255, 0.08)",
                        background: "rgba(17, 24, 39, 0.8)",
                        color: "#FFFFFF",
                        cursor: "pointer",
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        transition: "all 0.2s ease",
                    }}
                    onMouseEnter={(e) => {
                        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.4)";
                        e.currentTarget.style.background = "rgba(37, 99, 235, 0.15)";
                    }}
                    onMouseLeave={(e) => {
                        e.currentTarget.style.borderColor = "rgba(255, 255, 255, 0.08)";
                        e.currentTarget.style.background = "rgba(17, 24, 39, 0.8)";
                    }}
                >
                    <MdNotifications size={18} />
                </button>

                {/* Admin Profile Details */}
                <div
                    style={{
                        display: "flex",
                        alignItems: "center",
                        gap: "12px",
                        paddingLeft: "8px",
                        borderLeft: "1px solid rgba(255, 255, 255, 0.07)",
                    }}
                >
                    <img
                        src="https://i.pravatar.cc/150"
                        alt="Admin"
                        style={{
                            width: "40px",
                            height: "40px",
                            borderRadius: "50%",
                            border: "2px solid rgba(59, 130, 246, 0.3)",
                            objectFit: "cover",
                        }}
                    />

                    <div>
                        <div
                            style={{
                                color: "#FFFFFF",
                                fontWeight: 700,
                                fontSize: "13px",
                                letterSpacing: "-0.01em",
                            }}
                        >
                            {adminName}
                        </div>

                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: "5px",
                                color: "#4ade80",
                                fontSize: "11px",
                                fontWeight: 600,
                                marginTop: "2px",
                            }}
                        >
                            <MdCircle size={8} />
                            Online
                        </div>
                    </div>
                </div>
            </div>
        </header>
    );
}