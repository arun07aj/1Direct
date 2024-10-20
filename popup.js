// Get the toggle element
const toggle = document.getElementById('toggleRedirect');

// Fetch the current state of the toggle from storage
browser.storage.local.get('redirectEnabled').then((result) => {
  toggle.checked = result.redirectEnabled || false;  // Set the checkbox based on the stored state
});

// Listen for toggle change and send a message to the background script
toggle.addEventListener('change', () => {
  const redirectEnabled = toggle.checked;

  // Store the new toggle state
  browser.storage.local.set({ redirectEnabled });

  // Send the updated state to the background script
  browser.runtime.sendMessage({ redirectEnabled });
});
