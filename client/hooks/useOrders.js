import { useState, useCallback } from "react";
import { useAuth } from "@/hooks/useAuth"; // Update path if needed

export function useOrders() {
    const { authFetch } = useAuth();

    const [orders, setOrders] = useState([]);
    const [order, setOrder] = useState(null);
    const [pagination, setPagination] = useState({
        total: 0,
        pages: 0,
        current_page: 1,
    });
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);

    // ✅ Place order (user)
    const placeOrder = useCallback(async (items) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authFetch(`/orders`, {
                method: "POST",
                body: JSON.stringify({ items }),
            });
            return { success: true, order: res.order };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    const placeGuestOrder = useCallback(async ({ email, items }) => {
        setLoading(true);
        setError(null);
        try {
            const res = await fetch(`/api/guest-orders`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ email, items }),
            });

            const data = await res.json();
            if (!res.ok) throw new Error(data.error || "Guest order failed");

            return { success: true, order: data.order };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, []);

    const fetchUserOrders = useCallback(async ({ page = 1, perPage = 10 } = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authFetch(`/orders?page=${page}&per_page=${perPage}`);
            setOrders(res.orders);
            setPagination({
                total: res.total,
                pages: res.pages,
                current_page: res.current_page,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    const fetchOrderById = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authFetch(`/orders/${id}`);
            setOrder(res.order);
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    // ✅ Cancel user order
    const cancelOrder = useCallback(async (id) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authFetch(`/orders/${id}/cancel`, {
                method: "POST",
            });
            return { success: true, order: res.order };
        } catch (err) {
            setError(err.message);
            return { success: false, error: err.message };
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    const fetchAllOrders = useCallback(async ({ page = 1, perPage = 20 } = {}) => {
        setLoading(true);
        setError(null);
        try {
            const res = await authFetch(`/admin/orders?page=${page}&per_page=${perPage}`);
            setOrders(res.orders);
            setPagination({
                total: res.total,
                pages: res.pages,
                current_page: res.current_page,
            });
        } catch (err) {
            setError(err.message);
        } finally {
            setLoading(false);
        }
    }, [authFetch]);

    return {
        orders,
        order,
        pagination,
        loading,
        error,
        placeOrder,
        placeGuestOrder,
        fetchUserOrders,
        fetchOrderById,
        cancelOrder,
        fetchAllOrders,
    };
}
