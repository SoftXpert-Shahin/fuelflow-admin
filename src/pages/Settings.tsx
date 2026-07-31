import React, { useEffect, useState, createContext } from "react";
import type { ReactNode } from "react";
import { 
    MdBusiness, 
    MdLocalShipping, 
    MdMap,  
    MdDescription, 
    MdSave, 
} from "react-icons/md";

import {
    getSettings,
    updateSettings,
    getLegalPages,
    updateLegalPage,
} from "../services/settings";

const SettingsContext = createContext<any>(null);

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [settings, setSettings] = useState<any>(null);
    const [legalPages, setLegalPages] = useState<any[]>([]);

    useEffect(() => {
        load();
    }, []);

    async function load() {
        setLoading(true);

        try {
            const [settingData, legalData] =
                await Promise.all([
                    getSettings(),
                    getLegalPages(),
                ]);

            setSettings(settingData);
            setLegalPages(legalData);
        } finally {
            setLoading(false);
        }
    }

    async function saveSettings() {
        try {
            await updateSettings(settings);
            alert("Settings updated successfully.");
        } catch (error) {
            console.error("Failed to update settings", error);
            alert("Error updating settings.");
        }
    }

    async function handleSaveLegalPage(slug: string, content: string, title: string) {
        try {
            await updateLegalPage(slug, content);
            alert(`${title} updated successfully.`);
        } catch (error) {
            console.error(`Failed to update ${title}`, error);
            alert(`Error updating ${title}.`);
        }
    }

    if (loading) {
        return (
            <div style={{ textAlign: "center", padding: "100px", color: "#94a3b8", fontFamily: "'Inter', system-ui, sans-serif" }}>
                <div style={{
                    width: "36px",
                    height: "36px",
                    border: "3px solid rgba(37, 99, 235, 0.2)",
                    borderTop: "3px solid #3b82f6",
                    borderRadius: "50%",
                    animation: "spin 0.8s linear infinite",
                    margin: "0 auto 12px auto"
                }}></div>
                <p style={{ fontSize: "14px", fontWeight: 500 }}>Loading system telemetry...</p>
            </div>
        );
    }

    return (
        <SettingsContext.Provider value={{ settings, setSettings }}>
            <div style={{ padding: "32px 40px", minHeight: "100vh", background: "radial-gradient(circle at top left, #0b0f19 0%, #030712 60%, #000000 100%)", fontFamily: "'Inter', system-ui, -apple-system, sans-serif", color: "#f8fafc", boxSizing: "border-box" }}>
                
                {/* Header Section */}
                <div style={{ marginBottom: "32px", display: "flex", justifyContent: "space-between", alignItems: "flex-end" }}>
                    <div>
                        <h1 style={{ fontSize: "32px", fontWeight: 800, letterSpacing: "-0.02em", margin: "0 0 6px 0", color: "#ffffff", display: "flex", alignItems: "center", gap: "12px" }}>
                            Application <span style={{ background: "linear-gradient(135deg, #60a5fa 0%, #2563eb 50%, #1d4ed8 100%)", WebkitBackgroundClip: "text", WebkitTextFillColor: "transparent" }}>Settings</span>
                        </h1>
                        <p style={{ color: "#94a3b8", fontSize: "14px", margin: 0 }}>
                            Manage global platform configurations, operational thresholds, and legal documents.
                        </p>
                    </div>
                    
                    <button
                        onClick={saveSettings}
                        style={{
                            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                            color: "white",
                            border: "none",
                            padding: "12px 24px",
                            borderRadius: "12px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "14px",
                            display: "flex",
                            alignItems: "center",
                            gap: "8px",
                            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                            transition: "all 0.2s ease"
                        }}
                    >
                        <MdSave size={18} />
                        <span>Save All Settings</span>
                    </button>
                </div>

                {/* Structured Settings Grid Cards */}
                <div
                    style={{
                        display: "grid",
                        gridTemplateColumns: "repeat(auto-fit, minmax(320px, 1fr))",
                        gap: "24px",
                    }}
                >
                    <Card title="Company Profile" icon={<MdBusiness size={20} color="#60a5fa" />}>
                        <Input label="App Name" value={settings?.app_name} field="app_name" />
                        <Input label="Support Email" value={settings?.support_email} field="support_email" />
                        <Input label="Support Phone" value={settings?.support_phone} field="support_phone" />
                        <Input label="Company Address" value={settings?.company_address} field="company_address" />
                    </Card>

                    <Card title="Finance & Operational Rules" icon={<MdLocalShipping size={20} color="#60a5fa" />}>
                        <Input label="Currency Symbol" value={settings?.currency_symbol} field="currency_symbol" />
                        <Input label="Platform Fee (%)" type="number" step="0.01" value={settings?.platform_fee} field="platform_fee" />
                        <Input label="Auto Cancel Minutes" type="number" value={settings?.auto_cancel_minutes} field="auto_cancel_minutes" />
                    </Card>

                    <Card title="API Integrations & Keys" icon={<MdMap size={20} color="#60a5fa" />}>
                        <Input label="Google Maps API Key" value={settings?.google_maps_api_key} field="google_maps_api_key" />
                        <Input label="Paystack Public Key" value={settings?.paystack_public_key} field="paystack_public_key" />
                        <Input label="Paystack Secret Key" value={settings?.paystack_secret_key} field="paystack_secret_key" />
                    </Card>
                </div>

                {/* Bottom Save Action Bar */}
                <div style={{ marginTop: "24px", display: "flex", justifyContent: "flex-end" }}>
                    <button
                        onClick={saveSettings}
                        style={{
                            background: "linear-gradient(135deg, #2563eb 0%, #1d4ed8 100%)",
                            color: "white",
                            border: "none",
                            padding: "12px 30px",
                            borderRadius: "12px",
                            cursor: "pointer",
                            fontWeight: 600,
                            fontSize: "14px",
                            boxShadow: "0 4px 12px rgba(37, 99, 235, 0.3)",
                            transition: "all 0.2s ease"
                        }}
                    >
                        Save All Settings
                    </button>
                </div>

                {/* Legal Pages Section */}
                <div style={{ marginTop: "48px" }}>
                    <div style={{ marginBottom: "24px" }}>
                        <h2 style={{ fontSize: "22px", fontWeight: 700, color: "#ffffff", margin: "0 0 4px 0", display: "flex", alignItems: "center", gap: "10px" }}>
                            <MdDescription color="#60a5fa" size={24} />
                            Legal Pages & Documentation
                        </h2>
                        <p style={{ color: "#94a3b8", fontSize: "13px", margin: 0 }}>
                            Modify terms of service, privacy policies, and agreements rendered publicly.
                        </p>
                    </div>

                    <div style={{ display: "flex", flexDirection: "column", gap: "24px" }}>
                        {legalPages.map((page, index) => (
                            <Card key={page.id} title={page.title} icon={<MdDescription size={20} color="#60a5fa" />}>
                                <div style={{ marginBottom: "16px" }}>
                                    <textarea
                                        rows={8}
                                        value={page.content ?? ""}
                                        onChange={(e) => {
                                            const copy = [...legalPages];
                                            copy[index].content = e.target.value;
                                            setLegalPages(copy);
                                        }}
                                        style={{
                                            width: "100%",
                                            padding: "14px",
                                            borderRadius: "12px",
                                            border: "1px solid rgba(255, 255, 255, 0.08)",
                                            background: "rgba(17, 24, 39, 0.8)",
                                            color: "white",
                                            fontSize: "14px",
                                            boxSizing: "border-box",
                                            resize: "vertical",
                                            outline: "none",
                                            fontFamily: "'Inter', system-ui, sans-serif"
                                        }}
                                    />
                                </div>

                                <button
                                    onClick={() => handleSaveLegalPage(page.slug, page.content, page.title)}
                                    style={{
                                        background: "rgba(37, 99, 235, 0.15)",
                                        color: "#60a5fa",
                                        border: "1px solid rgba(59, 130, 246, 0.3)",
                                        padding: "10px 20px",
                                        borderRadius: "10px",
                                        cursor: "pointer",
                                        fontWeight: 600,
                                        fontSize: "13px",
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
                                    <MdSave size={16} />
                                    <span>Save {page.title}</span>
                                </button>
                            </Card>
                        ))}
                    </div>
                </div>
            </div>
        </SettingsContext.Provider>
    );
}

type CardProps = {
    title: string;
    icon?: ReactNode;
    children: ReactNode;
};

function Card({
    title,
    icon,
    children,
}: CardProps) {
    return (
        <div
            style={{
                background: "linear-gradient(145deg, rgba(17, 24, 39, 0.75) 0%, rgba(11, 15, 25, 0.85) 100%)",
                backdropFilter: "blur(20px)",
                padding: "28px",
                borderRadius: "20px",
                border: "1px solid rgba(255, 255, 255, 0.07)",
                boxShadow: "0 20px 40px -15px rgba(0, 0, 0, 0.5)",
            }}
        >
            <div style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "22px" }}>
                {icon && (
                    <div style={{ width: "36px", height: "36px", borderRadius: "10px", background: "rgba(37, 99, 235, 0.12)", border: "1px solid rgba(59, 130, 246, 0.25)", display: "flex", alignItems: "center", justifyContent: "center" }}>
                        {icon}
                    </div>
                )}
                <h2
                    style={{
                        color: "white",
                        fontSize: "18px",
                        fontWeight: 700,
                        margin: 0,
                        letterSpacing: "-0.01em"
                    }}
                >
                    {title}
                </h2>
            </div>

            {children}
        </div>
    );
}

function Input({
    label,
    value,
    field,
    type = "text",
    step,
}: any) {
    const { settings, setSettings } = React.useContext(SettingsContext);

    return (
        <div style={{ marginBottom: "18px" }}>
            <label
                style={{
                    display: "block",
                    marginBottom: "8px",
                    color: "#94a3b8",
                    fontWeight: 600,
                    fontSize: "12px",
                    textTransform: "uppercase",
                    letterSpacing: "0.5px"
                }}
            >
                {label}
            </label>

            <input
                type={type}
                step={step}
                value={value ?? ""}
                onChange={(e) =>
                    setSettings({
                        ...settings,
                        [field]: e.target.value,
                    })
                }
                style={{
                    width: "100%",
                    padding: "11px 14px",
                    borderRadius: "10px",
                    background: "rgba(17, 24, 39, 0.8)",
                    border: "1px solid rgba(255, 255, 255, 0.08)",
                    color: "white",
                    fontSize: "14px",
                    outline: "none",
                    boxSizing: "border-box"
                }}
            />
        </div>
    );
}