"use client";

import { useState, useCallback, useRef } from "react";

const API_BASE = process.env.NEXT_PUBLIC_API_URL || "/api";

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

        const fullUrl = `${API_BASE}/projects/approved?${params}`;
        console.log('🔍 Fetching projects from:', fullUrl);
        const response = await fetch(fullUrl);

        if (!response.ok) {
          console.error('❌ Response not OK:', response.status, response.statusText);
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
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

        const response = await fetch(`${API_BASE}/projects/featured?${params}`);

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
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

        const response = await fetch(`${API_BASE}/projects/approved?${params}`);

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
        const response = await fetch(`${API_BASE}/projects/my`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();
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

        const response = await fetch(`${API_BASE}/projects?${params}`, {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const data = await response.json();

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
        const response = await fetch(`${API_BASE}/projects/create`, {
          method: "POST",
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
      const response = await fetch(`${API_BASE}/categories`);

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

  const createProjectInteraction = useCallback(
    async (projectId, interestedIn, message, token) => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`${API_BASE}/user-projects`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            project_id: projectId,
            interested_in: interestedIn,
            message,
          }),
        });

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
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
      setLoading(true);
      setError(null);
      try {
        // Build headers object conditionally
        const headers = {
          "Content-Type": "application/json",
        };
        
        // Only add Authorization header if token is provided
        if (token) {
          headers.Authorization = `Bearer ${token}`;
        }
        
        const response = await fetch(
          `${API_BASE}/projects/${projectId}/reviews`,
          {
            method: "POST",
            headers,
            body: JSON.stringify({ rating, comment }),
          }
        );

        if (!response.ok) {
          const errorData = await response.json();
          throw new Error(
            errorData.error || `HTTP error! status: ${response.status}`
          );
        }

        const data = await response.json();
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
      const response = await fetch(`${API_BASE}/projects/${projectId}/reviews`);
      if (!response.ok) {
        throw new Error(`HTTP error! status: ${response.status}`);
      }
      const data = await response.json();
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
    
    // Cache management
    clearCache,
    refreshProjects,
    
    // LEGACY (for backward compatibility)
    fetchProjects, // Maps to fetchPublicProjects
  };
}
