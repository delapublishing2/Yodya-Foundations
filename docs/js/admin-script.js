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

    let date = new Date();
    let events = {};  // Assuming you're using an API for event storage

    const API_URL = 'https://backend-cd504z2zm-delapublishing2s-projects.vercel.app/api/events'

    async function handleLogin(event) {
        event.preventDefault();
        const username = loginForm['username'].value;
        const password = loginForm['password'].value;

        try {
            const response = await fetch('/api/login', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ username, password })
            });

            const result = await response.json();
            if (result.success) {
                const token = result.token;
                localStorage.setItem('authToken', token);  // Store the token in local storage
                loginContainer.style.display = 'none';
                calendarContainer.style.display = 'block';
                renderCalendar();
            } else {
                alert('Invalid credentials');
            }
        } catch (error) {
            console.error('Login error:', error);
        }
    }

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

    async function fetchEvents() {
        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(API_URL, {
                method: 'GET',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });
            const data = await response.json();
            events = data;
            renderCalendar();
        } catch (error) {
            console.error('Error fetching events:', error);
        }
    }

    async function saveEvent(event) {
        event.preventDefault();
        const eventId = eventForm['event-id'].value;
        const eventTitle = eventForm['event-title'].value;
        const eventDate = eventForm['event-date'].value;
        const eventDescription = eventForm['event-description'].value;

        const eventData = {
            id: eventId,
            title: eventTitle,
            date: eventDate,
            description: eventDescription
        };

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(API_URL, {
                method: 'POST',  // Change to 'PUT' if updating an existing event
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': `Bearer ${token}`
                },
                body: JSON.stringify(eventData)
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result.message);

            closeModal();
            fetchEvents();
        } catch (error) {
            console.error('Error saving event:', error);
        }
    }

    async function deleteEvent() {
        const eventId = eventForm['event-id'].value;

        try {
            const token = localStorage.getItem('authToken');
            const response = await fetch(`${API_URL}/${eventId}`, {
                method: 'DELETE',
                headers: {
                    'Authorization': `Bearer ${token}`
                }
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json();
            console.log(result.message);

            closeModal();
            fetchEvents();
        } catch (error) {
            console.error('Error deleting event:', error);
        }
    }

    eventForm.addEventListener('submit', saveEvent);
    deleteEventButton.addEventListener('click', deleteEvent);

    fetchEvents();

    function handleLogout() {
        localStorage.removeItem('authToken');  // Clear the token on logout
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
        if (event.target === modal) {
            closeModal();
        }
    });

    loginForm.addEventListener('submit', handleLogin);
    logoutButton.addEventListener('click', handleLogout);

    const token = localStorage.getItem('authToken');
    if (token) {
        loginContainer.style.display = 'none';
        calendarContainer.style.display = 'block';
        fetchEvents();
    } else {
        loginContainer.style.display = 'block';
        calendarContainer.style.display = 'none';
    }
});
