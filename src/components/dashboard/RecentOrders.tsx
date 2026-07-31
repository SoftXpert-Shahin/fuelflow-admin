import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { MdArrowForward, MdReceiptLong } from "react-icons/md";
import { getOrders } from "../../services/orders";

export default function RecentOrders() {
    const navigate = useNavigate();
    const [orders, setOrders] = useState<any[]>([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        loadOrders();
    }, []);

    async function loadOrders() {
        setLoading(true);
        try {
            const data = await getOrders();
            setOrders(data.slice(0, 5));
        } finally {
            setLoading(false);
        }
    }

    return (
        <div
            style={{
                background: "linear-gradient(145deg, rgba(17, 24, 39, 0.8) 0%, rgba(10, 14, 23, 0.9) 100%)",
                backdropFilter: "blur(20px)",
                borderRadius: "20px",
                padding: "24px",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
                width: "100%",
                boxSizing: "border-box"
            }}
        >
            <div
                style={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    marginBottom: "20px",
                }}
            >
                <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                    <div
                        style={{
                            width: "36px",
                            height: "36px",
                            borderRadius: "10px",
                            background: "rgba(37, 99, 235, 0.1)",
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            border: "1px solid rgba(37, 99, 235, 0.2)",
                        }}
                    >
                        <MdReceiptLong size={20} color="#60a5fa" />
                    </div>
                    <div>
                        <h2
                            style={{
                                color: "#ffffff",
                                fontSize: "16px",
                                fontWeight: 700,
                                letterSpacing: "-0.01em",
                                margin: "0 0 2px 0",
                            }}
                        >
                            Recent Orders Stream
                        </h2>
                        <p style={{ color: "#94a3b8", fontSize: "12px", margin: 0 }}>
                            Real-time transaction activity feed
                        </p>
                    </div>
                </div>
            </div>

            <div style={{ overflowX: "auto" }}>
                <table
                    style={{
                        width: "100%",
                        borderCollapse: "separate",
                        borderSpacing: "0 8px",
                    }}
                >
                    <thead>
                        <tr>
                            <th style={th}>Order ID</th>
                            <th style={th}>Customer</th>
                            <th style={th}>Fuel Type</th>
                            <th style={th}>Status</th>
                            <th style={th}>Total Amount</th>
                            <th style={{ ...th, textAlign: "right" }}>Actions</th>
                        </tr>
                    </thead>

                    <tbody>
                        {loading ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: "center", padding: "30px", color: "#94a3b8", fontSize: "14px" }}>
                                    Loading live orders telemetry...
                                </td>
                            </tr>
                        ) : orders.length === 0 ? (
                            <tr>
                                <td colSpan={6} style={{ textAlign: "center", padding: "30px", color: "#94a3b8", fontSize: "14px" }}>
                                    No recent orders found.
                                </td>
                            </tr>
                        ) : (
                            orders.map((order) => {
                                const status = (order.status || "").toLowerCase();
                                const badgeStyle = statusBadgeMap[status] || statusBadgeMap.default;

                                return (
                                    <tr
                                        key={order.id}
                                        style={{
                                            background: "rgba(255, 255, 255, 0.02)",
                                            transition: "background 0.2s ease",
                                        }}
                                    >
                                        <td style={{ ...td, fontWeight: 700, color: "#60a5fa" }}>
                                            #{order.id.slice(0, 8).toUpperCase()}
                                        </td>

                                        <td style={{ ...td, fontWeight: 500 }}>
                                            {order.customer?.full_name ?? "Guest User"}
                                        </td>

                                        <td style={td}>
                                            <span style={fuelBadgeStyle}>
                                                {order.fuel_type || "Standard"}
                                            </span>
                                        </td>

                                        <td style={td}>
                                            <span style={{ ...statusBadgeBase, ...badgeStyle }}>
                                                {order.status || "Pending"}
                                            </span>
                                        </td>

                                        <td style={{ ...td, fontWeight: 700, color: "#34d399" }}>
                                            ${order.total_price}
                                        </td>

                                        <td style={{ ...td, textAlign: "right" }}>
                                            <button
                                                onClick={() => navigate(`/admin/orders/${order.id}`)}
                                                style={{
                                                    background: "rgba(37, 99, 235, 0.12)",
                                                    color: "#60a5fa",
                                                    border: "1px solid rgba(59, 130, 246, 0.3)",
                                                    padding: "8px 14px",
                                                    borderRadius: "10px",
                                                    cursor: "pointer",
                                                    fontWeight: 600,
                                                    fontSize: "13px",
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
                            })
                        )}
                    </tbody>
                </table>
            </div>
        </div>
    );
}

const th: React.CSSProperties = {
    color: "#64748b",
    textAlign: "left",
    padding: "12px 16px",
    fontSize: "12px",
    fontWeight: 600,
    textTransform: "uppercase",
    letterSpacing: "0.5px",
    borderBottom: "1px solid rgba(255, 255, 255, 0.05)"
};

const td: React.CSSProperties = {
    color: "#f1f5f9",
    padding: "16px",
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
    on_the_way: {
        background: "rgba(6, 182, 212, 0.15)",
        color: "#22d3ee",
        border: "1px solid rgba(6, 182, 212, 0.3)"
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