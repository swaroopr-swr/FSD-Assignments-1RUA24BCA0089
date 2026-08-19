// DOM Elements
const pages = {
  home: document.getElementById('page-home'),
  createTrip: document.getElementById('page-create-trip'),
  dashboard: document.getElementById('page-dashboard')
};

const nav = {
  home: document.getElementById('nav-home'),
  trips: document.getElementById('nav-trips'),
  logo: document.getElementById('nav-logo')
};

const forms = {
  createTrip: document.getElementById('form-create-trip'),
  activity: document.getElementById('form-activity')
};

const buttons = {
  startPlanning: document.getElementById('btn-start-planning'),
  cancelTrip: document.getElementById('btn-cancel-trip'),
  deleteTrip: document.getElementById('btn-delete-trip'),
  addActivity: document.getElementById('btn-add-activity'),
  cancelModal: document.getElementById('btn-cancel-modal'),
  closeModal: document.getElementById('btn-close-modal')
};

const modal = document.getElementById('activity-modal');

// Application State
let currentTrip = null;
let activities = [];
let tripDates = [];
let selectedDate = null;

// --- INITIALIZATION ---
function init() {
  loadData();
  setupEventListeners();
  
  if (currentTrip) {
    navigateTo('dashboard');
  } else {
    navigateTo('home');
  }
}

// --- DATA MANAGEMENT ---
function loadData() {
  const savedTrip = localStorage.getItem('travelplan_trip');
  const savedActivities = localStorage.getItem('travelplan_activities');
  
  if (savedTrip) {
    currentTrip = JSON.parse(savedTrip);
    generateTripDates();
    if (savedActivities) {
      activities = JSON.parse(savedActivities);
    }
  } else {
    // Inject Demo Data for presentation
    currentTrip = {
      name: "Demo Trip: Bali Adventure",
      destination: "Bali, Indonesia",
      startDate: "2026-10-15",
      endDate: "2026-10-17",
      travelers: "2",
      notes: "This is a demo trip loaded automatically for presentation purposes!"
    };
    
    activities = [
      { id: "demo-1", name: "Arrive at Ngurah Rai Airport", date: "2026-10-15", time: "14:00", location: "Denpasar", category: "Travel", notes: "Booked airport transfer." },
      { id: "demo-2", name: "Check-in at Resort", date: "2026-10-15", time: "16:00", location: "Ubud", category: "Accommodation", notes: "Confirmation: #BALI123" },
      { id: "demo-3", name: "Dinner at Locavore", date: "2026-10-15", time: "19:30", location: "Ubud Center", category: "Food", notes: "Reservation under Swaroop." },
      { id: "demo-4", name: "Visit Tanah Lot Temple", date: "2026-10-16", time: "16:00", location: "Tanah Lot", category: "Sightseeing", notes: "Beautiful sunset spot." },
      { id: "demo-5", name: "Mount Batur Sunrise Trek", date: "2026-10-17", time: "02:30", location: "Mount Batur", category: "Adventure", notes: "Pickup from hotel at 2:30 AM." },
      { id: "demo-6", name: "Souvenir Shopping", date: "2026-10-17", time: "14:00", location: "Ubud Art Market", category: "Shopping", notes: "Buy gifts for family." }
    ];
    
    generateTripDates();
    saveData();
  }
}

function saveData() {
  if (currentTrip) {
    localStorage.setItem('travelplan_trip', JSON.stringify(currentTrip));
  } else {
    localStorage.removeItem('travelplan_trip');
  }
  localStorage.setItem('travelplan_activities', JSON.stringify(activities));
}

function clearData() {
  currentTrip = null;
  activities = [];
  tripDates = [];
  selectedDate = null;
  localStorage.removeItem('travelplan_trip');
  localStorage.removeItem('travelplan_activities');
  navigateTo('home');
}

// --- NAVIGATION ---
function navigateTo(pageId) {
  Object.values(pages).forEach(page => page.classList.remove('active'));
  pages[pageId].classList.add('active');
  
  // Update Nav
  nav.home.classList.remove('active');
  nav.trips.classList.remove('active');
  
  if (pageId === 'home') {
    nav.home.classList.add('active');
    nav.trips.style.display = currentTrip ? 'block' : 'none';
  } else if (pageId === 'createTrip') {
    nav.trips.style.display = 'none';
  } else if (pageId === 'dashboard') {
    nav.trips.style.display = 'block';
    nav.trips.classList.add('active');
    renderDashboard();
  }
}

// --- EVENT LISTENERS ---
function setupEventListeners() {
  // Nav Links
  nav.logo.addEventListener('click', (e) => { e.preventDefault(); navigateTo(currentTrip ? 'dashboard' : 'home'); });
  nav.home.addEventListener('click', (e) => { e.preventDefault(); navigateTo('home'); });
  nav.trips.addEventListener('click', (e) => { e.preventDefault(); navigateTo('dashboard'); });
  
  // Home Buttons
  buttons.startPlanning.addEventListener('click', () => navigateTo('createTrip'));
  
  // Create Trip Form
  buttons.cancelTrip.addEventListener('click', () => navigateTo(currentTrip ? 'dashboard' : 'home'));
  forms.createTrip.addEventListener('submit', handleCreateTrip);
  
  // Dashboard Actions
  buttons.deleteTrip.addEventListener('click', () => {
    if (confirm('Are you sure you want to delete this trip and all its activities?')) {
      clearData();
    }
  });
  
  // Filters
  document.getElementById('search-activity').addEventListener('input', renderActivities);
  document.getElementById('filter-category').addEventListener('change', renderActivities);
  
  // Activity Modal
  buttons.addActivity.addEventListener('click', () => openActivityModal());
  buttons.closeModal.addEventListener('click', closeActivityModal);
  buttons.cancelModal.addEventListener('click', closeActivityModal);
  forms.activity.addEventListener('submit', handleSaveActivity);
}

// --- TRIP LOGIC ---
function handleCreateTrip(e) {
  e.preventDefault();
  
  const name = document.getElementById('trip-name').value.trim();
  const dest = document.getElementById('trip-destination').value.trim();
  const start = document.getElementById('trip-start').value;
  const end = document.getElementById('trip-end').value;
  const travelers = document.getElementById('trip-travelers').value;
  const notes = document.getElementById('trip-notes').value.trim();
  
  // Validation
  if (new Date(end) < new Date(start)) {
    alert('End date cannot be earlier than start date.');
    return;
  }
  
  currentTrip = {
    name,
    destination: dest,
    startDate: start,
    endDate: end,
    travelers,
    notes
  };
  
  activities = []; // Clear previous activities
  generateTripDates();
  saveData();
  forms.createTrip.reset();
  navigateTo('dashboard');
}

function generateTripDates() {
  if (!currentTrip) return;
  tripDates = [];
  
  const start = new Date(currentTrip.startDate);
  const end = new Date(currentTrip.endDate);
  
  let current = new Date(start);
  while (current <= end) {
    tripDates.push(current.toISOString().split('T')[0]);
    current.setDate(current.getDate() + 1);
  }
  
  if (tripDates.length > 0) {
    selectedDate = tripDates[0];
  }
}

// --- DASHBOARD RENDERING ---
function renderDashboard() {
  if (!currentTrip) return;
  
  // Header Info
  document.getElementById('dash-trip-name').textContent = currentTrip.name;
  document.getElementById('dash-trip-dest').textContent = currentTrip.destination;
  document.getElementById('dash-trip-dates').textContent = `${currentTrip.startDate} to ${currentTrip.endDate}`;
  document.getElementById('dash-trip-travelers').textContent = currentTrip.travelers;
  document.getElementById('dash-trip-notes').textContent = currentTrip.notes;
  
  renderDaySidebar();
  renderActivities();
}

function renderDaySidebar() {
  const list = document.getElementById('day-selector-list');
  list.innerHTML = '';
  
  tripDates.forEach((date, index) => {
    const li = document.createElement('li');
    if (date === selectedDate) li.classList.add('active');
    
    li.innerHTML = `Day ${index + 1} <span class="date-sub">${date}</span>`;
    li.addEventListener('click', () => {
      selectedDate = date;
      document.querySelectorAll('#day-selector-list li').forEach(el => el.classList.remove('active'));
      li.classList.add('active');
      renderActivities();
    });
    
    list.appendChild(li);
  });
}

// --- ACTIVITY LOGIC ---
function renderActivities() {
  const container = document.getElementById('activities-list');
  const title = document.getElementById('current-day-title');
  const dayIndex = tripDates.indexOf(selectedDate) + 1;
  title.textContent = `Day ${dayIndex} - ${selectedDate}`;
  
  const searchTerm = document.getElementById('search-activity').value.toLowerCase();
  const categoryFilter = document.getElementById('filter-category').value;
  
  // Filter and Sort Activities
  let filtered = activities.filter(a => a.date === selectedDate);
  
  if (searchTerm) {
    filtered = filtered.filter(a => a.name.toLowerCase().includes(searchTerm));
  }
  if (categoryFilter !== 'All') {
    filtered = filtered.filter(a => a.category === categoryFilter);
  }
  
  filtered.sort((a, b) => a.time.localeCompare(b.time));
  
  // Render
  if (filtered.length === 0) {
    container.innerHTML = `<div class="empty-state">No activities found for this day.</div>`;
    return;
  }
  
  container.innerHTML = '';
  filtered.forEach(act => {
    const card = document.createElement('div');
    card.className = 'activity-card';
    card.innerHTML = `
      <div class="act-time">${act.time}</div>
      <div class="act-details">
        <div class="act-title-row">
          <h4>${act.name}</h4>
          <span class="act-category">${act.category}</span>
        </div>
        ${act.location ? `<p class="act-meta"><i class="fa-solid fa-location-dot"></i> ${act.location}</p>` : ''}
        ${act.notes ? `<p class="act-meta"><i class="fa-solid fa-note-sticky"></i> ${act.notes}</p>` : ''}
      </div>
      <div class="act-actions">
        <button class="edit-btn" title="Edit" onclick="editActivity('${act.id}')"><i class="fa-solid fa-pen"></i></button>
        <button class="delete-btn" title="Delete" onclick="deleteActivity('${act.id}')"><i class="fa-solid fa-trash"></i></button>
      </div>
    `;
    container.appendChild(card);
  });
}

function openActivityModal(activityId = null) {
  document.getElementById('modal-title').textContent = activityId ? 'Edit Activity' : 'Add Activity';
  forms.activity.reset();
  
  // Populate Date Dropdown
  const dateSelect = document.getElementById('act-date');
  dateSelect.innerHTML = '';
  tripDates.forEach(date => {
    const opt = document.createElement('option');
    opt.value = date;
    opt.textContent = date;
    dateSelect.appendChild(opt);
  });
  
  if (activityId) {
    const act = activities.find(a => a.id === activityId);
    if (act) {
      document.getElementById('activity-id').value = act.id;
      document.getElementById('act-name').value = act.name;
      document.getElementById('act-date').value = act.date;
      document.getElementById('act-time').value = act.time;
      document.getElementById('act-location').value = act.location || '';
      document.getElementById('act-category').value = act.category;
      document.getElementById('act-notes').value = act.notes || '';
    }
  } else {
    document.getElementById('activity-id').value = '';
    document.getElementById('act-date').value = selectedDate || tripDates[0];
  }
  
  modal.classList.add('active');
}

function closeActivityModal() {
  modal.classList.remove('active');
}

function handleSaveActivity(e) {
  e.preventDefault();
  
  const id = document.getElementById('activity-id').value;
  const newActivity = {
    id: id || Date.now().toString(),
    name: document.getElementById('act-name').value.trim(),
    date: document.getElementById('act-date').value,
    time: document.getElementById('act-time').value,
    location: document.getElementById('act-location').value.trim(),
    category: document.getElementById('act-category').value,
    notes: document.getElementById('act-notes').value.trim()
  };
  
  if (id) {
    const index = activities.findIndex(a => a.id === id);
    if (index !== -1) activities[index] = newActivity;
  } else {
    activities.push(newActivity);
  }
  
  saveData();
  closeActivityModal();
  renderActivities();
}

// Attach globals for inline handlers in HTML
window.editActivity = (id) => openActivityModal(id);
window.deleteActivity = (id) => {
  if (confirm('Are you sure you want to delete this activity?')) {
    activities = activities.filter(a => a.id !== id);
    saveData();
    renderActivities();
  }
};

// Start app
init();
