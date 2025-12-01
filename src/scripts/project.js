import ToDoList from "./to-do-list.js";

class Project {
    constructor(name, id, content = []) {
        this.name = name;
        this.id = id;
        this.content = content;
    }
}

const defaultProject = new Project("Default", "proj-001");
const minecraftProject = new Project("Build House In Minecraft", "proj-002");
const basketballProject = new Project("Practice and Mastering Basketball", "proj-003");

defaultProject.content = [
    new ToDoList(
        "89d102c7-e468-4067-9214-72aa5d4c82df", 
        "Playing Games", 
        defaultProject.name, 
        "12-20-2025", 
        "Low", 
        "It is Just For Fun and Activities"
    ),
    new ToDoList(
        "f5b3b2d6-a177-42ad-973f-5a76a55ab2db", 
        "Buy T-Shirt", 
        defaultProject.name, 
        "12-21-2025", 
        "High", 
        "To make house cleaner"
    ),
    new ToDoList(
        "2938d67f-10a7-4c98-86bf-18793cf98b13", 
        "Playing Games", 
        defaultProject.name, 
        "12-22-2025", 
        "Medium", 
        "Go to shop to buy more"
    ),
];

const projects = [defaultProject, minecraftProject, basketballProject];

console.log(projects[0].content);

let content = '';

projects[0].content.map((task) => {
    content += task.generateToDoList();
})

document.querySelector(".to-do-list").innerHTML = content;