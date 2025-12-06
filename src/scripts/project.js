import ToDoList from "./to-do-list.js";
import { generateID } from "./generateID.js";

export default class Project {
    constructor(name, id, content = []) {
        this.name = name;
        this.id = id;
        this.content = content;
    }

    createProjectElement() {
        const tempDiv = document.createElement('div');
        
        tempDiv.innerHTML = `
            <div class="project">
                <button class="row-btn" id="${this.id}" type="button">
                    <span class="project-name-display">${this.name}</span> 
                    <span class="material-symbols-outlined more" title="More">more_horiz</span>
                </button>

                <div class="menu" role="menu" style="display: none;"> 
                    <button class="menu-item" data-action="rename">
                        <span class="material-symbols-outlined">edit</span> Rename
                    </button>
                    <button class="menu-item delete" data-action="delete">
                        <span class="material-symbols-outlined">delete</span> Delete
                    </button>
                </div>
            </div>`;

        const projectElement = tempDiv.firstElementChild;

        const moreBtn = projectElement.querySelector('.more');
        const menu = projectElement.querySelector('.menu');

        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation(); 
            menu.style.display = menu.style.display === 'none' ? 'flex' : 'none';
        });

        document.addEventListener('click', (e) => {
            if (!menu.contains(e.target) && e.target !== moreBtn) {
                menu.style.display = 'none';
            }
        });

        return projectElement;
    }
}

export const projects = [
    new Project("Default", "proj@b83o-6qn3"), 
    new Project("Build House In Minecraft", "proj@p85c-4yv2")
];

// Add Tasks to Project 0
projects[0].content = [
    new ToDoList(generateID(), "Playing Games", projects[0].name, "2025-12-20", "Low", "Fun activity"),
    new ToDoList(generateID(), "Buy T-Shirt", projects[0].name, "2025-12-21", "High", "For cleaning"),
    new ToDoList(generateID(), "Buy Groceries", projects[0].name, "2025-12-22", "Medium", "More food"),
];

// Add Tasks to Project 1
projects[1].content = [
    new ToDoList(generateID(), "Build Rooms", projects[1].name, "2026-02-20", "High", "Design sleeping place"),
    new ToDoList(generateID(), "Storage Room", projects[1].name, "2026-02-21", "Medium", "For storage"),
];



const projectListContainer = document.querySelector(".my-projects");
const toDoListContainer = document.querySelector(".to-do-list"); 

function renderProjects() {
    projectListContainer.innerHTML = ''; 
    projects.forEach(project => {
        const projElement = project.createProjectElement();
        
        projElement.querySelector('.row-btn').addEventListener('click', () => {
            renderTasks(project);
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
            console.error("ToDoList class is missing createTaskElement method");
        }
    });
}

renderProjects();
renderTasks(projects[0]); 


const addDialog = document.querySelector(".add-dialog");
const addTaskBtn = document.querySelector(".add-task-btn");
const closeDialog = document.getElementById("close");

if (addDialog && addTaskBtn) {
    addTaskBtn.addEventListener("click", () => addDialog.showModal());
    closeDialog.addEventListener("click", () => addDialog.close());
}