import Project from "./project.js";
import ToDoList from "./to-do-list.js";

export let projects = [
    new Project("Default", "proj-j63r-9pf8"), 
    new Project("Build House In Minecraft", "proj-x59n-1fh6")
];

projects[0].content = [
    new ToDoList("91c06b39-00da-450b-ad7b-159c43199dfc", "Playing Games", projects[0].name, "2025-12-20", "Low", "Fun activity"),
    new ToDoList("018e4968-389c-4712-88dd-6dcb44ed3c9b", "Buy T-Shirt", projects[0].name, "2025-12-21", "High", "For cleaning"),
];

projects[1].content = [
    new ToDoList("443e59f3-c91c-4932-b5ca-cddaf4bb4fe4", "Build Rooms", projects[1].name, "2026-02-20", "High", "Design sleeping place"),
];