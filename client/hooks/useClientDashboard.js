import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

export function useClientDashboard() {
    const { authFetch } = useAuth();
    const [dashboardData, setDashboardData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchDashboardData = useCallback(async () => {
        setLoading(true);
        setError(null);
        try {
            const res = await authFetch("/dashboard/client");
            setDashboardData(res);
        } catch (err) {
            setError(err.message || "Failed to fetch dashboard data");
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    return {
        dashboardData,
        loading,
        error,
        fetchDashboardData,
    };
}
