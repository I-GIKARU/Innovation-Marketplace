// projects/page.jsx
import React from 'react';
import Projects from "@/components/projects/Projects";
import NavBar from "@/components/NavBar";
import Footer from "@/components/Footer";

const ProjectsPage = () => {
    return (
        <main>
            <NavBar />
            <Projects />
            <Footer />
        </main>
    );
};

export default ProjectsPage;
