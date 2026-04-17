/* The Javascript back-end for the HTML of my program. */
const STORAGE_KEY = 'application-tracker-items';

const form = document.getElementById('applicationForm');
const list = document.getElementById('applicationList');
const emptyState = document.getElementById('emptyState');
const filterStatus = document.getElementById('filterStatus');
const seedBtn = document.getElementById('seedBtn');
const clearBtn = document.getElementById('clearBtn');

const totalCount = document.getElementById('totalCount');
const appliedCount = document.getElementById('appliedCount');
const interviewCount = document.getElementById('interviewCount');
const offerCount = document.getElementById('offerCount');

const sampleData = [
  {
    id: crypto.randomUUID(),
    company: 'Amazon',
    role: 'Software Development Engineer Apprentice',
    status: 'Interview',
    deadline: '2026-04-28',
    location: 'London',
    notes: 'Prepare OOP and data structures examples for final stage.'
  },
  {
    id: crypto.randomUUID(),
    company: 'IBM',
    role: 'Junior Software Engineer',
    status: 'Applied',
    deadline: '2026-05-04',
    location: 'Remote',
    notes: 'Tailored CV toward backend and Python work.'
  },
  {
    id: crypto.randomUUID(),
    company: 'Meta',
    role: 'Technology Apprentice',
    status: 'Online Assessment',
    deadline: '2026-04-22',
    location: 'London',
    notes: 'Complete OA this weekend and review time complexity.'
  }
];

function getApplications() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

function saveApplications(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

function badgeClass(status) {
  return status.toLowerCase().replace(/\s+/g, '-');
}

function formatDate(dateStr) {
  if (!dateStr) return 'No deadline';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

function updateStats(items) {
  totalCount.textContent = items.length;
  appliedCount.textContent = items.filter(item => item.status === 'Applied').length;
  interviewCount.textContent = items.filter(item => item.status === 'Interview').length;
  offerCount.textContent = items.filter(item => item.status === 'Offer').length;
}

function renderApplications() {
  const items = getApplications();
  const filter = filterStatus.value;
  const filtered = filter === 'All' ? items : items.filter(item => item.status === filter);

  updateStats(items);
  list.innerHTML = '';
  emptyState.style.display = filtered.length ? 'none' : 'grid';

  filtered
    .slice()
    .reverse()
    .forEach(item => {
      const card = document.createElement('article');
      card.className = 'application-card';
      card.innerHTML = `
        <div class="application-card-top">
          <div>
            <h3>${item.role}</h3>
            <p>${item.company}</p>
          </div>
          <span class="badge ${badgeClass(item.status)}">${item.status}</span>
        </div>
        <div class="application-meta">
          <span>Deadline: ${formatDate(item.deadline)}</span>
          <span>Location: ${item.location || 'Not set'}</span>
        </div>
        <div class="note-box">${item.notes?.trim() ? item.notes : 'No notes added yet.'}</div>
        <div class="card-actions">
          <button class="icon-btn" data-delete-id="${item.id}">Delete</button>
        </div>
      `;
      list.appendChild(card);
    });
}

form.addEventListener('submit', event => {
  event.preventDefault();
  const items = getApplications();
  const nextItem = {
    id: crypto.randomUUID(),
    company: document.getElementById('company').value.trim(),
    role: document.getElementById('role').value.trim(),
    status: document.getElementById('status').value,
    deadline: document.getElementById('deadline').value,
    location: document.getElementById('location').value.trim(),
    notes: document.getElementById('notes').value.trim()
  };

  items.push(nextItem);
  saveApplications(items);
  form.reset();
  renderApplications();
});

filterStatus.addEventListener('change', renderApplications);

list.addEventListener('click', event => {
  const deleteId = event.target.getAttribute('data-delete-id');
  if (!deleteId) return;
  const items = getApplications().filter(item => item.id !== deleteId);
  saveApplications(items);
  renderApplications();
});

seedBtn.addEventListener('click', () => {
  saveApplications(sampleData);
  renderApplications();
});

clearBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  renderApplications();
});

renderApplications();
