import ToDoList from "./to-do-list.js";
import { generateID } from "./generateID.js";

export default class Project {
    constructor(name, id, content = []) {
        this.name = name;
        this.id = id;
        this.content = content;
    }

    generateProjectTag(){
        return `<div class="project">
                        <button class="row-btn" id="${this.id}" type="button">
                            <span id="project-name">${this.name}</span> 
                            <span class="material-symbols-outlined more" title="More">more_horiz</span>
                        </button>

                        <div class="menu" role="menu">
                            <button class="menu-item" data-action="rename"><span class="material-symbols-outlined">edit</span> Rename</button>
                            <button class="menu-item delete" data-action="delete"><span class="material-symbols-outlined">delete</span> Delete</button>
                        </div>
                    </div>`
    }
}

export const projects = [new Project("Default", "proj@b83o-6qn3"), new Project("Build House In Minecraft", "proj@p85c-4yv2")];

projects[0].content = [
    new ToDoList(
        "89d102c7-e468-4067-9214-72aa5d4c82df", 
        "Playing Games", 
        projects[0].name, 
        "12-20-2025", 
        "Low", 
        "It is Just For Fun and Activities"
    ),
    new ToDoList(
        "f5b3b2d6-a177-42ad-973f-5a76a55ab2db", 
        "Buy T-Shirt", 
        projects[0].name, 
        "12-21-2025", 
        "High", 
        "To make house cleaner"
    ),
    new ToDoList(
        "2938d67f-10a7-4c98-86bf-18793cf98b13", 
        "Playing Games", 
        projects[0].name, 
        "12-22-2025", 
        "Medium", 
        "Go to shop to buy more"
    ),
];

projects[1].content = [

    new ToDoList(
        "50f6f4f5-ca8b-433e-bcd2-ee206d476d85", 
        "Build Rooms", 
        projects[1].name, 
        "2-20-2026", 
        "High", 
        "To design the best sleeping place"
    ),
    new ToDoList(
        "fad06ae0-c34b-40fc-87ae-d1514bc25902", 
        "Put Storage Room In House", 
        projects[1].name, 
        "2-21-2026", 
        "Medium", 
        "To put storage"
    ),
]


console.log(projects[1].content);

let content = '';

projects[0].content.map((task) => {
    content += task.generateToDoList();
})

document.querySelector(".to-do-list").innerHTML = content;

const addDialog = document.querySelector(".add-dialog");
const addTaskBtn = document.querySelector(".add-task-btn");
const closeDialog = document.getElementById("close");

addTaskBtn.addEventListener("click", () => addDialog.showModal());
closeDialog.addEventListener("click", () => addDialog.close());

console.log(generateID());