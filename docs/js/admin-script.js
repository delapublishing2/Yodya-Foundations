// admin-script.js

document.addEventListener('DOMContentLoaded', function() {
    const currentMonthYear = document.getElementById('current-month-year');
    const calendarDays = document.querySelector('.calendar-days');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const modal = document.getElementById('event-modal');
    const closeModalButton = document.querySelector('.close-button');
    const eventForm = document.getElementById('event-form');
    const deleteEventButton = document.getElementById('delete-event');
    const modalTitle = document.getElementById('modal-title');
    const loginForm = document.getElementById('login-form');
    const loginContainer = document.querySelector('.login-container');
    const calendarContainer = document.querySelector('.calendar-container');
    const logoutButton = document.getElementById('logout-button');
    require('dotenv').config();

    let date = new Date();
    let events = JSON.parse(localStorage.getItem('events')) || {};
    let currentUser = JSON.parse(localStorage.getItem('currentUser')) || null;

    const adminUser = {
        username: process.env.ADMIN_USERNAME,
        password: process.env.ADMIN_PASSWORD,
        role: process.env.ADMIN_ROLE
      };
      
      // Example usage
      console.log(`Admin User: ${adminUser.username}, Role: ${adminUser.role}`);
    function renderCalendar() {
        const month = date.getMonth();
        const year = date.getFullYear();
        currentMonthYear.textContent = date.toLocaleDateString('en-US', { month: 'long', year: 'numeric' });

        const firstDayOfMonth = new Date(year, month, 1).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();

        calendarDays.innerHTML = '';

        for (let i = 0; i < firstDayOfMonth; i++) {
            const emptyDiv = document.createElement('div');
            emptyDiv.classList.add('calendar-date', 'empty');
            calendarDays.appendChild(emptyDiv);
        }

        for (let day = 1; day <= daysInMonth; day++) {
            const dateDiv = document.createElement('div');
            dateDiv.classList.add('calendar-date');
            dateDiv.textContent = day;

            const dateString = `${year}-${String(month + 1).padStart(2, '0')}-${String(day).padStart(2, '0')}`;
            if (events[dateString]) {
                const eventIndicator = document.createElement('div');
                eventIndicator.classList.add('event-indicator');
                dateDiv.appendChild(eventIndicator);
            }

            dateDiv.addEventListener('click', function() {
                openModal(dateString);
            });

            calendarDays.appendChild(dateDiv);
        }
    }

    function openModal(dateString) {
        const event = events[dateString];
        if (event) {
            modalTitle.textContent = 'Edit Event';
            eventForm['event-id'].value = dateString;
            eventForm['event-title'].value = event.title;
            eventForm['event-date'].value = dateString;
            eventForm['event-description'].value = event.description;
            deleteEventButton.style.display = 'block';
        } else {
            modalTitle.textContent = 'Add Event';
            eventForm.reset();
            eventForm['event-id'].value = dateString;
            deleteEventButton.style.display = 'none';
        }

        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
    }

    function saveEvent(event) {
        event.preventDefault();
        const eventId = eventForm['event-id'].value;
        const eventTitle = eventForm['event-title'].value;
        const eventDate = eventForm['event-date'].value;
        const eventDescription = eventForm['event-description'].value;

        events[eventId] = {
            title: eventTitle,
            date: eventDate,
            description: eventDescription
        };
        localStorage.setItem('events', JSON.stringify(events));

        eventForm.reset();
        closeModal();
        renderCalendar();
    }

    function deleteEvent() {
        const eventId = eventForm['event-id'].value;
        delete events[eventId];
        localStorage.setItem('events', JSON.stringify(events));

        eventForm.reset();
        closeModal();
        renderCalendar();
    }

    function handleLogin(event) {
        event.preventDefault();
        const username = loginForm['username'].value;
        const password = loginForm['password'].value;

        if (username === adminUser.username && password === adminUser.password) {
            currentUser = adminUser;
            localStorage.setItem('currentUser', JSON.stringify(currentUser));
            loginContainer.style.display = 'none';
            calendarContainer.style.display = 'block';
            renderCalendar();
        } else {
            alert('Invalid username or password');
        }
    }

    function handleLogout() {
        currentUser = null;
        localStorage.removeItem('currentUser');
        loginContainer.style.display = 'block';
        calendarContainer.style.display = 'none';
    }

    prevMonthButton.addEventListener('click', function() {
        date.setMonth(date.getMonth() - 1);
        renderCalendar();
    });

    nextMonthButton.addEventListener('click', function() {
        date.setMonth(date.getMonth() + 1);
        renderCalendar();
    });

    closeModalButton.addEventListener('click', closeModal);

    window.addEventListener('click', function(event) {
        if (event.target == modal) {
            closeModal();
        }
    });

    eventForm.addEventListener('submit', saveEvent);
    deleteEventButton.addEventListener('click', deleteEvent);
    loginForm.addEventListener('submit', handleLogin);
    logoutButton.addEventListener('click', handleLogout);

    if (currentUser && currentUser.role === 'admin') {
        loginContainer.style.display = 'none';
        calendarContainer.style.display = 'block';
        renderCalendar();
    } else {
        loginContainer.style.display = 'block';
        calendarContainer.style.display = 'none';
    }
});
