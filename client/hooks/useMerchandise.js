import { useState, useCallback, useRef } from "react";
import { useAuthContext } from "@/contexts/AuthContext";

export function useMerchandise() {
    const { authFetch } = useAuthContext();
    const [merchandise, setMerchandise] = useState([]);
    const [singleItem, setSingleItem] = useState(null);
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 0,
        current_page: 1,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [isCached, setIsCached] = useState(false);
    const cacheRef = useRef(new Map()); // Cache for different parameter combinations

    const fetchMerchandise = useCallback(async ({ page = 1, perPage = 10, inStock = true, forceRefresh = false } = {}) => {
        // Create cache key based on parameters
        const cacheKey = `${page}-${perPage}-${inStock}`;
        
        // Check if we have cached data and don't force refresh
        if (!forceRefresh && cacheRef.current.has(cacheKey)) {
            const cachedData = cacheRef.current.get(cacheKey);
            setMerchandise(cachedData.merchandise);
            setPagination(cachedData.pagination);
            setIsCached(true);
            return;
        }
        
        setLoading(true);
        setError(null);
        setIsCached(false);
        try {
            const res = await authFetch(`/merchandise?page=${page}&per_page=${perPage}&in_stock=${inStock}`);
            const merchandiseData = res.merchandise;
            const paginationData = {
                total: res.total,
                pages: res.pages,
                current_page: res.current_page,
            };
            
            // Cache the result
            cacheRef.current.set(cacheKey, {
                merchandise: merchandiseData,
                pagination: paginationData,
                timestamp: Date.now()
            });
            
            setMerchandise(merchandiseData);
            setPagination(paginationData);
            setIsCached(true);
        } catch (err) {
            setError(err.message || "Failed to fetch merchandise");
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    const fetchMerchandiseById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authFetch(`/merchandise/${id}`);
            setSingleItem(res.merchandise);
        } catch (err) {
            setError(err.message || "Failed to fetch merchandise item");
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    const createMerchandise = useCallback(async (data) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authFetch(`/merchandise`, {
                method: "POST",
                body: JSON.stringify(data),
            });
            return { success: true, item: res.merchandise };
        } catch (err) {
            setError(err.message || "Failed to create merchandise");
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    const updateMerchandise = useCallback(async (id, data) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authFetch(`/merchandise/${id}`, {
                method: "PUT",
                body: JSON.stringify(data),
            });
            return { success: true, item: res.merchandise };
        } catch (err) {
            setError(err.message || "Failed to update merchandise");
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    const deleteMerchandise = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            await authFetch(`/merchandise/${id}`, {
                method: "DELETE",
            });
            return { success: true };
        } catch (err) {
            setError(err.message || "Failed to delete merchandise");
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    // Helper function to clear cache
    const clearCache = useCallback(() => {
        cacheRef.current.clear();
        setIsCached(false);
    }, []);
    
    // Helper function to refresh data (force refetch)
    const refreshMerchandise = useCallback(async (params = {}) => {
        return await fetchMerchandise({ ...params, forceRefresh: true });
    }, [fetchMerchandise]);

    return {
        merchandise,
        singleItem,
        pagination,
        loading,
        error,
        isCached,
        fetchMerchandise,
        fetchMerchandiseById,
        createMerchandise,
        updateMerchandise,
        deleteMerchandise,
        clearCache,
        refreshMerchandise,
    };
}
