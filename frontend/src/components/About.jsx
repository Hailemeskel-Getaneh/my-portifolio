import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { usePortfolioData } from '../context/DataContext';
import './About.css';

export default function About() {
    const { data } = usePortfolioData();
    const [currentIndex, setCurrentIndex] = useState(0);

    useEffect(() => {
        if (!data || data.skills.length <= 1) return;
        const interval = setInterval(() => {
            setCurrentIndex(prev => (prev + 1) % data.skills.length);
        }, 4000);
        return () => clearInterval(interval);
    }, [data]);

    if (!data) return null;

    const nextSkill = () => setCurrentIndex(prev => (prev + 1) % data.skills.length);
    const prevSkill = () => setCurrentIndex(prev => (prev - 1 + data.skills.length) % data.skills.length);

    return (
        <section className="about-section" id="about">
            <div className="about-grid">
                <motion.div
                    initial={{ opacity: 0, x: -50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                >
                    <div className="flex flex-col md:flex-row gap-4 items-start mb-8">
                        {data.personalInfo.profile_image && (
                            <div className="profile-image-container">
                                <img src={data.personalInfo.profile_image} alt={data.personalInfo.name} className="profile-image" />
                                <div className="profile-image-glow"></div>
                            </div>
                        )}
                        <div>
                            <h2 className="section-title">
                                <span className="gradient-text">System Specs</span>
                            </h2>
                            <p className="about-text">{data.personalInfo.about}</p>
                        </div>
                    </div>

                    <div className="glass-panel p-6 mt-8">
                        <h3 className="text-xl font-mono text-accent-cyan mb-4 ">{'<Contact_Protocols />'}</h3>
                        <ul className="text-gray-300 font-mono space-y-2">
                            <li>Email: <a href={`mailto:${data.personalInfo.email}`} className="text-accent-purple hover:underline">{data.personalInfo.email}</a></li>
                            <li>GitHub: <a href={data.personalInfo.github} className="text-accent-purple hover:underline">{data.personalInfo.github}</a></li>
                            <li>LinkedIn: <a href={data.personalInfo.linkedin} className="text-accent-purple hover:underline">{data.personalInfo.linkedin}</a></li>
                        </ul>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, x: 50 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-100px" }}
                    className="skills-slider-container"
                >
                    <h3 className="section-subtitle">Core Modules</h3>

                    <div className="slider-wrapper">
                        <button className="slider-nav prev" onClick={prevSkill}>
                            <ChevronLeft size={24} />
                        </button>

                        <div className="slider-content">
                            <AnimatePresence mode="wait">
                                <motion.div
                                    key={currentIndex}
                                    initial={{ opacity: 0, scale: 0.8, x: 20 }}
                                    animate={{ opacity: 1, scale: 1, x: 0 }}
                                    exit={{ opacity: 0, scale: 0.8, x: -20 }}
                                    transition={{ duration: 0.5 }}
                                    className="skill-icon-card"
                                >
                                    {data.skills[currentIndex]?.icon_url ? (
                                        <img
                                            src={data.skills[currentIndex].icon_url}
                                            alt={data.skills[currentIndex].name}
                                            className="skill-logo"
                                        />
                                    ) : (
                                        <div className="skill-logo-placeholder">
                                            {data.skills[currentIndex]?.name.charAt(0)}
                                        </div>
                                    )}
                                    <h4 className="skill-name">{data.skills[currentIndex]?.name}</h4>
                                    <span className="skill-category">{data.skills[currentIndex]?.category}</span>
                                </motion.div>
                            </AnimatePresence>
                        </div>

                        <button className="slider-nav next" onClick={nextSkill}>
                            <ChevronRight size={24} />
                        </button>
                    </div>

                    <div className="slider-dots">
                        {data.skills.map((_, i) => (
                            <div
                                key={i}
                                className={`dot ${i === currentIndex ? 'active' : ''}`}
                                onClick={() => setCurrentIndex(i)}
                            />
                        ))}
                    </div>
                </motion.div>
            </div>
        </section>
    );
}
