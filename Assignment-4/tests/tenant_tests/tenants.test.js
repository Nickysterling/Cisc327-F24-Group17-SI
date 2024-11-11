const fs = require('fs');
const path = require('path');

// Get absolute paths
const projectRoot = path.resolve(__dirname, '../..');
const tenantsJsPath = path.join(projectRoot, 'apps/frontend/static/js/tenants.js');

// Create mock HTML content for testing
const mockHtml = `
<!DOCTYPE html>
<html>
<body>
    <!-- Dropdown Menu -->
    <div class="dropdown">
        <button class="dropdown-toggle">Actions</button>
        <div class="dropdown-menu" style="display: none;">
            <button class="view-profile-btn">View Profile</button>
            <button class="send-message-btn">Send Message</button>
            <button class="message-history-btn">Message History</button>
        </div>
    </div>

    <!-- View Profile Modal -->
    <div id="modalOverlay" style="display: none;">
        <div class="modal">
            <button id="closeModal">×</button>
            <div class="modal-content">
                <h2>Tenant Profile</h2>
            </div>
        </div>
    </div>

    <!-- Send Message Modal -->
    <div id="messageOverlay" style="display: none;">
        <div class="modal">
            <div class="modal-content">
                <button id="closeSendMessage">Cancel</button>
                <button id="sendMessage">Send</button>
            </div>
        </div>
    </div>

    <!-- Message History Modal -->
    <div id="historyOverlay" style="display: none;">
        <div class="modal">
            <button id="closeMessageHistory">×</button>
        </div>
    </div>

    <!-- Toast Message -->
    <div id="messageSuccessfulToast" style="display: none;">Message sent successfully!</div>

    <!-- Tenants Table -->
    <table class="tenants-table">
        <thead>
            <tr>
                <th><span>Name</span></th>
                <th><span>Unit</span></th>
                <th><span>Last Contacted</span></th>
                <th>Actions</th>
            </tr>
        </thead>
        <tbody>
            <tr>
                <td>John Doe</td>
                <td>101</td>
                <td>August 1, 2024</td>
                <td>
                    <div class="dropdown">
                        <button class="dropdown-toggle">Actions</button>
                        <div class="dropdown-menu">
                            <button class="view-profile-btn">View Profile</button>
                            <button class="send-message-btn">Send Message</button>
                            <button class="message-history-btn">Message History</button>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>Jane Smith</td>
                <td>102</td>
                <td>July 15, 2024</td>
                <td>
                    <div class="dropdown">
                        <button class="dropdown-toggle">Actions</button>
                        <div class="dropdown-menu">
                            <button class="view-profile-btn">View Profile</button>
                            <button class="send-message-btn">Send Message</button>
                            <button class="message-history-btn">Message History</button>
                        </div>
                    </div>
                </td>
            </tr>
            <tr>
                <td>Bob Johnson</td>
                <td>103</td>
                <td>September 1, 2024</td>
                <td>
                    <div class="dropdown">
                        <button class="dropdown-toggle">Actions</button>
                        <div class="dropdown-menu">
                            <button class="view-profile-btn">View Profile</button>
                            <button class="send-message-btn">Send Message</button>
                            <button class="message-history-btn">Message History</button>
                        </div>
                    </div>
                </td>
            </tr>
        </tbody>
    </table>
</body>
</html>
`;

// Set up JSDOM
const { JSDOM } = require('jsdom');
const dom = new JSDOM(mockHtml);

// Setup global window and document
global.window = dom.window;
global.document = dom.window.document;

// Import the tenants module
const { initializeTenants, parseDate, sortTableByColumn } = require(tenantsJsPath);

describe('Tenants.js functionality', () => {
    beforeEach(() => {
        // Reset the DOM before each test
        document.body.innerHTML = mockHtml;
        // Initialize the tenants functionality
        initializeTenants();
    });

    test('should toggle dropdown menu on button click', () => {
        const toggleButton = document.querySelector('.dropdown-toggle');
        const dropdownMenu = toggleButton.nextElementSibling;

        // Initial state
        expect(dropdownMenu.style.display).toBe('none');

        // Click to open
        toggleButton.click();
        expect(dropdownMenu.style.display).toBe('block');

        // Click again to close
        toggleButton.click();
        expect(dropdownMenu.style.display).toBe('none');

        // Test clicking outside closes dropdown
        toggleButton.click(); // Open again
        document.body.click();
        expect(dropdownMenu.style.display).toBe('none');
    });

    test('should open the view-profile modal when button is clicked', () => {
        const viewProfileButton = document.querySelector('.view-profile-btn');
        const modalOverlay = document.getElementById('modalOverlay');

        // Initial state
        expect(modalOverlay.style.display).toBe('none');

        // Click to open modal
        viewProfileButton.click();
        expect(modalOverlay.style.display).toBe('flex');

        // Test close button
        const closeButton = document.getElementById('closeModal');
        closeButton.click();
        expect(modalOverlay.style.display).toBe('none');
    });

    test('should open the send-message modal and show toast on send', (done) => {
        const sendMessageButton = document.querySelector('.send-message-btn');
        const messageOverlay = document.getElementById('messageOverlay');
        const toast = document.getElementById('messageSuccessfulToast');

        // Initial state
        expect(messageOverlay.style.display).toBe('none');
        expect(toast.style.display).toBe('none');

        // Open send-message modal
        sendMessageButton.click();
        expect(messageOverlay.style.display).toBe('flex');

        // Test send button and toast
        const sendButton = document.getElementById('sendMessage');
        sendButton.click();
        expect(messageOverlay.style.display).toBe('none');
        expect(toast.style.display).toBe('block');

        // Test if toast disappears after 3 seconds
        setTimeout(() => {
            expect(toast.style.display).toBe('none');
            done();
        }, 3100);
    });

    test('should handle message history modal properly', () => {
        const historyButton = document.querySelector('.message-history-btn');
        const historyOverlay = document.getElementById('historyOverlay');

        // Initial state
        expect(historyOverlay.style.display).toBe('none');

        // Open history modal
        historyButton.click();
        expect(historyOverlay.style.display).toBe('flex');

        // Test close button
        const closeButton = document.getElementById('closeMessageHistory');
        closeButton.click();
        expect(historyOverlay.style.display).toBe('none');
    });

    test('should sort table by column when header is clicked', () => {
        const nameHeader = document.querySelector('.tenants-table th');
        const table = document.querySelector('.tenants-table tbody');
        
        // Get initial order
        const initialRows = Array.from(table.querySelectorAll('tr'))
            .map(row => row.cells[0].textContent.trim());

        // First click - sort ascending
        nameHeader.querySelector('span').click();
        let sortedRows = Array.from(table.querySelectorAll('tr'))
            .map(row => row.cells[0].textContent.trim());

        // Should be in alphabetical order
        const expectedAscending = [...initialRows].sort((a, b) => a.localeCompare(b));
        expect(sortedRows).toEqual(expectedAscending);

        // Second click - sort descending
        nameHeader.querySelector('span').click();
        let reverseSortedRows = Array.from(table.querySelectorAll('tr'))
            .map(row => row.cells[0].textContent.trim());

        // Should be in reverse alphabetical order
        const expectedDescending = [...initialRows].sort((a, b) => b.localeCompare(a));
        expect(reverseSortedRows).toEqual(expectedDescending);
    });

    test('should sort dates correctly', () => {
        // Find the "Last Contacted" column header
        const dateHeader = Array.from(document.querySelectorAll('.tenants-table th'))
            .find(th => th.textContent.includes('Last Contacted'));
        
        const table = document.querySelector('.tenants-table tbody');
        
        // Get initial dates
        const initialDates = Array.from(table.querySelectorAll('tr'))
            .map(row => row.cells[2].textContent.trim());
    
        // Sort ascending
        dateHeader.querySelector('span').click();
        
        // Get sorted dates
        const sortedDates = Array.from(table.querySelectorAll('tr'))
            .map(row => row.cells[2].textContent.trim());
    
        // Convert to timestamps for comparison
        const sortedTimestamps = sortedDates.map(d => parseDate(d).getTime());
        
        // Verify ascending order
        for (let i = 1; i < sortedTimestamps.length; i++) {
            expect(sortedTimestamps[i]).toBeGreaterThanOrEqual(sortedTimestamps[i-1]);
        }
    
        // Sort descending
        dateHeader.querySelector('span').click();
        
        // Get reverse sorted dates
        const reverseSortedDates = Array.from(table.querySelectorAll('tr'))
            .map(row => row.cells[2].textContent.trim());
    
        // Convert to timestamps for comparison
        const reverseSortedTimestamps = reverseSortedDates.map(d => parseDate(d).getTime());
        
        // Verify descending order
        for (let i = 1; i < reverseSortedTimestamps.length; i++) {
            expect(reverseSortedTimestamps[i]).toBeLessThanOrEqual(reverseSortedTimestamps[i-1]);
        }
    });

    test('should parse dates correctly', () => {
        const testDate = parseDate('August 1, 2024');
        expect(testDate.getFullYear()).toBe(2024);
        expect(testDate.getMonth()).toBe(7); // August is 7 (zero-based)
        expect(testDate.getDate()).toBe(1);

        const anotherDate = parseDate('July 15, 2024');
        expect(anotherDate.getFullYear()).toBe(2024);
        expect(anotherDate.getMonth()).toBe(6); // July is 6
        expect(anotherDate.getDate()).toBe(15);
    });
});