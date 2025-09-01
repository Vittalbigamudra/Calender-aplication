# Calender-aplication
# 📅 Event Calendar

```json
{
  "2025-8-1": [
    { "title": "Meeting", "time": "10:00", "desc": "Project kickoff" },
    { "title": "Dentist", "time": "", "desc": "Check-up" }
  ]
}
<details> <summary>⚡ Initialization</summary>
On load:

Loads saved events from localStorage.

Sets a greeting message (based on time of day).

Displays up to 5 upcoming events.

Renders the current month’s calendar.

</details>
<details> <summary>🛠️ Core Functions</summary>
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

</details>
<details> <summary>🎨 Modal Logic</summary>
Event Modal
Opens when double-clicking a day.

Supports adding or editing events.

Closes when clicking outside or pressing the close button.

Timeline Modal
Opens via “View Timeline” button in popover.

Displays daily events in chronological order.

Supports editing and deleting.

</details>
<details> <summary>🖱️ User Interaction Guide</summary>
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

</details>
<details> <summary>🚀 Initial Render</summary>
Loads events.

Renders current month calendar.

Displays greeting and upcoming events list.

</details>
<details> <summary>📝 Example</summary>
html
Copy code
<div id="calendar"></div>
<div id="month-year-label"></div>
<button id="prev-month">◀</button>
<button id="next-month">▶</button>

<div id="event-modal"> ... </div>
<div id="timeline-modal"> ... </div>
</details>
<details> <summary>📌 Notes</summary>
This project uses vanilla JavaScript (no frameworks).

Events are local to the browser and not synced to a server.

To persist across devices, extend storage logic (e.g., API + database).

</details> ```
