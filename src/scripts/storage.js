import Project from "./project.js";
import ToDoList from "./to-do-list.js";

function getSampleProjects() {
    const sampleProjects = [
        new Project("Default", "proj-j63r-9pf8"), 
        new Project("Build House In Minecraft", "proj-x59n-1fh6")
    ];
    
    sampleProjects[0].content = [
        new ToDoList("91c06b39-00da-450b-ad7b-159c43199dfc", "Playing Games", sampleProjects[0].name, "2025-12-20", "Low", "Fun activity", false),
        new ToDoList("018e4968-389c-4712-88dd-6dcb44ed3c9b", "Buy T-Shirt", sampleProjects[0].name, "2025-12-21", "High", "For cleaning", false),
    ];
    
    sampleProjects[1].content = [
        new ToDoList("443e59f3-c91c-4932-b5ca-cddaf4bb4fe4", "Build Rooms", sampleProjects[1].name, "2026-02-20", "High", "Design sleeping place", false),
    ];

    return sampleProjects;
}

export function saveProjects(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
}

export function loadProjects() {
    const projectsJSON = localStorage.getItem('projects');

    if (!projectsJSON) {
        return getSampleProjects();
    }

    const projectsData = JSON.parse(projectsJSON);
    return projectsData.map(projData => {
        const project = new Project(projData.name, projData.id);
        project.content = projData.content.map(taskData => {
            return new ToDoList(
                taskData.id,
                taskData.name,
                taskData.project,
                taskData.date,
                taskData.importance,
                taskData.description,
                taskData.completed
            );
        });
        return project;
    });
}
