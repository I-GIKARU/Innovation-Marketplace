import os
import uuid
import json
from datetime import datetime
from flask import current_app
from PyPDF2 import PdfReader
import google.generativeai as genai
import firebase_admin
from firebase_admin import storage
from io import BytesIO

class AIAgent:
    def __init__(self):
        # Configure Google Generative AI
        self.google_api_key = os.getenv("GOOGLE_API_KEY")
        if self.google_api_key:
            genai.configure(api_key=self.google_api_key)
        else:
            print("⚠️ GOOGLE_API_KEY not found. AI functionality will not be available.")
        
        # Firebase storage bucket
        try:
            self.bucket = storage.bucket()
        except Exception as e:
            print(f"⚠️ Firebase storage initialization failed: {e}")
            self.bucket = None
        
        # In-memory text store for quick access
        self.pdf_text_store = {}

    def extract_text_from_pdf(self, file_stream):
        """Extract text from PDF file stream"""
        try:
            reader = PdfReader(file_stream)
            text = "\n".join([page.extract_text() or "" for page in reader.pages])
            return text
        except Exception as e:
            print(f"PDF parse error: {e}")
            return None

    def generate_cv_summary(self, text: str) -> str:
        """Generate AI summary for CV content"""
        if not text.strip():
            return "The CV file appears to be empty or unreadable."
        
        try:
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
            prompt = f"""
            Analyze this CV/Resume and provide a comprehensive professional summary including:
            
            1. **Professional Profile**: Key skills, experience level, and areas of expertise
            2. **Technical Skills**: Programming languages, frameworks, tools, and technologies
            3. **Experience Summary**: Years of experience and key roles/positions
            4. **Education**: Degrees, certifications, and academic achievements
            5. **Key Strengths**: Standout qualities and unique selling points
            6. **Career Focus**: Primary areas of interest and career direction
            
            Make the summary professional, concise, and suitable for admin review.
            
            CV Content:
            {text[:8000]}
            """
            
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Gemini CV summary error: {e}")
            return "CV summary could not be generated due to AI service error."

    def generate_project_summary(self, project_data: dict, documentation_text: str = None) -> str:
        """Generate AI summary for project"""
        try:
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
            
            # Combine project data and documentation
            project_info = f"""
            Project Title: {project_data.get('title', 'N/A')}
            Description: {project_data.get('description', 'N/A')}
            Tech Stack: {project_data.get('tech_stack', 'N/A')}
            Technical Mentor: {project_data.get('technical_mentor', 'N/A')}
            """
            
            if documentation_text:
                project_info += f"\n\nDocumentation Content:\n{documentation_text[:6000]}"
            
            prompt = f"""
            Create a comprehensive project summary for this Innovation Marketplace project including:
            
            1. **Project Overview**: What the project does and its main purpose
            2. **Technical Implementation**: Key technologies, frameworks, and architecture
            3. **Features & Functionality**: Main features and capabilities
            4. **Innovation Factor**: What makes this project unique or innovative
            5. **Learning Outcomes**: Skills and knowledge demonstrated
            6. **Potential Applications**: Real-world use cases and market potential
            
                    "Make the summary engaging for potential viewers and users."
            
            Project Information:
            {project_info}
            """
            
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Gemini project summary error: {e}")
            return "Project summary could not be generated due to AI service error."

    def answer_project_question(self, question: str, project_data: dict, documentation_text: str = None) -> str:
        """Answer questions about a specific project"""
        try:
            model = genai.GenerativeModel('gemini-2.0-flash-exp')
            
            # Combine project data and documentation
            context = f"""
            Project: {project_data.get('title', 'N/A')}
            Description: {project_data.get('description', 'N/A')}
            Tech Stack: {project_data.get('tech_stack', 'N/A')}
            GitHub: {project_data.get('github_link', 'N/A')}
            Demo: {project_data.get('demo_link', 'N/A')}
            """
            
            if documentation_text:
                context += f"\n\nDocumentation:\n{documentation_text[:6000]}"
            
            prompt = f"""
            You are an AI assistant helping users understand this Innovation Marketplace project. 
            Answer the following question based on the project information and documentation provided.
            
            Be helpful, accurate, and engaging. If the information isn't available in the context, 
            say so politely and suggest checking the project's GitHub repository or contacting the developers.
            
            Project Context:
            {context}
            
            Question: {question}
            
            Answer:
            """
            
            response = model.generate_content(prompt)
            return response.text.strip()
        except Exception as e:
            print(f"Gemini question answering error: {e}")
            return "I'm sorry, I couldn't process your question due to an AI service error. Please try again later."

    # AI documentation methods kept for CV functionality only
    def upload_pdf_to_firebase(self, file_stream, file_type="cv"):
        """Upload PDF to Firebase for AI processing (CVs only)"""
        if not self.bucket:
            raise Exception("Firebase storage not initialized")
        
        file_id = f"{uuid.uuid4()}.pdf"
        blob_path = f"ai_documents/{file_type}/{file_id}"
        blob = self.bucket.blob(blob_path)
        
        try:
            # Reset stream position
            file_stream.seek(0)
            blob.upload_from_file(file_stream, content_type='application/pdf')
            blob.make_public()
            
            return {
                'file_id': file_id,
                'url': blob.public_url,
                'blob_path': blob_path
            }
        except Exception as e:
            print(f"Firebase upload error: {e}")
            raise Exception('Failed to upload to Firebase')

    def save_document_metadata(self, file_id: str, metadata: dict, file_type="cv"):
        """Save document metadata to Firebase (CVs only)"""
        if not self.bucket:
            raise Exception("Firebase storage not initialized")
        
        metadata_blob = self.bucket.blob(f"ai_documents/{file_type}/{file_id}.json")
        
        try:
            metadata_blob.upload_from_string(
                data=json.dumps({
                    **metadata,
                    'uploaded_at': datetime.utcnow().isoformat(),
                    'file_type': file_type
                }),
                content_type="application/json"
            )
        except Exception as e:
            print(f"Failed to save metadata: {e}")
            raise Exception('Could not save metadata')

    def get_document_text(self, file_id: str, file_type="cv"):
        """Retrieve document text from cache or Firebase (CVs only)"""
        # Try from memory first
        cache_key = f"{file_type}_{file_id}"
        text = self.pdf_text_store.get(cache_key)
        
        if not text and self.bucket:
            # Load from Firebase metadata
            metadata_blob = self.bucket.blob(f"ai_documents/{file_type}/{file_id}.json")
            if metadata_blob.exists():
                try:
                    metadata_str = metadata_blob.download_as_text()
                    metadata = json.loads(metadata_str)
                    text = metadata.get("text")
                    if text:
                        self.pdf_text_store[cache_key] = text  # Cache for future use
                except Exception as e:
                    print(f"Error loading document text: {e}")
        
        return text
    
    def get_project_pdf_texts(self, project):
        """Extract text from all PDFs in a regular project's media"""
        if not project:
            print("❌ No project provided")
            return []
            
        if not project.pdf_urls:
            print(f"📄 No PDFs found for project '{project.title}' (pdf_urls is empty)")
            return []
        
        try:
            import json
            pdf_urls = json.loads(project.pdf_urls)
            if not pdf_urls:
                print(f"📄 Project '{project.title}' has empty PDF URLs list")
                return []
            print(f"📄 Found {len(pdf_urls)} PDF URLs in project '{project.title}' media")
        except (json.JSONDecodeError, TypeError) as e:
            print(f"❌ Failed to parse project PDF URLs for '{project.title}': {e}")
            return []
        
        # Check if Firebase bucket is available
        if not self.bucket:
            print("❌ Firebase bucket not initialized - cannot read PDFs")
            return []
        
        pdf_texts = []
        
        for i, pdf_url in enumerate(pdf_urls):
            try:
                # Extract storage path from Firebase URL
                storage_path = self._extract_storage_path_from_url(pdf_url)
                if not storage_path:
                    print(f"❌ Could not extract storage path from URL: {pdf_url}")
                    continue
                
                # Create cache key for this PDF
                cache_key = f"project_pdf_{storage_path}"
                
                # Check cache first
                cached_text = self.pdf_text_store.get(cache_key)
                if cached_text:
                    print(f"✅ Found cached text for PDF {i+1} (length: {len(cached_text)})")
                    pdf_texts.append(cached_text)
                    continue
                
                # Download and extract text from PDF
                print(f"📥 Downloading PDF {i+1} from Firebase: {storage_path}")
                blob = self.bucket.blob(storage_path)
                
                if not blob.exists():
                    print(f"❌ PDF not found in Firebase: {storage_path}")
                    continue
                
                # Download PDF content
                pdf_content = blob.download_as_bytes()
                pdf_stream = BytesIO(pdf_content)
                
                # Extract text
                text = self.extract_text_from_pdf(pdf_stream)
                if text and text.strip():
                    print(f"✅ Extracted text from PDF {i+1} (length: {len(text)})")
                    # Cache the text
                    self.pdf_text_store[cache_key] = text
                    pdf_texts.append(text)
                else:
                    print(f"⚠️ No text extracted from PDF {i+1}")
                    
            except Exception as e:
                print(f"❌ Error processing PDF {i+1}: {e}")
                continue
        
        print(f"📄 Successfully extracted text from {len(pdf_texts)} PDFs")
        return pdf_texts
    
    def _extract_storage_path_from_url(self, url):
        """Extract Firebase storage path from download URL"""
        try:
            # Handle Firebase Storage REST API URLs
            if 'firebasestorage.googleapis.com' in url and '/o/' in url:
                from urllib.parse import unquote
                # Extract path between /o/ and ?alt=media
                path_part = url.split('/o/')[1].split('?')[0]
                return unquote(path_part)
            
            # Handle direct Firebase Storage URLs
            elif 'appspot.com' in url:
                # Extract path after domain
                parts = url.split('appspot.com/')[-1].split('?')[0]
                return parts
            
            return None
            
        except Exception as e:
            print(f"Error extracting storage path from URL: {e}")
            return None

    def delete_document(self, file_id: str, file_type="general"):
        """Delete document and metadata from Firebase"""
        if not self.bucket:
            return
        
        cache_key = f"{file_type}_{file_id}"
        self.pdf_text_store.pop(cache_key, None)
        
        try:
            # Delete PDF file
            pdf_blob = self.bucket.blob(f"ai_documents/{file_type}/{file_id}")
            if pdf_blob.exists():
                pdf_blob.delete()
            
            # Delete metadata file
            metadata_blob = self.bucket.blob(f"ai_documents/{file_type}/{file_id}.json")
            if metadata_blob.exists():
                metadata_blob.delete()
        except Exception as e:
            print(f"Delete error: {e}")

ai_agent = AIAgent()
