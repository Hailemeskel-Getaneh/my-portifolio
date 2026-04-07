import { Code, Server, Database, Terminal, Cpu, Globe } from 'lucide-react';

export const portfolioData = {
    personalInfo: {
        name: "Hailemeskel Getaneh",
        title: "Backend Engineer & Systems Architect",
        tagline: "Engineering high-performance backends, resilient APIs, and seamless digital experiences.",
        about: "I am a Full-Stack Software Engineer with a passion for building scalable, secure, and intuitive systems. With deep expertise in Node.js, Python, and cloud infrastructure, I focus on the underlying architecture that makes modern web applications fast and reliable.",
        email: "hailemeskel.getaneh@outlook.com",
        github: "https://github.com/hailemeskel-getaneh",
        linkedin: "https://linkedin.com/in/hailemeskel-getaneh",
        profile_image: null
    },
    skills: [
        { name: "Node.js", category: "Runtime", level: 95 },
        { name: "JavaScript", category: "Language", level: 95 },
        { name: "TypeScript", category: "Language", level: 90 },
        { name: "Python", category: "Language", level: 88 },
        { name: "React", category: "Frontend", level: 92 },
        { name: "PostgreSQL", category: "Database", level: 90 },
        { name: "Docker", category: "DevOps", level: 85 },
        { name: "C", category: "Language", level: 75 },
    ],
    services: [
        { title: "Full-Stack Development", description: "Building end-to-end applications with modern stacks like MERN and Next.js.", icon: "Globe" },
        { title: "API & Microservices", description: "Designing robust, scalable backend architectures and secure RESTful APIs.", icon: "Server" },
        { title: "Database Systems", description: "Expert schema design and optimization for SQL and NoSQL databases.", icon: "Database" },
        { title: "System Engineering", description: "Implementing low-level logic and high-performance computation modules.", icon: "Cpu" }
    ],
    projects: [
        {
            id: "proj-1",
            title: "wanderEthio",
            description: "A comprehensive tourism platform designed to enhance the travel experience in Ethiopia with seamless registration and booking.",
            technologies: ["JavaScript", "Node.js", "Express", "MongoDB"],
            link: "https://github.com/hailemeskel-getaneh/wanderEthio",
            status: "PUBLIC"
        },
        {
            id: "proj-2",
            title: "gitglow",
            description: "A premium GitHub statistics generator that creates dynamic, glassmorphism-inspired SVG cards for profile READMEs.",
            technologies: ["JavaScript", "SVG", "GitHub API", "Node.js"],
            link: "https://github.com/hailemeskel-getaneh/gitglow",
            status: "STABLE"
        },
        {
            id: "proj-3",
            title: "brainbox",
            description: "A lightweight web application designed to help you capture, organize, and manage thoughts, topics, and notes.",
            technologies: ["TypeScript", "React", "Node.js", "Express"],
            link: "https://github.com/hailemeskel-getaneh/brainbox",
            status: "PUBLIC"
        },
        {
            id: "proj-4",
            title: "QuizApp",
            description: "A MERN stack quiz application with a timer and an admin panel for managing users and questions.",
            technologies: ["JavaScript", "React", "Node.js", "MongoDB"],
            link: "https://github.com/hailemeskel-getaneh/QuizApp",
            status: "PUBLIC"
        },
        {
            id: "proj-5",
            title: "ethco-ai",
            description: "An AI-powered platform for Ethiopian context, leveraging modern machine learning and TypeScript.",
            technologies: ["TypeScript", "React", "Tailwind", "Python"],
            link: "https://github.com/hailemeskel-getaneh/ethco-ai",
            status: "STABLE"
        }
    ],

    terminalLogs: [
        "Initializing secure kernel connection... [OK]",
        "Loading Hailemeskel_Core_Modules... [SUCCESS]",
        "Scanning local databases for active repositories...",
        "Establishing encrypted link to GitHub API...",
        "System state: OPERATIONAL",
        "Welcome to the control center. Execute 'GET /portfolio' to begin."
    ]
};

