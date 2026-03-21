import DashboardLayout from "@/components/layout/DashboardLayout";
import { ChatProvider } from "@/context/ChatContext";

export default function Layout({ children }: { children: React.ReactNode }) {
    return (
        <ChatProvider>
            <DashboardLayout>{children}</DashboardLayout>
        </ChatProvider>
    );
}