const defaultImage = "/images/marketplace.png";

// Helper function to get project images (using thumbnail_url only)
export const getProjectImages = (project) => {
  if (!project) return [defaultImage];
  
  // Use thumbnail_url as the main image, fallback to default
  return project.thumbnail_url ? [project.thumbnail_url] : [defaultImage];
};

// Helper function to parse video URLs from backend JSON string
export const getProjectVideos = (project) => {
  if (!project || !project.video_urls) return [];
  
  try {
    const videos = JSON.parse(project.video_urls);
    return Array.isArray(videos) ? videos : [];
  } catch (e) {
    console.warn('Failed to parse video_urls:', e);
    return [];
  }
};

// Helper function to parse PDF URLs from backend JSON string
export const getProjectPDFs = (project) => {
  if (!project || !project.pdf_urls) return [];
  
  try {
    const pdfs = JSON.parse(project.pdf_urls);
    return Array.isArray(pdfs) ? pdfs : [];
  } catch (e) {
    console.warn('Failed to parse pdf_urls:', e);
    return [];
  }
};

// Helper function to parse ZIP URLs from backend JSON string
export const getProjectZIPs = (project) => {
  if (!project || !project.zip_urls) return [];
  try {
    const zips = JSON.parse(project.zip_urls);
    return Array.isArray(zips) ? zips : [];
  } catch (e) {
    console.warn('Failed to parse zip_urls:', e);
    return [];
  }
};

// Helper function to get team members from project
export const getTeamMembers = (project) => {
  const registeredMembers = project?.user_projects?.filter(
    (up) => up.interested_in === "contributor" && up.user
  ) || [];
  
  // Handle external_collaborators - it can be a JSON string or already parsed array
  let externalCollaborators = [];
  if (project?.external_collaborators) {
    try {
      // If it's a string, parse it; if it's already an array, use it directly
      externalCollaborators = typeof project.external_collaborators === 'string' 
        ? JSON.parse(project.external_collaborators)
        : project.external_collaborators;
    } catch (e) {
      console.warn('Failed to parse external_collaborators:', e);
      externalCollaborators = [];
    }
  }
  
  const externalMembers = externalCollaborators?.map((collab, index) => ({
    id: `external-${index}`,
    user: {
      name: collab.name || 'Unknown',
      github: collab.github || '',
      email: collab.email || '',
      id: null,
      role: { name: 'external' }
    },
    interested_in: 'contributor',
    isExternal: true
  })) || [];
  
  return [...registeredMembers, ...externalMembers];
};
