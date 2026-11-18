import { Geist, Geist_Mono } from "next/font/google";
import "../globals.css";
import ProtectedRoute from "./protected_routes";
import { SidebarDemo } from "@/components/sidebar";

export const metadata = {
  title: "MySkillsGuru",
  description: "AI-powered personalized learning roadmaps, self-review, and practice tests",
};

export default function RootLayout({ children}) {

  return (
        <ProtectedRoute><SidebarDemo>{children}</SidebarDemo></ProtectedRoute>
  );
}