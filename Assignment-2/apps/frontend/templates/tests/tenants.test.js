const fs = require('fs');
const path = require('path');

// Load the HTML file
const html = fs.readFileSync(path.resolve(__dirname, '../tenants/tenants.html'), 'utf8');

// Set up JSDOM
const { JSDOM } = require('jsdom');
const dom = new JSDOM(html);
const document = dom.window.document;

require('../../static/js/tenants'); 

describe('Tenants.js functionality', () => {
    beforeEach(() => {
        // Reset the DOM to avoid test interference
        document.body.innerHTML = html;
        require('../../static/js/tenants'); // Re-import the script
    });

    test('should toggle dropdown menu on button click', () => {
        const toggleButton = document.querySelector('.dropdown-toggle');
        const dropdownMenu = toggleButton.nextElementSibling;

        // Click to open
        toggleButton.click();
        expect(dropdownMenu.style.display).toBe('block');

        // Click again to close
        toggleButton.click();
        expect(dropdownMenu.style.display).toBe('none');
    });

    test('should close all dropdowns when clicking outside', () => {
        const toggleButton = document.querySelector('.dropdown-toggle');
        const dropdownMenu = toggleButton.nextElementSibling;

        // Open the dropdown
        toggleButton.click();
        expect(dropdownMenu.style.display).toBe('block');

        // Simulate clicking outside
        document.dispatchEvent(new MouseEvent('click', { bubbles: true }));
        expect(dropdownMenu.style.display).toBe('none');
    });

    test('should open the view-profile modal when button is clicked', () => {
        const viewProfileButton = document.querySelector('.view-profile-btn');
        const modalOverlay = document.getElementById('modalOverlay');

        // Click to open modal
        viewProfileButton.click();
        expect(modalOverlay.style.display).toBe('flex');

        // Close the modal
        document.getElementById('closeModal').click();
        expect(modalOverlay.style.display).toBe('none');
    });

    test('should open the send-message modal and show toast on send', () => {
        const sendMessageButton = document.querySelector('.send-message-btn');
        const messageOverlay = document.getElementById('messageOverlay');
        const sendMessage = document.getElementById('sendMessage');
        const toast = document.getElementById('messageSuccessfulToast');

        // Open send-message modal
        sendMessageButton.click();
        expect(messageOverlay.style.display).toBe('flex');

        // Click send and check toast visibility
        sendMessage.click();
        expect(messageOverlay.style.display).toBe('none');
        expect(toast.style.display).toBe('block');

        // Check if the toast hides after 3 seconds
        setTimeout(() => {
            expect(toast.style.display).toBe('none');
        }, 3000);
    });

    test('should sort table by column when header is clicked', () => {
        const nameHeader = document.querySelector('th span'); // First header for Name
        const rowsBeforeSorting = Array.from(document.querySelectorAll('.tenants-table tbody tr')).map(row => row.cells[0].textContent);

        // Click to sort by Name
        nameHeader.click();

        // Expect rows to be sorted
        const rowsAfterSorting = Array.from(document.querySelectorAll('.tenants-table tbody tr')).map(row => row.cells[0].textContent);
        const sortedRows = [...rowsBeforeSorting].sort(); // Create a sorted copy for comparison

        expect(rowsAfterSorting).toEqual(sortedRows);
    });
});
