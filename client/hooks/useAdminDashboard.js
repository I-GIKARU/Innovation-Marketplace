import { useState, useCallback } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

export function useAdminDashboard() {
    const { authFetch } = useAuthContext();
    const [dashboardData, setDashboardData] = useState(null);
    const [allData, setAllData] = useState({
        products: [],
        projects: [],
        cvs: [],
        orders: [],
        categories: [],
        contributions: [],
        users: []
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [dataLoaded, setDataLoaded] = useState({
        dashboard: false,
        products: false,
        projects: false,
        cvs: false,
        orders: false,
        categories: false,
        contributions: false,
        users: false
    });

    const fetchDashboardData = useCallback(async () => {
        if (dataLoaded.dashboard) return; // Avoid refetching
        
        setLoading(true);
        setError(null);
        try {
            const res = await authFetch("/dashboard/admin");
            setDashboardData(res);
            setDataLoaded(prev => ({ ...prev, dashboard: true }));
        } catch (err) {
            setError(err.message || "Failed to fetch admin dashboard data");
        } finally {
            setLoading(false);
        }
    }, [authFetch, dataLoaded.dashboard]);

    const fetchAllAdminData = useCallback(async () => {
        setLoading(true);
        setError(null);
        
        try {
            // Fetch all admin data concurrently
            const [dashboardRes, productsRes, projectsRes, cvsRes, ordersRes, categoriesRes, contributionsRes] = await Promise.allSettled([
                authFetch("/dashboard/admin"),
                authFetch("/merchandise"), 
                authFetch("/projects"),
                authFetch("/ai/admin/cvs"),
                authFetch("/admin/sales"),
                authFetch("/categories"),
                authFetch("/contributions")
            ]);

            // Process dashboard data
            if (dashboardRes.status === 'fulfilled') {
                setDashboardData(dashboardRes.value);
                setDataLoaded(prev => ({ ...prev, dashboard: true }));
            }

            // Process products data
            if (productsRes.status === 'fulfilled') {
                setAllData(prev => ({ 
                    ...prev, 
                    products: productsRes.value.merchandise || productsRes.value || [] 
                }));
                setDataLoaded(prev => ({ ...prev, products: true }));
            }

            // Process projects data
            if (projectsRes.status === 'fulfilled') {
                setAllData(prev => ({ 
                    ...prev, 
                    projects: projectsRes.value.projects || projectsRes.value || [] 
                }));
                setDataLoaded(prev => ({ ...prev, projects: true }));
            }

            // Process CVs data
            if (cvsRes.status === 'fulfilled') {
                setAllData(prev => ({ 
                    ...prev, 
                    cvs: cvsRes.value.cvs || cvsRes.value || [] 
                }));
                setDataLoaded(prev => ({ ...prev, cvs: true }));
            }

            // Process orders data
            if (ordersRes.status === 'fulfilled') {
                setAllData(prev => ({ 
                    ...prev, 
                    orders: ordersRes.value.sales || ordersRes.value.orders || ordersRes.value || [] 
                }));
                setDataLoaded(prev => ({ ...prev, orders: true }));
            }

            // Process categories data
            if (categoriesRes.status === 'fulfilled') {
                setAllData(prev => ({ 
                    ...prev, 
                    categories: categoriesRes.value.categories || categoriesRes.value || [] 
                }));
                setDataLoaded(prev => ({ ...prev, categories: true }));
            }

            // Process contributions data
            if (contributionsRes.status === 'fulfilled') {
                setAllData(prev => ({ 
                    ...prev, 
                    contributions: contributionsRes.value.contributions || contributionsRes.value || [] 
                }));
                setDataLoaded(prev => ({ ...prev, contributions: true }));
            }

        } catch (err) {
            setError(err.message || "Failed to fetch admin data");
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    // Function to refresh specific data sections
    const refreshData = useCallback(async (section) => {
        try {
            let endpoint;
            switch (section) {
                case 'products':
                    endpoint = "/merchandise";
                    break;
                case 'projects':
                    endpoint = "/projects";
                    break;
                case 'cvs':
                    endpoint = "/ai/admin/cvs";
                    break;
                case 'orders':
                    endpoint = "/admin/sales";
                    break;
                case 'categories':
                    endpoint = "/categories";
                    break;
                case 'contributions':
                    endpoint = "/contributions";
                    break;
                case 'dashboard':
                default:
                    endpoint = "/dashboard/admin";
                    break;
            }

            const res = await authFetch(endpoint);
            
            if (section === 'dashboard') {
                setDashboardData(res);
            } else {
                let dataToSet;
                if (section === 'orders') {
                    dataToSet = res.sales || res.orders || res || [];
                } else {
                    dataToSet = res[section] || res || [];
                }
                setAllData(prev => ({ 
                    ...prev, 
                    [section]: dataToSet 
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
        fetchAllAdminData,
        refreshData,
    };
}
