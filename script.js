const calendarEl = document.getElementById('calendar');
const resultsEl = document.getElementById('results');
const monthSelect = document.getElementById('monthSelect');
const yearSelect = document.getElementById('yearSelect');

let current = new Date();
let selectedDate = null;

function populateSelectors() {
    const months = [
        'January','February','March','April','May','June',
        'July','August','September','October','November','December'
    ];
    months.forEach((name, idx) => {
        const opt = document.createElement('option');
        opt.value = idx;
        opt.textContent = name;
        monthSelect.appendChild(opt);
    });
    for (let y = 1858; y <= 2057; y++) {
        const opt = document.createElement('option');
        opt.value = y;
        opt.textContent = y;
        yearSelect.appendChild(opt);
    }
    monthSelect.value = current.getMonth();
    yearSelect.value = current.getFullYear();

    monthSelect.addEventListener('change', () => {
        current.setMonth(parseInt(monthSelect.value, 10));
        buildCalendar(current);
    });
    yearSelect.addEventListener('change', () => {
        current.setFullYear(parseInt(yearSelect.value, 10));
        buildCalendar(current);
    });
}

function buildCalendar(date) {
    calendarEl.innerHTML = '';
    monthSelect.value = date.getMonth();
    yearSelect.value = date.getFullYear();

    const header = document.createElement('div');
    header.className = 'calendar-header';
    const prevBtn = document.createElement('button');
    prevBtn.textContent = '<';
    const nextBtn = document.createElement('button');
    nextBtn.textContent = '>';
    const title = document.createElement('div');
    title.textContent = date.toLocaleString('default', { month: 'long', year: 'numeric' });

    prevBtn.addEventListener('click', () => {
        date.setMonth(date.getMonth() - 1);
        buildCalendar(date);
    });
    nextBtn.addEventListener('click', () => {
        date.setMonth(date.getMonth() + 1);
        buildCalendar(date);
    });

    header.appendChild(prevBtn);
    header.appendChild(title);
    header.appendChild(nextBtn);
    calendarEl.appendChild(header);

    const daysContainer = document.createElement('div');
    daysContainer.className = 'calendar-grid';

    const dayNames = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
    dayNames.forEach(name => {
        const el = document.createElement('div');
        el.textContent = name;
        daysContainer.appendChild(el);
    });

    const year = date.getFullYear();
    const month = date.getMonth();
    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();

    for (let i = 0; i < firstDay; i++) {
        daysContainer.appendChild(document.createElement('div'));
    }

    for (let d = 1; d <= daysInMonth; d++) {
        const dayEl = document.createElement('div');
        dayEl.className = 'day';
        dayEl.textContent = d;
        dayEl.addEventListener('click', () => {
            selectedDate = new Date(year, month, d);
            document.querySelectorAll('.day.selected').forEach(e => e.classList.remove('selected'));
            dayEl.classList.add('selected');
            showResults();
        });
        daysContainer.appendChild(dayEl);
    }

    calendarEl.appendChild(daysContainer);
}

function formatDate(date) {
    const dd = String(date.getDate()).padStart(2, '0');
    const mm = String(date.getMonth() + 1).padStart(2, '0');
    const yy = String(date.getFullYear() % 100).padStart(2, '0');
    return `${dd}${mm}${yy}`;
}

function getCenturyDigits(year) {
    const set = new Set();
    if (year >= 1900 && year <= 1999) {
        [0,1,2,3].forEach(d => set.add(d));
    }
    if ((year >= 2000 && year <= 2036) || (year >= 1937 && year <= 1999)) {
        set.add(4);
    }
    if ((year >= 2000 && year <= 2057) || (year >= 1858 && year <= 1899)) {
        [5,6,7,8].forEach(d => set.add(d));
    }
    if ((year >= 2000 && year <= 2036) || (year >= 1937 && year <= 1999)) {
        set.add(9);
    }
    return Array.from(set).sort();
}

function mod11(numStr) {
    const weights = [4,3,2,7,6,5,4,3,2,1];
    let sum = 0;
    for (let i = 0; i < 10; i++) {
        sum += parseInt(numStr[i], 10) * weights[i];
    }
    return sum % 11 === 0;
}

function generateNumbers(date) {
    const prefix = formatDate(date);
    const beforeOct2007 = date < new Date(2007, 9, 1);
    const digits = getCenturyDigits(date.getFullYear());
    const odd = [[],[],[]];
    const even = [[],[],[]];

    for (const first of digits) {
        for (let rest = 0; rest <= 999; rest++) {
            const serialNum = first * 1000 + rest;
            if (serialNum === 0) continue;
            const serialStr = String(serialNum).padStart(4, '0');
            const cprStr = prefix + serialStr;
            if (beforeOct2007 && !mod11(cprStr)) continue;

            const full = `${prefix}-${serialStr}`;
            const last2 = serialNum % 100;
            if (serialNum % 2 === 1) {
                const idx = Math.floor(((last2 - 1) / 2)) % 3;
                odd[idx].push(full);
            } else {
                const idx = Math.floor(((last2 - 2) / 2)) % 3;
                even[idx].push(full);
            }
        }
    }

    return { odd, even };
}

function buildTable(odd, even) {
    const table = document.createElement('table');
    const thead = document.createElement('thead');
    let tr = document.createElement('tr');
    const oddTh = document.createElement('th');
    oddTh.textContent = 'Odd';
    oddTh.colSpan = 3;
    const evenTh = document.createElement('th');
    evenTh.textContent = 'Even';
    evenTh.colSpan = 3;
    tr.appendChild(oddTh);
    tr.appendChild(evenTh);
    thead.appendChild(tr);

    tr = document.createElement('tr');
    ['1. serie','2. serie','3. serie','1. serie','2. serie','3. serie'].forEach(label => {
        const th = document.createElement('th');
        th.textContent = label;
        tr.appendChild(th);
    });
    thead.appendChild(tr);
    table.appendChild(thead);

    const tbody = document.createElement('tbody');
    const maxLen = Math.max(
        odd[0].length, odd[1].length, odd[2].length,
        even[0].length, even[1].length, even[2].length
    );

    for (let i = 0; i < maxLen; i++) {
        const row = document.createElement('tr');
        [...odd, ...even].forEach(col => {
            const td = document.createElement('td');
            td.textContent = col[i] || '';
            row.appendChild(td);
        });
        tbody.appendChild(row);
    }

    table.appendChild(tbody);
    return table;
}

function showResults() {
    if (!selectedDate) return;
    resultsEl.innerHTML = '';
    const { odd, even } = generateNumbers(selectedDate);
    const table = buildTable(odd, even);
    resultsEl.appendChild(table);
}

populateSelectors();
buildCalendar(current);
