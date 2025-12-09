import Project from "./project.js";
import ToDoList from "./to-do-list.js";
import { loadProjects } from "./storage.js";

export let projects = loadProjects();
