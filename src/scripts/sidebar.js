import { projects } from "./project.js";

const addProjectDialog = document.querySelector(".add-project");
const addProject = document.getElementById("add-project");
const closeDialog = document.getElementById("close2");

addProject.addEventListener("click", () => addProjectDialog.showModal());
closeDialog.addEventListener("click", () => addProjectDialog.close());


let projectLists = '';

projects.map((projectTag) => {
    projectLists += projectTag.generateProjectTag();
});

document.querySelector(".my-projects").innerHTML = projectLists;

document.addEventListener('DOMContentLoaded', () => {
    
    // Helper to close all open menus
    function closeAll() {
        document.querySelectorAll('.menu.show').forEach(menu => {
            menu.classList.remove('show');
            menu.setAttribute('aria-hidden', 'true');
        });
    }

    const container = document.querySelector('.my-projects');

    if (container) {
        container.addEventListener('click', function(e) {
            
            const toggleBtn = e.target.closest('.more');
            if (toggleBtn) {
                e.stopPropagation(); 
                e.preventDefault();

                const project = toggleBtn.closest('.project');
                const menu = project.querySelector('.menu');
                const isAlreadyOpen = menu.classList.contains('show');

                closeAll(); 

                if (!isAlreadyOpen) {
                    menu.classList.add('show');
                    menu.setAttribute('aria-hidden', 'false');
                }
                return;
            }
            
            const menuItem = e.target.closest('.menu-item');
            if (menuItem) {
                e.preventDefault();
                
                const project = menuItem.closest('.project');
                const action = menuItem.dataset.action; 
                
                const titleSpan = project.querySelector('.row-btn > span:first-child');
                const currentTitle = titleSpan.textContent.trim();

                if (action === 'rename') {
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.value = currentTitle;
                    input.className = 'project-edit-input';
                    
                    titleSpan.innerHTML = '';
                    titleSpan.appendChild(input);
                    input.focus();

                    const saveName = () => {
                        const newName = input.value.trim();
                        titleSpan.textContent = newName || currentTitle; 
                    };

                    input.addEventListener('keydown', (evt) => {
                        if (evt.key === 'Enter') {
                            saveName();
                        }
                    });

                    input.addEventListener('blur', () => {
                        saveName();
                    });

                    console.log('Rename mode activated');
                } 
                else if (action === 'delete') {
                   console.log('Delete action triggered');
                   project.remove(); 
                } 
                else {
                    console.log('Other action triggered:', action);
                }

                closeAll();
            }
        });
    }

    document.addEventListener('click', (e) => {
        if (!e.target.closest('.menu') && !e.target.closest('.more')) {
            closeAll();
        }
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
    });
});