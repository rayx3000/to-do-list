import Project from "./project.js";
import ToDoList from "./to-do-list.js";
import { sampleProjects } from "./data.js";

export function saveProjects(projects) {
    localStorage.setItem('projects', JSON.stringify(projects));
}

export function loadProjects() {
    const projectsJSON = localStorage.getItem('projects');

    if (!projectsJSON) {
        return [sampleProjects[0], sampleProjects[1]];
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
                taskData.description
            );
        });
        return project;
    });
}
