"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { useProjects } from "./useProjects";
import { useAuth } from "./useAuth";

export function useProjectDetail() {
  const { id } = useParams();
  const router = useRouter();
  const { user, loading: authLoading, token } = useAuth();
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
  } = useProjects();

  const [isEditing, setIsEditing] = useState(false);
  const [editedDescription, setEditedDescription] = useState("");
  const [editedTechStack, setEditedTechStack] = useState("");
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [showInteractionForm, setShowInteractionForm] = useState(false);
  const [showReviewForm, setShowReviewForm] = useState(false);
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
      alert(`Downloading ${singleProject.title}!`);
    }
  };

  const handleEditClick = () => {
    setIsEditing(true);
  };

  const handleSaveEdit = async () => {
    if (!token) {
      alert("You must be logged in to edit projects.");
      return;
    }
    const updatedData = {
      description: editedDescription,
      tech_stack: editedTechStack,
    };
    const result = await updateProject(singleProject.id, updatedData, token);
    if (result.success) {
      alert("Project updated successfully!");
      setIsEditing(false);
      fetchProjectById(id);
    } else {
      alert(`Failed to update project: ${result.error}`);
    }
  };

  const handleDeleteClick = () => {
    setShowDeleteConfirm(true);
  };

  const handleConfirmDelete = async () => {
    if (!token) {
      alert("You must be logged in to delete projects.");
      return;
    }
    const result = await deleteProject(singleProject.id, token);
    if (result.success) {
      alert("Project deleted successfully!");
      router.push("/projects");
    } else {
      alert(`Failed to delete project: ${result.error}`);
    }
    setShowDeleteConfirm(false);
  };

  const handleExpressInterest = async (interestedIn, message) => {
    if (!token) {
      alert("You must be logged in to express interest.");
      return;
    }

    const result = await createProjectInteraction(
      singleProject.id,
      interestedIn,
      message,
      token
    );
    if (result.success) {
      alert("Your interest has been recorded!");
      setShowInteractionForm(false);
      fetchProjectById(id);
    } else {
      alert(`Failed to express interest: ${result.error}`);
    }
  };

  const handleSubmitReview = async (rating, comment) => {
    const result = await submitReview(
      singleProject.id,
      rating,
      comment,
      token
    );
    if (result.success) {
      alert("Review submitted successfully!");
      setShowReviewForm(false);
      fetchProjectReviews(id);
    } else {
      alert(`Failed to submit review: ${result.error}`);
    }
  };

  // Permission checks
  const canEditOrDelete =
    user &&
    singleProject &&
    (user.role?.name === "admin" ||
      (user.role?.name === "student" &&
        singleProject.user_projects?.some(
          (up) => up.user?.id === user.id && up.interested_in === "contributor"
        )));

  const canExpressInterest =
    user &&
    (user.role?.name === "student" || user.role?.name === "client") &&
    !currentUserProjectInteraction &&
    !canEditOrDelete;

  const canWriteReview = true; // Allow anyone to write reviews (anonymous)

  return {
    // State
    singleProject,
    projectReviews,
    loading: authLoading || loading,
    error,
    user,
    token,
    isEditing,
    editedDescription,
    editedTechStack,
    showDeleteConfirm,
    showInteractionForm,
    showReviewForm,
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
    
    // State setters
    setEditedDescription,
    setEditedTechStack,
    setShowDeleteConfirm,
    setShowInteractionForm,
    setShowReviewForm,
  };
}
