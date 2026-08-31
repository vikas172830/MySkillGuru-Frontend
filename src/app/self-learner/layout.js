import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import ProtectedRoute from "./protected_routes";
import { SidebarDemo } from "@/components/sidebar";

export const metadata = {
  title: "MySkillGuru",
  description: "AI-powered personalized learning roadmaps, self-review, and practice tests",
  icons: {
    icon: "/pics/Logo5.png",
  },
};

export default function RootLayout({ children}) {

  return (
        <ProtectedRoute><SidebarDemo>{children}</SidebarDemo></ProtectedRoute>
  );
}