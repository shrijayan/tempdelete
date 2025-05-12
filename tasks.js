document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const addTaskForm = document.getElementById('addTaskForm');
    const tasksList = document.getElementById('tasksList');
    const usernameDisplay = document.getElementById('username-display');
    const filterBtns = document.querySelectorAll('.filter-btn');
    
    // Get username from localStorage
    const username = localStorage.getItem('username');
    if (username) {
        usernameDisplay.textContent = `Welcome, ${username}`;
    }
    
    // Initialize tasks array from localStorage
    let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
    
    // Initial render tasks
    renderTasks();
    
    // Add event listener for form submission
    addTaskForm.addEventListener('submit', function(event) {
        event.preventDefault();
        
        // Get form values
        const taskTitle = document.getElementById('taskTitle').value.trim();
        const taskDescription = document.getElementById('taskDescription').value.trim();
        const taskType = document.querySelector('input[name="taskType"]:checked').value;
        
        // Create task object
        const newTask = {
            id: generateId(),
            title: taskTitle,
            description: taskDescription,
            type: taskType,
            completed: false,
            createdAt: new Date().toISOString(),
            updatedAt: new Date().toISOString()
        };
        
        // Add to tasks array
        tasks.push(newTask);
        
        // Save to localStorage
        saveToLocalStorage();
        
        // Reset form
        addTaskForm.reset();
        
        // Render tasks
        renderTasks();
        
        // Show success message
        showNotification('Task added successfully!');
    });
    
    // Add event listeners for filter buttons
    filterBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            // Remove active class from all buttons
            filterBtns.forEach(btn => btn.classList.remove('active'));
            
            // Add active class to clicked button
            this.classList.add('active');
            
            // Filter tasks
            const filterValue = this.getAttribute('data-filter');
            renderTasks(filterValue);
        });
    });
    
    // Function to generate unique ID
    function generateId() {
        return Date.now().toString(36) + Math.random().toString(36).substr(2);
    }
    
    // Function to save tasks to localStorage
    function saveToLocalStorage() {
        localStorage.setItem('tasks', JSON.stringify(tasks));
    }
    
    // Function to render tasks
    function renderTasks(filter = 'all') {
        // Clear tasks list
        tasksList.innerHTML = '';
        
        // Filter tasks
        let filteredTasks = [];
        
        switch(filter) {
            case 'task':
                filteredTasks = tasks.filter(task => task.type === 'task');
                break;
            case 'note':
                filteredTasks = tasks.filter(task => task.type === 'note');
                break;
            case 'completed':
                filteredTasks = tasks.filter(task => task.completed);
                break;
            default:
                filteredTasks = tasks;
        }
        
        // If no tasks, show message
        if (filteredTasks.length === 0) {
            const noTasksMsg = document.createElement('div');
            noTasksMsg.className = 'no-tasks-message';
            noTasksMsg.textContent = 'No tasks or notes found. Add your first one above!';
            tasksList.appendChild(noTasksMsg);
            return;
        }
        
        // Sort tasks by creation date (newest first)
        filteredTasks.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        
        // Render each task
        filteredTasks.forEach(task => {
            const taskItem = document.createElement('div');
            taskItem.className = `task-item ${task.type} ${task.completed ? 'completed' : ''}`;
            taskItem.dataset.id = task.id;
            
            // Format date
            const createdDate = new Date(task.createdAt).toLocaleDateString();
            const createdTime = new Date(task.createdAt).toLocaleTimeString();
            
            taskItem.innerHTML = `
                <div class="task-item-header">
                    <h3>${task.title}</h3>
                    <div class="task-controls">
                        ${task.type === 'task' ? `
                            <button class="complete-btn" title="${task.completed ? 'Mark as incomplete' : 'Mark as complete'}">
                                ${task.completed ? '↩' : '✓'}
                            </button>
                        ` : ''}
                        <button class="edit-btn" title="Edit">✎</button>
                        <button class="delete-btn" title="Delete">×</button>
                    </div>
                </div>
                ${task.description ? `<p>${task.description}</p>` : ''}
                <div class="task-meta">
                    <span>Created on ${createdDate} at ${createdTime}</span>
                    <span class="task-type-badge ${task.type}">${task.type.charAt(0).toUpperCase() + task.type.slice(1)}</span>
                </div>
            `;
            
            // Add event listeners for task controls
            tasksList.appendChild(taskItem);
            
            // Complete button
            const completeBtn = taskItem.querySelector('.complete-btn');
            if (completeBtn) {
                completeBtn.addEventListener('click', function() {
                    toggleTaskComplete(task.id);
                });
            }
            
            // Edit button
            const editBtn = taskItem.querySelector('.edit-btn');
            editBtn.addEventListener('click', function() {
                editTask(task);
            });
            
            // Delete button
            const deleteBtn = taskItem.querySelector('.delete-btn');
            deleteBtn.addEventListener('click', function() {
                deleteTask(task.id);
            });
        });
    }
    
    // Function to toggle task complete
    function toggleTaskComplete(taskId) {
        const taskIndex = tasks.findIndex(task => task.id === taskId);
        if (taskIndex !== -1) {
            tasks[taskIndex].completed = !tasks[taskIndex].completed;
            tasks[taskIndex].updatedAt = new Date().toISOString();
            saveToLocalStorage();
            renderTasks(document.querySelector('.filter-btn.active').getAttribute('data-filter'));
            showNotification(`Task marked as ${tasks[taskIndex].completed ? 'complete' : 'incomplete'}`);
        }
    }
    
    // Function to edit task
    function editTask(task) {
        // Set form values
        document.getElementById('taskTitle').value = task.title;
        document.getElementById('taskDescription').value = task.description;
        document.querySelector(`input[value="${task.type}"]`).checked = true;
        
        // Change submit button text
        const submitBtn = addTaskForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Update';
        
        // Create cancel button if it doesn't exist
        let cancelBtn = addTaskForm.querySelector('.cancel-btn');
        if (!cancelBtn) {
            cancelBtn = document.createElement('button');
            cancelBtn.className = 'cancel-btn';
            cancelBtn.type = 'button';
            cancelBtn.textContent = 'Cancel';
            cancelBtn.style.backgroundColor = '#ddd';
            cancelBtn.style.marginLeft = '10px';
            submitBtn.parentNode.appendChild(cancelBtn);
        }
        
        // Scroll to form
        addTaskForm.scrollIntoView({ behavior: 'smooth' });
        
        // Store editing task id
        addTaskForm.dataset.editingId = task.id;
        
        // Cancel button event listener
        cancelBtn.addEventListener('click', function() {
            resetForm();
        });
        
        // Update form submit handler
        addTaskForm.onsubmit = function(event) {
            event.preventDefault();
            
            // Get form values
            const taskTitle = document.getElementById('taskTitle').value.trim();
            const taskDescription = document.getElementById('taskDescription').value.trim();
            const taskType = document.querySelector('input[name="taskType"]:checked').value;
            
            // Find task index
            const taskIndex = tasks.findIndex(t => t.id === task.id);
            if (taskIndex !== -1) {
                // Update task
                tasks[taskIndex].title = taskTitle;
                tasks[taskIndex].description = taskDescription;
                tasks[taskIndex].type = taskType;
                tasks[taskIndex].updatedAt = new Date().toISOString();
                
                // Save to localStorage
                saveToLocalStorage();
                
                // Reset form
                resetForm();
                
                // Render tasks
                renderTasks(document.querySelector('.filter-btn.active').getAttribute('data-filter'));
                
                // Show success message
                showNotification('Task updated successfully!');
            }
        };
    }
    
    // Function to reset form
    function resetForm() {
        addTaskForm.reset();
        const submitBtn = addTaskForm.querySelector('button[type="submit"]');
        submitBtn.textContent = 'Add';
        
        // Remove cancel button
        const cancelBtn = addTaskForm.querySelector('.cancel-btn');
        if (cancelBtn) {
            cancelBtn.remove();
        }
        
        // Remove editing id
        delete addTaskForm.dataset.editingId;
        
        // Reset form submit handler
        addTaskForm.onsubmit = null;
        
        // Restore default event handler
        addTaskForm.addEventListener('submit', function(event) {
            event.preventDefault();
            
            // Get form values
            const taskTitle = document.getElementById('taskTitle').value.trim();
            const taskDescription = document.getElementById('taskDescription').value.trim();
            const taskType = document.querySelector('input[name="taskType"]:checked').value;
            
            // Create task object
            const newTask = {
                id: generateId(),
                title: taskTitle,
                description: taskDescription,
                type: taskType,
                completed: false,
                createdAt: new Date().toISOString(),
                updatedAt: new Date().toISOString()
            };
            
            // Add to tasks array
            tasks.push(newTask);
            
            // Save to localStorage
            saveToLocalStorage();
            
            // Reset form
            addTaskForm.reset();
            
            // Render tasks
            renderTasks();
            
            // Show success message
            showNotification('Task added successfully!');
        });
    }
    
    // Function to delete task
    function deleteTask(taskId) {
        if (confirm('Are you sure you want to delete this item?')) {
            tasks = tasks.filter(task => task.id !== taskId);
            saveToLocalStorage();
            renderTasks(document.querySelector('.filter-btn.active').getAttribute('data-filter'));
            showNotification('Item deleted successfully!');
        }
    }
    
    // Function to show notification
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.textContent = message;
        
        // Style notification
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = '#4a90e2';
        notification.style.color = 'white';
        notification.style.padding = '10px 15px';
        notification.style.borderRadius = '5px';
        notification.style.boxShadow = '0 2px 10px rgba(0, 0, 0, 0.1)';
        notification.style.zIndex = '1000';
        notification.style.opacity = '0';
        notification.style.transform = 'translateY(10px)';
        notification.style.transition = 'opacity 0.3s, transform 0.3s';
        
        // Add to body
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateY(0)';
        }, 10);
        
        // Remove notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateY(10px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
});
