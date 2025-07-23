"use client";

import { useProjectDetail } from "@/hooks/useProjectDetail";
import { getProjectImages, getProjectVideos, getProjectPDFs, getProjectZIPs, getTeamMembers } from "@/utils/projectHelpers";
import ProjectDetailLayout from "@/components/project-detail/ProjectDetailLayout";
import ReviewForm from "@/components/project-detail/ReviewForm";
import InteractionForm from "@/components/project-detail/InteractionForm";
import DeleteConfirmModal from "@/components/project-detail/DeleteConfirmModal";

export default function ProjectDetail() {
  const {
    // State
    singleProject,
    projectReviews,
    loading,
    error,
    user,
    isEditing,
    editedDescription,
    editedTechStack,
    showDeleteConfirm,
    showInteractionForm,
    showReviewForm,
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
  } = useProjectDetail();

  if (loading) {
    return <div className="p-4 text-center">Loading project details...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!singleProject) {
    return <div className="p-4 text-center">Project not found.</div>;
  }

  const projectImages = getProjectImages(singleProject);
  const projectVideos = getProjectVideos(singleProject);
  const projectPDFs = getProjectPDFs(singleProject);
  const projectZIPs = getProjectZIPs(singleProject);
  const teamMembers = getTeamMembers(singleProject);

  return (
    <>
      <ProjectDetailLayout
        project={singleProject}
        projectImages={projectImages}
        projectVideos={projectVideos}
        projectPDFs={projectPDFs}
        projectZIPs={projectZIPs}
        teamMembers={teamMembers}
        projectReviews={projectReviews}
        isEditing={isEditing}
        editedDescription={editedDescription}
        editedTechStack={editedTechStack}
        canEditOrDelete={canEditOrDelete}
        canExpressInterest={canExpressInterest}
        canWriteReview={canWriteReview}
        onDescriptionChange={setEditedDescription}
        onTechStackChange={setEditedTechStack}
        onDownload={handleDownload}
        onEdit={handleEditClick}
        onSave={handleSaveEdit}
        onDelete={handleDeleteClick}
        onExpressInterest={() => setShowInteractionForm(true)}
        onWriteReview={() => setShowReviewForm(true)}
      />

      {/* Modals */}
      {showDeleteConfirm && (
        <DeleteConfirmModal
          onConfirm={handleConfirmDelete}
          onCancel={() => setShowDeleteConfirm(false)}
        />
      )}

      {showInteractionForm && (
        <InteractionForm
          project={singleProject}
          user={user}
          onSubmit={handleExpressInterest}
          onCancel={() => setShowInteractionForm(false)}
        />
      )}

      {showReviewForm && (
        <ReviewForm
          project={singleProject}
          user={user}
          onSubmit={handleSubmitReview}
          onCancel={() => setShowReviewForm(false)}
        />
      )}
    </>
  );
}
