import { Code, Server, Database, Terminal, Cpu, Globe } from 'lucide-react';

export const portfolioData = {
    personalInfo: {
        name: "Haile",
        title: "Backend Developer & Systems Architect",
        tagline: "Building scalable logic, robust APIs, and optimizing data flow.",
        about: "I specialize in creating efficient, secure, and highly available backend systems. While others focus on the surface, I engineer the core mechanisms that power the web.",
        email: "contact@haile.dev",
        github: "https://github.com/haile",
        linkedin: "https://linkedin.com/in/haile"
    },
    skills: [
        { name: "Node.js", category: "Language/Runtime", level: 90 },
        { name: "Python", category: "Language", level: 85 },
        { name: "Go", category: "Language", level: 75 },
        { name: "PostgreSQL", category: "Database", level: 88 },
        { name: "MongoDB", category: "Database", level: 80 },
        { name: "Redis", category: "Database/Cache", level: 70 },
        { name: "Docker", category: "DevOps", level: 85 },
        { name: "AWS", category: "Cloud", level: 75 },
    ],
    services: [
        { title: "API Development", description: "RESTful & GraphQL APIs with high throughput and low latency.", icon: "Server" },
        { title: "Database Architecture", description: "Schema design, indexing, and query optimization for scale.", icon: "Database" },
        { title: "System Integration", description: "Connecting microservices and third-party APIs securely.", icon: "Cpu" },
        { title: "DevOps & CI/CD", description: "Automated pipelines and containerized deployments.", icon: "Terminal" }
    ],
    projects: [
        {
            id: "proj-1",
            title: "Auth Gateway Microservice",
            description: "A centralized JWT authentication service handling 10k+ requests per minute with Redis caching.",
            technologies: ["Go", "Redis", "Docker"],
            link: "#",
            status: "200 OK"
        },
        {
            id: "proj-2",
            title: "Real-time Data Pipeline",
            description: "WebSocket-based streaming data pipeline processing financial market data in real-time.",
            technologies: ["Node.js", "Socket.io", "PostgreSQL"],
            link: "#",
            status: "200 OK"
        },
        {
            id: "proj-3",
            title: "E-Commerce Logistics Engine",
            description: "complex routing algorithm and inventory management API for a massive retail platform.",
            technologies: ["Python", "FastAPI", "MongoDB"],
            link: "#",
            status: "200 OK"
        }
    ],
    terminalLogs: [
        "Establishing secure connection to server...",
        "Authenticating user credentials...",
        "Access granted. Loading backend modules...",
        "Initializing database connections... [OK]",
        "Starting core engine... [OK]",
        "System ready. Welcome."
    ]
};
