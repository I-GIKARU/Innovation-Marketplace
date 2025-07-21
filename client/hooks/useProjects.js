"use client";

import { useState, useCallback } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "http://localhost:5000/api";

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [singleProject, setSingleProject] = useState(null);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    current_page: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);

  const fetchProjects = useCallback(
    async ({
      page = 1,
      per_page = 12,
      search = "",
      category = "",
      featured = null,
      approved = true,
    } = {}) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: per_page.toString(),
          approved: approved.toString(),
        });

        if (search) params.append("search", search);
        if (category) params.append("category", category);
        if (featured !== null) params.append("featured", featured.toString());

        const response = await fetch(`${API_BASE}/projects?${params}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

        setProjects(data.projects || []);
        setPagination({
          total: data.total || 0,
          pages: data.pages || 0,
          current_page: data.current_page || 1,
        });
      } catch (err) {
        setError(err.message || "Failed to fetch projects");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchProjectById = useCallback(async (id) => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/projects/${id}`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setSingleProject(data.project || null);
    } catch (err) {
      setError(err.message || "Failed to fetch project");
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await fetch(`${API_BASE}/projects/categories`);

      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }

      const data = await response.json();
      setCategories(data.categories || []);
    } catch (err) {
      setError(err.message || "Failed to fetch categories");
      console.error("Error fetching categories:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const recordProjectClick = useCallback(async (id) => {
    try {
      await fetch(`${API_BASE}/projects/${id}/click`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Error recording project click:", err);
    }
  }, []);

  const recordProjectDownload = useCallback(async (id) => {
    try {
      await fetch(`${API_BASE}/projects/${id}/download`, {
        method: "POST",
      });
    } catch (err) {
      console.error("Error recording project download:", err);
    }
  }, []);

  const updateProject = useCallback(async (id, projectData, token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/projects/${id}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(projectData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      const data = await response.json();
      setSingleProject(data.project); // Update the single project state
      return { success: true, project: data.project };
    } catch (err) {
      setError(err.message || "Failed to update project");
      console.error("Error updating project:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const deleteProject = useCallback(async (id, token) => {
    setLoading(true);
    setError(null);
    try {
      const response = await fetch(`${API_BASE}/projects/${id}`, {
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(
          errorData.error || `HTTP error! status: ${response.status}`
        );
      }

      setSingleProject(null);
      return { success: true };
    } catch (err) {
      setError(err.message || "Failed to delete project");
      console.error("Error deleting project:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  return {
    projects,
    singleProject,
    categories,
    pagination,
    loading,
    error,
    fetchProjects,
    fetchProjectById,
    fetchCategories,
    recordProjectClick,
    recordProjectDownload,
    updateProject,
    deleteProject,
  };
}
