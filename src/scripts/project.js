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
            document.querySelectorAll('.menu').forEach(m => m.style.display = 'none');
            menu.style.display = 'flex';
        });

        document.addEventListener('click', (e) => {
            if (menu.style.display === 'flex' && !menu.contains(e.target) && e.target !== moreBtn) {
                menu.style.display = 'none';
            }
        });

        return projectElement;
    }

    createProjectHeader() {
        const tempDiv = document.createElement('div');

        tempDiv.innerHTML = `
            <div class="project-title-container">
                <div class="header-top">
                    <h1 class="project-name">${this.name}</h1>
                    <button class="add-task-btn">
                        <span class="material-symbols-outlined">add</span>
                        <span>Add New Task</span>
                    </button>
                </div>

                <dialog class="add-dialog">
                    <div class="dialog-header">
                        <h3>Add New Task</h3>
                        <span class="material-symbols-outlined close-btn" style="cursor: pointer;">close</span>
                    </div>

                    <form class="add-task-form" method="dialog">
                        <label>
                            <span>Name</span>
                            <input type="text" name="task-name" id="task-name-${this.id}" required>
                        </label>

                        <label>
                            <span>Date</span>
                            <input type="date" name="task-date" id="task-date-${this.id}" required>
                        </label>

                        <label>
                            <span>Importance</span>
                            <select id="task-importance-${this.id}" name="task-importance">
                                <option value="Low">Low</option>
                                <option value="Medium">Medium</option>
                                <option value="High">High</option>
                            </select>
                        </label>

                        <label>
                            <span>Description</span>
                            <textarea id="description-${this.id}" class="description-textbox" maxlength="75"></textarea>
                        </label>

                        <button type="submit" class="confirm-add-btn">Add Task</button>
                    </form>
                </dialog>
            </div>`;

        const headerElement = tempDiv.firstElementChild;
        const addBtn = headerElement.querySelector('.add-task-btn');
        const dialog = headerElement.querySelector('.add-dialog');
        const closeBtn = headerElement.querySelector('.close-btn');
        const form = headerElement.querySelector('.add-task-form');

        addBtn.addEventListener('click', () => dialog.showModal());
        
        closeBtn.addEventListener('click', () => {
            dialog.close();
            form.reset();
        });


        form.addEventListener('submit', (e) => {
            const formData = {
                name: headerElement.querySelector(`#task-name-${this.id}`).value,
                date: headerElement.querySelector(`#task-date-${this.id}`).value,
                importance: headerElement.querySelector(`#task-importance-${this.id}`).value,
                description: headerElement.querySelector(`#description-${this.id}`).value,
                projectID: this.id
            };

            const event = new CustomEvent('task-added', { detail: formData });
            headerElement.dispatchEvent(event);

            form.reset();
        });

        return headerElement;
    }
}