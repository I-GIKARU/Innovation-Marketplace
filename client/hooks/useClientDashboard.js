import { useState, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

export function useClientDashboard() {
    const { authFetch } = useAuthContext();
    const [dashboardData, setDashboardData] = useState(null);
    const [allData, setAllData] = useState({
        orders: [],
        contributions: [],
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dataLoaded, setDataLoaded] = useState({
        dashboard: false,
        orders: false,
        contributions: false,
    });

    const fetchDashboardData = useCallback(async () => {
        if (dataLoaded.dashboard) return;
        
        setLoading(true);
        setError(null);
        try {
            const res = await authFetch("/dashboard/client");
            setDashboardData(res);
            setDataLoaded(prev => ({ ...prev, dashboard: true }));
        } catch (err) {
            setError(err.message || "Failed to fetch dashboard data");
        } finally {
            setLoading(false);
        }
    }, [authFetch, dataLoaded.dashboard]);

    const fetchAllClientData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            const [dashboardRes, ordersRes, contributionsRes] = await Promise.allSettled([
                authFetch("/dashboard/client"),
                authFetch("/orders"),
                authFetch("/contributions")
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

            if (contributionsRes.status === 'fulfilled') {
                setAllData(prev => ({ 
                    ...prev, 
                    contributions: contributionsRes.value.contributions || contributionsRes.value || [] 
                }));
                setDataLoaded(prev => ({ ...prev, contributions: true }));
            }

        } catch (err) {
            setError(err.message || "Failed to fetch client data");
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
                case 'contributions':
                    endpoint = "/contributions";
                    break;
                case 'dashboard':
                default:
                    endpoint = "/dashboard/client";
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
        fetchAllClientData,
        refreshData,
    };
}
