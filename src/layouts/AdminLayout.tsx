import { Outlet } from "react-router-dom";

import Sidebar from "../components/layout/Sidebar";
import Topbar from "../components/layout/Topbar";
/* src/index.css */
 export default function AdminLayout() {
    return (
        <div
            style={{
                display: "flex",
                height: "100vh",
                background: "#0B1220",
            }}
        >
            <Sidebar />

            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                }}
            >
                <Topbar />

                <main
                    style={{
                        flex: 1,
                        padding: 24,
                        overflow: "auto",
                    }}
                >
                    <Outlet />
                </main>
            </div>
        </div>
    );
}