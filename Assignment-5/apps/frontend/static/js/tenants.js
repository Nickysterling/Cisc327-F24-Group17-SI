function initializeTenants() {
    // Dropdown functionality
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(event) {
            event.stopPropagation(); // Ensure only the button itself triggers the dropdown

            const dropdownMenu = this.nextElementSibling;

            // Toggle the dropdown menu (open/close)
            if (dropdownMenu.style.display === 'block') {
                dropdownMenu.style.display = 'none'; // Close if open
            } else {
                // Close all other open dropdowns before opening the clicked one
                document.querySelectorAll('.dropdown-menu').forEach(menu => {
                    menu.style.display = 'none';
                });
                dropdownMenu.style.display = 'block'; // Open the clicked one
            }
        });
    });

    // Close dropdowns when clicking outside
    document.addEventListener('click', function() {
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
            menu.style.display = 'none'; // Close all open dropdowns
        });
    });

    // Open view-profile modal on click of button in dropdown menu
    document.querySelectorAll('.view-profile-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('modalOverlay').style.display = 'flex';
        });
    });

    // Close view-profile modal when 'X' is clicked
    document.getElementById('closeModal').addEventListener('click', () => {
        document.getElementById('modalOverlay').style.display = 'none';
    });

    // Open send-message modal on click of a button in dropdown menu
    document.querySelectorAll('.send-message-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('messageOverlay').style.display = 'flex';
        });
    });

    // Close send-message modal when 'Cancel' is clicked
    document.getElementById('closeSendMessage').addEventListener('click', () => {
        document.getElementById('messageOverlay').style.display = 'none';
    });

    // Close send-message modal and display success message when 'Send' is clicked 
    document.getElementById('sendMessage').addEventListener('click', () => {
        document.getElementById('messageOverlay').style.display = 'none';

        // Show the toast message
        const toast = document.getElementById('messageSuccessfulToast');
        toast.style.display = 'block';
        toast.classList.add('show');

        // Hide the toast message after 3 seconds
        setTimeout(() => {
            toast.style.display = 'none';
            toast.classList.remove('show');
        }, 3000);
    });

    // Open message-history modal on click of button in dropdown menu
    document.querySelectorAll('.message-history-btn').forEach(button => {
        button.addEventListener('click', () => {
            document.getElementById('historyOverlay').style.display = 'flex';
        });
    });

    // Close message-history modal when 'X' is clicked
    document.getElementById('closeMessageHistory').addEventListener('click', () => {
        document.getElementById('historyOverlay').style.display = 'none';
    });

    // Sorting functionality for headers (excluding "Actions" column)
    const headerSpans = document.querySelectorAll('.tenants-table th span');
    let sortOrder = 1; // 1 for ascending, -1 for descending
    let lastSortedHeader = null;

    headerSpans.forEach((span, index) => {
        const header = span.parentElement;

        if (header.textContent.trim() !== 'Actions') { // Exclude Actions column
            span.addEventListener('click', function() {
                // Add fade-in effect
                span.style.opacity = 0;
                setTimeout(() => {
                    span.style.opacity = 1;
                }, 50);

                // Sort the table column
                sortTableByColumn(index, header);
            });
        }
    });
}

// Custom date parsing function for "August 1, 2024" format
function parseDate(dateString) {
    const [month, day, year] = dateString.split(' ');

    // Convert the month name to a month index (0 = January, 11 = December)
    const months = {
        January: 0, February: 1, March: 2, April: 3,
        May: 4, June: 5, July: 6, August: 7,
        September: 8, October: 9, November: 10, December: 11
    };

    const monthIndex = months[month];
    const dayNumber = parseInt(day.replace(',', '')); // Remove comma and parse the day
    const yearNumber = parseInt(year);

    // Return a Date object
    return new Date(yearNumber, monthIndex, dayNumber);
}

function sortTableByColumn(columnIndex, header) {
    const table = document.querySelector('.tenants-table tbody');
    const rows = Array.from(table.querySelectorAll('tr'));
    const headerText = header.textContent.trim();
    let sortOrder = header.classList.contains('sorted-asc') ? -1 : 1;

    const sortedRows = rows.sort((a, b) => {
        const cellA = a.querySelectorAll('td')[columnIndex].textContent.trim();
        const cellB = b.querySelectorAll('td')[columnIndex].textContent.trim();

        // Check if we're sorting the "Last Contacted" column
        if (headerText.includes('Last Contacted')) {
            const dateA = parseDate(cellA);
            const dateB = parseDate(cellB);
            return (dateA - dateB) * sortOrder;
        }

        // Regular string comparison for other columns
        return cellA.localeCompare(cellB) * sortOrder;
    });

    // Clear the table
    while (table.firstChild) {
        table.removeChild(table.firstChild);
    }

    // Add sorted rows
    sortedRows.forEach(row => table.appendChild(row));

    // Update sort classes
    const headers = document.querySelectorAll('.tenants-table th');
    headers.forEach(h => h.classList.remove('sorted-asc', 'sorted-desc'));

    if (sortOrder === 1) {
        header.classList.add('sorted-asc');
    } else {
        header.classList.add('sorted-desc');
    }
}

// Export for testing environment
if (typeof module !== 'undefined' && module.exports) {
    module.exports = {
        initializeTenants,
        parseDate,
        sortTableByColumn
    };
} else {
    // For browser environment
    document.addEventListener('DOMContentLoaded', initializeTenants);
}