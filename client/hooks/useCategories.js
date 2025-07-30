"use client";

import { useState, useCallback } from "react";
import apiClient from "@/lib/apiClient";

export function useCategories() {
  const [categories, setCategories] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/categories', {
        withCredentials: true
      });

      const data = response.data;
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message || "Failed to fetch categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const createCategory = useCallback(async (categoryData, token) => {
    setLoading(true);
    setError(null);

    try {
      // Set the token for this request
      apiClient.defaults.headers.Authorization = `Bearer ${token}`;
      const response = await apiClient.post('/admin/categories', categoryData, {
        withCredentials: true
      });

      const data = response.data;
      setCategories(prev => [...prev, data.category]);
      return { success: true, category: data.category };
    } catch (err) {
      setError(err.message || "Failed to create category");
      console.error("Error creating category:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const updateCategory = useCallback(async (id, categoryData, token) => {
    setLoading(true);
    setError(null);

    try {
      // Set the token for this request
      apiClient.defaults.headers.Authorization = `Bearer ${token}`;
      const response = await apiClient.put(`/admin/categories/${id}`, categoryData, {
        withCredentials: true
      });

      const data = response.data;
      setCategories(prev => 
        prev.map(cat => cat.id === id ? data.category : cat)
      );
      return { success: true, category: data.category };
    } catch (err) {
      setError(err.message || "Failed to update category");
      console.error("Error updating category:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteCategory = useCallback(async (id, token) => {
    setLoading(true);
    setError(null);

    try {
      // Set the token for this request
      apiClient.defaults.headers.Authorization = `Bearer ${token}`;
      await apiClient.delete(`/admin/categories/${id}`, {
        withCredentials: true
      });

      setCategories(prev => prev.filter(cat => cat.id !== id));
      return { success: true };
    } catch (err) {
      setError(err.message || "Failed to delete category");
      console.error("Error deleting category:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    categories,
    loading,
    error,
    fetchCategories,
    createCategory,
    updateCategory,
    deleteCategory,
  };
}
