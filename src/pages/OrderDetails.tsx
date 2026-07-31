import { useEffect, useState, type CSSProperties } from "react";
import { useNavigate, useParams } from "react-router-dom";
import {
    MdArrowBack,
    MdLocalShipping,
    MdPerson,
    MdDirectionsCar,
    MdLocationOn,
    MdPayments,
    MdCheckCircle,
    MdOutlineEmail,
    MdOutlinePhone,
    MdOutlineBadge,
     
} from "react-icons/md";
import { getOrderDetails, updateOrderStatus } from "../services/orders";

const orderTimeline = [
    {
        key: "pending",
        title: "Order Created",
        field: "created_at",
    },
    {
        key: "accepted",
        title: "Driver Accepted",
        field: "accepted_at",
    },
    {
        key: "arrived",
        title: "Driver Arrived",
        field: "arrived_at",
    },
    {
        key: "delivering",
        title: "Delivery Started",
        field: "delivery_started_at",
    },
    {
        key: "waiting_confirmation",
        title: "Waiting Customer Confirmation",
        field: "customer_confirmation_requested_at",
    },
    {
        key: "completed",
        title: "Completed",
        field: "completed_at",
    },
    {
        key: "cancelled",
        title: "Cancelled",
        field: "cancelled_at",
    },
];

function StatusBadge({
    status,
}: {
    status: string;
}) {

    const colors: Record<string, string> = {
        pending: "#F59E0B",
        accepted: "#2563EB",
        arrived: "#8B5CF6",
        delivering: "#06B6D4",
        waiting_confirmation: "#F97316",
        completed: "#16A34A",
        cancelled: "#DC2626",
    };

    return (

        <span
            style={{
                background: colors[status] || "#374151",
                color: "white",
                padding: "8px 16px",
                borderRadius: 30,
                fontWeight: 700,
                fontSize: 14,
                textTransform: "capitalize",
            }}
        >
            {status.replaceAll("_", " ")}
        </span>

    );

}

export default function OrderDetails() {
    const { id } = useParams();
    const navigate = useNavigate();
    const [order, setOrder] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [actionLoading, setActionLoading] = useState<string | null>(null);

    useEffect(() => {
        loadOrder();
    }, [id]);

    async function loadOrder() {
        if (!id) return;
        setLoading(true);
        try {
            const data = await getOrderDetails(id);
            setOrder(data);
        } finally {
            setLoading(false);
        }
    }

    function getAvatar(name?: string, avatar?: string) {
        if (avatar) return avatar;
        return `https://ui-avatars.com/api/?background=1d4ed8&color=ffffff&size=128&bold=true&name=${encodeURIComponent(
            name || "User"
        )}`;
    }

    async function changeStatus(
        status: string,
    ) {

        if (!id) return;

        const ok = window.confirm(
            `Change order status to "${status.replaceAll("_", " ")}"?`
        );

        if (!ok) return;

        try {
            setActionLoading(status);
            await updateOrderStatus(
                id,
                status,
            );
            await loadOrder();
        } finally {
            setActionLoading(null);
        }

    }

    if (loading) {
        return (
            <div style={styles.centerScreen}>
                <div style={styles.spinnerWrapper}>
                    <div style={styles.spinner}></div>
                    <p style={styles.loadingText}>Loading Enterprise Data...</p>
                </div>
            </div>
        );
    }

    if (!order) {
        return (
            <div style={styles.centerScreen}>
                <div style={styles.emptyCard}>
                    <h2 style={{ color: "#ffffff", marginBottom: "8px" }}>Order Not Found</h2>
                    <p style={{ color: "#94a3b8", marginBottom: "20px" }}>The requested record does not exist or was removed.</p>
                    <button onClick={() => navigate(-1)} style={styles.primaryButton}>
                        <MdArrowBack size={18} /> Return Back
                    </button>
                </div>
            </div>
        );
    }

    // const currentStatus = order.status?.toLowerCase();

    return (
        <div style={styles.container}>
            {/* Top Navigation & Header Bar */}
            <div style={styles.headerBar}>
                <button 
                    onClick={() => navigate(-1)} 
                    style={styles.backButton}
                    onMouseEnter={(e) => Object.assign(e.currentTarget.style, styles.backButtonHover)}
                    onMouseLeave={(e) => Object.assign(e.currentTarget.style, styles.backButton)}
                >
                    <MdArrowBack size={18} />
                    <span>Back to Orders</span>
                </button>

                <div style={styles.headerMeta}>
                    <div style={styles.badgeWrapper}>
                        <span style={styles.liveIndicator}></span>
                        <span style={styles.statusBadgeText}>{order.status || "Pending"}</span>
                    </div>
                </div>
            </div>

            <div style={styles.titleSection}>
                <div>
                    <h1 style={styles.mainTitle}>
                        Order <span style={styles.gradientText}>#{order.id.slice(0, 8).toUpperCase()}</span>
                    </h1>
                    <p style={styles.subtitle}>Comprehensive tracking, client details, and logistical telemetry.</p>
                </div>
            </div>

            {/* Main Content Grid */}
            <div style={styles.grid}>
                {/* Customer Information Card */}
                <Card title="Customer Profile" icon={<MdPerson color="#3b82f6" />}>
                    <div style={styles.profileHeader}>
                        <img
                            src={getAvatar(order.customer?.full_name, order.customer?.avatar_url)}
                            alt=""
                            style={styles.avatar}
                        />
                        <div>
                            <h3 style={styles.profileName}>{order.customer?.full_name || "Guest Customer"}</h3>
                            <span style={styles.roleBadge}>Client Account</span>
                        </div>
                    </div>
                    <div style={styles.infoList}>
                        <Info icon={<MdOutlinePhone color="#60a5fa" />} label="Phone" value={order.customer?.phone} />
                        <Info icon={<MdOutlineEmail color="#60a5fa" />} label="Email" value={order.customer?.email} />
                    </div>
                </Card>

                {/* Driver Information Card */}
                <Card title="Assigned Driver" icon={<MdDirectionsCar color="#3b82f6" />}>
                    <div style={styles.profileHeader}>
                        <img
                            src={getAvatar(order.driver?.full_name, order.driver?.avatar_url)}
                            alt=""
                            style={styles.avatar}
                        />
                        <div>
                            <h3 style={styles.profileName}>{order.driver?.full_name || "Unassigned Fleet"}</h3>
                            <span style={styles.roleBadge}>Logistics Operator</span>
                        </div>
                    </div>
                    <div style={styles.infoList}>
                        <Info icon={<MdOutlinePhone color="#60a5fa" />} label="Phone" value={order.driver?.phone} />
                        <Info icon={<MdOutlineEmail color="#60a5fa" />} label="Email" value={order.driver?.email} />
                    </div>
                </Card>

                {/* Order Information Card */}
                <Card title="Order Specifications" icon={<MdLocalShipping color="#3b82f6" />}>
                    <div style={styles.infoList}>
                        <Info icon={<MdLocalShipping color="#60a5fa" />} label="Fuel Type" value={order.fuel_type} />
                        <Info icon={<MdOutlineBadge color="#60a5fa" />} label="Quantity" value={`${order.liters} Liters`} highlight />
                        <Info icon={<MdPayments color="#60a5fa" />} label="Payment" value={order.payment_method} />
                        <Info icon={<MdPayments color="#34d399" />} label="Total Price" value={`$${order.total_price}`} isPrice />
                        <div
                            style={{
                                display: "flex",
                                alignItems: "center",
                                gap: 12,
                                marginTop: 15,
                            }}>

                            <MdCheckCircle
                                color="white"
                                size={20}
                            />

                            <strong
                                style={{
                                    color: "white",
                                }}
                            >
                                Status
                            </strong>

                            <StatusBadge
                                status={order.status}
                            />
                        </div>
                    </div>
                </Card>

                {/* Delivery Telemetry Card */}
                <Card title="Destination Telemetry" icon={<MdLocationOn color="#3b82f6" />}>
                    <div style={styles.infoList}>
                        <Info icon={<MdLocationOn color="#f43f5e" />} label="Address" value={order.address} />
                        <Info icon={<MdLocationOn color="#60a5fa" />} label="Latitude" value={order.latitude} />
                        <Info icon={<MdLocationOn color="#60a5fa" />} label="Longitude" value={order.longitude} />
                    </div>
                </Card>
            </div>

            {/* Sticky Action Toolbar */}
            <div style={styles.actionToolbar}>
                <div style={styles.toolbarLabel}>
                    <span style={{ color: "#94a3b8", fontSize: "13px", fontWeight: 600, textTransform: "uppercase", letterSpacing: "0.5px" }}>
                        Update State:
                    </span>
                </div>
                <div
                    style={{
                        display: "flex",
                        gap: 12,
                        flexWrap: "wrap",
                        marginTop: 30,
                    }}>

                    {order.status === "pending" && (

                        <ActionButton
                            title="Accept Order"
                            color="#2563EB"
                            onClick={() =>
                                changeStatus("accepted")
                            }
                            loading={actionLoading === "accepted"}
                        />

                    )}

                    {order.status === "accepted" && (

                        <ActionButton
                            title="Driver Arrived"
                            color="#8B5CF6"
                            onClick={() =>
                                changeStatus("arrived")
                            }
                            loading={actionLoading === "arrived"}
                        />

                    )}

                    {order.status === "arrived" && (

                        <ActionButton
                            title="Start Delivery"
                            color="#06B6D4"
                            onClick={() =>
                                changeStatus("delivering")
                            }
                            loading={actionLoading === "delivering"}
                        />

                    )}

                    {order.status === "delivering" && (

                        <ActionButton
                            title="Waiting Confirmation"
                            color="#F97316"
                            onClick={() =>
                                changeStatus(
                                    "waiting_confirmation"
                                )
                            }
                            loading={actionLoading === "waiting_confirmation"}
                        />

                    )}

                    {order.status ===
                        "waiting_confirmation" && (

                        <ActionButton
                            title="Complete Order"
                            color="#16A34A"
                            onClick={() =>
                                changeStatus("completed")
                            }
                            loading={actionLoading === "completed"}
                        />

                    )}

                    {order.status !== "completed" &&
                        order.status !== "cancelled" && (

                            <ActionButton
                                title="Cancel Order"
                                color="#DC2626"
                                onClick={() =>
                                    changeStatus("cancelled")
                                }
                                loading={actionLoading === "cancelled"}
                            />

                    )}
                </div>
            </div>

            <Timeline order={order} />
        </div>
    );
}

function Card({ title, icon, children }: any) {
    return (
        <div style={styles.card}>
            <div style={styles.cardHeader}>
                <div style={styles.cardIconWrapper}>{icon}</div>
                <h3 style={styles.cardTitle}>{title}</h3>
            </div>
            {children}
        </div>
    );
}

function Info({ icon, label, value, highlight, isPrice }: any) {
    return (
        <div style={styles.infoRow}>
            <div style={styles.infoLabelGroup}>
                <span style={styles.infoIconBox}>{icon}</span>
                <span style={styles.infoLabelText}>{label}:</span>
            </div>
            <span style={{
                ...styles.infoValueText,
                ...(highlight ? styles.highlightText : {}),
                ...(isPrice ? styles.priceText : {})
            }}>
                {value ?? "—"}
            </span>
        </div>
    );
}

function ActionButton({ title, color, onClick, loading }: any) {
    return (
        <button
            onClick={onClick}
            disabled={loading}
            style={{
                ...styles.actionBtn,
                background: color,
                opacity: loading ? 0.7 : 1,
            }}
        >
            {loading ? <span style={styles.btnSpinner}></span> : null}
            <span>{title}</span>
        </button>
    );
}

function Timeline({
    order,
}: {
    order: any;
}) {
    return (
        <div
            style={{
                background: "#111827",
                borderRadius: 14,
                padding: 24,
                marginTop: 30,
            }}
        >
            <h2
                style={{
                    color: "white",
                    marginTop: 0,
                }}
            >
                Order Timeline
            </h2>

            {orderTimeline.map((item) => {

                const date =
                    order[item.field];

                return (

                    <div
                        key={item.key}
                        style={{
                            display: "flex",
                            alignItems: "center",
                            gap: 16,
                            marginBottom: 20,
                        }}
                    >

                        <div
                            style={{
                                width: 18,
                                height: 18,
                                borderRadius: "50%",
                                background: date
                                    ? "#22C55E"
                                    : "#374151",
                            }}
                        />

                        <div>

                            <div
                                style={{
                                    color: "white",
                                    fontWeight: 700,
                                }}
                            >
                                {item.title}
                            </div>

                            <div
                                style={{
                                    color: "#94A3B8",
                                    fontSize: 13,
                                }}
                            >
                                {date
                                    ? new Date(
                                          date
                                      ).toLocaleString()
                                    : "Pending"}
                            </div>

                        </div>

                    </div>

                );

            })}
        </div>
    );
}

const styles: Record<string, CSSProperties> = {
    container: {
        padding: "32px 40px",
        minHeight: "100vh",
        background: "radial-gradient(circle at top left, #0b0f19 0%, #030712 60%, #000000 100%)",
        fontFamily: "'Inter', system-ui, -apple-system, sans-serif",
        color: "#f8fafc",
        boxSizing: "border-box"
    },
    centerScreen: {
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        minHeight: "100vh",
        background: "#030712"
    },
    spinnerWrapper: {
        textAlign: "center"
    },
    spinner: {
        width: "48px",
        height: "48px",
        border: "3px solid rgba(37, 99, 235, 0.2)",
        borderTop: "3px solid #3b82f6",
        borderRadius: "50%",
        animation: "spin 0.8s linear infinite",
        margin: "0 auto 16px auto"
    },
    loadingText: {
        color: "#94a3b8",
        fontSize: "14px",
        fontWeight: 500,
        letterSpacing: "0.5px"
    },
    emptyCard: {
        background: "rgba(17, 24, 39, 0.7)",
        backdropFilter: "blur(16px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        padding: "32px",
        borderRadius: "20px",
        textAlign: "center",
        maxWidth: "400px"
    },
    headerBar: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        marginBottom: "20px"
    },
    backButton: {
        background: "rgba(15, 23, 42, 0.8)",
        backdropFilter: "blur(12px)",
        color: "#cbd5e1",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "10px",
        padding: "10px 18px",
        display: "flex",
        gap: "8px",
        alignItems: "center",
        cursor: "pointer",
        fontWeight: 500,
        fontSize: "14px",
        transition: "all 0.2s ease"
    },
    backButtonHover: {
        background: "rgba(30, 41, 59, 0.9)",
        color: "#ffffff",
        borderColor: "rgba(59, 130, 246, 0.4)",
        transform: "translateX(-2px)"
    },
    headerMeta: {
        display: "flex",
        alignItems: "center",
        gap: "12px"
    },
    badgeWrapper: {
        display: "flex",
        alignItems: "center",
        gap: "8px",
        background: "rgba(30, 41, 59, 0.6)",
        border: "1px solid rgba(255, 255, 255, 0.06)",
        padding: "6px 14px",
        borderRadius: "20px"
    },
    liveIndicator: {
        width: "8px",
        height: "8px",
        borderRadius: "50%",
        background: "#3b82f6",
        boxShadow: "0 0 10px #3b82f6"
    },
    statusBadgeText: {
        color: "#e2e8f0",
        fontSize: "12px",
        fontWeight: 600,
        textTransform: "uppercase",
        letterSpacing: "0.8px"
    },
    titleSection: {
        marginBottom: "28px"
    },
    mainTitle: {
        fontSize: "32px",
        fontWeight: 800,
        letterSpacing: "-0.02em",
        margin: "0 0 6px 0",
        color: "#ffffff"
    },
    gradientText: {
        background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)",
        WebkitBackgroundClip: "text",
        WebkitTextFillColor: "transparent"
    },
    subtitle: {
        color: "#94a3b8",
        fontSize: "14px",
        margin: 0
    },
    grid: {
        display: "grid",
        gridTemplateColumns: "repeat(auto-fit, minmax(240px, 1fr))",
        gap: "24px",
        marginBottom: "36px"
    },
    card: {
        background: "linear-gradient(145deg, rgba(17, 24, 39, 0.75) 0%, rgba(11, 15, 25, 0.85) 100%)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.07)",
        borderRadius: "20px",
        padding: "26px",
        boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
        transition: "transform 0.2s ease, border-color 0.2s ease"
    },
    cardHeader: {
        display: "flex",
        alignItems: "center",
        gap: "12px",
        marginBottom: "22px",
        borderBottom: "1px solid rgba(255, 255, 255, 0.05)",
        paddingBottom: "14px"
    },
    cardIconWrapper: {
        width: "36px",
        height: "36px",
        borderRadius: "10px",
        background: "rgba(37, 99, 235, 0.1)",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        border: "1px solid rgba(37, 99, 235, 0.2)"
    },
    cardTitle: {
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: 700,
        letterSpacing: "-0.01em",
        margin: 0
    },
    profileHeader: {
        display: "flex",
        gap: "16px",
        alignItems: "center",
        marginBottom: "22px",
        background: "rgba(255, 255, 255, 0.02)",
        padding: "12px",
        borderRadius: "14px",
        border: "1px solid rgba(255, 255, 255, 0.04)"
    },
    avatar: {
        width: "60px",
        height: "60px",
        borderRadius: "12px",
        objectFit: "cover",
        border: "2px solid rgba(59, 130, 246, 0.3)"
    },
    profileName: {
        color: "#ffffff",
        fontSize: "16px",
        fontWeight: 600,
        margin: "0 0 4px 0"
    },
    roleBadge: {
        display: "inline-block",
        background: "rgba(37, 99, 235, 0.15)",
        color: "#60a5fa",
        fontSize: "11px",
        fontWeight: 600,
        padding: "2px 8px",
        borderRadius: "6px",
        letterSpacing: "0.5px",
        textTransform: "uppercase"
    },
    infoList: {
        display: "flex",
        flexDirection: "column",
        gap: "14px"
    },
    infoRow: {
        display: "flex",
        justifyContent: "space-between",
        alignItems: "center",
        fontSize: "14px"
    },
    infoLabelGroup: {
        display: "flex",
        alignItems: "center",
        gap: "10px",
        color: "#94a3b8"
    },
    infoIconBox: {
        display: "flex",
        alignItems: "center"
    },
    infoLabelText: {
        fontWeight: 500,
        color: "#94a3b8"
    },
    infoValueText: {
        color: "#f1f5f9",
        fontWeight: 500,
        textAlign: "right",
        maxWidth: "180px",
        overflow: "hidden",
        textOverflow: "ellipsis",
        whiteSpace: "nowrap"
    },
    highlightText: {
        color: "#60a5fa",
        fontWeight: 700
    },
    priceText: {
        color: "#34d399",
        fontWeight: 800,
        fontSize: "16px"
    },
    actionToolbar: {
        background: "linear-gradient(145deg, rgba(17, 24, 39, 0.85) 0%, rgba(10, 14, 23, 0.95) 100%)",
        backdropFilter: "blur(20px)",
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "20px",
        padding: "20px 24px",
        display: "flex",
        flexDirection: "column",
        gap: "14px",
        boxShadow: "0 20px 40px rgba(0, 0, 0, 0.4)"
    },
    toolbarLabel: {
        display: "flex",
        alignItems: "center"
    },
    actionBtn: {
        border: "1px solid rgba(255, 255, 255, 0.08)",
        borderRadius: "12px",
        padding: "12px 20px",
        cursor: "pointer",
        fontWeight: 600,
        fontSize: "14px",
        display: "flex",
        alignItems: "center",
        gap: "8px",
        color: "#ffffff",
        transition: "all 0.2s ease"
    },
    btnSpinner: {
        width: "14px",
        height: "14px",
        border: "2px solid rgba(255, 255, 255, 0.3)",
        borderTop: "2px solid #ffffff",
        borderRadius: "50%",
        animation: "spin 0.6s linear infinite",
        display: "inline-block"
    }
};