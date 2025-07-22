"use client";

import Auth from "@/components/auth/Auth";

export default function AuthPage() {
    return (
        <div className="fixed inset-0 z-50 flex items-center justify-center backdrop-blur-sm bg-black/40">
            <Auth />
        </div>
    );
}
