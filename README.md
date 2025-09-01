# Calender-aplication
# 📅 Calendar App

An interactive **web-based calendar application** with event scheduling, editing, and timeline features.  
Events are stored locally in the browser using `localStorage`.

---

## 🔑 Features
- Month-by-month navigable calendar grid.
- Single-click day selection with event popover.
- Double-click to add new events.
- Event storage, retrieval, editing, and deletion via `localStorage`.
- Modal-based timeline view for daily events.
- Greeting message and upcoming events list on the homepage.

---

## 📂 DOM Elements

These HTML elements are referenced by the script:

### Calendar & Navigation
- `calendar` – Calendar grid container.
- `monthYearLabel` – Label for current month/year.
- `prevBtn`, `nextBtn` – Previous/next month buttons.

### Event Modal (Add/Edit)
- `eventModal` – Modal for adding/editing events.
- `eventForm` – Form inside the modal.
- `eventTitleInput`, `eventDescInput`, `eventTimeInput` – Inputs for event details.
- `closeModalBtn` – Close button for event modal.

### Popover & Timeline
- `eventPopover` – Popover showing events for a day.
- `timelineModal` – Modal for full daily timeline.
- `timelineContent` – Container for timeline list.
- `closeTimelineBtn` – Button to close timeline modal.

### Home Page Widgets
- `greetingElem` – Displays a time-based greeting.
- `eventsListElem` – Displays up to 5 upcoming events.

---

## 🕒 Date Variables
- `currentTime` – Current date/time.
- `currentYear`, `currentMonth` – Current year and month.
- `today` – Today’s date.
- `selectedDay`, `selectedDayNum` – Currently selected day cell and its number.

---

## 📦 Event Storage
Events are stored under the key `calendar-events` in **localStorage**.

```json
{
  "2025-8-1": [
    { "title": "Meeting", "time": "10:00", "desc": "Project kickoff" },
    { "title": "Dentist", "time": "", "desc": "Check-up" }
  ]
}
⚡ Initialization
On load:

Loads saved events from localStorage.

Sets a greeting message (based on time of day).

Displays up to 5 upcoming events.

Renders the current month’s calendar.

🛠️ Core Functions
updateMonthYearLabel(year, month)
Updates the header with the current month and year.

getEventKey(year, month, day)
Generates a unique storage key for events in the format YYYY-M-D.

getEventsForDay(year, month, day)
Retrieves a copy of events for a given day.

showPopover(dayCell, year, month, day)
Displays a popover with events for the selected day.

hidePopover()
Hides the event popover.

showTimelineModal(year, month, day)
Opens a modal showing the timeline of all events for the given day.
Supports edit and delete actions.

hideTimelineModal()
Closes the timeline modal.

generateCalendar(year, month)
Builds the interactive calendar grid:

Adds blank cells before the first day.

Creates clickable day cells.

Marks today and days with events.

Attaches single-click (select/show) and double-click (add event) handlers.

🎨 Modal Logic
Event Modal
Opens when double-clicking a day.

Supports adding or editing events.

Closes when clicking outside or pressing the close button.

Timeline Modal
Opens via “View Timeline” button in popover.

Displays daily events in chronological order.

Supports editing and deleting.

🖱️ User Interaction Guide
Here’s how to use the calendar:

Navigate months

Use the ◀ Previous and ▶ Next buttons to move through months.

View events for a day

Click on a day → highlights it and opens a popover showing that day’s events.

Add a new event

Double-click on a day → opens the event modal.

Enter a title, optional time, and description.

Click Save → event is added to the day.

Edit an event

Open the Timeline view (via popover → “View Timeline” button).

Click Edit on an event → modal opens pre-filled.

Update fields and save.

Delete an event

Open the Timeline view.

Click Delete on an event → it is removed.

Upcoming events list

On the homepage, up to 5 future events are displayed automatically.

🚀 Initial Render
Loads events.

Renders current month calendar.

Displays greeting and upcoming events list.

📝 Example
html
Copy code
<div id="calendar"></div>
<div id="month-year-label"></div>
<button id="prev-month">◀</button>
<button id="next-month">▶</button>

<div id="event-modal"> ... </div>
<div id="timeline-modal"> ... </div>
📌 Notes
This project uses vanilla JavaScript (no frameworks).

Events are local to the browser and not synced to a server.

To persist across devices, extend storage logic (e.g., API + database).
