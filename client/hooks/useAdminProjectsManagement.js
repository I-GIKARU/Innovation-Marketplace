import { useState, useEffect, useCallback } from 'react';

export const useAdminProjectsManagement = () => {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [updatingProject, setUpdatingProject] = useState(null);
  const [deletingProject, setDeletingProject] = useState(null);
  const [togglingFeatured, setTogglingFeatured] = useState(null);

  const fetchProjects = useCallback(async () => {
    try {
      setLoading(true);
      setError(null);
      
      const token = localStorage.getItem('token');
      const response = await fetch('/api/projects', {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to fetch projects');
      }

      const data = await response.json();
      setProjects(data.projects || data);
    } catch (err) {
      console.error('Error fetching projects:', err);
      setError(err.message);
    } finally {
      setLoading(false);
    }
  }, []);

  const updateProjectStatus = useCallback(async (projectId, newStatus) => {
    setUpdatingProject(projectId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ status: newStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update project status');
      }

      const result = await response.json();
      const actionText = newStatus === 'approved' ? 'approved' : 'rejected';
      
      // Refresh projects to show updated status
      await fetchProjects();
      
      return {
        success: true,
        message: `Project "${result.project?.title || 'Unknown'}" has been ${actionText} successfully!`
      };
    } catch (err) {
      console.error('Error updating project status:', err);
      return {
        success: false,
        message: `Failed to update project status: ${err.message}`
      };
    } finally {
      setUpdatingProject(null);
    }
  }, [fetchProjects]);

  const rejectProjectWithReason = useCallback(async (projectId, rejectionReason) => {
    setUpdatingProject(projectId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ 
          status: 'rejected',
          rejection_reason: rejectionReason.trim() || 'Project rejected without specific reason'
        }),
      });
      
      if (!response.ok) {
        throw new Error('Failed to reject project');
      }

      await fetchProjects();
      return {
        success: true,
        message: 'Project has been rejected successfully!'
      };
    } catch (err) {
      console.error('Error rejecting project:', err);
      return {
        success: false,
        message: `Failed to reject project: ${err.message}`
      };
    } finally {
      setUpdatingProject(null);
    }
  }, [fetchProjects]);

  const deleteProject = useCallback(async (projectId) => {
    setDeletingProject(projectId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'DELETE',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });

      if (!response.ok) {
        throw new Error('Failed to delete project');
      }

      await fetchProjects();
      return {
        success: true,
        message: 'Project has been deleted successfully!'
      };
    } catch (err) {
      console.error('Error deleting project:', err);
      return {
        success: false,
        message: `Failed to delete project: ${err.message}`
      };
    } finally {
      setDeletingProject(null);
    }
  }, [fetchProjects]);

  const toggleFeaturedStatus = useCallback(async (projectId, currentFeaturedStatus) => {
    setTogglingFeatured(projectId);
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'PUT',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
        body: JSON.stringify({ featured: !currentFeaturedStatus }),
      });

      if (!response.ok) {
        throw new Error('Failed to update featured status');
      }

      const result = await response.json();
      const actionText = result.project.featured ? 'featured' : 'unfeatured';
      
      // Update local state instead of refetching all projects
      setProjects(prevProjects => 
        prevProjects.map(project => 
          project.id === projectId 
            ? { ...project, featured: result.project.featured }
            : project
        )
      );

      return {
        success: true,
        message: `Project has been ${actionText} successfully!`
      };
    } catch (err) {
      console.error('Error updating featured status:', err);
      return {
        success: false,
        message: `Failed to update featured status: ${err.message}`
      };
    } finally {
      setTogglingFeatured(null);
    }
  }, []);

  const fetchProjectDetails = useCallback(async (projectId) => {
    try {
      const token = localStorage.getItem('token');
      const response = await fetch(`/api/projects/${projectId}`, {
        method: 'GET',
        credentials: 'include',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${token}`,
        },
      });
      
      if (!response.ok) {
        throw new Error('Failed to fetch project details');
      }
      
      const data = await response.json();
      return {
        success: true,
        project: data.project || data
      };
    } catch (err) {
      console.error('Error fetching project details:', err);
      return {
        success: false,
        error: err.message
      };
    }
  }, []);

  useEffect(() => {
    fetchProjects();
  }, [fetchProjects]);

  return {
    // State
    projects,
    loading,
    error,
    updatingProject,
    deletingProject,
    togglingFeatured,
    
    // Actions
    fetchProjects,
    updateProjectStatus,
    rejectProjectWithReason,
    deleteProject,
    toggleFeaturedStatus,
    fetchProjectDetails,
  };
};
