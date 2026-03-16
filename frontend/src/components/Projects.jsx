import React from 'react';
import { motion } from 'framer-motion';
import { ExternalLink, Github } from 'lucide-react';
import { usePortfolioData } from '../context/DataContext';
import './Projects.css';

const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
        opacity: 1,
        transition: {
            staggerChildren: 0.2
        }
    }
};

const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.6 } }
};

export default function Projects() {
    const { data } = usePortfolioData();
    if (!data) return null;

    return (
        <section className="projects-section" id="projects">
            <motion.h2
                className="section-title"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
            >
                <span className="gradient-text">Featured Endpoints</span>
            </motion.h2>

            <motion.div
                className="projects-grid"
                variants={containerVariants}
                initial="hidden"
                whileInView="visible"
                viewport={{ once: true, margin: "-100px" }}
            >
                {data.projects.map((project, index) => (
                    <motion.div key={project.id} className="project-card" variants={itemVariants}>
                        {project.image_url && (
                            <div className="project-image-wrapper">
                                <img src={project.image_url} alt={project.title} className="project-card-image" />
                                <div className="image-overlay"></div>
                            </div>
                        )}
                        <div className="project-content">
                            <div className="project-header">
                                <h3 className="project-title">{project.title}</h3>
                                <span className="project-status">{project.status}</span>
                            </div>

                            <p className="project-description">{project.description}</p>

                            <div className="project-tech">
                                {project.technologies.map(tech => (
                                    <span key={tech} className="tech-tag">{tech}</span>
                                ))}
                            </div>

                            <div className="flex gap-4 mt-auto">
                                <a href={project.link} className="project-link" target="_blank" rel="noreferrer">
                                    <Github size={18} /> Source
                                </a>
                                <a href={project.link} className="project-link" target="_blank" rel="noreferrer">
                                    <ExternalLink size={18} /> Live
                                </a>
                            </div>
                        </div>
                    </motion.div>
                ))}
            </motion.div>
        </section>
    );
}
