"use client";

import { useProjectDetail } from "@/hooks/useProjectDetail";
import { getProjectImages, getProjectVideos, getProjectPDFs, getProjectZIPs, getTeamMembers } from "@/utils/projectHelpers";
import ProjectDetailLayout from "@/components/project-detail/ProjectDetailLayout";
import ReviewForm from "@/components/project-detail/ReviewForm";
import DeleteConfirmModal from "@/components/project-detail/DeleteConfirmModal";
import InteractionForm from "@/components/project-detail/InteractionForm";
import ProjectQA from "@/components/projects/ProjectQA";
import LoadingSpinner from "@/components/ui/LoadingSpinner";
import { useState } from "react";

export default function ProjectDetail() {
  // AI Q&A modal state
  const [showAIModal, setShowAIModal] = useState(false);

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
    handleSubmitReview,
    handleExpressInterest,
    handleHireTeam,
    setEditedDescription,
    setEditedTechStack,
    setShowDeleteConfirm,
    setShowInteractionForm,
    setShowReviewForm,
  } = useProjectDetail();

  const handleAskAI = () => {
    setShowAIModal(true);
  };

  const handleCloseAI = () => {
    setShowAIModal(false);
  };

if (loading || !singleProject) {
    return <div className="p-4 text-center"><LoadingSpinner size="large" text="Loading project details..." /></div>;
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
        onAskAI={handleAskAI}
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
          onSubmit={async (action, interestedIn, message) => {
            if (action === 'hire_team') {
              await handleHireTeam({ message, interested_in: interestedIn });
            } else {
              await handleExpressInterest(interestedIn, message);
            }
          }}
          onCancel={() => setShowInteractionForm(false)}
        />
      )}

      {showReviewForm && (
        <ReviewForm
          project={singleProject}
          user={user}
          onSubmit={async (rating, comment) => {
            await handleSubmitReview(rating, comment);
          }}
          onCancel={() => setShowReviewForm(false)}
        />
      )}


      {showAIModal && (
        <ProjectQA
          isOpen={showAIModal}
          project={singleProject}
          onClose={handleCloseAI}
        />
      )}
    </>
  );
}
