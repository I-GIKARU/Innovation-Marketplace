import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth";

export function useMerchandise() {
    const { authFetch } = useAuth();
    const [merchandise, setMerchandise] = useState([]);
    const [singleItem, setSingleItem] = useState(null);
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 0,
        current_page: 1,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    const fetchMerchandise = useCallback(async ({ page = 1, perPage = 10, inStock = true } = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authFetch(`/merchandise?page=${page}&per_page=${perPage}&in_stock=${inStock}`);
            setMerchandise(res.merchandise);
            setPagination({
                total: res.total,
                pages: res.pages,
                current_page: res.current_page,
            });
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

    return {
        merchandise,
        singleItem,
        pagination,
        loading,
        error,
        fetchMerchandise,
        fetchMerchandiseById,
        createMerchandise,
        updateMerchandise,
        deleteMerchandise,
    };
}
