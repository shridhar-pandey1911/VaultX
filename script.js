// VaultX Password Manager JavaScript

// Global variables
let credentials = [];
let passwordHistory = [];
let currentCredential = null;

// Initialize the application
document.addEventListener('DOMContentLoaded', function() {
    loadCredentials();
    loadPasswordHistory();
    initializePage();
});

// Load credentials from localStorage
function loadCredentials() {
    const stored = localStorage.getItem('vaultx_credentials');
    if (stored) {
        credentials = JSON.parse(stored);
    } else {
        // Add some sample data
        credentials = [
            {
                id: 1,
                siteName: 'Google',
                siteUrl: 'https://google.com',
                username: 'john.doe@email.com',
                password: 'MyStr0ngP@ssw0rd!',
                category: 'personal',
                notes: 'Main Google account',
                dateAdded: new Date('2024-01-15').toISOString(),
                strength: 'strong'
            },
            {
                id: 2,
                siteName: 'GitHub',
                siteUrl: 'https://github.com',
                username: 'johndoe',
                password: 'GitHubP@ss123',
                category: 'work',
                notes: 'Development account',
                dateAdded: new Date('2024-01-20').toISOString(),
                strength: 'medium'
            },
            {
                id: 3,
                siteName: 'Facebook',
                siteUrl: 'https://facebook.com',
                username: 'john.doe@email.com',
                password: 'facebook123',
                category: 'social',
                notes: 'Social media account',
                dateAdded: new Date('2024-01-10').toISOString(),
                strength: 'weak'
            }
        ];
        saveCredentials();
    }
}

// Save credentials to localStorage
function saveCredentials() {
    localStorage.setItem('vaultx_credentials', JSON.stringify(credentials));
}

// Load password history from localStorage
function loadPasswordHistory() {
    const stored = localStorage.getItem('vaultx_password_history');
    if (stored) {
        passwordHistory = JSON.parse(stored);
    }
}

// Save password history to localStorage
function savePasswordHistory() {
    localStorage.setItem('vaultx_password_history', JSON.stringify(passwordHistory));
}

// Initialize page-specific functionality
function initializePage() {
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    switch(currentPage) {
        case 'index.html':
        case '':
            initializeHomePage();
            break;
        case 'add-credential.html':
            initializeAddCredentialPage();
            break;
        case 'password-generator.html':
            initializePasswordGeneratorPage();
            break;
        case 'breach-alerts.html':
            initializeBreachAlertsPage();
            break;
        case 'settings.html':
            initializeSettingsPage();
            break;
    }
}

// Home page initialization
function initializeHomePage() {
    updateVaultStats();
    displayCredentials();
    
    // Search functionality
    const searchInput = document.getElementById('searchInput');
    if (searchInput) {
        searchInput.addEventListener('input', filterCredentials);
    }
    
    // Sort functionality
    const sortSelect = document.getElementById('sortSelect');
    if (sortSelect) {
        sortSelect.addEventListener('change', sortCredentials);
    }
}

// Update vault statistics
function updateVaultStats() {
    const totalCredentials = document.getElementById('totalCredentials');
    const strongPasswords = document.getElementById('strongPasswords');
    const weakPasswords = document.getElementById('weakPasswords');
    
    if (totalCredentials) totalCredentials.textContent = credentials.length;
    
    const strongCount = credentials.filter(c => c.strength === 'strong').length;
    const weakCount = credentials.filter(c => c.strength === 'weak').length;
    
    if (strongPasswords) strongPasswords.textContent = strongCount;
    if (weakPasswords) weakPasswords.textContent = weakCount;
}

// Display credentials in the grid
function displayCredentials(filteredCredentials = null) {
    const grid = document.getElementById('credentialsGrid');
    if (!grid) return;
    
    const creds = filteredCredentials || credentials;
    
    if (creds.length === 0) {
        grid.innerHTML = '<div class="no-credentials">No credentials found. <a href="add-credential.html">Add your first credential</a></div>';
        return;
    }
    
    grid.innerHTML = creds.map(credential => `
        <div class="credential-item">
            <div class="credential-info">
                <div class="credential-icon category-${credential.category}">
                    ${getCategoryIcon(credential.category)}
                </div>
                <div class="credential-details">
                    <h3>${credential.siteName}</h3>
                    <p>${credential.username}</p>
                    <span class="strength-indicator strength-${credential.strength}">${credential.strength}</span>
                </div>
            </div>
            <div class="credential-actions">
                <button onclick="viewPassword(${credential.id})" title="View Password">
                    <i class="fas fa-eye"></i>
                </button>
                <button onclick="copyUsername(${credential.id})" title="Copy Username">
                    <i class="fas fa-user"></i>
                </button>
                <button onclick="copyPassword(${credential.id})" title="Copy Password">
                    <i class="fas fa-copy"></i>
                </button>
                <button onclick="editCredential(${credential.id})" title="Edit">
                    <i class="fas fa-edit"></i>
                </button>
                <button onclick="deleteCredential(${credential.id})" title="Delete">
                    <i class="fas fa-trash"></i>
                </button>
            </div>
        </div>
    `).join('');
}

// Get category icon
function getCategoryIcon(category) {
    const icons = {
        personal: '<i class="fas fa-user"></i>',
        work: '<i class="fas fa-briefcase"></i>',
        social: '<i class="fas fa-share-alt"></i>',
        financial: '<i class="fas fa-credit-card"></i>',
        shopping: '<i class="fas fa-shopping-cart"></i>',
        other: '<i class="fas fa-folder"></i>'
    };
    return icons[category] || icons.other;
}

// Filter credentials based on search
function filterCredentials() {
    const searchTerm = document.getElementById('searchInput').value.toLowerCase();
    const filtered = credentials.filter(credential => 
        credential.siteName.toLowerCase().includes(searchTerm) ||
        credential.username.toLowerCase().includes(searchTerm) ||
        credential.category.toLowerCase().includes(searchTerm)
            );
    // You may want to do something with 'filtered' here, like updating the UI
}