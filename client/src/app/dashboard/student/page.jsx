// src/app/dashboard/student/page.jsx
"use client";
import { useAuth } from "@/hooks/useAuth";
import { useRouter } from "next/navigation";

import Sidebar from "@/components/Sidebar";
import Topbar from "@/components/Topbar";
import ProjectCard from "@/components/ProjectCard";
import SkillsPanel from "@/components/SkillsPanel";
import NavBar from "@/components/NavBar";

const projectData = [
    {
        title: "Tours & travel",
        description: "Moringa School, you’re not just signing up for a course...",
        image: "/images/tour.jpg",
        bgColor: "bg-gray-100",
    },
    {
        title: "Health Hub",
        description: "Moringa School, you’re not just signing up for a course...",
        image: "/images/health.jpg",
        bgColor: "bg-green-200",
    },
    {
        title: "Ecommerce",
        description: "Moringa School, you’re not just signing up for a course...",
        image: "/images/ecom.jpg",
        bgColor: "bg-pink-100",
    },
    {
        title: "Food court",
        description: "Moringa School, you’re not just signing up for a course...",
        image: "/images/food.jpg",
        bgColor: "bg-blue-900 text-white",
    },
];

export default function StudentDashboard() {
    const { user, logout } = useAuth("student");
    const router = useRouter();

    if (!user) return <p>Loading student dashboard...</p>;

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4">
                <NavBar />
                <Topbar />

                <div className="mb-4 p-4 bg-blue-50 rounded shadow">
                    <h1 className="text-xl font-bold">Welcome, Student</h1>
                    <p className="text-gray-700">Email: {user.email}</p>

                </div>

                <div className="flex gap-4 mt-6">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                        {projectData.map((proj, idx) => (
                            <ProjectCard key={idx} {...proj} />
                        ))}
                    </div>
                    <SkillsPanel />
                </div>
            </div>
        </div>
    );
}
