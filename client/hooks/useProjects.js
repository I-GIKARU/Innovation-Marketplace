"use client";

import { useState, useCallback, useRef } from "react";
import apiClient from "@/lib/apiClient";
import toast from 'react-hot-toast';

export function useProjects() {
  const [projects, setProjects] = useState([]);
  const [featuredProjects, setFeaturedProjects] = useState([]);
  const [myProjects, setMyProjects] = useState([]);
  const [allProjects, setAllProjects] = useState([]); // For admin view
  const [singleProject, setSingleProject] = useState(null);
  const [categories, setCategories] = useState([]);
  const [pagination, setPagination] = useState({
    total: 0,
    pages: 0,
    current_page: 1,
  });
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const [projectReviews, setProjectReviews] = useState([]);
  const [statusCounts, setStatusCounts] = useState({}); // For admin dashboard
  const [isCached, setIsCached] = useState(false);
  const cacheRef = useRef(new Map()); // Cache for different parameter combinations

  // NEW: Fetch public projects (approved only) with caching
  const fetchPublicProjects = useCallback(
    async ({
      page = 1,
      per_page = 12,
      search = "",
      category_id = null,
      featured = null,
      forceRefresh = false,
    } = {}) => {
      // Create cache key based on parameters
      const cacheKey = `${page}-${per_page}-${search}-${category_id}-${featured}`;
      
      // Check if we have cached data and don't force refresh
      if (!forceRefresh && cacheRef.current.has(cacheKey)) {
        const cachedData = cacheRef.current.get(cacheKey);
        setProjects(cachedData.projects);
        setPagination(cachedData.pagination);
        setIsCached(true);
        console.log('✅ Using cached data for:', cacheKey);
        return;
      }
      
      setLoading(true);
      setError(null);
      setIsCached(false);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: per_page.toString(),
        });

        if (search) params.append("search", search);
        if (category_id) params.append("category_id", category_id.toString());
        if (featured !== null) params.append("featured", featured.toString());

        const fullUrl = `/projects/approved?${params}`;
        console.log('🔍 Fetching projects from:', fullUrl);
        const response = await apiClient.get(fullUrl);

        const data = response.data;
        console.log('✅ API Response data:', data);
        console.log('🔢 Projects count:', data.projects?.length || 0);

        const projectsData = data.projects || [];
        const paginationData = {
          total: data.total || 0,
          pages: data.pages || 0,
          current_page: data.current_page || 1,
        };
        
        // Cache the result
        cacheRef.current.set(cacheKey, {
          projects: projectsData,
          pagination: paginationData,
          timestamp: Date.now()
        });

        setProjects(projectsData);
        setPagination(paginationData);
        setIsCached(true);
        
        console.log('📊 State updated - Projects:', projectsData.length, 'Pagination:', paginationData);
      } catch (err) {
        setError(err.message || "Failed to fetch projects");
        console.error("Error fetching projects:", err);
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // NEW: Fetch featured projects for homepage
  const fetchFeaturedProjects = useCallback(
    async (limit = 6) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams();
        if (limit) params.append("limit", limit.toString());

        const response = await apiClient.get(`/projects/featured?${params}`);
        const data = response.data;
        setFeaturedProjects(data.projects || []);
        return { success: true, projects: data.projects, count: data.count };
      } catch (err) {
        setError(err.message || "Failed to fetch featured projects");
        console.error("Error fetching featured projects:", err);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // NEW: Fetch approved projects by category
  const fetchProjectsByCategory = useCallback(
    async (categoryId, { page = 1, per_page = 12 } = {}) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: per_page.toString(),
          category_id: categoryId.toString(), // Filter by category using query parameter
        });

        const response = await apiClient.get(`/projects/approved?${params}`);
        const data = response.data;

        setProjects(data.projects || []);
        setPagination({
          total: data.total || 0,
          pages: data.pages || 0,
          current_page: data.current_page || 1,
        });
        return { success: true, projects: data.projects };
      } catch (err) {
        setError(err.message || "Failed to fetch projects by category");
        console.error("Error fetching projects by category:", err);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // NEW: Fetch student's own projects
  const fetchMyProjects = useCallback(
    async (token) => {
      setLoading(true);
      setError(null);

      try {
        // Set the token for this request
        apiClient.defaults.headers.Authorization = `Bearer ${token}`;
        const response = await apiClient.get('/projects/my');
        const data = response.data;
        setMyProjects(data.projects || []);
        setStatusCounts(data.status_counts || {});
        return { success: true, projects: data.projects, status_counts: data.status_counts };
      } catch (err) {
        setError(err.message || "Failed to fetch my projects");
        console.error("Error fetching my projects:", err);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // NEW: Fetch all projects for admin
  const fetchAllProjects = useCallback(
    async (token, {
      page = 1,
      per_page = 12,
      status = "",
      search = "",
      category_id = null,
    } = {}) => {
      setLoading(true);
      setError(null);

      try {
        const params = new URLSearchParams({
          page: page.toString(),
          per_page: per_page.toString(),
        });

        if (status) params.append("status", status);
        if (search) params.append("search", search);
        if (category_id) params.append("category_id", category_id.toString());

        // Set the token for this request
        apiClient.defaults.headers.Authorization = `Bearer ${token}`;
        const response = await apiClient.get(`/projects?${params}`);
        const data = response.data;

        setAllProjects(data.projects || []);
        setPagination({
          total: data.total || 0,
          pages: data.pages || 0,
          current_page: data.current_page || 1,
        });
        setStatusCounts(data.status_counts || {});
        return { success: true, projects: data.projects, status_counts: data.status_counts };
      } catch (err) {
        setError(err.message || "Failed to fetch all projects");
        console.error("Error fetching all projects:", err);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // NEW: Create a new project
  const createProject = useCallback(
    async (projectData, token) => {
      setLoading(true);
      setError(null);

      try {
        // Set the token for this request
        apiClient.defaults.headers.Authorization = `Bearer ${token}`;
        const response = await apiClient.post('/projects/create', projectData);
        const data = response.data;
        return { success: true, project: data.project, message: data.message };
      } catch (err) {
        setError(err.message || "Failed to create project");
        console.error("Error creating project:", err);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // LEGACY: Keep old method for backward compatibility
  const fetchProjects = fetchPublicProjects;

  const fetchProjectById = useCallback(async (id) => {
    setLoading(true);
    setError(null);
    // Don't clear singleProject immediately to prevent flashing

    try {
      const response = await apiClient.get(`/projects/${id}`);
      const data = response.data;
      setSingleProject(data.project || null);
      setError(null); // Clear any previous errors on success
    } catch (err) {
      const errorMessage = err.message || "Failed to fetch project";
      setError(errorMessage);
      // Only clear singleProject if this is a 404 or similar "not found" error
      if (err.response?.status === 404) {
        setSingleProject(null);
      }
      console.error("Error fetching project:", err);
    } finally {
      setLoading(false);
    }
  }, []);

  const fetchCategories = useCallback(async () => {
    setLoading(true);
    setError(null);

    try {
      const response = await apiClient.get('/categories');
      const data = response.data;
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
      await apiClient.post(`/projects/${id}/click`);
    } catch (err) {
      console.error("Error recording project click:", err);
    }
  }, []);

  const recordProjectDownload = useCallback(async (id) => {
    try {
      await apiClient.post(`/projects/${id}/download`);
    } catch (err) {
      console.error("Error recording project download:", err);
    }
  }, []);

  const updateProject = useCallback(async (id, projectData, token) => {
    setLoading(true);
    setError(null);
    try {
      // Set the token for this request
      apiClient.defaults.headers.Authorization = `Bearer ${token}`;
      const response = await apiClient.put(`/projects/${id}`, projectData);
      const data = response.data;
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
      // Set the token for this request
      apiClient.defaults.headers.Authorization = `Bearer ${token}`;
      await apiClient.delete(`/projects/${id}`);

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

  const createProjectInteraction = useCallback(
    async (projectId, interestedIn, message, token) => {
      setLoading(true);
      setError(null);
      try {
        // Set the token for this request
        apiClient.defaults.headers.Authorization = `Bearer ${token}`;
        const response = await apiClient.post('/user-projects', {
          project_id: projectId,
          interested_in: interestedIn,
          message,
        });
        const data = response.data;
        return { success: true, userProject: data.user_project };
      } catch (err) {
        setError(err.message || "Failed to create project interaction");
        console.error("Error creating project interaction:", err);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const submitReview = useCallback(
    async (projectId, rating, comment, token) => {
      // Ensure authentication is required
      if (!token) {
        const message = "Please log in to submit a review";
        toast.error(message);
        return { success: false, error: message };
      }
      
      setLoading(true);
      setError(null);
      try {
        // Set the token for this request
        apiClient.defaults.headers.Authorization = `Bearer ${token}`;
        const response = await apiClient.post(`/projects/${projectId}/reviews`, {
          rating,
          comment
        });
        const data = response.data;
        return { success: true, review: data.review };
      } catch (err) {
        setError(err.message || "Failed to submit review");
        console.error("Error submitting review:", err);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  const fetchProjectReviews = useCallback(async (projectId) => {
    setLoading(true);
    setError(null);
    try {
      const response = await apiClient.get(`/projects/${projectId}/reviews`);
      const data = response.data;
      setProjectReviews(data.reviews || []);
      return { success: true, reviews: data.reviews };
    } catch (err) {
      setError(err.message || "Failed to fetch project reviews");
      console.error("Error fetching project reviews:", err);
      return { success: false, error: err.message };
    } finally {
      setLoading(false);
    }
  }, []);

  const hireTeam = useCallback(
    async (projectId, hireData) => {
      setLoading(true);
      setError(null);
      try {
        const response = await apiClient.post(`/projects/${projectId}/hire`, hireData);
        const data = response.data;
        return { success: true, message: data.message };
      } catch (err) {
        setError(err.message || "Failed to send hire request");
        console.error("Error sending hire request:", err);
        return { success: false, error: err.message };
      } finally {
        setLoading(false);
      }
    },
    []
  );

  // Helper function to clear cache
  const clearCache = useCallback(() => {
    cacheRef.current.clear();
    setIsCached(false);
  }, []);
  
  // Helper function to refresh data (force refetch)
  const refreshProjects = useCallback(async (params = {}) => {
    return await fetchPublicProjects({ ...params, forceRefresh: true });
  }, [fetchPublicProjects]);

  return {
    // State
    projects,
    featuredProjects,
    myProjects,
    allProjects,
    singleProject,
    categories,
    pagination,
    loading,
    error,
    projectReviews,
    statusCounts,
    isCached,
    
    // NEW Organized Methods
    fetchPublicProjects,
    fetchFeaturedProjects,
    fetchProjectsByCategory,
    fetchMyProjects,
    fetchAllProjects,
    createProject,
    
    // Existing Methods (unchanged)
    fetchProjectById,
    fetchCategories,
    recordProjectClick,
    recordProjectDownload,
    updateProject,
    deleteProject,
    createProjectInteraction,
    submitReview,
    fetchProjectReviews,
    hireTeam,
    
    // Cache management
    clearCache,
    refreshProjects,
    
    // LEGACY (for backward compatibility)
    fetchProjects, // Maps to fetchPublicProjects
  };
}
