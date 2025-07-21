"use client";

import { useEffect, useState, useCallback } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  FiGithub,
  FiExternalLink,
  FiEye,
  FiDownload,
  FiStar,
  FiMail,
  FiEdit,
  FiTrash2,
  FiMessageSquare,
  FiStar as FiStarFilled,
} from "react-icons/fi";

import { useProjects } from "@/hooks/useProjects";
import { useAuth } from "@/hooks/useAuth";
import Image from "next/image";

export default function ProjectDetail() {
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
  const [userProjectMessage, setUserProjectMessage] = useState("");
  const [userProjectInterestedIn, setUserProjectInterestedIn] = useState("");
  const [currentUserProjectInteraction, setCurrentUserProjectInteraction] =
    useState(null);

  const [showReviewForm, setShowReviewForm] = useState(false);
  const [reviewRating, setReviewRating] = useState(0);
  const [reviewComment, setReviewComment] = useState("");

  const defaultImage =
    "https://images.pexels.com/photos/32980837/pexels-photo-32980837.jpeg";
  const defaultUserAvatar = "/placeholder.svg?height=48&width=48";

  const fetchProjectData = useCallback(async () => {
    if (id) {
      await fetchProjectById(id);
      await fetchProjectReviews(id);
    }
  }, [id, fetchProjectById, fetchProjectReviews]);

  useEffect(() => {
    fetchProjectData();
  }, [fetchProjectData]);

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
      fetchProjectData(); // Re-fetch data to ensure UI is up-to-date
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
      router.push("/projects"); // Redirect to projects list after deletion
    } else {
      alert(`Failed to delete project: ${result.error}`);
    }
    setShowDeleteConfirm(false);
  };

  const handleExpressInterest = async () => {
    if (!token) {
      alert("You must be logged in to express interest.");
      return;
    }
    if (!userProjectInterestedIn || !userProjectMessage) {
      alert("Please select your interest and provide a message.");
      return;
    }

    const result = await createProjectInteraction(
      singleProject.id,
      userProjectInterestedIn,
      userProjectMessage,
      token
    );
    if (result.success) {
      alert("Your interest has been recorded!");
      setShowInteractionForm(false);
      setUserProjectMessage("");
      setUserProjectInterestedIn("");
      fetchProjectData();
    } else {
      alert(`Failed to express interest: ${result.error}`);
    }
  };

  const handleSubmitReview = async () => {
    if (!token) {
      alert("You must be logged in to submit a review.");
      return;
    }
    if (!reviewRating || reviewRating < 1 || reviewRating > 5) {
      alert("Please provide a rating between 1 and 5.");
      return;
    }
    if (!currentUserProjectInteraction?.id) {
      alert("No valid interaction found to review.");
      return;
    }

    const result = await submitReview(
      currentUserProjectInteraction.id,
      reviewRating,
      reviewComment,
      token
    );
    if (result.success) {
      alert("Review submitted successfully!");
      setShowReviewForm(false);
      setReviewRating(0);
      setReviewComment("");
      fetchProjectData(); // Re-fetch reviews
    } else {
      alert(`Failed to submit review: ${result.error}`);
    }
  };

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

  const canWriteReview =
    user &&
    user.role?.name === "client" &&
    currentUserProjectInteraction &&
    !projectReviews.some(
      (review) => review.user_project_id === currentUserProjectInteraction.id
    );

  if (authLoading || loading) {
    return <div className="p-4 text-center">Loading project details...</div>;
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>;
  }

  if (!singleProject) {
    return <div className="p-4 text-center">Project not found.</div>;
  }

  const teamMembers = singleProject.user_projects?.filter(
    (up) => up.interested_in === "contributor" && up.user
  );

  return (
    <div className="p-4">
      <div className="bg-white rounded-xl shadow-lg p-6 mt-6 max-w-4xl mx-auto">
        <div className="relative mb-6">
          <Image
            src={singleProject.image_url || defaultImage}
            alt={singleProject.title}
            width={800}
            height={450}
            className="w-full h-auto object-cover rounded-lg"
          />
          {singleProject.featured && (
            <div className="absolute top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-full text-sm flex items-center">
              <FiStar className="w-4 h-4 mr-1" />
              Featured
            </div>
          )}
          {singleProject.is_for_sale && (
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">
              For Sale
            </div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          {singleProject.title}
        </h1>
        {singleProject.category?.name && (
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4">
            {singleProject.category.name}
          </span>
        )}

        {isEditing ? (
          <textarea
            className="w-full p-2 border rounded-md mb-4 text-gray-700 text-lg"
            value={editedDescription}
            onChange={(e) => setEditedDescription(e.target.value)}
            rows={5}
          />
        ) : (
          <p className="text-gray-700 text-lg mb-6">
            {singleProject.description}
          </p>
        )}

        {singleProject.tech_stack && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Tech Stack
            </h3>
            {isEditing ? (
              <input
                type="text"
                className="w-full p-2 border rounded-md text-gray-700"
                value={editedTechStack}
                onChange={(e) => setEditedTechStack(e.target.value)}
              />
            ) : (
              <p className="text-gray-700">{singleProject.tech_stack}</p>
            )}
          </div>
        )}

        {singleProject.technical_mentor && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">
              Technical Mentor
            </h3>
            <p className="text-gray-700">{singleProject.technical_mentor}</p>
          </div>
        )}

        <div className="flex items-center justify-between text-gray-600 text-sm mb-6">
          <div className="flex items-center space-x-4">
            <span className="flex items-center">
              <FiEye className="w-4 h-4 mr-1" />
              {singleProject.views || 0} views
            </span>
            <span className="flex items-center">
              <FiDownload className="w-4 h-4 mr-1" />
              {singleProject.downloads || 0} downloads
            </span>
          </div>
        </div>

        <div className="flex flex-wrap gap-4 mb-6">
          {singleProject.github_link && (
            <a
              href={singleProject.github_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-gray-800 text-white rounded-md hover:bg-gray-700 transition-colors"
            >
              <FiGithub className="w-5 h-5 mr-2" />
              View Code
            </a>
          )}
          {singleProject.demo_link && (
            <a
              href={singleProject.demo_link}
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 transition-colors"
            >
              <FiExternalLink className="w-5 h-5 mr-2" />
              Live Demo
            </a>
          )}
          {singleProject.is_for_sale && (
            <button
              onClick={handleDownload}
              className="flex items-center px-4 py-2 bg-orange-500 text-white rounded-md hover:bg-orange-600 transition-colors"
            >
              <FiDownload className="w-5 h-5 mr-2" />
              Download
            </button>
          )}

          {canEditOrDelete && (
            <>
              {isEditing ? (
                <button
                  onClick={handleSaveEdit}
                  className="flex items-center px-4 py-2 bg-green-600 text-white rounded-md hover:bg-green-700 transition-colors"
                >
                  Save Changes
                </button>
              ) : (
                <button
                  onClick={handleEditClick}
                  className="flex items-center px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
                >
                  <FiEdit className="w-5 h-5 mr-2" />
                  Edit Project
                </button>
              )}
              <button
                onClick={handleDeleteClick}
                className="flex items-center px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 transition-colors"
              >
                <FiTrash2 className="w-5 h-5 mr-2" />
                Delete Project
              </button>
            </>
          )}

          {canExpressInterest && (
            <button
              onClick={() => setShowInteractionForm(true)}
              className="flex items-center px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700 transition-colors"
            >
              <FiMessageSquare className="w-5 h-5 mr-2" />
              Express Interest
            </button>
          )}

          {canWriteReview && (
            <button
              onClick={() => setShowReviewForm(true)}
              className="flex items-center px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700 transition-colors"
            >
              <FiStarFilled className="w-5 h-5 mr-2" />
              Write a Review
            </button>
          )}
        </div>

        {showDeleteConfirm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg">
              <h3 className="text-lg font-bold mb-4">Confirm Deletion</h3>
              <p className="mb-4">
                Are you sure you want to delete this project? This action cannot
                be undone.
              </p>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowDeleteConfirm(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleConfirmDelete}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700"
                >
                  Delete
                </button>
              </div>
            </div>
          </div>
        )}

        {showInteractionForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">
                Express Interest in {singleProject.title}
              </h3>
              <div className="mb-4">
                <label
                  htmlFor="interestedIn"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  I am interested in:
                </label>
                <select
                  id="interestedIn"
                  className="w-full p-2 border rounded-md"
                  value={userProjectInterestedIn}
                  onChange={(e) => setUserProjectInterestedIn(e.target.value)}
                >
                  <option value="">Select an option</option>
                  {user?.role?.name === "student" && (
                    <option value="collaboration">Collaboration</option>
                  )}
                  {user?.role?.name === "client" && (
                    <>
                      <option value="buying">Buying</option>
                      <option value="hiring">Hiring</option>
                    </>
                  )}
                </select>
              </div>
              <div className="mb-4">
                <label
                  htmlFor="message"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Message:
                </label>
                <textarea
                  id="message"
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  value={userProjectMessage}
                  onChange={(e) => setUserProjectMessage(e.target.value)}
                  placeholder="Tell us why you're interested..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowInteractionForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleExpressInterest}
                  className="px-4 py-2 bg-purple-600 text-white rounded-md hover:bg-purple-700"
                >
                  Submit Interest
                </button>
              </div>
            </div>
          </div>
        )}

        {showReviewForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white p-6 rounded-lg shadow-lg w-full max-w-md">
              <h3 className="text-lg font-bold mb-4">
                Write a Review for {singleProject.title}
              </h3>
              <div className="mb-4">
                <label
                  htmlFor="rating"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Rating (1-5):
                </label>
                <input
                  type="number"
                  id="rating"
                  className="w-full p-2 border rounded-md"
                  min="1"
                  max="5"
                  value={reviewRating}
                  onChange={(e) =>
                    setReviewRating(Number.parseInt(e.target.value))
                  }
                />
              </div>
              <div className="mb-4">
                <label
                  htmlFor="reviewComment"
                  className="block text-sm font-medium text-gray-700 mb-1"
                >
                  Comment:
                </label>
                <textarea
                  id="reviewComment"
                  className="w-full p-2 border rounded-md"
                  rows={4}
                  value={reviewComment}
                  onChange={(e) => setReviewComment(e.target.value)}
                  placeholder="Share your thoughts on this project..."
                />
              </div>
              <div className="flex justify-end gap-2">
                <button
                  onClick={() => setShowReviewForm(false)}
                  className="px-4 py-2 bg-gray-300 rounded-md hover:bg-gray-400"
                >
                  Cancel
                </button>
                <button
                  onClick={handleSubmitReview}
                  className="px-4 py-2 bg-yellow-600 text-white rounded-md hover:bg-yellow-700"
                >
                  Submit Review
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Team Members Section */}
        {teamMembers && teamMembers.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Team Members
            </h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((up) => (
                <div
                  key={up.user.id}
                  className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm"
                >
                  <Image
                    src={defaultUserAvatar || "/placeholder.svg"}
                    alt={up.user.email}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">
                      {up.user.email}
                    </p>
                    {up.user.bio && (
                      <p className="text-sm text-gray-600 line-clamp-1">
                        {up.user.bio}
                      </p>
                    )}
                    <a
                      href={`mailto:${up.user.email}`}
                      className="flex items-center text-blue-600 hover:underline text-sm mt-1"
                    >
                      <FiMail className="w-4 h-4 mr-1" />
                      Contact
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
        {teamMembers && teamMembers.length === 0 && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">
              Team Members
            </h3>
            <p className="text-gray-600">
              No team members listed for this project.
            </p>
          </div>
        )}
        <div className="mt-8 border-t pt-6">
          <h3 className="text-xl font-bold text-gray-900 mb-4">Reviews</h3>
          {projectReviews && projectReviews.length > 0 ? (
            projectReviews.map((review) => (
              <div key={review.id} className="mb-4 p-4 border rounded-md">
                <p className="font-semibold">Rating: {review.rating}/5</p>
                <p className="text-gray-700">{review.comment}</p>
                <p className="text-xs text-gray-500 mt-1">
                  {new Date(review.date).toLocaleDateString()}
                </p>
              </div>
            ))
          ) : (
            <p className="text-gray-600">No reviews yet.</p>
          )}
        </div>
      </div>
    </div>
  );
}
