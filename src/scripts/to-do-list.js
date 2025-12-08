export default class ToDoList {
    constructor(id, name, project, date, importance, description) {
        this.id = id;
        this.name = name;
        this.project = project;
        this.date = date;
        this.importance = importance;
        this.description = description;
    }

    createTaskElement() {
        const tempDiv = document.createElement('div');
        
        tempDiv.innerHTML = `
             <div class="task" id="${this.id}">
                    <div class="task-options">
                        <button class="material-symbols-outlined edit-btn">edit</button>
                        <button class="material-symbols-outlined delete-btn">delete</button>
                    </div>
                    <div class="task-name">
                        <h2>${this.name}</h2>
                    </div>
                    <div class="task-details"> 
                        <h4>${this.project}</h4>                       
                        <span class="date">${this.date}</span>
                        <span class="importance">${this.importance}</span>
                        <p class="description">${this.description}</p>
                    </div>
            </div>
        `;

        const taskElement = tempDiv.firstElementChild;

        const editBtn = taskElement.querySelector('.edit-btn');
        editBtn.addEventListener('click', () => this.openEditDialog());

        const deleteBtn = taskElement.querySelector('.delete-btn');
        deleteBtn.addEventListener('click', () => {
             taskElement.remove();
             const event = new CustomEvent('task-deleted', { 
                 detail: { id: this.id },
                 bubbles: true 
             });
             document.querySelector('.to-do-list').dispatchEvent(event);
        });

        return taskElement;
    }

   openEditDialog() {
        const existingDialog = document.getElementById(`dialog-${this.id}`);
        if (existingDialog) existingDialog.remove();

        const dialogHTML = `
            <dialog class="edit-dialog" id="dialog-${this.id}">
                <form class="edit-task-form" method="dialog">
                    <div class="dialog-header">
                        <h3>Edit Task</h3>
                        <span class="material-symbols-outlined close-btn" style="cursor:pointer;">close</span>
                    </div>
                    
                    <label>
                        <span>Name</span>
                        <input type="text" id="edit-name-${this.id}" value="${this.name}" required>
                    </label>
                    
                    <label>
                        <span>Date</span>
                        <input type="date" id="edit-date-${this.id}" value="${this.date}" required>
                    </label>
                    
                    <label>
                        <span>Importance/Priority</span>
                        <select id="edit-importance-${this.id}">
                            <option value="Low" ${this.importance === 'Low' ? 'selected' : ''}>Low</option>
                            <option value="Medium" ${this.importance === 'Medium' ? 'selected' : ''}>Medium</option>
                            <option value="High" ${this.importance === 'High' ? 'selected' : ''}>High</option>
                        </select>
                    </label>
                    
                    <label>
                        <span>Description</span>
                        <textarea id="edit-desc-${this.id}" class="description-textbox" maxlength="75">${this.description}</textarea>
                    </label>
                    
                    <button type="submit">Save Changes</button>
                </form>
            </dialog>`;

        document.body.insertAdjacentHTML('beforeend', dialogHTML);

        const dialog = document.getElementById(`dialog-${this.id}`);
        const closeBtn = dialog.querySelector('.close-btn');
        const form = dialog.querySelector('form');

        closeBtn.addEventListener('click', () => dialog.close());
        
        form.addEventListener('submit', () => {
            this.name = document.getElementById(`edit-name-${this.id}`).value;
            this.date = document.getElementById(`edit-date-${this.id}`).value;
            this.importance = document.getElementById(`edit-importance-${this.id}`).value;
            this.description = document.getElementById(`edit-desc-${this.id}`).value;

            const event = new CustomEvent('task-edited', { 
                detail: { task: this },
                bubbles: true 
            });
            document.querySelector('.to-do-list').dispatchEvent(event);
        });

        dialog.addEventListener('close', () => dialog.remove());
        dialog.showModal();
    }
}