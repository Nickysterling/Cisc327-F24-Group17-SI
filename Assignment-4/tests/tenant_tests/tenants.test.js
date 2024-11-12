const fs = require('fs');
const path = require('path');
const { expect } = require('chai');
const { JSDOM } = require('jsdom');
const sinon = require('sinon');

describe('Tenants.js functionality', () => {
    let document;
    let window;
    let clock;
    let tenantsModule;

    const setupHtml = `
        <!DOCTYPE html>
        <html>
        <body>
            <table class="tenants-table">
                <thead>
                    <tr>
                        <th><span>Name</span></th>
                        <th><span>Address</span></th>
                        <th><span>Status</span></th>
                        <th><span>Last Contacted</span></th>
                        <th>Actions</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>Zack Brown</td>
                        <td>123 Main St</td>
                        <td>Active</td>
                        <td>January 15, 2024</td>
                        <td>
                            <div class="dropdown">
                                <button class="dropdown-toggle">Actions</button>
                                <div class="dropdown-menu" style="display: none;">
                                    <button class="view-profile-btn">View Profile</button>
                                    <button class="send-message-btn">Send Message</button>
                                    <button class="message-history-btn">Message History</button>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Alice Smith</td>
                        <td>456 Oak Ave</td>
                        <td>Active</td>
                        <td>March 1, 2024</td>
                        <td>
                            <div class="dropdown">
                                <button class="dropdown-toggle">Actions</button>
                                <div class="dropdown-menu" style="display: none;">
                                    <button class="view-profile-btn">View Profile</button>
                                    <button class="send-message-btn">Send Message</button>
                                    <button class="message-history-btn">Message History</button>
                                </div>
                            </div>
                        </td>
                    </tr>
                    <tr>
                        <td>Bob Johnson</td>
                        <td>789 Pine Rd</td>
                        <td>Active</td>
                        <td>February 1, 2024</td>
                        <td>
                            <div class="dropdown">
                                <button class="dropdown-toggle">Actions</button>
                                <div class="dropdown-menu" style="display: none;">
                                    <button class="view-profile-btn">View Profile</button>
                                    <button class="send-message-btn">Send Message</button>
                                    <button class="message-history-btn">Message History</button>
                                </div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>

            <!-- View Profile Modal -->
            <div id="modalOverlay" style="display: none;">
                <div class="modal">
                    <button id="closeModal">×</button>
                    <h2>Tenant Profile</h2>
                </div>
            </div>

            <!-- Send Message Modal -->
            <div id="messageOverlay" style="display: none;">
                <div class="modal">
                    <h2>Send Message</h2>
                    <button id="closeSendMessage">Cancel</button>
                    <button id="sendMessage">Send</button>
                </div>
            </div>

            <!-- Message History Modal -->
            <div id="historyOverlay" style="display: none;">
                <div class="modal">
                    <button id="closeMessageHistory">×</button>
                    <h2>Message History</h2>
                </div>
            </div>

            <!-- Toast Message -->
            <div id="messageSuccessfulToast" class="toast" style="display: none;">
                Message sent successfully!
            </div>
        </body>
        </html>
    `;

    before(() => {
        // Set up JSDOM
        const dom = new JSDOM(setupHtml, {
            runScripts: 'dangerously',
            resources: 'usable',
            pretendToBeVisual: true
        });
        
        window = dom.window;
        document = window.document;
        global.document = document;
        global.window = window;

        // Load the tenants module
        tenantsModule = require('../../apps/frontend/static/js/tenants');
    });

    beforeEach(() => {
        // Reset DOM to initial state
        document.body.innerHTML = setupHtml;
        
        // Create a fake timer
        clock = sinon.useFakeTimers();
        
        // Re-initialize the tenants functionality
        tenantsModule = require('../../apps/frontend/static/js/tenants');
        tenantsModule.initializeTenants();

        // Clear module cache
        delete require.cache[require.resolve('../../apps/frontend/static/js/tenants')];
    });

    afterEach(() => {
        clock.restore();
        sinon.restore();
    });

    describe('Dropdown functionality', () => {
        it('should toggle dropdown menu on button click', () => {
            const toggleButton = document.querySelector('.dropdown-toggle');
            const dropdownMenu = toggleButton.nextElementSibling;

            expect(dropdownMenu.style.display).to.equal('none');

            toggleButton.click();
            expect(dropdownMenu.style.display).to.equal('block');

            toggleButton.click();
            expect(dropdownMenu.style.display).to.equal('none');
        });

        it('should close all other dropdowns when opening a new one', () => {
            const toggleButtons = document.querySelectorAll('.dropdown-toggle');
            const dropdownMenus = document.querySelectorAll('.dropdown-menu');
            
            // Verify initial state
            expect(dropdownMenus[0].style.display).to.equal('none');
            expect(dropdownMenus[1].style.display).to.equal('none');
            
            // Open first dropdown
            toggleButtons[0].click();
            expect(dropdownMenus[0].style.display).to.equal('block');
            expect(dropdownMenus[1].style.display).to.equal('none');
            
            // Open second dropdown
            toggleButtons[1].click();
            expect(dropdownMenus[0].style.display).to.equal('none');
            expect(dropdownMenus[1].style.display).to.equal('block');
        });

        it('should close dropdowns when clicking outside', () => {
            const toggleButton = document.querySelector('.dropdown-toggle');
            const dropdownMenu = toggleButton.nextElementSibling;

            toggleButton.click();
            expect(dropdownMenu.style.display).to.equal('block');

            document.body.click();
            expect(dropdownMenu.style.display).to.equal('none');
        });
    });

    describe('Modal functionality', () => {
        describe('View Profile Modal', () => {
            it('should open the view-profile modal when button is clicked', () => {
                const viewProfileButton = document.querySelector('.view-profile-btn');
                const modalOverlay = document.getElementById('modalOverlay');

                viewProfileButton.click();
                expect(modalOverlay.style.display).to.equal('flex');
            });

            it('should close the view-profile modal when X is clicked', () => {
                const modalOverlay = document.getElementById('modalOverlay');
                const closeButton = document.getElementById('closeModal');

                modalOverlay.style.display = 'flex';
                closeButton.click();
                expect(modalOverlay.style.display).to.equal('none');
            });
        });

        describe('Send Message Modal', () => {
            it('should open the send-message modal when button is clicked', () => {
                const sendMessageButton = document.querySelector('.send-message-btn');
                const messageOverlay = document.getElementById('messageOverlay');

                sendMessageButton.click();
                expect(messageOverlay.style.display).to.equal('flex');
            });

            it('should close the send-message modal when Cancel is clicked', () => {
                const messageOverlay = document.getElementById('messageOverlay');
                const closeButton = document.getElementById('closeSendMessage');

                messageOverlay.style.display = 'flex';
                closeButton.click();
                expect(messageOverlay.style.display).to.equal('none');
            });

            it('should show toast message when Send is clicked and hide after 3 seconds', () => {
                const sendMessage = document.getElementById('sendMessage');
                const messageOverlay = document.getElementById('messageOverlay');
                const toast = document.getElementById('messageSuccessfulToast');

                messageOverlay.style.display = 'flex';
                sendMessage.click();

                expect(messageOverlay.style.display).to.equal('none');
                expect(toast.style.display).to.equal('block');
                expect(toast.classList.contains('show')).to.be.true;

                clock.tick(3000);

                expect(toast.style.display).to.equal('none');
                expect(toast.classList.contains('show')).to.be.false;
            });
        });

        describe('Message History Modal', () => {
            it('should open the message-history modal when button is clicked', () => {
                const historyButton = document.querySelector('.message-history-btn');
                const historyOverlay = document.getElementById('historyOverlay');

                historyButton.click();
                expect(historyOverlay.style.display).to.equal('flex');
            });

            it('should close the message-history modal when X is clicked', () => {
                const historyOverlay = document.getElementById('historyOverlay');
                const closeButton = document.getElementById('closeMessageHistory');

                historyOverlay.style.display = 'flex';
                closeButton.click();
                expect(historyOverlay.style.display).to.equal('none');
            });
        });
    });

    describe('Table sorting functionality', () => {
        describe('parseDate function', () => {
            it('should correctly parse date strings', () => {
                const dateStr = 'August 1, 2024';
                const result = tenantsModule.parseDate(dateStr);

                expect(result).to.be.instanceOf(Date);
                expect(result.getFullYear()).to.equal(2024);
                expect(result.getMonth()).to.equal(7); // August is 7 (0-based)
                expect(result.getDate()).to.equal(1);
            });

            it('should handle different months correctly', () => {
                const testCases = [
                    { input: 'January 1, 2024', expectedMonth: 0 },
                    { input: 'June 15, 2024', expectedMonth: 5 },
                    { input: 'December 31, 2024', expectedMonth: 11 }
                ];

                testCases.forEach(({ input, expectedMonth }) => {
                    const result = tenantsModule.parseDate(input);
                    expect(result.getMonth()).to.equal(expectedMonth);
                });
            });
        });

        describe('Table sorting', () => {
            it('should sort text columns ascending and descending', () => {
                const nameHeader = document.querySelector('th span');
                const getNames = () => Array.from(document.querySelectorAll('.tenants-table tbody tr'))
                    .map(row => row.cells[0].textContent.trim());

                const originalOrder = getNames();
                expect(originalOrder).to.deep.equal(['Zack Brown', 'Alice Smith', 'Bob Johnson']);

                nameHeader.click();
                clock.tick(100);
                const ascendingOrder = getNames();
                expect(ascendingOrder).to.deep.equal(['Alice Smith', 'Bob Johnson', 'Zack Brown']);

                nameHeader.click();
                clock.tick(100);
                const descendingOrder = getNames();
                expect(descendingOrder).to.deep.equal(['Zack Brown', 'Bob Johnson', 'Alice Smith']);
            });

            it('should sort dates correctly', () => {
                const dateHeader = Array.from(document.querySelectorAll('th span'))
                    .find(span => span.textContent.includes('Last Contacted'));
                
                const getDates = () => Array.from(document.querySelectorAll('.tenants-table tbody tr'))
                    .map(row => row.cells[3].textContent.trim());

                // Verify initial state
                expect(getDates()).to.deep.equal([
                    'January 15, 2024',
                    'March 1, 2024',
                    'February 1, 2024'
                ]);

                // First click - ascending
                dateHeader.click();
                clock.tick(100);
                expect(getDates()).to.deep.equal([
                    'January 15, 2024',
                    'February 1, 2024',
                    'March 1, 2024'
                ]);

                // Second click - descending
                dateHeader.click();
                clock.tick(100);
                expect(getDates()).to.deep.equal([
                    'March 1, 2024',
                    'February 1, 2024',
                    'January 15, 2024'
                ]);
            });
        });
    });

    describe('Event propagation', () => {
        it('should stop propagation on dropdown toggle click', () => {
            const toggleButton = document.querySelector('.dropdown-toggle');
            const clickEvent = new window.Event('click', { bubbles: true });
            
            const stopPropagationSpy = sinon.spy();
            clickEvent.stopPropagation = stopPropagationSpy;

            toggleButton.dispatchEvent(clickEvent);
            expect(stopPropagationSpy.called).to.be.true;
        });
    });
});