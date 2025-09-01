// Get references to DOM elements used throughout the calendar app
const calendar = document.getElementById("calendar"); // Calendar grid container
const monthYearLabel = document.getElementById("month-year-label"); // Label for current month/year
const prevBtn = document.getElementById("prev-month"); // Previous month button
const nextBtn = document.getElementById("next-month"); // Next month button
const eventModal = document.getElementById("event-modal"); // Modal for adding events
const eventForm = document.getElementById("event-form"); // Event form inside modal
const eventTitleInput = document.getElementById("event-title"); // Event title input
const eventDescInput = document.getElementById("event-desc"); // Event description input
const closeModalBtn = document.getElementById("close-modal"); // Button to close event modal
const eventPopover = document.getElementById("event-popover"); // Popover for showing events on a day
const timelineModal = document.getElementById("timeline-modal"); // Modal for day timeline
const timelineContent = document.getElementById("timeline-list"); // Timeline event list container
const closeTimelineBtn = document.getElementById("close-timeline"); // Button to close timeline modal
const eventTimeInput = document.getElementById("event-time"); // Event time input

// Initialize date-related variables
let currentTime = new Date(); // Current date/time
let currentYear = currentTime.getFullYear(); // Current year
let currentMonth = currentTime.getMonth(); // Current month (0-indexed)
let today = new Date(); // Today's date
let selectedDay = null; // Reference to currently selected day cell
let selectedDayNum = null; // Number of selected day

// Load events from localStorage if available, otherwise use empty object
let events = {};
if (localStorage.getItem("calendar-events")) {
    events = JSON.parse(localStorage.getItem("calendar-events"));
}

// Immediately-invoked function for greeting and upcoming events on the home page
(function() {
    const greetingElem = document.getElementById("greeting"); // Greeting element
    const eventsListElem = document.getElementById("events-list"); // Upcoming events list element

    // Set greeting message based on time of day
    if (greetingElem) {
        const now = new Date();
        const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
        const months = [
            "January", "February", "March", "April", "May", "June",
            "July", "August", "September", "October", "November", "December"
        ];
        const hour = now.getHours();
        let greeting = "Good evening";
        if (hour < 12) greeting = "Good morning";
        else if (hour < 18) greeting = "Good afternoon";
        const dayName = days[now.getDay()];
        const dayNum = now.getDate();
        const monthName = months[now.getMonth()];
        greetingElem.textContent = `${greeting}, today is ${dayName} the ${dayNum} of ${monthName}`;
    }

    // Display up to 5 upcoming events (today or later), sorted by date
    if (eventsListElem) {
        let allEvents = {};
        // Prefer window.events if set, otherwise use localStorage
        if (window.events) {
            allEvents = window.events;
        } else if (localStorage.getItem("calendar-events")) {
            allEvents = JSON.parse(localStorage.getItem("calendar-events"));
        }
        // Flatten events into an array with date objects
        let upcoming = [];
        for (const key in allEvents) {
            const [year, month, day] = key.split("-").map(Number);
            const date = new Date(year, month, day);
            if (Array.isArray(allEvents[key])) {
                for (const ev of allEvents[key]) {
                    upcoming.push({
                        date,
                        title: ev.title,
                        desc: ev.desc
                    });
                }
            }
        }
        // Filter for today or future, sort, and take top 5
        upcoming = upcoming
            .filter(ev => ev.date >= new Date(new Date().setHours(0,0,0,0)))
            .sort((a, b) => a.date - b.date)
            .slice(0, 5);

        // Render the list or a message if no events
        if (upcoming.length === 0) {
            eventsListElem.innerHTML = "<li style='color:#aaa;'>No upcoming events</li>";
        } else {
            eventsListElem.innerHTML = upcoming.map(ev =>
            `<li>
                <strong>${ev.title}</strong> <span style="color:#2d8cff;">${ev.time ? ("@ " + ev.time) : ""}</span>
                <br>
                <span style="font-size:0.95em;color:#555;">
                ${ev.date.toLocaleDateString(undefined, { weekday: 'short', month: 'short', day: 'numeric' })}
                <br>${ev.desc}
                </span>
                </li>`
            ).join("");
        }
    }
})();

// Update the month/year label above the calendar
function updateMonthYearLabel(year, month) {
    const monthNames = [
        "January", "February", "March", "April", "May", "June",
        "July", "August", "September", "October", "November", "December"
    ];
    if (monthYearLabel) {
        monthYearLabel.textContent = `${monthNames[month]} ${year}`;
    }
}

// Generate a unique key for a given date (used for storing events)
function getEventKey(year, month, day) {
    return `${year}-${month}-${day}`;
}

// Get a copy of the events array for a specific day
function getEventsForDay(year, month, day) {
    const key = getEventKey(year, month, day);
    return events[key] ? [...events[key]] : [];
}

// Show a popover with events for a specific day
function showPopover(dayCell, year, month, day) {
    const rect = dayCell.getBoundingClientRect(); // Get position of day cell
    const eventsList = getEventsForDay(year, month, day); // Get events for this day

    // Build HTML for popover
    let html = `<strong>Events for ${month + 1}/${day}/${year}</strong><ul style="padding-left:18px;">`;
    if (eventsList.length === 0) {
        html += "<li style='color:#aaa;'>No events</li>";
    } else {
        for (const ev of eventsList) {
            html += `<li><strong>${ev.title}</strong><br><span style="font-size:0.95em;color:#555;">${ev.desc}</span></li>`;
        }
    }
    html += "</ul>";
    html += `<button id="view-timeline-btn" style="margin-top:8px;">View Timeline</button>`;

    eventPopover.innerHTML = html; // Set popover content
    eventPopover.style.display = "block"; // Show popover

    // Position popover below the day cell
    const scrollY = window.scrollY || document.documentElement.scrollTop;
    eventPopover.style.top = (rect.bottom + scrollY + 6) + "px";
    eventPopover.style.left = (rect.left + rect.width/2 - 110) + "px";

    // Add handler for "View Timeline" button
    setTimeout(() => {
        const btn = document.getElementById("view-timeline-btn");
        if (btn) {
            btn.onclick = () => showTimelineModal(year, month, day);
        }
    }, 0);
}

// Hide the event popover
function hidePopover() {
    eventPopover.style.display = "none";
}

// Show the timeline modal for a specific day, listing all events with delete and edit buttons
function showTimelineModal(year, month, day) {
    let eventsList = getEventsForDay(year, month, day);

    // Sort events by time (if time exists, otherwise keep original order)
    eventsList.sort((a, b) => {
        if (!a.time && !b.time) return 0;
        if (!a.time) return 1;
        if (!b.time) return -1;
        return a.time.localeCompare(b.time);
    });

    let html = "";
    if (eventsList.length === 0) {
        html = "<p style='color:#aaa;'>No events for this day.</p>";
    } else {
        html = `<ul style="list-style:none;padding:0;">`;
        eventsList.forEach((ev, idx) => {
            html += `
            <li style="margin-bottom:22px;position:relative;padding-left:32px;">
                <span style="position:absolute;left:0;top:0;width:18px;height:18px;background:#add8e6;border-radius:50%;display:inline-block;border:2px solid #90ee90;"></span>
                <div style="background:#f5f5f5;border-radius:6px;padding:10px 14px;box-shadow:0 1px 4px rgba(0,0,0,0.07);">
                    <strong>${ev.time ? ev.time + " - " : ""}${ev.title}</strong>
                    <div style="font-size:0.98em;color:#555;">${ev.desc || ""}</div>
                    <button class="edit-event-btn" data-idx="${idx}" style="margin-top:8px;margin-right:8px;background:#2d8cff;color:#fff;border:none;border-radius:4px;padding:4px 10px;cursor:pointer;">Edit</button>
                    <button class="delete-event-btn" data-idx="${idx}" style="margin-top:8px;background:#ff4d4d;color:#fff;border:none;border-radius:4px;padding:4px 10px;cursor:pointer;">Delete</button>
                </div>
            </li>`;
        });
        html += "</ul>";
    }
    timelineContent.innerHTML = html; // Set modal content
    timelineModal.style.display = "flex"; // Show modal

    // Add click handlers for delete buttons
    const deleteBtns = timelineContent.querySelectorAll('.delete-event-btn');
    deleteBtns.forEach(btn => {
        btn.onclick = function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            const key = getEventKey(year, month, day);
            if (events[key]) {
                // Sort the actual events array the same way as displayed
                events[key].sort((a, b) => {
                    if (!a.time && !b.time) return 0;
                    if (!a.time) return 1;
                    if (!b.time) return -1;
                    return a.time.localeCompare(b.time);
                });
                events[key].splice(idx, 1); // Remove event from array
                if (events[key].length === 0) {
                    delete events[key]; // Remove key if no events left
                }
                localStorage.setItem("calendar-events", JSON.stringify(events)); // Save changes
                showTimelineModal(year, month, day); // Refresh timeline
                generateCalendar(currentYear, currentMonth); // Refresh calendar grid
            }
        };
    });

    // Add click handlers for edit buttons
    const editBtns = timelineContent.querySelectorAll('.edit-event-btn');
    editBtns.forEach(btn => {
        btn.onclick = function() {
            const idx = parseInt(this.getAttribute('data-idx'));
            const key = getEventKey(year, month, day);
            if (events[key]) {
                // Sort the actual events array the same way as displayed
                events[key].sort((a, b) => {
                    if (!a.time && !b.time) return 0;
                    if (!a.time) return 1;
                    if (!b.time) return -1;
                    return a.time.localeCompare(b.time);
                });
                const ev = events[key][idx];
                // Pre-fill modal with event data
                eventTitleInput.value = ev.title;
                eventTimeInput.value = ev.time || "";
                eventDescInput.value = ev.desc || "";
                eventModal.style.display = "flex";
                // Store editing info
                eventModal.dataset.editing = "true";
                eventModal.dataset.editKey = key;
                eventModal.dataset.editIdx = idx;
                timelineModal.style.display = "none";
            }
        };
    });
}

// Hide the timeline modal
function hideTimelineModal() {
    timelineModal.style.display = "none";
}

// Generate the calendar grid for a given month/year
function generateCalendar(year, month) {
    calendar.innerHTML = ""; // Clear previous calendar
    selectedDay = null;
    selectedDayNum = null;
    hidePopover();

    // Calculate which day of week the month starts on and how many days in month
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Add blank cells for days before the 1st of the month
    for (let i = 0; i < firstDay; i++) {
        const blankCell = document.createElement("div");
        blankCell.className = "day-cell";
        blankCell.style.visibility = "hidden";
        calendar.appendChild(blankCell);
    }

    // Add a cell for each day in the month
    for (let day = 1; day <= daysInMonth; day++) {
        const dayCell = document.createElement("div");
        dayCell.className = "day-cell";
        dayCell.textContent = day;

        // Highlight today
        if (
            year === today.getFullYear() &&
            month === today.getMonth() &&
            day === today.getDate()
        ) {
            dayCell.classList.add("today");
        }

        // Highlight days with events
        const eventKey = getEventKey(year, month, day);
        if (events[eventKey]) {
            dayCell.classList.add("has-event");
        }

        // Single click: select and show popover
        dayCell.addEventListener("click", (e) => {
            if (selectedDay) selectedDay.classList.remove("selected");
            selectedDay = dayCell;
            selectedDayNum = day;
            dayCell.classList.add("selected");
            showPopover(dayCell, year, month, day);
            e.stopPropagation();
        });

        // Double click: open event modal for adding new event
        dayCell.addEventListener("dblclick", (e) => {
            e.stopPropagation();
            if (selectedDay) selectedDay.classList.remove("selected");
            selectedDay = dayCell;
            selectedDayNum = day;
            dayCell.classList.add("selected");
            // Clear modal inputs
            eventTitleInput.value = "";
            eventTimeInput.value = "";
            eventDescInput.value = "";
            eventModal.style.display = "flex";
            hidePopover();
        });

        calendar.appendChild(dayCell); // Add cell to calendar grid
    }
    updateMonthYearLabel(year, month); // Update label above calendar
}

// Modal logic for closing event modal
if (closeModalBtn) {
    closeModalBtn.onclick = () => {
        eventModal.style.display = "none";
    };
}
if (eventModal) {
    eventModal.onclick = (e) => {
        if (e.target === eventModal) eventModal.style.display = "none";
    };
}

// Handle event form submission (add new event or edit existing)
if (eventForm) {
    eventForm.onsubmit = (e) => {
        e.preventDefault();
        // Check if editing an event
        if (eventModal.dataset.editing === "true") {
            const key = eventModal.dataset.editKey;
            const idx = parseInt(eventModal.dataset.editIdx);
            if (events[key] && events[key][idx]) {
                // Update event with new values
                events[key][idx] = {
                    title: eventTitleInput.value,
                    time: eventTimeInput.value,
                    desc: eventDescInput.value
                };
                localStorage.setItem("calendar-events", JSON.stringify(events));
                eventModal.style.display = "none";
                // Clean up editing state
                delete eventModal.dataset.editing;
                delete eventModal.dataset.editKey;
                delete eventModal.dataset.editIdx;
                generateCalendar(currentYear, currentMonth);
                showTimelineModal(
                    currentYear,
                    currentMonth,
                    parseInt(key.split("-")[2])
                );
                return;
            }
        }
        // Normal add event flow
        if (selectedDayNum != null) {
            const eventKey = getEventKey(currentYear, currentMonth, selectedDayNum);
            if (!events[eventKey]) events[eventKey] = [];
            events[eventKey].push({
                title: eventTitleInput.value,
                time: eventTimeInput.value,
                desc: eventDescInput.value
            });
            localStorage.setItem("calendar-events", JSON.stringify(events)); // Save to localStorage
            eventModal.style.display = "none";
            generateCalendar(currentYear, currentMonth); // Refresh calendar
            // Keep the day highlighted and show popover
            const dayCells = calendar.querySelectorAll(".day-cell");
            for (let cell of dayCells) {
                if (parseInt(cell.textContent) === selectedDayNum) {
                    cell.classList.add("selected");
                    showPopover(cell, currentYear, currentMonth, selectedDayNum);
                    break;
                }
            }
        }
    };
}

// When closing the modal, clear editing state
if (closeModalBtn) {
    closeModalBtn.onclick = () => {
        eventModal.style.display = "none";
        delete eventModal.dataset.editing;
        delete eventModal.dataset.editKey;
        delete eventModal.dataset.editIdx;
    };
}
if (eventModal) {
    eventModal.onclick = (e) => {
        if (e.target === eventModal) {
            eventModal.style.display = "none";
            delete eventModal.dataset.editing;
            delete eventModal.dataset.editKey;
            delete eventModal.dataset.editIdx;
        }
    };
}

// Month navigation button logic
if (prevBtn && nextBtn) {
    prevBtn.onclick = () => {
        currentMonth--;
        if (currentMonth < 0) {
            currentMonth = 11;
            currentYear--;
        }
        generateCalendar(currentYear, currentMonth);
    };
    nextBtn.onclick = () => {
        currentMonth++;
        if (currentMonth > 11) {
            currentMonth = 0;
            currentYear++;
        }
        generateCalendar(currentYear, currentMonth);
    };
}

// Timeline modal close button logic
if (closeTimelineBtn) {
    closeTimelineBtn.onclick = hideTimelineModal;
}
if (timelineModal) {
    timelineModal.onclick = (e) => {
        if (e.target === timelineModal) hideTimelineModal();
    };
}

// Hide popover if clicking outside of it
document.addEventListener("click", (e) => {
    if (eventPopover.style.display === "block" && !eventPopover.contains(e.target)) {
        hidePopover();
    }
});

// Initial calendar render for current month/year
generateCalendar(currentYear, currentMonth);