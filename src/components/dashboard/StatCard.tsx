import "./StatCard.css";
import type { ReactNode } from "react";

type Props = {
    title: string;
    value: string | number;
    icon: ReactNode;
    color: string;
};

export default function StatCard({
    title,
    value,
    icon,
    color,
}: Props) {
    return (
        <div
            style={{
                background: "#111827",
                borderRadius: 16,
                padding: 20,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                border: "1px solid #1F2937",
            }}
        >
            <div>
                <p
                    style={{
                        color: "#94A3B8",
                        margin: 0,
                        fontSize: 14,
                    }}
                >
                    {title}
                </p>

                <h2
                    style={{
                        color: "white",
                        marginTop: 10,
                        marginBottom: 0,
                    }}
                >
                    {value}
                </h2>
            </div>

            <div
                style={{
                    width: 60,
                    height: 60,
                    borderRadius: 16,
                    background: color,
                    display: "flex",
                    justifyContent: "center",
                    alignItems: "center",
                }}
            >
                {icon}
            </div>
        </div>
    );
}