"use client"

import { useEffect } from "react"
import { useParams } from "next/navigation"
import { FiGithub, FiExternalLink, FiEye, FiDownload, FiStar, FiMail } from "react-icons/fi" // Added FiMail icon

import { useProjects } from "@/hooks/useProjects"
import { useAuth } from "@/hooks/useAuth"
import Image from "next/image"



export default function ProjectDetail() {
  const { id } = useParams()
  const { user, loading: authLoading } = useAuth()
  const { singleProject, loading, error, fetchProjectById, recordProjectDownload } = useProjects()

  const defaultImage = "/placeholder.svg?height=400&width=600"
  const defaultUserAvatar = "/placeholder.svg?height=48&width=48"

  useEffect(() => {
    if (id) {
      fetchProjectById(id)
    }
  }, [id, fetchProjectById])

  const handleDownload = () => {
    if (singleProject?.id) {
      recordProjectDownload(singleProject.id)
      alert(`Downloading ${singleProject.title}!`)
    }
  }

  if (authLoading || loading) {
    return <div className="p-4 text-center">Loading project details...</div>
  }

  if (error) {
    return <div className="p-4 text-center text-red-500">Error: {error}</div>
  }

  if (!singleProject) {
    return <div className="p-4 text-center">Project not found.</div>
  }

  const teamMembers = singleProject.user_projects?.filter((up) => up.interested_in === "contributor" && up.user)

  return (
    <div className="p-4">
      <NavBar />
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
            <div className="absolute top-4 left-4 bg-green-500 text-white px-3 py-1 rounded-full text-sm">For Sale</div>
          )}
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">{singleProject.title}</h1>
        {singleProject.category?.name && (
          <span className="inline-block bg-blue-100 text-blue-800 text-sm px-3 py-1 rounded-full mb-4">
            {singleProject.category.name}
          </span>
        )}

        <p className="text-gray-700 text-lg mb-6">{singleProject.description}</p>

        {singleProject.tech_stack && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Tech Stack</h3>
            <p className="text-gray-700">{singleProject.tech_stack}</p>
          </div>
        )}

        {singleProject.technical_mentor && (
          <div className="mb-4">
            <h3 className="text-lg font-semibold text-gray-800 mb-2">Technical Mentor</h3>
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
        </div>
        {/* Team Members Section */}
        {teamMembers && teamMembers.length > 0 && (
          <div className="mt-8 border-t pt-6">
            <h3 className="text-xl font-bold text-gray-900 mb-4">Team Members</h3>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              {teamMembers.map((up) => (
                <div key={up.user.id} className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg shadow-sm">
                  <Image
                    src={defaultUserAvatar || "/placeholder.svg"}
                    alt={up.user.email}
                    width={48}
                    height={48}
                    className="rounded-full object-cover"
                  />
                  <div>
                    <p className="font-semibold text-gray-800">{up.user.email}</p>
                    {up.user.bio && <p className="text-sm text-gray-600 line-clamp-1">{up.user.bio}</p>}
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
            <h3 className="text-xl font-bold text-gray-900 mb-4">Team Members</h3>
            <p className="text-gray-600">No team members listed for this project.</p>
          </div>
        )}
        <div className="mt-8 border-t pt-6">
                      <h3 className="text-xl font-bold text-gray-900 mb-4">Reviews</h3>
                      {singleProject.reviews && singleProject.reviews.length > 0 ? (
                          singleProject.reviews.map((review) => (
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
      <Footer />  
    </div>
  )
}
