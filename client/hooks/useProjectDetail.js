"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProjects } from "./useProjects";
import { useAuthContext } from "@/contexts/AuthContext";
import toast from 'react-hot-toast';

export function useProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading, authFetch } = useAuthContext();
  const {
    singleProject,
    loading,
    error,
    projectReviews,
    fetchProjectById,
    recordProjectDownload,
    updateProject,
    deleteProject,
    createProjectInteraction,
    submitReview,
    fetchProjectReviews,
    hireTeam,
  } = useProjects();

  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedTechStack, setEditedTechStack] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
  const [showHireForm, setShowHireForm] = useState(false);
  const [currentUserProjectInteraction, setCurrentUserProjectInteraction] = useState(null);

  // Load project data on mount and when ID changes
  useEffect(() => {
    if (id) {
      fetchProjectById(id);
      fetchProjectReviews(id);
    }
  }, [id]);

  useEffect(() => {
    if (singleProject) {
      setEditedDescription(singleProject.description || "");
      setEditedTechStack(singleProject.tech_stack || "");

      if (user && singleProject.user_projects) {
        const interaction = singleProject.user_projects.find(
          (up) => up.user?.id === user.id && up.project_id === singleProject.id
        );
        setCurrentUserProjectInteraction(interaction);
      }
    }
  }, [singleProject, user]);

  const handleDownload = () => {
    if (singleProject?.id) {
      recordProjectDownload(singleProject.id);
      toast.success(`Downloading ${singleProject.title}!`);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!user) {
      toast.error("You must be logged in to edit projects.");
      return;
    }
    
    try {
      const updatedData = {
        description: editedDescription,
        tech_stack: editedTechStack,
      };
      await authFetch(`/projects/${singleProject.id}`, {
        method: 'PUT',
        body: JSON.stringify(updatedData)
      });
      toast.success("Project updated successfully!");
      setIsEditing(false);
      fetchProjectById(id);
    } catch (error) {
      toast.error(`Failed to update project: ${error.message}`);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!user) {
      toast.error("You must be logged in to delete projects.");
      return;
    }
    
    try {
      await authFetch(`/projects/${singleProject.id}`, {
        method: 'DELETE'
      });
      toast.success("Project deleted successfully!");
      router.push("/projects");
    } catch (error) {
      toast.error(`Failed to delete project: ${error.message}`);
    }
    setShowDeleteConfirm(false);
  };

  const handleExpressInterest = async (interestedIn, message) => {
    if (!user) {
      toast.error("You must be logged in to express interest.");
      return;
    }

    try {
      await authFetch('/user-projects', {
        method: 'POST',
        body: JSON.stringify({
          project_id: singleProject.id,
          interested_in: interestedIn,
          message
        })
      });
      toast.success("Your interest has been recorded!");
      setShowInteractionForm(false);
      fetchProjectById(id);
    } catch (error) {
      toast.error(error.message || 'Failed to express interest');
    }
  };

  const handleSubmitReview = async (rating, comment) => {
    if (!user) {
      toast.error("Please log in to write a review.");
      return;
    }
    
    try {
      await authFetch(`/projects/${singleProject.id}/reviews`, {
        method: 'POST',
        body: JSON.stringify({ rating, comment })
      });
      toast.success("Review submitted successfully!");
      setShowReviewForm(false);
      fetchProjectReviews(id);
    } catch (error) {
      toast.error(error.message || 'Failed to submit review');
    }
  };

  const handleHireTeam = async (hireData) => {
    if (!user) {
      toast.error("You must be logged in to send a hire request.");
      return;
    }
    
    try {
      await authFetch(`/projects/${singleProject.id}/hire`, {
        method: 'POST',
        body: JSON.stringify(hireData)
      });
      toast.success("Hire request sent successfully! The team will be notified.");
      setShowHireForm(false);
    } catch (error) {
      toast.error(`Failed to send hire request: ${error.message}`);
    }
  };

  const handleReviewClick = () => {
    if (!user) {
      toast.error("Please log in to write a review.");
      return;
    }
    setShowReviewForm(true);
  };

  // Helper function to determine user role (handle both string and object formats)
  const getUserRole = () => {
    if (!user) return null;
    
    // Handle case where role is a string (from API response)
    if (typeof user.role === 'string') {
      return user.role;
    }
    
    // Handle case where role is an object with name property
    if (user.role?.name) {
      return user.role.name;
    }
    
    // Fallback: determine role based on email domain
    if (user.email?.includes('@student.moringaschool.com')) {
      return 'student';
    }
    
    // Default to client for other email domains
    return 'client';
  };

  const userRole = getUserRole();

  // Permission checks
  const canEditOrDelete =
    user &&
    singleProject &&
    (userRole === "admin" ||
      (userRole === "student" &&
        singleProject.user_projects?.some(
          (up) => up.user?.id === user.id && up.interested_in === "contributor"
        )));

  // Always show interaction buttons for logged-in users with valid roles
  const canExpressInterest =
    user &&
    singleProject &&
    (userRole === "student" || userRole === "client");

  const canWriteReview = true; // Show review button to everyone

  // Debug logging (remove in production)
  console.log('Permission Debug:', {
    user: user?.email,
    userRole: user?.role?.name,
    userRoleId: user?.role?.id,
    hasProject: !!singleProject,
    projectId: singleProject?.id,
    projectTitle: singleProject?.title,
    authLoading,
    loading,
    canEditOrDelete,
    canExpressInterest,
    currentUserProjectInteraction,
    userProjects: singleProject?.user_projects?.length || 0
  });

  return {
    // State
    singleProject,
    projectReviews,
    loading: authLoading || loading,
    error,
    user,
    isEditing,
    editedDescription,
    editedTechStack,
    showDeleteConfirm,
    showInteractionForm,
    showReviewForm,
    showHireForm,
    currentUserProjectInteraction,
    
    // Permissions
    canEditOrDelete,
    canExpressInterest,
    canWriteReview,
    
    // Handlers
    handleDownload,
    handleEditClick,
    handleSaveEdit,
    handleDeleteClick,
    handleConfirmDelete,
    handleExpressInterest,
    handleSubmitReview,
    handleHireTeam,
    handleReviewClick,
    
    // State setters
    setEditedDescription,
    setEditedTechStack,
    setShowDeleteConfirm,
    setShowInteractionForm,
    setShowReviewForm,
    setShowHireForm,
  };
}
