import { useEffect, useState } from "react";
import { MdLocalGasStation, MdLocalShipping, MdSave, MdAttachMoney } from "react-icons/md";
import {
    getFuelPrices,
    updateFuelPrice,
    getDeliverySettings,
    updateDeliverySettings,
    getPricingConfig,
    subscribeToPricing,
} from "../services/pricing";

export default function Pricing() {
    const [fuelPrices, setFuelPrices] = useState<any[]>([]);
    const [delivery, setDelivery] = useState<any>(null);
    const [loading, setLoading] = useState(true);
    const [pricing, setPricing] = useState<any>(null);

    useEffect(() => {
        load();
    }, []);
    useEffect(() => {
        async function loadPricing() {
            const config = await getPricingConfig();
            setPricing(config);
        }

        loadPricing();

        const unsubscribe = subscribeToPricing(loadPricing);

        return unsubscribe;
    }, []);

    const currency = pricing?.settings?.currency_symbol ?? "৳";
    async function load() {
        setLoading(true);
        try {
            const [fuelData, deliveryData] = await Promise.all([
                getFuelPrices(),
                getDeliverySettings()
            ]);
            setFuelPrices(fuelData);
            setDelivery(deliveryData);
        } finally {
            setLoading(false);
        }
    }

    async function saveFuel(item: any) {
        await updateFuelPrice(
            item.id,
            Number(item.price_per_liter)
        );
    
        await load(); // Reload latest values
    
        alert("Fuel price updated successfully.");
    }

    async function saveDelivery() {
        await updateDeliverySettings({
            price_per_km: Number(delivery.price_per_km),
            minimum_delivery_fee: Number(delivery.minimum_delivery_fee),
            maximum_delivery_fee:
                delivery.maximum_delivery_fee === "" ||
                delivery.maximum_delivery_fee === null
                    ? null
                    : Number(delivery.maximum_delivery_fee),
        });
    
        await load(); // Reload latest values
    
        alert("Delivery settings updated successfully.");
    }

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
            {/* Header Section */}
            <div style={{ marginBottom: "32px" }}>
                <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 6px 0", color: "#ffffff" }}>
                    Pricing & Fee <span style={{ background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Configuration</span>
                </h1>
                <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                    Manage global fuel rates matrix and dynamic delivery fee rules.
                </p>
            </div>

            {loading ? (
                <div style={{ textAlign: "center", padding: "80px", color: "#94a3b8" }}>
                    <div style={{
                        width: "36px",
                        height: "36px",
                        border: "3px solid rgba(37, 99, 235, 0.2)",
                        borderTop: "3px solid #3b82f6",
                        borderRadius: "50%",
                        animation: "spin 0.8s linear infinite",
                        margin: "0 auto 12px auto"
                    }}></div>
                    <p style={{ fontSize: "14px", fontWeight: 500 }}>Loading pricing telemetry...</p>
                </div>
            ) : (
                <>
                    {/* Current Pricing Summary Cards */}
                    <div
                        style={{
                            display: "grid",
                            gridTemplateColumns: "repeat(auto-fit, minmax(120px, 1fr))",
                            gap: 20,
                            marginBottom: 30,
                        }}
                    >
                        {fuelPrices.map((fuel) => (
                            <div
                                key={fuel.id}
                                style={{
                                    background: "#111827",
                                    border: "1px solid #1F2937",
                                    borderRadius: 16,
                                    padding: 22,
                                }}
                            >
                                <div style={{ color: "#94A3B8", fontSize: 14 }}>
                                    {fuel.fuel_type}
                                </div>
                                <div style={{ marginTop: 8, fontSize: 34, fontWeight: 700, color: "#10B981" }}>
                                    {currency}{fuel.price_per_liter}
                                </div>
                                <div style={{ color: "#64748B", marginTop: 6 }}>
                                    Per Liter
                                </div>
                            </div>
                        ))}

                        {delivery && (
                            <>
                                <div
                                    style={{
                                        background: "#111827",
                                        border: "1px solid #1F2937",
                                        borderRadius: 16,
                                        padding: 22,
                                    }}
                                >
                                    <div style={{ color: "#94A3B8" }}>Delivery / KM</div>
                                    <div style={{ marginTop: 8, fontSize: 34, fontWeight: 700, color: "#3B82F6" }}>
                                        {currency}{delivery.price_per_km}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        background: "#111827",
                                        border: "1px solid #1F2937",
                                        borderRadius: 16,
                                        padding: 22,
                                    }}
                                >
                                    <div style={{ color: "#94A3B8" }}>Minimum Fee</div>
                                    <div style={{ marginTop: 8, fontSize: 34, fontWeight: 700, color: "#F59E0B" }}>
                                    {currency}{delivery.minimum_delivery_fee}
                                    </div>
                                </div>

                                <div
                                    style={{
                                        background: "#111827",
                                        border: "1px solid #1F2937",
                                        borderRadius: 16,
                                        padding: 22,
                                    }}
                                >
                                    <div style={{ color: "#94A3B8" }}>Maximum Fee</div>
                                    <div style={{ marginTop: 8, fontSize: 34, fontWeight: 700, color: "#EF4444" }}>
                                        {delivery.maximum_delivery_fee
                                            ? `${currency} ${delivery.maximum_delivery_fee}`
                                            : "Unlimited"}
                                    </div>
                                </div>
                            </>
                        )}
                    </div>

                    {/* Editor Cards Grid */}
                    <div style={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(400px, 1fr))", gap: "24px" }}>
                        
                        {/* Fuel Prices Card */}
                        <div
                            style={{
                                background: "linear-gradient(145deg, rgba(17, 24, 39, 0.75) 0%, rgba(11, 15, 25, 0.85) 100%)",
                                backdropFilter: "blur(20px)",
                                borderRadius: "20px",
                                border: "1px solid rgba(255, 255, 255, 0.07)",
                                padding: "28px",
                                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)"
                            }}
                        >
                            <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                                <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(37, 99, 235, 0.12)", border: "1px solid rgba(59, 130, 246, 0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                    <MdLocalGasStation color="#60a5fa" size={22} />
                                </div>
                                <div>
                                    <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", margin: 0 }}>Fuel Price Matrix</h2>
                                    <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0 0" }}>Update base rate per liter</p>
                                </div>
                            </div>

                            <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                {fuelPrices.map((item, index) => (
                                    <div
                                        key={item.id}
                                        style={{
                                            display: "flex",
                                            justifyContent: "space-between",
                                            alignItems: "center",
                                            background: "rgba(255, 255, 255, 0.02)",
                                            padding: "14px 16px",
                                            borderRadius: "14px",
                                            border: "1px solid rgba(255, 255, 255, 0.04)"
                                        }}
                                    >
                                        <div style={{ display: "flex", alignItems: "center", gap: "10px" }}>
                                            <span style={{ fontSize: "14px", fontWeight: 600, color: "#f1f5f9" }}>
                                                {item.fuel_type}
                                            </span>
                                        </div>

                                        <div style={{ display: "flex", alignItems: "center", gap: "12px" }}>
                                            <div style={{ position: "relative", display: "flex", alignItems: "center" }}>
                                                <MdAttachMoney size={16} color="#64748b" style={{ position: "absolute", left: "10px" }} />
                                                <input
                                                    type="number"
                                                    step="0.01"
                                                    value={item.price_per_liter}
                                                    onChange={(e) => {
                                                        const copy = [...fuelPrices];
                                                        copy[index].price_per_liter = e.target.value;
                                                        setFuelPrices(copy);
                                                    }}
                                                    style={{
                                                        width: "120px",
                                                        padding: "8px 12px 8px 30px",
                                                        borderRadius: "10px",
                                                        border: "1px solid rgba(255, 255, 255, 0.08)",
                                                        background: "rgba(17, 24, 39, 0.8)",
                                                        color: "#34d399",
                                                        fontWeight: 700,
                                                        fontSize: "14px",
                                                        outline: "none"
                                                    }}
                                                />
                                            </div>

                                            <button
                                                onClick={() => saveFuel(item)}
                                                style={{
                                                    background: "rgba(37, 99, 235, 0.15)",
                                                    color: "#60a5fa",
                                                    border: "1px solid rgba(59, 130, 246, 0.3)",
                                                    padding: "8px 14px",
                                                    borderRadius: "10px",
                                                    cursor: "pointer",
                                                    fontWeight: 600,
                                                    fontSize: "12px",
                                                    display: "inline-flex",
                                                    alignItems: "center",
                                                    gap: "6px",
                                                    transition: "all 0.2s ease"
                                                }}
                                                onMouseEnter={(e) => {
                                                    e.currentTarget.style.background = "#2563eb";
                                                    e.currentTarget.style.color = "#ffffff";
                                                }}
                                                onMouseLeave={(e) => {
                                                    e.currentTarget.style.background = "rgba(37, 99, 235, 0.15)";
                                                    e.currentTarget.style.color = "#60a5fa";
                                                }}
                                            >
                                                <MdSave size={14} />
                                                <span>Save</span>
                                            </button>
                                        </div>
                                    </div>
                                ))}
                            </div>
                        </div>

                        {/* Delivery Settings Card */}
                        {delivery && (
                            <div
                                style={{
                                    background: "linear-gradient(145deg, rgba(17, 24, 39, 0.75) 0%, rgba(11, 15, 25, 0.85) 100%)",
                                    backdropFilter: "blur(20px)",
                                    borderRadius: "20px",
                                    border: "1px solid rgba(255, 255, 255, 0.07)",
                                    padding: "28px",
                                    boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)"
                                }}
                            >
                                <div style={{ display: "flex", alignItems: "center", gap: "12px", marginBottom: "24px" }}>
                                    <div style={{ width: "42px", height: "42px", borderRadius: "12px", background: "rgba(37, 99, 235, 0.12)", border: "1px solid rgba(59, 130, 246, 0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                                        <MdLocalShipping color="#60a5fa" size={22} />
                                    </div>
                                    <div>
                                        <h2 style={{ fontSize: "18px", fontWeight: 700, color: "#ffffff", margin: 0 }}>Delivery Parameters</h2>
                                        <p style={{ fontSize: "12px", color: "#94a3b8", margin: "2px 0 0 0" }}>Configure calculation fees & caps</p>
                                    </div>
                                </div>

                                <div style={{ display: "flex", flexDirection: "column", gap: "16px" }}>
                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                            Price Per KM
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={delivery.price_per_km}
                                            onChange={(e) =>
                                                setDelivery({
                                                    ...delivery,
                                                    price_per_km: e.target.value,
                                                })
                                            }
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                            Minimum Delivery Fee
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={delivery.minimum_delivery_fee}
                                            onChange={(e) =>
                                                setDelivery({
                                                    ...delivery,
                                                    minimum_delivery_fee: e.target.value,
                                                })
                                            }
                                            style={inputStyle}
                                        />
                                    </div>

                                    <div style={{ display: "flex", flexDirection: "column", gap: "6px" }}>
                                        <label style={{ fontSize: "12px", fontWeight: 600, color: "#94a3b8", textTransform: "uppercase", letterSpacing: "0.5px" }}>
                                            Maximum Delivery Fee (Optional)
                                        </label>
                                        <input
                                            type="number"
                                            step="0.01"
                                            value={delivery.maximum_delivery_fee ?? ""}
                                            onChange={(e) =>
                                                setDelivery({
                                                    ...delivery,
                                                    maximum_delivery_fee: e.target.value,
                                                })
                                            }
                                            style={inputStyle}
                                        />
                                    </div>

                                    <button
                                        onClick={saveDelivery}
                                        style={{
                                            marginTop: "8px",
                                            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                                            color: "#ffffff",
                                            border: "none",
                                            padding: "12px",
                                            borderRadius: "12px",
                                            cursor: "pointer",
                                            fontWeight: 600,
                                            fontSize: "14px",
                                            display: "flex",
                                            alignItems: "center",
                                            justifyContent: "center",
                                            gap: "8px",
                                            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                                            transition: "all 0.2s ease"
                                        }}
                                    >
                                        <MdSave size={16} />
                                        <span>Save Delivery Settings</span>
                                    </button>
                                </div>
                            </div>
                        )}
                    </div>
                </>
            )}
        </div>
    );
}

const inputStyle: React.CSSProperties = {
    width: "100%",
    padding: "11px 14px",
    borderRadius: "10px",
    border: "1px solid rgba(255, 255, 255, 0.08)",
    background: "rgba(17, 24, 39, 0.8)",
    color: "#ffffff",
    fontSize: "14px",
    outline: "none",
    boxSizing: "border-box"
};