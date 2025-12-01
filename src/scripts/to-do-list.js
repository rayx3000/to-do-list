export default class ToDoList{
    constructor(id, name, project, date, importance, description){
        this.id = id;
        this.name = name;
        this.project = project;
        this.date = date
        this.importance = importance; 
        this.description = description;
    }

    generateToDoList(){
        return `
             <div class="task" id="${this.id}">
                    <div class="task-options">
                        <span class="material-symbols-outlined" id="edit">edit</span>
                        <span class="material-symbols-outlined" id="delete">delete</span>
                    </div>
                    <div class="task-name">
                        <h2>${this.name}</h2>
                    </div>
                    <div class="task-details"> 
                        <h4>${this.project}</h4>                       
                        <span id="date">${this.date}</span>
                        <span id="importance">${this.importance}</span>
                        <p id="description">${this.description}</p>
                    </div>
            </div>
        `
    }
}

