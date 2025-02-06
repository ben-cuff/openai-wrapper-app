import { SidebarProvider } from "@/components/ui/sidebar";
import React from "react";

type LayoutProps = {
	children: React.ReactNode;
};

export default function Layout({ children }: LayoutProps) {
	return <SidebarProvider>{children}</SidebarProvider>;
}
