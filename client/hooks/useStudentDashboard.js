import { useState, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

export function useStudentDashboard() {
    const { authFetch } = useAuthContext();
    const [dashboardData, setDashboardData] = useState(null);
    const [allData, setAllData] = useState({
        orders: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dataLoaded, setDataLoaded] = useState({
        dashboard: false,
        orders: false,
    });

    const fetchDashboardData = useCallback(async () => {
        if (dataLoaded.dashboard) return;
        
        setLoading(true);
        setError(null);
        try {
            const res = await authFetch("/dashboard/student");
            setDashboardData(res);
            setDataLoaded(prev => ({ ...prev, dashboard: true }));
        } catch (err) {
            setError(err.message || "Failed to fetch dashboard data");
        } finally {
            setLoading(false);
        }
    }, [authFetch, dataLoaded.dashboard]);

    const fetchAllStudentData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const [dashboardRes, ordersRes] = await Promise.allSettled([
                authFetch("/dashboard/student"),
                authFetch("/orders")
            ]);

            if (dashboardRes.status === 'fulfilled') {
                setDashboardData(dashboardRes.value);
                setDataLoaded(prev => ({ ...prev, dashboard: true }));
            }

            if (ordersRes.status === 'fulfilled') {
                setAllData(prev => ({ 
                    ...prev, 
                    orders: ordersRes.value.orders || ordersRes.value || [] 
                }));
                setDataLoaded(prev => ({ ...prev, orders: true }));
            }

        } catch (err) {
            setError(err.message || "Failed to fetch student data");
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    const refreshData = useCallback(async (section) => {
        try {
            let endpoint;
            switch (section) {
                case 'orders':
                    endpoint = "/orders";
                    break;
                case 'dashboard':
                default:
                    endpoint = "/dashboard/student";
                    break;
            }

            const res = await authFetch(endpoint);
            
            if (section === 'dashboard') {
                setDashboardData(res);
            } else {
                setAllData(prev => ({ 
                    ...prev, 
                    [section]: res[section] || res || [] 
                }));
            }
        } catch (err) {
            console.error(`Failed to refresh ${section} data:`, err);
        }
    }, [authFetch]);

    return {
        dashboardData,
        allData,
        loading,
        error,
        dataLoaded,
        fetchDashboardData,
        fetchAllStudentData,
        refreshData,
    };
}

