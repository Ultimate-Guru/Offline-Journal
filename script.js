// DOM Elements
const journalEditor = document.getElementById('journal-editor');
const saveButton = document.getElementById('save-btn');
const newEntryButton = document.getElementById('new-entry-btn');
const entriesList = document.getElementById('entries-list');
const currentDateElement = document.getElementById('current-date');
const statusIndicator = document.getElementById('status-indicator');
const statusText = document.getElementById('status-text');
const offlineMessage = document.getElementById('offline-message');
const onlineMessage = document.getElementById('online-message');

// Global variables
let currentEntryId = null;
let isEditing = false;
let isNewEntry = true;
let checkConnectionInterval;

// Initialize the application
function initApp() {
    checkConnectionStatus();
    
    // Set up regular connection checking
    checkConnectionInterval = setInterval(checkConnectionStatus, 2000);
    
    // Load existing entries
    loadEntriesList();
    
    // Set up event listeners
    setupEventListeners();
}

// Check if the user is offline
function checkConnectionStatus() {
    const isOffline = !navigator.onLine;
    
    statusIndicator.className = isOffline ? 'offline' : 'online';
    statusText.textContent = isOffline ? 'Offline - Ready to journal' : 'Online - Disconnect to journal';
    
    // Update UI based on connection status
    if (isOffline) {
        journalEditor.disabled = false;
        saveButton.disabled = false;
        offlineMessage.classList.remove('hidden');
        onlineMessage.classList.add('hidden');
    } else {
        journalEditor.disabled = true;
        saveButton.disabled = true;
        offlineMessage.classList.add('hidden');
        onlineMessage.classList.remove('hidden');
    }
}

// Set up event listeners
function setupEventListeners() {
    // Save button
    saveButton.addEventListener('click', saveEntry);
    
    // New entry button
    newEntryButton.addEventListener('click', createNewEntry);
    
    // Auto-save when offline and content changes (debounced)
    let saveTimeout;
    journalEditor.addEventListener('input', () => {
        if (!navigator.onLine && journalEditor.value.trim().length > 0) {
            clearTimeout(saveTimeout);
            saveTimeout = setTimeout(() => {
                saveEntry(true); // true for auto-save
            }, 1500);
        }
    });
    
    // Listen for online/offline events
    window.addEventListener('online', checkConnectionStatus);
    window.addEventListener('offline', checkConnectionStatus);
}

// Create a new entry
function createNewEntry() {
    currentEntryId = generateEntryId();
    isNewEntry = true;
    isEditing = true;
    
    journalEditor.value = '';
    currentDateElement.textContent = formatDate(new Date(), true);
    
    // Mark as selected in the sidebar
    const selectedEntries = document.querySelectorAll('.entry-item.selected');
    selectedEntries.forEach(entry => entry.classList.remove('selected'));
    
    // Enable editing if offline
    checkConnectionStatus();
}

// Load entry content
function loadEntry(entryId) {
    const entries = getEntriesFromStorage();
    const entry = entries.find(e => e.id === entryId);
    
    if (entry) {
        currentEntryId = entryId;
        isNewEntry = false;
        isEditing = true;
        
        journalEditor.value = entry.content;
        currentDateElement.textContent = formatDate(new Date(entry.date), true);
        
        // Mark as selected in the sidebar
        const selectedEntries = document.querySelectorAll('.entry-item.selected');
        selectedEntries.forEach(entry => entry.classList.remove('selected'));
        
        const entryElement = document.querySelector(`[data-entry-id="${entryId}"]`);
        if (entryElement) {
            entryElement.classList.add('selected');
        }
        
        // Enable editing if offline
        checkConnectionStatus();
    }
}

// Save current entry
function saveEntry(isAutoSave = false) {
    if (navigator.onLine) {
        alert('You must be offline to save a journal entry.');
        return;
    }
    
    const content = journalEditor.value.trim();
    if (content.length === 0) {
        return;
    }
    
    const entries = getEntriesFromStorage();
    const now = new Date();
    
    // Find existing entry or create new one
    const existingEntryIndex = entries.findIndex(e => e.id === currentEntryId);
    
    const entry = {
        id: currentEntryId,
        date: now.toISOString(),
        content: content,
        preview: content.substring(0, 50) + (content.length > 50 ? '...' : '')
    };
    
    if (existingEntryIndex >= 0) {
        entries[existingEntryIndex] = entry;
    } else {
        entries.push(entry);
    }
    
    // Sort entries by date, newest first
    entries.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Save to localStorage
    localStorage.setItem('journalEntries', JSON.stringify(entries));
    
    // Update UI
    loadEntriesList();
    
    // Show the entry as selected
    setTimeout(() => {
        const entryElement = document.querySelector(`[data-entry-id="${currentEntryId}"]`);
        if (entryElement) {
            entryElement.classList.add('selected');
        }
    }, 10);
    
    if (!isAutoSave) {
        alert('Journal entry saved!');
    }
}

// Load the list of entries into the sidebar
function loadEntriesList() {
    const entries = getEntriesFromStorage();
    
    if (entries.length === 0) {
        entriesList.innerHTML = '<p class="no-entries-message">No entries yet</p>';
        return;
    }
    
    entriesList.innerHTML = '';
    
    // Group entries by date
    const entriesByDate = {};
    entries.forEach(entry => {
        const dateKey = new Date(entry.date).toDateString();
        if (!entriesByDate[dateKey]) {
            entriesByDate[dateKey] = [];
        }
        entriesByDate[dateKey].push(entry);
    });
    
    // Create entry elements grouped by date
    Object.keys(entriesByDate).forEach(dateKey => {
        const dateEntries = entriesByDate[dateKey];
        
        dateEntries.forEach(entry => {
            const entryElement = document.createElement('div');
            entryElement.className = 'entry-item';
            entryElement.dataset.entryId = entry.id;
            
            if (entry.id === currentEntryId) {
                entryElement.classList.add('selected');
            }
            
            entryElement.innerHTML = `
                <div class="entry-date" style="font-weight: 600;">${formatDate(new Date(entry.date))}</div>
                <div class="entry-preview">${entry.preview}</div>
            `;
            
            entryElement.addEventListener('click', () => {
                loadEntry(entry.id);
            });
            
            entriesList.appendChild(entryElement);
        });
    });
}

// Helper function to get entries from localStorage
function getEntriesFromStorage() {
    const entriesJson = localStorage.getItem('journalEntries');
    return entriesJson ? JSON.parse(entriesJson) : [];
}

// Generate a unique ID for entries
function generateEntryId() {
    return Date.now().toString(36) + Math.random().toString(36).substring(2, 7);
}

// Format date for display
function formatDate(date, includeTime = false) {
    const options = { 
        weekday: 'short', 
        month: 'short', 
        day: 'numeric', 
        year: 'numeric'
    };
    
    if (includeTime) {
        options.hour = '2-digit';
        options.minute = '2-digit';
    }
    
    return date.toLocaleDateString('en-US', options);
}

// Initialize the app when the DOM is loaded
document.addEventListener('DOMContentLoaded', initApp);