document.addEventListener('DOMContentLoaded', () => {
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
                    const newName = prompt('Rename project:', currentTitle);
                    if (newName && newName.trim() !== "") {
                        titleSpan.textContent = newName.trim();
                    }
                } 
                else if (action === 'delete') {
                    if (confirm(`Delete "${currentTitle}"?`)) {
                        project.remove();
                    }
                } 
                else {
                    console.log('Action triggered:', action);
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

    // 4. Close on Escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeAll();
    });
});