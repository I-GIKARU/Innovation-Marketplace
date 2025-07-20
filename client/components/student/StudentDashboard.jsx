'use client';

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

import Sidebar from '@/components/student/Sidebar';
import Topbar from '@/components/student/Topbar';
import ProjectCard from '@/components/ProjectCard';
import SkillsPanel from '@/components/student/SkillsPanel';
import { useAuth } from '@/hooks/useAuth';

const API_BASE = process.env.NEXT_PUBLIC_API_BASE_URL || 'http://localhost:5000/api';

export default function StudentDashboard() {
    const { user, loading: authLoading } = useAuth();
    const [projects, setProjects] = useState([]);
    const [loading, setLoading] = useState(true);
    const router = useRouter();

    useEffect(() => {
        if (!authLoading && !user) {
            router.push('/');
        }
    }, [authLoading, user, router]);

    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const res = await fetch(`${API_BASE}/projects`);
                const data = await res.json();
                setProjects(data.projects || []);
            } catch (err) {
                console.error('Failed to load projects:', err);
            } finally {
                setLoading(false);
            }
        };

        if (user) fetchProjects();
    }, [user]);

    if (authLoading) return <p className="p-4">Checking authentication...</p>;
    if (!user) return null;

    return (
        <div className="flex">
            <Sidebar />
            <div className="flex-1 p-4">
                <Topbar />

                <div className="mb-4 p-4 bg-blue-50 rounded shadow">
                    <h1 className="text-xl font-bold">Welcome, Student</h1>
                    <p className="text-gray-700">Email: {user.email}</p>
                </div>

                <div className="flex gap-4 mt-6">
                    <div className="grid grid-cols-2 gap-4 flex-1">
                        {loading ? (
                            <p>Loading projects...</p>
                        ) : (
                            projects.map((proj, idx) => (
                                <ProjectCard
                                    key={proj.id || idx}
                                    project={proj} // ✅ Pass full project object
                                />
                            ))
                        )}
                    </div>
                    <SkillsPanel />
                </div>
            </div>
        </div>
    );
}
