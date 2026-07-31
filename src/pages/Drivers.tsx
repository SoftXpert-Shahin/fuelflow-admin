import { useEffect, useState } from "react";
import { MdDirectionsCar, MdSearch, MdGroup } from "react-icons/md";
import { getDrivers } from "../services/drivers";

export default function Drivers() {
    const [drivers, setDrivers] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);
    const [search, setSearch] = useState("");

    useEffect(() => {
        loadDrivers();
    }, []);

    async function loadDrivers() {
        setLoading(true);
        try {
            const data = await getDrivers();
            setDrivers(data);
        } finally {
            setLoading(false);
        }
    }

    const filtered = drivers.filter((driver) => {
        const keyword = search.toLowerCase();
        return (
            driver.full_name?.toLowerCase().includes(keyword) ||
            driver.phone?.toLowerCase().includes(keyword) ||
            driver.email?.toLowerCase().includes(keyword)
        );
    });

    return (
        <div
            style={{
                padding: "32px 40px",
                minHeight: "100vh",
                background: "radial-gradient(circle at top left, #0b0f19 0%, #030712 60%, #000000 100%)",
                fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
                color: "#f8fafc",
                boxSizing: "border-box"
            }}
        >
            {/* Header & Controls Section */}
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "flex-end",
                    marginBottom: "32px",
                    flexWrap: "wrap",
                    gap: "16px"
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "16px" }}>
                    <div
                        style={{
                            width: "52px",
                            height: "52px",
                            borderRadius: "16px",
                            background: "rgba(37, 99, 235, 0.12)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid rgba(59, 130, 246, 0.25)",
                            boxShadow: "inset 0 1px 1px rgba(255, 255, 255, 0.1)"
                        }}
                    >
                        <MdGroup size={26} color="#60a5fa" />
                    </div>
                    <div>
                        <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 4px 0", color: "#ffffff" }}>
                            Drivers Directory
                        </h1>
                        <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                            Fleet operational telemetry • <strong style={{ color: "#60a5fa" }}>Total Active: {filtered.length}</strong>
                        </p>
                    </div>
                </div>

                {/* Search Input Container */}
                <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                    <MdSearch size={18} color="#64748b" style={{ position: "absolute", left: "14px" }} />
                    <input
                        placeholder="Search driver by name, phone..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                        style={{
                            width: "280px",
                            padding: "10px 14px 10px 42px",
                            borderRadius: "12px",
                            border: "1px solid rgba(255, 255, 255, 0.08)",
                            background: "rgba(17, 24, 39, 0.75)",
                            backdropFilter: "blur(12px)",
                            color: "#ffffff",
                            fontSize: "13px",
                            outline: "none",
                            transition: "all 0.2s ease",
                        }}
                    />
                </div>
            </div>

            {/* Table Card Container */}
            <div
                style={{
                    background: "linear-gradient(145deg, rgba(17, 24, 39, 0.75) 0%, rgba(11, 15, 25, 0.85) 100%)",
                    backdropFilter: "blur(20px)",
                    borderRadius: "20px",
                    border: "1px solid rgba(255, 255, 255, 0.07)",
                    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
                    overflow: "hidden"
                }}
            >
                <div style={{ overflowX: "auto" }}>
                    <table
                        style={{
                            width: "100%",
                            borderCollapse: "separate",
                            borderSpacing: "0 4px",
                        }}
                    >
                        <thead>
                            <tr style={{ background: "rgba(255, 255, 255, 0.02)" }}>
                                <th style={th}>Driver Profile</th>
                                <th style={th}>Phone Number</th>
                                <th style={th}>Email Address</th>
                                <th style={th}>Connection Status</th>
                            </tr>
                        </thead>

                        <tbody>
                            {loading ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                                        <div style={{
                                            width: "36px",
                                            height: "36px",
                                            border: "3px solid rgba(37, 99, 235, 0.2)",
                                            borderTop: "3px solid #3b82f6",
                                            borderRadius: "50%",
                                            animation: "spin 0.8s linear infinite",
                                            margin: "0 auto 12px auto"
                                        }}></div>
                                        <p style={{ fontSize: "14px", fontWeight: 500 }}>Synchronizing active drivers telemetry...</p>
                                    </td>
                                </tr>
                            ) : filtered.length === 0 ? (
                                <tr>
                                    <td colSpan={4} style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                                        <MdDirectionsCar size={40} color="#334155" style={{ marginBottom: "10px" }} />
                                        <p style={{ fontSize: "15px", fontWeight: 600, color: "#cbd5e1", margin: "0 0 4px 0" }}>No drivers matching query</p>
                                        <p style={{ fontSize: "13px", margin: 0 }}>Try adjusting your search filters.</p>
                                    </td>
                                </tr>
                            ) : (
                                filtered.map((driver) => {
                                    const isOnline = driver.is_online;
                                    const badgeStyle = isOnline ? onlineBadgeStyle : offlineBadgeStyle;

                                    return (
                                        <tr
                                            key={driver.id}
                                            style={{
                                                transition: "background 0.2s ease",
                                            }}
                                            onMouseEnter={(e) => {
                                                e.currentTarget.style.background = "rgba(255, 255, 255, 0.03)";
                                            }}
                                            onMouseLeave={(e) => {
                                                e.currentTarget.style.background = "transparent";
                                            }}
                                        >
                                            <td style={td}>
                                                <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                                    <div
                                                        style={{
                                                            width: "42px",
                                                            height: "42px",
                                                            borderRadius: "12px",
                                                            background: "rgba(37, 99, 235, 0.12)",
                                                            border: "1px solid rgba(59, 130, 246, 0.25)",
                                                            display: "flex",
                                                            justifyContent: "center",
                                                            alignItems: "center",
                                                        }}
                                                    >
                                                        <MdDirectionsCar color="#60a5fa" size={20} />
                                                    </div>
                                                    <span style={{ fontWeight: 600, color: "#f1f5f9" }}>
                                                        {driver.full_name || "Unnamed Driver"}
                                                    </span>
                                                </div>
                                            </td>

                                            <td style={{ ...td, color: "#cbd5e1" }}>
                                                {driver.phone || "-"}
                                            </td>

                                            <td style={{ ...td, color: "#cbd5e1" }}>
                                                {driver.email || "-"}
                                            </td>

                                            <td style={td}>
                                                <span style={{ ...statusBadgeBase, ...badgeStyle }}>
                                                    {isOnline ? "Online" : "Offline"}
                                                </span>
                                            </td>
                                        </tr>
                                    );
                                })
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}

const th: React.CSSProperties = {
    padding: "14px 16px",
    textAlign: "left",
    color: "#64748b",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
};

const td: React.CSSProperties = {
    padding: "16px",
    color: "#f1f5f9",
    fontSize: "14px",
    borderTop: "1px solid rgba(255, 255, 255, 0.03)",
    borderBottom: "1px solid rgba(255, 255, 255, 0.03)"
};

const statusBadgeBase: React.CSSProperties = {
    display: "inline-block",
    padding: "4px 10px",
    borderRadius: "6px",
    fontSize: "11px",
    fontWeight: 700,
    textTransform: "uppercase",
    letterSpacing: "0.5px"
};

const onlineBadgeStyle: React.CSSProperties = {
    background: "rgba(22, 163, 74, 0.15)",
    color: "#4ade80",
    border: "1px solid rgba(22, 163, 74, 0.3)"
};

const offlineBadgeStyle: React.CSSProperties = {
    background: "rgba(100, 116, 139, 0.15)",
    color: "#94a3b8",
    border: "1px solid rgba(100, 116, 139, 0.3)"
};