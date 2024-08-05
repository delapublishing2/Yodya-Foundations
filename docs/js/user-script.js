// user-script.js

document.addEventListener('DOMContentLoaded', function() {
    const currentMonthYear = document.getElementById('current-month-year');
    const calendarDays = document.querySelector('.calendar-days');
    const prevMonthButton = document.getElementById('prev-month');
    const nextMonthButton = document.getElementById('next-month');
    const modal = document.getElementById('event-modal');
    const closeModalButton = document.querySelector('.close-button');
    const eventForm = document.getElementById('event-form');
    const modalTitle = document.getElementById('modal-title');
    const joinEventButton = document.getElementById('join-event');

    let date = new Date();
    let events = JSON.parse(localStorage.getItem('events')) || {};

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
            modalTitle.textContent = 'Event Details';
            eventForm['event-title'].value = event.title;
            eventForm['event-date'].value = dateString;
            eventForm['event-description'].value = event.description;
            joinEventButton.style.display = 'block';
        } else {
            modalTitle.textContent = 'No Event';
            eventForm.reset();
            joinEventButton.style.display = 'none';
        }

        modal.style.display = 'block';
    }

    function closeModal() {
        modal.style.display = 'none';
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

    renderCalendar();
});
