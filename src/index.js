import './style.css';

import Project from "./scripts/project.js";
import ToDoList from "./scripts/to-do-list.js";
import { generateID } from "./scripts/generateID.js";
import { loadProjects, saveProjects } from "./scripts/storage.js";
import { projects } from './scripts/data.js';
import { home, days, weekly } from './scripts/sidebar.js';

const projectListContainer = document.querySelector(".my-projects");
const toDoListContainer = document.querySelector(".to-do-list");
const mainContentContainer = document.querySelector(".main-content");
const addProjectBtn = document.getElementById("add-project");
const addProjectDialog = document.querySelector(".add-project");
const closeDialogBtn = document.getElementById("close2");
const addProjectForm = addProjectDialog.querySelector("form");
const homeBtn = document.getElementById("home");
const todayBtn = document.getElementById("today");
const weeklyBtn = document.getElementById("weekly");

let currentActiveProject = projects.length > 0 ? projects[0] : null;

const views = {
    home: home,
    today: days,
    weekly: weekly
};

let currentView = views.home ? 'home' : (currentActiveProject ? 'project' : null); 

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
    renderTaskArray(project.content);
}

function renderTaskArray(tasks) {
    toDoListContainer.innerHTML = '';
    tasks.forEach(task => {
        toDoListContainer.appendChild(task.createTaskElement());
    });
}

function loadProjectToMain(project) {
    currentActiveProject = project;
    currentView = 'project';

    const existingHeader = mainContentContainer.querySelector('.project-title-container');
    if (existingHeader) existingHeader.remove();

    if (project) {
        const headerElement = project.createProjectHeader();
        mainContentContainer.prepend(headerElement);
    }

    renderTasks(project);
}

function loadViewToMain(title, tasks) {
    currentActiveProject = null;
    currentView = title.toLowerCase();

    let existingHeader = mainContentContainer.querySelector('.project-title-container');
    if (!existingHeader) {
        existingHeader = document.createElement('div');
        existingHeader.classList.add('project-title-container');
        mainContentContainer.prepend(existingHeader);
    }

    existingHeader.innerHTML = `<div class="header-top">
                    <h1>${title}</h1>
                    </div>`
    existingHeader.removeAttribute('id');

    renderTaskArray(tasks);
}

homeBtn.addEventListener('click', () => loadViewToMain('Home', home));
todayBtn.addEventListener('click', () => loadViewToMain('Today', days));
weeklyBtn.addEventListener('click', () => loadViewToMain('Weekly', weekly));


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

    const projectIndex = projects.findIndex(p => p.id === id);
    if (projectIndex > -1) {
        projects.splice(projectIndex, 1);
        saveProjects(projects);
        renderSidebar();
    }

    if (currentActiveProject && currentActiveProject.id === id) {
        loadViewToMain('Home', home);
    }
});


mainContentContainer.addEventListener('task-added', (e) => {
    if (!currentActiveProject) {
        if(projects.length > 0){
            currentActiveProject = projects[0];
        } else {
            return; 
        }
    }

    const data = e.detail;
    const newTask = new ToDoList(
        crypto.randomUUID(), data.name, currentActiveProject.name, data.date, data.importance, data.description
    );

    currentActiveProject.content.push(newTask);
    saveProjects(projects);
    if (currentView === 'project') {
        renderTasks(currentActiveProject);
    } else {
        loadViewToMain(currentView.charAt(0).toUpperCase() + currentView.slice(1), views[currentView]);
    }
});

toDoListContainer.addEventListener('task-deleted', (e) => {
    const { id, project } = e.detail;
    const proj = projects.find(p => p.name === project);
    if(proj){
        proj.content = proj.content.filter(t => t.id !== id);
        saveProjects(projects);
    }
});

toDoListContainer.addEventListener('task-edited', (e) => {
    saveProjects(projects);
    if (currentView === 'project') {
        renderTasks(currentActiveProject);
    } else {
        loadViewToMain(currentView.charAt(0).toUpperCase() + currentView.slice(1), views[currentView]);
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
loadViewToMain('Home', home);
console.log('Loaded projects:', projects);