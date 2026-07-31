import { Outlet } from "react-router-dom";

import Sidebar from "./Sidebar";
import Topbar from "./Topbar";

export default function AdminLayout() {
    return (
        <div
    style={{
        flex: 1,
        marginLeft: 270,
        width: "calc(100% - 270px)",
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        overflow: "hidden",
    }}
>
            {/* Fixed Sidebar */}
            <Sidebar />

            {/* Right Side */}
            <div
                style={{
                    flex: 1,
                    display: "flex",
                    flexDirection: "column",
                    overflow: "hidden",
                }}
            >
                {/* Fixed Topbar */}
                <Topbar />

                {/* Scrollable Content */}
                <main
    style={{
        flex: 1,
        overflowY: "auto",
        padding: 24,
        background: "#0F172A",
    }}
>
    <Outlet />
</main>
            </div>
        </div>
    );
}