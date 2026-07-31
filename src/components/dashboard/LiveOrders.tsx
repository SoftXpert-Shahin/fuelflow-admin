import { useEffect, useState } from "react";
import { getLiveOrders } from "../../services/orders";
import { subscribeOrders } from "../../services/orders";
export default function LiveOrders() {
    const [orders, setOrders] = useState<any[]>([]);

    useEffect(() => {
        load();
    
        const unsubscribe = subscribeOrders(load);
    
        return unsubscribe;
    }, []);
    async function load() {
        const data = await getLiveOrders();
        setOrders(data);
    }

    return (
        <div
            style={{
                background: "#111827",
                padding: 20,
                borderRadius: 16,
                height:450,
                overflowY: "scroll",
            }}
        >
            <h3
                style={{
                    color: "white",
                    marginBottom: 20,
                }}
            >
                Live Orders
            </h3>

            {orders.length === 0 && (
                <p style={{ color: "#94A3B8" }}>
                    No active orders
                </p>
            )}

            {orders.map((order) => (
                <div
                    key={order.id}
                    style={{
                        display: "flex",
                        justifyContent: "space-between",
                        alignItems: "center",
                        marginBottom: 14,
                        paddingBottom: 12,
                        borderBottom: "1px solid #1F2937",
                    }}
                >
                    <div>
                        <div
                            style={{
                                color: "white",
                                fontWeight: 600,
                            }}
                        >
                            {order.customer?.full_name ?? "Unknown"}
                        </div>

                        <div
                            style={{
                                color: "#94A3B8",
                                fontSize: 13,
                            }}
                        >
                            #{order.id.slice(0, 8)}
                        </div>
                    </div>

                    <div
                        style={{
                            textAlign: "right",
                        }}
                    >
                        <div
                            style={{
                                color: "#10B981",
                                fontWeight: 600,
                            }}
                        >
                            ${order.total_price}
                        </div>

                        <div
                            style={{
                                color: "#94A3B8",
                                fontSize: 13,
                            }}
                        >
                            {order.status}
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}