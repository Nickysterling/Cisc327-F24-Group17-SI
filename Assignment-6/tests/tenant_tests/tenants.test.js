const { test, expect } = require('@playwright/test');
const path = require('path');

// Register page tests
test.describe('Register Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file://${path.join(__dirname, 'test.html')}`);
  });

  test('should show error when no role is selected', async ({ page }) => {
    // Validate role selection
    await page.evaluate(() => {
      window.validateRoleSelection();
    });
    
    // Error message should be visible
    const errorMessage = await page.locator('#role-error');
    await expect(errorMessage).toBeVisible();
    await expect(errorMessage).toHaveText('Please select a role');
  });

  test('should allow submission when landlord role is selected', async ({ page }) => {
    // Select landlord role
    await page.click('#landlord');
    
    // Validate role selection
    const result = await page.evaluate(() => {
      return window.validateRoleSelection();
    });
    
    expect(result).toBe(true);
    
    // Error message should be hidden
    const errorMessage = await page.locator('#role-error');
    await expect(errorMessage).not.toBeVisible();
  });
});

// Tenants page tests
test.describe('Tenants Page', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto(`file://${path.join(__dirname, 'test.html')}`);
  });

  test.describe('Table Sorting', () => {
    test('should sort table by name column', async ({ page }) => {
      // Click name header to sort ascending
      await page.click('th:has-text("Name")');
      
      // Check order (ascending)
      const rows = await page.locator('.tenants-table tbody tr').all();
      const firstCell = await rows[0].locator('td').nth(0).textContent();
      const lastCell = await rows[1].locator('td').nth(0).textContent();
      
      expect(firstCell).toBe('Jane Smith');
      expect(lastCell).toBe('John Doe');
      
      // Verify sorting indicator
      await expect(page.locator('th:has-text("Name")')).toHaveClass(/sorted-asc/);
      
      // Click again to sort descending
      await page.click('th:has-text("Name")');
      
      // Get updated row content
      const updatedRows = await page.locator('.tenants-table tbody tr').all();
      const newFirstCell = await updatedRows[0].locator('td').nth(0).textContent();
      const newLastCell = await updatedRows[1].locator('td').nth(0).textContent();
      
      expect(newFirstCell).toBe('John Doe');
      expect(newLastCell).toBe('Jane Smith');
      
      // Verify sorting indicator changed
      await expect(page.locator('th:has-text("Name")')).toHaveClass(/sorted-desc/);
    });

    test('should sort table by email column', async ({ page }) => {
      // Click email header to sort ascending
      await page.click('th:has-text("Email")');
      
      // Check order (ascending)
      const rows = await page.locator('.tenants-table tbody tr').all();
      const firstCell = await rows[0].locator('td').nth(1).textContent();
      const lastCell = await rows[1].locator('td').nth(1).textContent();
      
      expect(firstCell).toBe('jane@example.com');
      expect(lastCell).toBe('john@example.com');
      
      // Click again to sort descending
      await page.click('th:has-text("Email")');
      
      // Get updated row content
      const updatedRows = await page.locator('.tenants-table tbody tr').all();
      const newFirstCell = await updatedRows[0].locator('td').nth(1).textContent();
      const newLastCell = await updatedRows[1].locator('td').nth(1).textContent();
      
      expect(newFirstCell).toBe('john@example.com');
      expect(newLastCell).toBe('jane@example.com');
    });

    test('should sort table by date column', async ({ page }) => {
      // Click date header to sort ascending
      await page.click('th:has-text("Last Contacted")');
      
      // Check order (ascending)
      const rows = await page.locator('.tenants-table tbody tr').all();
      const firstCell = await rows[0].locator('td').nth(2).textContent();
      const lastCell = await rows[1].locator('td').nth(2).textContent();
      
      expect(firstCell).toBe('July 15, 2024');
      expect(lastCell).toBe('August 1, 2024');
      
      // Click again to sort descending
      await page.click('th:has-text("Last Contacted")');
      
      // Get updated row content
      const updatedRows = await page.locator('.tenants-table tbody tr').all();
      const newFirstCell = await updatedRows[0].locator('td').nth(2).textContent();
      const newLastCell = await updatedRows[1].locator('td').nth(2).textContent();
      
      expect(newFirstCell).toBe('August 1, 2024');
      expect(newLastCell).toBe('July 15, 2024');
    });
  });

  test.describe('Dropdown Menu', () => {
    test('should toggle dropdown menu when clicking the button', async ({ page }) => {
      // Force click the dropdown toggle to avoid intercepted clicks
      await page.click('.dropdown-toggle >> nth=0', { force: true });
      
      // Menu should be visible
      const dropdownMenu = page.locator('.dropdown-menu >> nth=0');
      await expect(dropdownMenu).toBeVisible();
      
      // Force click toggle again
      await page.click('.dropdown-toggle >> nth=0', { force: true });
      
      // Menu should be hidden
      await expect(dropdownMenu).not.toBeVisible();
    });
  
    test('should close all dropdowns when clicking outside', async ({ page }) => {
      // Open first dropdown with force click
      await page.click('.dropdown-toggle >> nth=0', { force: true });
      await page.waitForTimeout(100);
  
      // Verify first dropdown is open
      const firstMenu = page.locator('.dropdown-menu >> nth=0');
      await expect(firstMenu).toBeVisible();
      
      // Click outside in an empty area
      await page.mouse.click(0, 0);
      
      // Verify dropdown is closed
      await expect(firstMenu).not.toBeVisible();
    });
  });

  test.describe('Modal Functionality', () => {
    test('should handle view profile modal', async ({ page }) => {
      // Open dropdown and click view profile
      await page.click('.dropdown-toggle >> nth=0');
      await expect(page.locator('.dropdown-menu >> nth=0')).toBeVisible();
      await page.click('.view-profile-btn >> nth=0');
      
      // Modal should be visible
      const modal = page.locator('#modalOverlay');
      await expect(modal).toBeVisible();
      
      // Close modal
      await page.click('#closeModal');
      
      // Modal should be hidden
      await expect(modal).not.toBeVisible();
    });

    test('should handle send message modal and show success toast', async ({ page }) => {
      // Open dropdown and click send message
      await page.click('.dropdown-toggle >> nth=0');
      await expect(page.locator('.dropdown-menu >> nth=0')).toBeVisible();
      await page.click('.send-message-btn >> nth=0');
      
      // Message overlay should be visible
      const messageOverlay = page.locator('#messageOverlay');
      await expect(messageOverlay).toBeVisible();
      
      // Send message
      await page.click('#sendMessage');
      
      // Wait for overlay to be hidden
      await expect(messageOverlay).not.toBeVisible();
      
      // Check toast appearance and timing
      const toast = page.locator('#messageSuccessfulToast');
      await expect(toast).toHaveClass(/show/, { timeout: 1000 });
      
      // Wait for toast to disappear
      await page.waitForTimeout(3000);
      await expect(toast).not.toHaveClass(/show/);
    });

    test('should handle message history modal', async ({ page }) => {
      // Open dropdown and click message history
      await page.click('.dropdown-toggle >> nth=0');
      await expect(page.locator('.dropdown-menu >> nth=0')).toBeVisible();
      await page.click('.message-history-btn >> nth=0');
      
      // History overlay should be visible
      const historyOverlay = page.locator('#historyOverlay');
      await expect(historyOverlay).toBeVisible();
      
      // Close modal
      await page.click('#closeMessageHistory');
      
      // History overlay should be hidden
      await expect(historyOverlay).not.toBeVisible();
    });

    test('should close message modal with cancel button', async ({ page }) => {
      // Open dropdown and click send message
      await page.click('.dropdown-toggle >> nth=0');
      await expect(page.locator('.dropdown-menu >> nth=0')).toBeVisible();
      await page.click('.send-message-btn >> nth=0');
      
      // Message overlay should be visible
      const messageOverlay = page.locator('#messageOverlay');
      await expect(messageOverlay).toBeVisible();
      
      // Click cancel
      await page.click('#closeSendMessage');
      
      // Overlay should be hidden and no toast should appear
      await expect(messageOverlay).not.toBeVisible();
      const toast = page.locator('#messageSuccessfulToast');
      await expect(toast).not.toBeVisible();
    });
  });

  test.describe('Date Parsing', () => {
    test('should correctly parse and compare dates', async ({ page }) => {
      const result = await page.evaluate(() => {
        const date1 = window.parseDate('August 1, 2024');
        const date2 = window.parseDate('July 15, 2024');
        return {
          isDate1Greater: date1 > date2,
          date1Month: date1.getMonth(),
          date1Day: date1.getDate(),
          date1Year: date1.getFullYear()
        };
      });
      
      expect(result.isDate1Greater).toBe(true);
      expect(result.date1Month).toBe(7); // August is month 7 (0-based)
      expect(result.date1Day).toBe(1);
      expect(result.date1Year).toBe(2024);
    });
  });
});