import './style.css';

import Project from "./scripts/project.js";
import ToDoList from "./scripts/to-do-list.js";
import { generateID } from "./scripts/generateID.js";
import { loadProjects, saveProjects } from "./scripts/storage.js";

const projectListContainer = document.querySelector(".my-projects");
const toDoListContainer = document.querySelector(".to-do-list");
const mainContentContainer = document.querySelector(".main-content");
const addProjectBtn = document.getElementById("add-project");
const addProjectDialog = document.querySelector(".add-project");
const closeDialogBtn = document.getElementById("close2");
const addProjectForm = addProjectDialog.querySelector("form");

let projects = loadProjects();
let currentActiveProject = projects.length > 0 ? projects[0] : null;

function renderSidebar() {
    projectListContainer.innerHTML = '';
    projects.forEach(project => {
        const projElement = project.createProjectElement();
        projectListContainer.appendChild(projElement);
    });
}

function renderTasks(project) {
    if (!project) {
        toDoListContainer.innerHTML = '';
        return;
    }
    toDoListContainer.innerHTML = '';
    project.content.forEach(task => {
        toDoListContainer.appendChild(task.createTaskElement());
    });
}

function loadProjectToMain(project) {
    currentActiveProject = project;

    const existingHeader = mainContentContainer.querySelector('.project-title-container');
    if (existingHeader) existingHeader.remove();

    if (project) {
        const headerElement = project.createProjectHeader();
        mainContentContainer.prepend(headerElement);
    }

    renderTasks(project);
}

projectListContainer.addEventListener('project-selected', (e) => {
    loadProjectToMain(e.detail.project);
});

projectListContainer.addEventListener('project-renamed', (e) => {
    const { id, newName } = e.detail;

    const project = projects.find(p => p.id === id);
    if (project) {
        project.name = newName;
        if (currentActiveProject && currentActiveProject.id === id) {
            const headerTitle = document.querySelector('.project-title-container .project-name');
            if (headerTitle) headerTitle.textContent = newName;
        }
        saveProjects(projects);
    }
});

projectListContainer.addEventListener('project-deleted', (e) => {
    const { id } = e.detail;

    projects = projects.filter(p => p.id !== id);
    saveProjects(projects);

    const projectDOM = document.querySelector(`.project[id="${id}"]`);
    if (projectDOM && projectDOM.parentElement) projectDOM.parentElement.remove();

    if (currentActiveProject && currentActiveProject.id === id) {
        mainContentContainer.querySelector('.project-title-container')?.remove();
        toDoListContainer.innerHTML = '';
        currentActiveProject = projects.length > 0 ? projects[0] : null;
        loadProjectToMain(currentActiveProject);
    }
});


mainContentContainer.addEventListener('task-added', (e) => {
    if (!currentActiveProject) return;

    const data = e.detail;
    const newTask = new ToDoList(
        crypto.randomUUID(), data.name, currentActiveProject.name, data.date, data.importance, data.description
    );

    currentActiveProject.content.push(newTask);
    saveProjects(projects);
    renderTasks(currentActiveProject);
});

toDoListContainer.addEventListener('task-deleted', (e) => {
    if (!currentActiveProject) return;
    const { id } = e.detail;
    currentActiveProject.content = currentActiveProject.content.filter(t => t.id !== id);
    saveProjects(projects);
});

toDoListContainer.addEventListener('task-edited', (e) => {
    if (currentActiveProject) {
        saveProjects(projects);
        renderTasks(currentActiveProject);
    }
});


addProjectBtn.addEventListener("click", () => addProjectDialog.showModal());
closeDialogBtn.addEventListener("click", () => addProjectDialog.close());

addProjectForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const projectNameInput = document.getElementById("project-name-input");
    const projectName = projectNameInput.value;

    if (projectName) {
        const newProject = new Project(projectName, `proj-${generateID()}`);
        projects.push(newProject);
        saveProjects(projects);

        renderSidebar();
        loadProjectToMain(newProject);
    }

    projectNameInput.value = "";
    addProjectDialog.close();
});

document.addEventListener('task-deleted', (e) => {
    const taskEl = document.getElementById(e.detail.id);
    if (taskEl) taskEl.remove();
});

document.addEventListener('click', (e) => {
    const isMenu = e.target.closest('.menu');
    const isMoreBtn = e.target.closest('.more');
    if (!isMenu && !isMoreBtn) {
        document.querySelectorAll('.menu').forEach(m => m.style.display = 'none');
    }
});

renderSidebar();
loadProjectToMain(currentActiveProject);