const calendarEl = document.getElementById('calendar');
const resultsEl = document.getElementById('results');

let selectedDate = null;
let current = new Date();

function buildCalendar(date) {
    calendarEl.innerHTML = '';

    const header = document.createElement('div');
    header.className = 'calendar-header';
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '<';
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '>';
    const monthYear = document.createElement('div');
    monthYear.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    prevBtn.addEventListener('click', () => {
        date.setMonth(date.getMonth() - 1);
        buildCalendar(date);
    });
    nextBtn.addEventListener('click', () => {
        date.setMonth(date.getMonth() + 1);
        buildCalendar(date);
    });

    header.appendChild(prevBtn);
    header.appendChild(monthYear);
    header.appendChild(nextBtn);
    calendarEl.appendChild(header);

    const daysContainer = document.createElement('div');
    daysContainer.className = 'calendar-grid';

    // Day names
    const dayNames = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    for (const name of dayNames) {
        const dayNameEl = document.createElement('div');
        dayNameEl.textContent = name;
        daysContainer.appendChild(dayNameEl);
    }

    // Compute first day of month
    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    // Fill empty cells before first day
    for (let i = 0; i < firstDay; i++) {
        daysContainer.appendChild(document.createElement('div'));
    }

    // Days
    for (let d = 1; d <= daysInMonth; d++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'day';
        dayEl.textContent = d;
        dayEl.addEventListener('click', () => {
            selectedDate = new Date(year, month, d);
            showResults();
            const selected = document.querySelector('.day.selected');
            if (selected) selected.classList.remove('selected');
            dayEl.classList.add('selected');
        });
        daysContainer.appendChild(dayEl);
    }

    calendarEl.appendChild(daysContainer);
}

function numberFilter(str) {
    // Placeholder for future filtering rules
    return true;
}

function generateNumbers(date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear()).slice(-2);
    const prefix = `${dd}${mm}${yy}-`;
    const list = [];
    for (let i = 1; i <= 9999; i++) {
        const candidate = prefix + String(i).padStart(4, '0');
        if (numberFilter(candidate)) {
            list.push(candidate);
        }
    }
    return list;
}

function showResults() {
    if (!selectedDate) return;
    const numbers = generateNumbers(selectedDate);
    resultsEl.innerHTML = `<h2>Numbers for ${selectedDate.toDateString()}</h2>`;
    const ul = document.createElement('ul');
    const frag = document.createDocumentFragment();
    for (const num of numbers) {
        const li = document.createElement('li');
        li.textContent = num;
        frag.appendChild(li);
    }
    ul.appendChild(frag);
    resultsEl.appendChild(ul);
}


buildCalendar(current);
