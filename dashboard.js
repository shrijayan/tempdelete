// DOM Elements
const themeToggle = document.getElementById('theme-toggle');
const noteTab = document.getElementById('notes-tab');
const tasksTab = document.getElementById('tasks-tab');
const remindersTab = document.getElementById('reminders-tab');
const notesSection = document.getElementById('notes-section');
const tasksSection = document.getElementById('tasks-section');
const remindersSection = document.getElementById('reminders-section');
const addNoteBtn = document.getElementById('add-note-btn');
const addTaskBtn = document.getElementById('add-task-btn');
const addReminderBtn = document.getElementById('add-reminder-btn');
const noteModal = document.getElementById('note-modal');
const taskModal = document.getElementById('task-modal');
const reminderModal = document.getElementById('reminder-modal');
const noteForm = document.getElementById('note-form');
const taskForm = document.getElementById('task-form');
const reminderForm = document.getElementById('reminder-form');
const notesContainer = document.getElementById('notes-container');
const tasksContainer = document.getElementById('tasks-container');
const remindersContainer = document.getElementById('reminders-container');
const filterBtns = document.querySelectorAll('.filter-btn');
const closeModalBtns = document.querySelectorAll('.close-modal');

// Data Storage
let notes = JSON.parse(localStorage.getItem('notes')) || [];
let tasks = JSON.parse(localStorage.getItem('tasks')) || [];
let reminders = JSON.parse(localStorage.getItem('reminders')) || [];
let currentFilter = 'all';

// Initialize
document.addEventListener('DOMContentLoaded', () => {
    // Check for dark mode preference
    if (localStorage.getItem('darkMode') === 'true') {
        document.body.classList.add('dark-mode');
        themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    }

    // Set active tab based on URL hash or default to notes
    const hash = window.location.hash.substring(1);
    if (hash === 'tasks') {
        showSection(tasksSection, tasksTab);
    } else if (hash === 'reminders') {
        showSection(remindersSection, remindersTab);
    } else {
        showSection(notesSection, noteTab);
    }

    // Render initial data
    renderNotes();
    renderTasks();
    renderReminders();
});

// Theme Toggle
themeToggle.addEventListener('click', () => {
    document.body.classList.toggle('dark-mode');
    const isDarkMode = document.body.classList.contains('dark-mode');
    localStorage.setItem('darkMode', isDarkMode);
    themeToggle.innerHTML = isDarkMode ? '<i class="fas fa-sun"></i>' : '<i class="fas fa-moon"></i>';
});

// Tab Navigation
noteTab.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(notesSection, noteTab);
    window.location.hash = 'notes';
});

tasksTab.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(tasksSection, tasksTab);
    window.location.hash = 'tasks';
});

remindersTab.addEventListener('click', (e) => {
    e.preventDefault();
    showSection(remindersSection, remindersTab);
    window.location.hash = 'reminders';
});

// Show active section and update active tab
function showSection(section, tab) {
    // Hide all sections
    notesSection.classList.add('hidden');
    tasksSection.classList.add('hidden');
    remindersSection.classList.add('hidden');
    
    // Remove active class from all tabs
    document.querySelectorAll('.sidebar-nav li').forEach(item => {
        item.classList.remove('active');
    });
    
    // Show selected section and set active tab
    section.classList.remove('hidden');
    tab.parentElement.classList.add('active');
}

// Modal Controls
addNoteBtn.addEventListener('click', () => openModal(noteModal));
addTaskBtn.addEventListener('click', () => openModal(taskModal));
addReminderBtn.addEventListener('click', () => openModal(reminderModal));

closeModalBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        const modal = btn.closest('.modal');
        closeModal(modal);
    });
});

// Close modal when clicking outside
window.addEventListener('click', (e) => {
    if (e.target.classList.contains('modal')) {
        closeModal(e.target);
    }
});

function openModal(modal) {
    modal.classList.add('show');
    // Reset form if opening
    const form = modal.querySelector('form');
    if (form) form.reset();
}

function closeModal(modal) {
    modal.classList.remove('show');
}

// Notes Functionality
noteForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('note-title').value;
    const content = document.getElementById('note-content').value;
    const color = document.getElementById('note-color').value;
    const id = Date.now().toString();
    const date = new Date().toISOString();
    
    const newNote = { id, title, content, color, date };
    notes.unshift(newNote); // Add to beginning of array
    
    saveNotes();
    renderNotes();
    closeModal(noteModal);
    noteForm.reset();
});

function saveNotes() {
    localStorage.setItem('notes', JSON.stringify(notes));
}


function editNote(e) {
    const noteId = e.currentTarget.dataset.id;
    const note = notes.find(note => note.id === noteId);
    
    if (note) {
        document.getElementById('note-title').value = note.title;
        document.getElementById('note-content').value = note.content;
        document.getElementById('note-color').value = note.color;
        
        // Remove the old note
        notes = notes.filter(n => n.id !== noteId);
        
        openModal(noteModal);
    }
}

function deleteNote(e) {
    const noteId = e.currentTarget.dataset.id;
    notes = notes.filter(note => note.id !== noteId);
    saveNotes();
    renderNotes();
}

// Tasks Functionality
taskForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('task-title').value;
    const description = document.getElementById('task-description').value;
    const dueDate = document.getElementById('task-due-date').value;
    const priority = document.getElementById('task-priority').value;
    const id = Date.now().toString();
    const completed = false;
    const createdAt = new Date().toISOString();
    
    const newTask = { id, title, description, dueDate, priority, completed, createdAt };
    tasks.unshift(newTask); // Add to beginning of array
    
    saveTasks();
    renderTasks();
    closeModal(taskModal);
    taskForm.reset();
});


function renderTasks() {
    tasksContainer.innerHTML = '';
    
    // Filter tasks based on current filter
    let filteredTasks = tasks;
    if (currentFilter === 'active') {
        filteredTasks = tasks.filter(task => !task.completed);
    } else if (currentFilter === 'completed') {
        filteredTasks = tasks.filter(task => task.completed);
    }
    
    if (filteredTasks.length === 0) {
        tasksContainer.innerHTML = '<div class="empty-state">No tasks found. Click "New Task" to create one.</div>';
        return;
    }
    
    filteredTasks.forEach(task => {
        const taskEl = document.createElement('div');
        taskEl.className = `task-item ${task.completed ? 'completed' : ''}`;
        
        // Format due date if exists
        let dueDateFormatted = '';
        if (task.dueDate) {
            const dueDate = new Date(task.dueDate);
            dueDateFormatted = dueDate.toLocaleDateString() + ' ' + dueDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        }
        
        taskEl.innerHTML = `
            <input type="checkbox" class="task-checkbox" data-id="${task.id}" ${task.completed ? 'checked' : ''}>
            <div class="task-content">
                <h3 class="task-title">${task.title}</h3>
                <div class="task-details">
                    ${task.description ? `<p>${task.description}</p>` : ''}
                    ${task.dueDate ? `<div class="task-due"><i class="far fa-clock"></i> ${dueDateFormatted}</div>` : ''}
                    <div class="task-priority">
                        <span class="priority-indicator priority-${task.priority}"></span>
                        ${task.priority.charAt(0).toUpperCase() + task.priority.slice(1)}
                    </div>
                </div>
            </div>
            <div class="task-actions">
                <button class="task-btn edit-task" data-id="${task.id}"><i class="fas fa-edit"></i></button>
                <button class="task-btn delete-task" data-id="${task.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        tasksContainer.appendChild(taskEl);
    });
    
    // Add event listeners
    document.querySelectorAll('.task-checkbox').forEach(checkbox => {
        checkbox.addEventListener('change', toggleTaskCompletion);
    });
    
    document.querySelectorAll('.edit-task').forEach(btn => {
        btn.addEventListener('click', editTask);
    });
    
    document.querySelectorAll('.delete-task').forEach(btn => {
        btn.addEventListener('click', deleteTask);
    });
}

function toggleTaskCompletion(e) {
    const taskId = e.target.dataset.id;
    const task = tasks.find(task => task.id === taskId);
    
    if (task) {
        task.completed = e.target.checked;
        saveTasks();
        renderTasks();
    }
}

function editTask(e) {
    const taskId = e.currentTarget.dataset.id;
    const task = tasks.find(task => task.id === taskId);
    
    if (task) {
        document.getElementById('task-title').value = task.title;
        document.getElementById('task-description').value = task.description || '';
        if (task.dueDate) document.getElementById('task-due-date').value = task.dueDate;
        document.getElementById('task-priority').value = task.priority;
        
        // Remove the old task
        tasks = tasks.filter(t => t.id !== taskId);
        
        openModal(taskModal);
    }
}

function deleteTask(e) {
    const taskId = e.currentTarget.dataset.id;
    tasks = tasks.filter(task => task.id !== taskId);
    saveTasks();
    renderTasks();
}

// Task Filters
filterBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        filterBtns.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        currentFilter = btn.dataset.filter;
        renderTasks();
    });
});

// Reminders Functionality
reminderForm.addEventListener('submit', (e) => {
    e.preventDefault();
    
    const title = document.getElementById('reminder-title').value;
    const date = document.getElementById('reminder-date').value;
    const repeat = document.getElementById('reminder-repeat').value;
    const id = Date.now().toString();
    const createdAt = new Date().toISOString();
    
    const newReminder = { id, title, date, repeat, createdAt };
    reminders.unshift(newReminder); // Add to beginning of array
    
    saveReminders();
    renderReminders();
    closeModal(reminderModal);
    reminderForm.reset();
    
    // Schedule notification if browser supports it
    if (Notification.permission === 'granted') {
        scheduleNotification(newReminder);
    } else if (Notification.permission !== 'denied') {
        Notification.requestPermission().then(permission => {
            if (permission === 'granted') {
                scheduleNotification(newReminder);
            }
        });
    }
});

function saveReminders() {
    localStorage.setItem('reminders', JSON.stringify(reminders));
}

function renderReminders() {
    remindersContainer.innerHTML = '';
    
    if (reminders.length === 0) {
        remindersContainer.innerHTML = '<div class="empty-state">No reminders yet. Click "New Reminder" to create one.</div>';
        return;
    }
    
    // Sort reminders by date
    const sortedReminders = [...reminders].sort((a, b) => new Date(a.date) - new Date(b.date));
    
    sortedReminders.forEach(reminder => {
        const reminderEl = document.createElement('div');
        reminderEl.className = 'reminder-item';
        
        // Format date
        const reminderDate = new Date(reminder.date);
        const formattedDate = reminderDate.toLocaleDateString() + ' ' + reminderDate.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });
        
        // Check if reminder is past due
        const isPastDue = reminderDate < new Date();
        
        reminderEl.innerHTML = `
            <div class="reminder-icon">
                <i class="fas fa-bell"></i>
            </div>
            <div class="reminder-content">
                <h3 class="reminder-title">${reminder.title}</h3>
                <div class="reminder-info">
                    <div class="reminder-datetime ${isPastDue ? 'past-due' : ''}">
                        <i class="far fa-calendar-alt"></i> ${formattedDate}
                    </div>
                    ${reminder.repeat !== 'none' ? `
                        <div class="reminder-repeat">
                            <i class="fas fa-redo"></i> ${reminder.repeat.charAt(0).toUpperCase() + reminder.repeat.slice(1)}
                        </div>
                    ` : ''}
                </div>
            </div>
            <div class="reminder-actions">
                <button class="reminder-btn edit-reminder" data-id="${reminder.id}"><i class="fas fa-edit"></i></button>
                <button class="reminder-btn delete-reminder" data-id="${reminder.id}"><i class="fas fa-trash"></i></button>
            </div>
        `;
        
        remindersContainer.appendChild(reminderEl);
    });
    
    // Add event listeners
    document.querySelectorAll('.edit-reminder').forEach(btn => {
        btn.addEventListener('click', editReminder);
    });
    
    document.querySelectorAll('.delete-reminder').forEach(btn => {
        btn.addEventListener('click', deleteReminder);
    });
}


function deleteReminder(e) {
    const reminderId = e.currentTarget.dataset.id;
    reminders = reminders.filter(reminder => reminder.id !== reminderId);
    saveReminders();
    renderReminders();
}

function scheduleNotification(reminder) {
    const reminderTime = new Date(reminder.date).getTime();
    const currentTime = new Date().getTime();
    const timeUntilReminder = reminderTime - currentTime;
    
    if (timeUntilReminder > 0) {
        setTimeout(() => {
            const notification = new Notification(reminder.title, {
                body: 'Reminder!',
                icon: 'https://cdn.iconscout.com/icon/free/png-256/reminder-1767865-1502402.png'
            });
            
            // Handle recurring reminders
            if (reminder.repeat !== 'none') {
                let nextDate = new Date(reminder.date);
                
                switch (reminder.repeat) {
                    case 'daily':
                        nextDate.setDate(nextDate.getDate() + 1);
                        break;
                    case 'weekly':
                        nextDate.setDate(nextDate.getDate() + 7);
                        break;
                    case 'monthly':
                        nextDate.setMonth(nextDate.getMonth() + 1);
                        break;
                }
                
                const updatedReminder = {
                    ...reminder,
                    date: nextDate.toISOString(),
                    id: Date.now().toString()
                };
                
                reminders.push(updatedReminder);
                saveReminders();
                renderReminders();
                scheduleNotification(updatedReminder);
            }
        }, timeUntilReminder);
    }
}

// Check for reminders when the page loads
function checkReminders() {
    if (Notification.permission === 'granted') {
        reminders.forEach(reminder => {
            scheduleNotification(reminder);
        });
    }
}

checkReminders();
