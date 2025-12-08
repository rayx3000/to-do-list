//import './style.css'

import Project from "./scripts/project.js";
import ToDoList from "./scripts/to-do-list.js";
import { generateID } from "./scripts/generateID.js";

// --- 1. Data Initialization ---
const projects = [
    new Project("Default", "proj-default"), 
    new Project("Build House In Minecraft", "proj-minecraft")
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

// --- 2. DOM Elements ---
const projectListContainer = document.querySelector(".my-projects");
const toDoListContainer = document.querySelector(".to-do-list"); 
const mainContentContainer = document.querySelector(".main-content"); // Container for Header + Tasks

// --- 3. Render Functions ---

function renderSidebar() {
    projectListContainer.innerHTML = ''; 
    
    projects.forEach(project => {
        const projElement = project.createProjectElement();
        
        // Add click event to switch active project
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

/**
 * Loads the Project Header and The Tasks into the main view
 */
function loadProjectToMain(project) {
    // 1. Clear existing header (but keep the task container)
    // Assuming .main-content contains the header + .to-do-list
    const existingHeader = mainContentContainer.querySelector('.project-title-container');
    if (existingHeader) {
        existingHeader.remove();
    }

    // 2. Create and Append new Header
    const headerElement = project.createProjectHeader();
    mainContentContainer.prepend(headerElement);

    // 3. Listen for "Add Task" event from this specific header
    headerElement.addEventListener('task-added', (e) => {
        const data = e.detail;
        
        // Create new Task Object
        const newTask = new ToDoList(
            generateID(), 
            data.name, 
            project.name, 
            data.date, 
            data.importance, 
            data.description
        );
        
        // Update Data
        project.content.push(newTask);
        
        // Update UI
        renderTasks(project); 
    });

    // 4. Render the tasks for this project
    renderTasks(project);
}

renderSidebar();
loadProjectToMain(projects[0]); //

console.log("hello");