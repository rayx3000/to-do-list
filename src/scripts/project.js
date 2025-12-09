export default class Project {
    constructor(name, id, content = []) {
        this.name = name;
        this.id = id;
        this.content = content;
        this.sidebarElement = null; 
    }

    createProjectElement() {
        const tempDiv = document.createElement('div');
        tempDiv.dataset.id = this.id;
        
        tempDiv.innerHTML = `
            <div class="project" id="${this.id}">
                <button class="row-btn" id="btn-${this.id}" type="button">
                    <span class="project-name-display">${this.name}</span> 
                    <input type="text" class="project-name-edit" value="${this.name}" style="display: none;">
                    <span class="material-symbols-outlined more" title="More">more_horiz</span>
                </button>

                <div class="menu" role="menu" style="display: none;"> 
                    <button class="menu-item rename-btn" data-action="rename">
                        <span class="material-symbols-outlined">edit</span> Rename
                    </button>
                    <button class="menu-item delete-btn" data-action="delete">
                        <span class="material-symbols-outlined">delete</span> Delete
                    </button>
                </div>
            </div>`;

        this.sidebarElement = tempDiv.firstElementChild;
        this._attachSidebarEvents(this.sidebarElement);

        return this.sidebarElement;
    }

    _attachSidebarEvents(element) {
        const moreBtn = element.querySelector('.more');
        const menu = element.querySelector('.menu');
        const renameBtn = element.querySelector('.rename-btn');
        const deleteBtn = element.querySelector('.delete-btn');
        const rowBtn = element.querySelector('.row-btn');
        
        const nameDisplay = element.querySelector('.project-name-display');
        const nameInput = element.querySelector('.project-name-edit');
        const more = element.querySelector('.more');

        rowBtn.addEventListener('click', (e) => {
            if(e.target === moreBtn || e.target === nameInput) return;
            
            const event = new CustomEvent('project-selected', { 
                detail: { project: this }, 
                bubbles: true 
            });
            element.dispatchEvent(event);
        });

        moreBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            document.querySelectorAll('.menu').forEach(m => m.style.display = 'none');
            menu.style.display = 'flex';
        });

        renameBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.style.display = 'none'; 
            
            nameDisplay.style.display = 'none';
            nameInput.style.display = 'block';
            more.style.display = 'none';
            nameInput.focus();
        });

        const saveRename = () => {
            if (nameInput.style.display === 'none') return; 

            const newName = nameInput.value.trim();
            if (newName && newName !== this.name) {
                this.name = newName;
                nameDisplay.textContent = this.name;

                element.dispatchEvent(new CustomEvent('project-renamed', {
                    detail: { id: this.id, newName: this.name },
                    bubbles: true
                }));
            } else {
                nameInput.value = this.name; 
            }

            nameInput.style.display = 'none';
            nameDisplay.style.display = 'block';
            more.style.display = 'block';
        };

        nameInput.addEventListener('blur', saveRename);
        nameInput.addEventListener('keydown', (e) => {
            if(e.key === 'Enter') saveRename();
        });
        nameInput.addEventListener('click', (e) => e.stopPropagation()); 

        deleteBtn.addEventListener('click', (e) => {
            e.stopPropagation();
            menu.style.display = 'none';
            
            this.openDeleteDialog();
        });
    }

    createProjectHeader() {
        const tempDiv = document.createElement('div');

        tempDiv.innerHTML = `
            <div class="project-title-container" id="project-header-${this.id}">
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

            const event = new CustomEvent('task-added', { detail: formData, bubbles: true });
            headerElement.dispatchEvent(event);
            form.reset();
        });

        return headerElement;
    }

    openDeleteDialog() {
        const existingDialog = document.getElementById(`dialog-delete-${this.id}`);
        if (existingDialog) existingDialog.remove();

        const dialogHTML = `
            <dialog class="delete-dialog" id="dialog-delete-${this.id}">
                <form class="delete-task-form" method="dialog">
                    <h3>Confirm Deletion</h3>
                    <p>Are you sure you want to delete the project "<span id="delete-name-${this.id}"></span>"?</p>
                    <div class="dialog-buttons">
                        <button type="submit" class="confirm-delete-btn">Delete</button>
                        <button type="button" class="cancel-btn">Cancel</button>
                    </div>
                    <span class="material-symbols-outlined close-btn" style="cursor: pointer; position: absolute; top: 10px; right: 10px;">close</span>
                </form>
            </dialog>`;

        const tempDiv = document.createElement('div');
        tempDiv.innerHTML = dialogHTML;
        document.body.appendChild(tempDiv.firstElementChild);

        const dialog = document.getElementById(`dialog-delete-${this.id}`);
        const closeBtn = dialog.querySelector('.close-btn');
        const cancelBtn = dialog.querySelector('.cancel-btn');
        const form = dialog.querySelector('form');

        dialog.querySelector(`#delete-name-${this.id}`).textContent = this.name;

        closeBtn.addEventListener('click', () => dialog.close());
        cancelBtn.addEventListener('click', () => dialog.close());

        form.addEventListener('submit', () => {
            const event = new CustomEvent('project-deleted', { 
                detail: { id: this.id },
                bubbles: true 
            });
            this.sidebarElement.dispatchEvent(event);
        });

        dialog.addEventListener('close', () => dialog.remove());
        dialog.showModal();
    }
}