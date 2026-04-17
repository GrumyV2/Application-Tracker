/* The Javascript back-end for the HTML of my program. */
const STORAGE_KEY = 'application-tracker-items';

// DOM Element Selectors
const form = document.getElementById('applicationForm');
const list = document.getElementById('applicationList');
const emptyState = document.getElementById('emptyState');
const filterStatus = document.getElementById('filterStatus');
const clearBtn = document.getElementById('clearBtn');

// Stat Display Selectors
const totalCount = document.getElementById('totalCount');
const appliedCount = document.getElementById('appliedCount');
const interviewCount = document.getElementById('interviewCount');
const offerCount = document.getElementById('offerCount');

// Fetch data from local storage
function getApplications() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY) || '[]');
}

// Save data to local storage
function saveApplications(items) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items));
}

// Convert status to CSS-safe class name
function badgeClass(status) {
  return status.toLowerCase().replace(/\s+/g, '-');
}

// Format date string to 'DD Mon YYYY'
function formatDate(dateStr) {
  if (!dateStr) return 'No deadline';
  const date = new Date(dateStr + 'T00:00:00');
  return date.toLocaleDateString(undefined, { day: 'numeric', month: 'short', year: 'numeric' });
}

// Calculate and display stat counts
function updateStats(items) {
  totalCount.textContent = items.length;
  appliedCount.textContent = items.filter(item => item.status === 'Applied').length;
  interviewCount.textContent = items.filter(item => item.status === 'Interview').length;
  offerCount.textContent = items.filter(item => item.status === 'Offer').length;
}

// Main function to build the UI list
function renderApplications() {
  const items = getApplications();
  const filter = filterStatus.value;
  const filtered = filter === 'All' ? items : items.filter(item => item.status === filter);

  updateStats(items);
  list.innerHTML = ''; // Clear current list
  emptyState.style.display = filtered.length ? 'none' : 'grid';

  // Sort and loop through items to create HTML
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

// Handle form submission
form.addEventListener('submit', event => {
  event.preventDefault();
  const items = getApplications();
  const nextItem = {
    id: crypto.randomUUID(), // Generate unique ID
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

// Re-render when filter changes
filterStatus.addEventListener('change', renderApplications);

// Handle item deletion via event delegation
list.addEventListener('click', event => {
  const deleteId = event.target.getAttribute('data-delete-id');
  if (!deleteId) return;
  const items = getApplications().filter(item => item.id !== deleteId);
  saveApplications(items);
  renderApplications();
});

// Clear all records
clearBtn.addEventListener('click', () => {
  localStorage.removeItem(STORAGE_KEY);
  renderApplications();
});

// Run on page load
renderApplications();
