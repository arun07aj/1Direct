let redirectEnabled = false;

// Listen for changes to the toggle state
browser.runtime.onMessage.addListener((message) => {
  if (message.redirectEnabled !== undefined) {
    redirectEnabled = message.redirectEnabled;
  }
});

// Load the stored state of the redirectEnabled flag when the extension starts
browser.storage.local.get('redirectEnabled').then((result) => {
  redirectEnabled = result.redirectEnabled || false;
});

// Function to extract the domain from a URL
function extractDomain(url) {
  const a = document.createElement('a');
  a.href = url;
  return a.hostname;
}

// Listen for web requests and handle redirection
browser.webRequest.onBeforeRequest.addListener(
  function(details) {
    const currentDomain = extractDomain(details.originUrl);  
    const newDomain = extractDomain(details.url);            

    // Block if domains are different and redirection is disabled
    if (currentDomain !== newDomain && !redirectEnabled) {
      browser.notifications.create({
        type: 'basic',
        iconUrl: 'icon.png', 
        title: 'Redirection Blocked',
        message: `Redirection to ${newDomain} was blocked.`
      });

      return { cancel: true };  // Block the redirection
    }

    // Allow redirection if the toggle is enabled
    return {};
  },
  { urls: ["<all_urls>"] },  
  ["blocking"]
);
