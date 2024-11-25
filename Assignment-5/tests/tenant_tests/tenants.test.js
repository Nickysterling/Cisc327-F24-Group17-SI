const { JSDOM } = require('jsdom');
const { expect } = require('chai');
const sinon = require('sinon');

describe('Integration Tests', () => {
  let dom;
  let window;
  let document;
  let console;
  let clock;

  beforeEach(() => {
    // Create a new DOM environment before each test
    dom = new JSDOM(`
      <!DOCTYPE html>
      <html>
        <body>
          <!-- Register form elements -->
          <input type="radio" id="landlord" name="role" value="landlord">
          <div id="role-error" style="display: none;">Please select a role</div>

          <!-- Tenants table elements -->
          <table class="tenants-table">
            <thead>
              <tr>
                <th><span>Name</span></th>
                <th><span>Email</span></th>
                <th><span>Last Contacted</span></th>
                <th>Actions</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>John Doe</td>
                <td>john@example.com</td>
                <td>August 1, 2024</td>
                <td>
                  <button class="dropdown-toggle">Actions</button>
                  <div class="dropdown-menu" style="display: none;">
                    <button class="view-profile-btn">View Profile</button>
                    <button class="send-message-btn">Send Message</button>
                    <button class="message-history-btn">Message History</button>
                  </div>
                </td>
              </tr>
              <tr>
                <td>Jane Smith</td>
                <td>jane@example.com</td>
                <td>July 15, 2024</td>
                <td>
                  <button class="dropdown-toggle">Actions</button>
                  <div class="dropdown-menu" style="display: none;">
                    <button class="view-profile-btn">View Profile</button>
                    <button class="send-message-btn">Send Message</button>
                    <button class="message-history-btn">Message History</button>
                  </div>
                </td>
              </tr>
            </tbody>
          </table>

          <!-- Modals -->
          <div id="modalOverlay" style="display: none;">
            <button id="closeModal">X</button>
          </div>
          <div id="messageOverlay" style="display: none;">
            <button id="closeSendMessage">Cancel</button>
            <button id="sendMessage">Send</button>
          </div>
          <div id="historyOverlay" style="display: none;">
            <button id="closeMessageHistory">X</button>
          </div>
          <div id="messageSuccessfulToast" style="display: none;"></div>
        </body>
      </html>
    `);

    // Set up the window and document globals
    window = dom.window;
    document = window.document;
    console = window.console;

    // Create a fake timer
    clock = sinon.useFakeTimers();

    // Define the functions in the window scope
    window.validateRoleSelection = function() {
        console.log("Validation function is running");
        const landlord = document.getElementById('landlord').checked;
        const roleError = document.getElementById('role-error');
        if (!landlord) {
            roleError.style.display = "block";
            return false;
        } else {
            roleError.style.display = "none";
            return true;
        }
    };

    window.parseDate = function(dateString) {
        const [month, day, year] = dateString.split(' ');
        const months = {
            January: 0, February: 1, March: 2, April: 3,
            May: 4, June: 5, July: 6, August: 7,
            September: 8, October: 9, November: 10, December: 11
        };
        const monthIndex = months[month];
        const dayNumber = parseInt(day.replace(',', ''));
        const yearNumber = parseInt(year);
        return new Date(yearNumber, monthIndex, dayNumber);
    };

    window.sortTableByColumn = function(columnIndex, header) {
        const table = document.querySelector('.tenants-table tbody');
        const rows = Array.from(table.querySelectorAll('tr'));
        const headerText = header.textContent.trim();
        let sortOrder = header.classList.contains('sorted-asc') ? -1 : 1;

        const sortedRows = rows.sort((a, b) => {
            const cellA = a.querySelectorAll('td')[columnIndex].textContent.trim();
            const cellB = b.querySelectorAll('td')[columnIndex].textContent.trim();

            if (headerText.includes('Last Contacted')) {
                const dateA = window.parseDate(cellA);
                const dateB = window.parseDate(cellB);
                return (dateA - dateB) * sortOrder;
            }

            return cellA.localeCompare(cellB) * sortOrder;
        });

        while (table.firstChild) {
            table.removeChild(table.firstChild);
        }

        sortedRows.forEach(row => table.appendChild(row));

        const headers = document.querySelectorAll('.tenants-table th');
        headers.forEach(h => h.classList.remove('sorted-asc', 'sorted-desc'));

        if (sortOrder === 1) {
            header.classList.add('sorted-asc');
        } else {
            header.classList.add('sorted-desc');
        }
    };

    window.initializeTenants = function() {
        const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
        
        dropdownToggles.forEach(toggle => {
            toggle.addEventListener('click', function(event) {
                event.stopPropagation();
                const dropdownMenu = this.nextElementSibling;
                if (dropdownMenu.style.display === 'block') {
                    dropdownMenu.style.display = 'none';
                } else {
                    document.querySelectorAll('.dropdown-menu').forEach(menu => {
                        menu.style.display = 'none';
                    });
                    dropdownMenu.style.display = 'block';
                }
            });
        });

        document.addEventListener('click', function() {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.style.display = 'none';
            });
        });

        document.querySelectorAll('.view-profile-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.getElementById('modalOverlay').style.display = 'flex';
            });
        });

        document.getElementById('closeModal').addEventListener('click', () => {
            document.getElementById('modalOverlay').style.display = 'none';
        });

        document.querySelectorAll('.send-message-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.getElementById('messageOverlay').style.display = 'flex';
            });
        });

        document.getElementById('closeSendMessage').addEventListener('click', () => {
            document.getElementById('messageOverlay').style.display = 'none';
        });

        document.getElementById('sendMessage').addEventListener('click', () => {
            document.getElementById('messageOverlay').style.display = 'none';
            const toast = document.getElementById('messageSuccessfulToast');
            toast.style.display = 'block';
            toast.classList.add('show');
            setTimeout(() => {
                toast.style.display = 'none';
                toast.classList.remove('show');
            }, 3000);
        });

        document.querySelectorAll('.message-history-btn').forEach(button => {
            button.addEventListener('click', () => {
                document.getElementById('historyOverlay').style.display = 'flex';
            });
        });

        document.getElementById('closeMessageHistory').addEventListener('click', () => {
            document.getElementById('historyOverlay').style.display = 'none';
        });

        const headerSpans = document.querySelectorAll('.tenants-table th span');
        headerSpans.forEach((span, index) => {
            const header = span.parentElement;
            if (header.textContent.trim() !== 'Actions') {
                span.addEventListener('click', () => {
                    window.sortTableByColumn(index, header);
                });
            }
        });
    };
  });

  afterEach(() => {
    clock.restore();
  });

  describe('Register Form', () => {
    it('should show error when no role is selected', () => {
      const result = window.validateRoleSelection();
      const roleError = document.getElementById('role-error');
      
      expect(result).to.be.false;
      expect(roleError.style.display).to.equal('block');
    });

    it('should hide error and allow submission when landlord is selected', () => {
      const landlordRadio = document.getElementById('landlord');
      landlordRadio.checked = true;
      
      const result = window.validateRoleSelection();
      const roleError = document.getElementById('role-error');
      
      expect(result).to.be.true;
      expect(roleError.style.display).to.equal('none');
    });
  });

  describe('Tenants Table', () => {
    beforeEach(() => {
      window.initializeTenants();
    });

    describe('Dropdown Functionality', () => {
      it('should toggle dropdown menu when clicking the toggle button', () => {
        const toggleBtn = document.querySelector('.dropdown-toggle');
        const dropdownMenu = toggleBtn.nextElementSibling;

        toggleBtn.click();
        expect(dropdownMenu.style.display).to.equal('block');

        toggleBtn.click();
        expect(dropdownMenu.style.display).to.equal('none');
      });

      it('should close all dropdowns when clicking outside', () => {
        const toggleBtns = document.querySelectorAll('.dropdown-toggle');
        
        // Open all dropdowns
        toggleBtns.forEach(btn => btn.click());
        
        // Click outside
        document.body.click();
        
        // Check all dropdowns are closed
        document.querySelectorAll('.dropdown-menu').forEach(menu => {
          expect(menu.style.display).to.equal('none');
        });
      });
    });

    describe('Modal Functionality', () => {
      it('should open and close view profile modal', () => {
        const viewProfileBtn = document.querySelector('.view-profile-btn');
        const modalOverlay = document.getElementById('modalOverlay');
        const closeModal = document.getElementById('closeModal');

        viewProfileBtn.click();
        expect(modalOverlay.style.display).to.equal('flex');

        closeModal.click();
        expect(modalOverlay.style.display).to.equal('none');
      });

      it('should handle send message modal and show success toast', () => {
        const sendMessageBtn = document.querySelector('.send-message-btn');
        const messageOverlay = document.getElementById('messageOverlay');
        const sendButton = document.getElementById('sendMessage');
        const toast = document.getElementById('messageSuccessfulToast');

        sendMessageBtn.click();
        expect(messageOverlay.style.display).to.equal('flex');

        sendButton.click();
        expect(messageOverlay.style.display).to.equal('none');
        expect(toast.style.display).to.equal('block');
        expect(toast.classList.contains('show')).to.be.true;

        clock.tick(3000);
        
        expect(toast.style.display).to.equal('none');
        expect(toast.classList.contains('show')).to.be.false;
      });

      it('should open and close message history modal', () => {
        const messageHistoryBtn = document.querySelector('.message-history-btn');
        const historyOverlay = document.getElementById('historyOverlay');
        const closeHistory = document.getElementById('closeMessageHistory');

        messageHistoryBtn.click();
        expect(historyOverlay.style.display).to.equal('flex');

        closeHistory.click();
        expect(historyOverlay.style.display).to.equal('none');
      });
    });

    describe('Table Sorting', () => {
      it('should sort table by name column', () => {
        const nameHeader = document.querySelector('th span');
        const tbody = document.querySelector('.tenants-table tbody');
        
        nameHeader.click();
        
        let rows = tbody.querySelectorAll('tr');
        expect(rows[0].querySelectorAll('td')[0].textContent).to.equal('Jane Smith');
        expect(rows[1].querySelectorAll('td')[0].textContent).to.equal('John Doe');
        
        nameHeader.click();
        
        rows = tbody.querySelectorAll('tr');
        expect(rows[0].querySelectorAll('td')[0].textContent).to.equal('John Doe');
        expect(rows[1].querySelectorAll('td')[0].textContent).to.equal('Jane Smith');
      });

      it('should sort table by date column', () => {
        const dateHeader = document.querySelectorAll('th span')[2];
        const tbody = document.querySelector('.tenants-table tbody');
        
        dateHeader.click();
        
        let rows = tbody.querySelectorAll('tr');
        let dates = Array.from(rows).map(row => 
          row.querySelectorAll('td')[2].textContent
        );
        
        expect(dates[0]).to.equal('July 15, 2024');
        expect(dates[1]).to.equal('August 1, 2024');
        
        dateHeader.click();
        
        rows = tbody.querySelectorAll('tr');
        dates = Array.from(rows).map(row => 
          row.querySelectorAll('td')[2].textContent
        );
        
        expect(dates[0]).to.equal('August 1, 2024');
        expect(dates[1]).to.equal('July 15, 2024');
      });
    });

    describe('Date Parsing', () => {
      it('should correctly parse dates in the expected format', () => {
        const date1 = window.parseDate('August 1, 2024');
        const date2 = window.parseDate('July 15, 2024');
        
        expect(date1.getTime()).to.be.greaterThan(date2.getTime());
        expect(date1.getMonth()).to.equal(7); // August is month 7 (0-based)
        expect(date1.getDate()).to.equal(1);
        expect(date1.getFullYear()).to.equal(2024);
      });
    });
  });
});