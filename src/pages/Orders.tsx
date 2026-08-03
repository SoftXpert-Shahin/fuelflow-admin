import { useEffect, useMemo, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdSearch, MdFilterList, MdArrowForward, MdReceipt } from "react-icons/md";
import { getOrders, subscribeOrders } from "../services/orders";

export default function Orders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    const [search, setSearch] = useState("");
    const [status, setStatus] = useState("all");

    useEffect(() => {
        loadOrders();
        const unsubscribe = subscribeOrders(loadOrders);
        return unsubscribe;
    }, [search, status]);

    async function loadOrders() {
        setLoading(true);
        try {
            const data = await getOrders(status);
            setOrders(data);
        } finally {
            setLoading(false);
        }
    }

    const total = useMemo(() => orders.length, [orders]);

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
            {/* Header / Controls Area */}
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
                <div>
                    <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 6px 0", color: "#ffffff" }}>
                        Enterprise <span style={{ background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Orders Management</span>
                    </h1>
                    <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                        Active Telemetry & Live Subscription Stream • <strong style={{ color: "#60a5fa" }}>Total Records: {total}</strong>
                    </p>
                </div>

                <div
                    style={{
                        display: "flex",
                        gap: "12px",
                        flexWrap: "wrap"
                    }}
                >
                    {/* Search Input Container */}
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <MdSearch size={18} color="#64748b" style={{ position: "absolute", left: "14px" }} />
                        <input
                            placeholder="Search Order ID / Customer..."
                            value={search}
                            onChange={(e) => setSearch(e.target.value)}
                            style={{
                                width: "260px",
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

                    {/* Status Dropdown Container */}
                    <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                        <MdFilterList size={16} color="#64748b" style={{ position: "absolute", left: "14px", pointerEvents: "none" }} />
                        <select
                            value={status}
                            onChange={(e) => setStatus(e.target.value)}
                            style={{
                                padding: "10px 16px 10px 38px",
                                borderRadius: "12px",
                                border: "1px solid rgba(255, 255, 255, 0.08)",
                                background: "rgba(17, 24, 39, 0.75)",
                                backdropFilter: "blur(12px)",
                                color: "#ffffff",
                                fontSize: "13px",
                                fontWeight: 500,
                                outline: "none",
                                cursor: "pointer",
                                appearance: "none"
                            }}
                        >
                            <option value="all" style={{ background: "#111827" }}>Filter: All Status</option>
                            <option value="pending" style={{ background: "#111827" }}>Pending</option>
                            <option value="accepted" style={{ background: "#111827" }}>Accepted</option>
                            <option value="arrived" style={{ background: "#111827" }}>Arrived</option>
                            <option value="delivering" style={{ background: "#111827" }}>Delivering</option>
                            <option value="waiting_confirmation" style={{ background: "#111827" }}>Waiting Confirmation</option>
                            <option value="completed" style={{ background: "#111827" }}>Completed</option>
                            <option value="cancelled" style={{ background: "#111827" }}>Cancelled</option>
                        </select>
                    </div>
                </div>
            </div>

            {/* Table Card Wrapper */}
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
                {loading ? (
                    <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                        <div style={{
                            width: "36px",
                            height: "36px",
                            border: "3px solid rgba(37, 99, 235, 0.2)",
                            borderTop: "3px solid #3b82f6",
                            borderRadius: "50%",
                            animation: "spin 0.8s linear infinite",
                            margin: "0 auto 12px auto"
                        }}></div>
                        <p style={{ fontSize: "14px", fontWeight: 500 }}>Synchronizing master orders ledger...</p>
                    </div>
                ) : orders.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "60px", color: "#94a3b8" }}>
                        <MdReceipt size={40} color="#334155" style={{ marginBottom: "10px" }} />
                        <p style={{ fontSize: "15px", fontWeight: 600, color: "#cbd5e1", margin: "0 0 4px 0" }}>No orders matching parameters</p>
                        <p style={{ fontSize: "13px", margin: 0 }}>Try modifying your search criteria or clearing filter options.</p>
                    </div>
                ) : (
                    <div style={{ overflowX: "auto" }}>
                        <table
                            style={{
                                width: "100%",
                                borderCollapse: "separate",
                                borderSpacing: "0 4px",
                            }}
                        >
                            <thead
                                style={{
                                    background: "rgba(255, 255, 255, 0.02)",
                                }}
                            >
                                <tr>
                                    <th style={th}>Order ID</th>
                                    <th style={th}>Customer</th>
                                    <th style={th}>Assigned Driver</th>
                                    <th style={th}>Fuel Type</th>
                                    <th style={th}>Volume</th>
                                    <th style={th}>Total Amount</th>
                                    <th style={th}>Status</th>
                                    <th style={th}>Timestamp</th>
                                    <th style={{ ...th, textAlign: "right" }}>Actions</th>
                                </tr>
                            </thead>

                            <tbody>
                                {orders.map((order) => {
                                    const statusKey = (order.status || "").toLowerCase();
                                    const badgeStyle = statusBadgeMap[statusKey] || statusBadgeMap.default;

                                    return (
                                        <tr
                                            key={order.id}
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
                                            <td style={{ ...td, fontWeight: 700, color: "#60a5fa" }}>
                                                #{order.id.slice(0, 8).toUpperCase()}
                                            </td>

                                            <td style={{ ...td, fontWeight: 500 }}>
                                                {order.customer?.full_name ?? "Guest Customer"}
                                            </td>

                                            <td style={td}>
                                                <span style={{ color: order.driver?.full_name ? "#f1f5f9" : "#64748b", fontStyle: order.driver?.full_name ? "normal" : "italic" }}>
                                                    {order.driver?.full_name ?? "Unassigned"}
                                                </span>
                                            </td>

                                            <td style={td}>
                                                <span style={fuelBadgeStyle}>
                                                    {order.fuel_type || "Standard"}
                                                </span>
                                            </td>

                                            <td style={{ ...td, fontWeight: 600 }}>
                                                {order.liters} L
                                            </td>

                                            <td style={{ ...td, fontWeight: 700, color: "#34d399" }}>
                                                ${order.total_price}
                                            </td>

                                            <td style={td}>
                                                <span style={{ ...statusBadgeBase, ...badgeStyle }}>
                                                    {order.status || "Pending"}
                                                </span>
                                            </td>

                                            <td style={{ ...td, color: "#94a3b8", fontSize: "13px" }}>
                                                {new Date(order.created_at).toLocaleDateString("en-US", {
                                                    month: "short",
                                                    day: "numeric",
                                                    year: "numeric"
                                                })}
                                            </td>

                                            <td style={{ ...td, textAlign: "right" }}>
                                                <button
                                                    onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                    style={{
                                                        background: "rgba(37, 99, 235, 0.12)",
                                                        color: "#60a5fa",
                                                        border: "1px solid rgba(59, 130, 246, 0.3)",
                                                        padding: "7px 14px",
                                                        borderRadius: "10px",
                                                        cursor: "pointer",
                                                        fontWeight: 600,
                                                        fontSize: "12px",
                                                        display: "inline-flex",
                                                        alignItems: "center",
                                                        gap: "6px",
                                                        transition: "all 0.2s ease",
                                                    }}
                                                    onMouseEnter={(e) => {
                                                        e.currentTarget.style.background = "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)";
                                                        e.currentTarget.style.color = "#ffffff";
                                                        e.currentTarget.style.borderColor = "#2563eb";
                                                    }}
                                                    onMouseLeave={(e) => {
                                                        e.currentTarget.style.background = "rgba(37, 99, 235, 0.12)";
                                                        e.currentTarget.style.color = "#60a5fa";
                                                        e.currentTarget.style.borderColor = "rgba(59, 130, 246, 0.3)";
                                                    }}
                                                >
                                                    <span>View</span>
                                                    <MdArrowForward size={14} />
                                                </button>
                                            </td>
                                        </tr>
                                    );
                                })}
                            </tbody>
                        </table>
                    </div>
                )}
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

const statusBadgeMap: Record<string, React.CSSProperties> = {
    pending: {
        background: "rgba(245, 158, 11, 0.15)",
        color: "#fbbf24",
        border: "1px solid rgba(245, 158, 11, 0.3)"
    },
    accepted: {
        background: "rgba(37, 99, 235, 0.15)",
        color: "#60a5fa",
        border: "1px solid rgba(37, 99, 235, 0.3)"
    },
    arrived: {
        background: "rgba(6, 182, 212, 0.15)",
        color: "#22d3ee",
        border: "1px solid rgba(6, 182, 212, 0.3)"
    },
    delivering: {
        background: "rgba(14, 165, 233, 0.15)",
        color: "#38bdf8",
        border: "1px solid rgba(14, 165, 233, 0.3)"
    },
    waiting_confirmation: {
        background: "rgba(168, 85, 247, 0.15)",
        color: "#c084fc",
        border: "1px solid rgba(168, 85, 247, 0.3)"
    },
    completed: {
        background: "rgba(22, 163, 74, 0.15)",
        color: "#4ade80",
        border: "1px solid rgba(22, 163, 74, 0.3)"
    },
    cancelled: {
        background: "rgba(220, 38, 38, 0.15)",
        color: "#f87171",
        border: "1px solid rgba(220, 38, 38, 0.3)"
    },
    default: {
        background: "rgba(148, 163, 184, 0.15)",
        color: "#cbd5e1",
        border: "1px solid rgba(148, 163, 184, 0.3)"
    }
};

const fuelBadgeStyle: React.CSSProperties = {
    background: "rgba(255, 255, 255, 0.04)",
    color: "#cbd5e1",
    padding: "4px 8px",
    borderRadius: "6px",
    fontSize: "12px",
    fontWeight: 500,
    border: "1px solid rgba(255, 255, 255, 0.06)"
};
