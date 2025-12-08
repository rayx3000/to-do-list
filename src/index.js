//import './style.css'

import Project from "./scripts/project.js";
import ToDoList from "./scripts/to-do-list.js";
import { generateID } from "./scripts/generateID.js";

let projects = [
    new Project("Default", "proj-default"), 
    new Project("Build House In Minecraft", "proj-minecraft")
];

projects[0].content = [
    new ToDoList(generateID(), "Playing Games", projects[0].name, "2025-12-20", "Low", "Fun activity"),
    new ToDoList(generateID(), "Buy T-Shirt", projects[0].name, "2025-12-21", "High", "For cleaning"),
    new ToDoList(generateID(), "Buy Groceries", projects[0].name, "2025-12-22", "Medium", "More food"),
];


projects[1].content = [
    new ToDoList(generateID(), "Build Rooms", projects[1].name, "2026-02-20", "High", "Design sleeping place"),
    new ToDoList(generateID(), "Storage Room", projects[1].name, "2026-02-21", "Medium", "For storage"),
];

const projectListContainer = document.querySelector(".my-projects");
const toDoListContainer = document.querySelector(".to-do-list"); 
const mainContentContainer = document.querySelector(".main-content"); 

function renderSidebar() {
    projectListContainer.innerHTML = ''; 
    
    projects.forEach(project => {
        const projElement = project.createProjectElement();
        
        projElement.querySelector('.row-btn').addEventListener('click', () => {
            loadProjectToMain(project);
        });

        projectListContainer.appendChild(projElement);
    });
}

function renderTasks(project) {
    toDoListContainer.innerHTML = '';
    
    project.content.forEach(task => {
        if (typeof task.createTaskElement === 'function') {
            toDoListContainer.appendChild(task.createTaskElement()); 
        } else {
            console.error("ToDoList class is missing createTaskElement method", task);
        }
    });
}


function loadProjectToMain(project) {
    const existingHeader = mainContentContainer.querySelector('.project-title-container');
    if (existingHeader) {
        existingHeader.remove();
    }

    const headerElement = project.createProjectHeader();
    mainContentContainer.prepend(headerElement);

    headerElement.addEventListener('task-added', (e) => {
        const data = e.detail;
        
        const newTask = new ToDoList(
            generateID(), 
            data.name, 
            project.name, 
            data.date, 
            data.importance, 
            data.description
        );
        
        project.content.push(newTask);
        
        renderTasks(project); 
    });

    renderTasks(project);
}

renderSidebar();
loadProjectToMain(projects[0]); 

const projectContainer = document.querySelector(".my-projects"); 
const addProjectBtn = document.getElementById("add-project");
const addProjectDialog = document.querySelector(".add-project");
const closeDialogBtn = document.getElementById("close2");
const addProjectForm = addProjectDialog.querySelector("form"); 

addProjectBtn.addEventListener("click", () => addProjectDialog.showModal());
closeDialogBtn.addEventListener("click", () => addProjectDialog.close());

addProjectForm.addEventListener("submit", (e) => {
    const projectNameInput = document.getElementById("project-name-input"); 
    const projectName = projectNameInput.value;
    
    const newProject = new Project(projectName, generateID());
    
    projects.push(newProject);
    
    renderSidebar();

    loadProjectToMain(newProject);

    projectNameInput.value = "";
    addProjectDialog.close(); 
});

projectContainer.addEventListener('project-deleted', (e) => {
    const projectID = e.detail.id;
    console.log(`Project ${projectID} deleted`);
});

projectContainer.addEventListener('project-renamed', (e) => {
    const { id, newName } = e.detail;
    console.log(`Project ${id} renamed to ${newName}`);
});

document.addEventListener('DOMContentLoaded', () => {
    
    function closeAll() {
        document.querySelectorAll('.menu.show').forEach(menu => {
            menu.classList.remove('show');
            menu.setAttribute('aria-hidden', 'true');
        });
    }

    const container = document.querySelector('.my-projects');

    if (container) {
        container.addEventListener('click', function(e) {
            
            const toggleBtn = e.target.closest('.more');
            if (toggleBtn) {
                e.stopPropagation(); 
                e.preventDefault();

                const project = toggleBtn.closest('.project');
                const menu = project.querySelector('.menu');
                const isAlreadyOpen = menu.classList.contains('show');

                closeAll(); 

                if (!isAlreadyOpen) {
                    menu.classList.add('show');
                    menu.setAttribute('aria-hidden', 'false');
                }
                return;
            }
            
            const menuItem = e.target.closest('.menu-item');
            if (menuItem) {
                e.preventDefault();
                
                const project = menuItem.closest('.project');
                const action = menuItem.dataset.action; 
                
                const titleSpan = project.querySelector('.row-btn > span:first-child');
                const currentTitle = titleSpan.textContent.trim();

                if (action === 'rename') {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = currentTitle;
                    input.className = 'project-edit-input';
                    
                    titleSpan.innerHTML = '';
                    titleSpan.appendChild(input);
                    input.focus();

                    const saveName = () => {
                        const newName = input.value.trim();
                        titleSpan.textContent = newName || currentTitle; 
                    };

                    input.addEventListener('keydown', (evt) => {
                        if (evt.key === 'Enter') {
                            saveName();
                        }
                    });

                    input.addEventListener('blur', () => {
                        saveName();
                    });

                    console.log('Rename mode activated');
                } 
                else if (action === 'delete') {
                   console.log('Delete action triggered');
                   project.remove(); 
                } 
                else {
                    console.log('Other action triggered:', action);
                }

                closeAll();
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu') && !e.target.closest('.more')) {
            closeAll();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
    });
});