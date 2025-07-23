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

