const getOgImage = async (sendResponse) => {
  const ogImage = document.querySelector('meta[property="og:image"]').getAttribute('content');
  sendResponse({ ogImage });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'get-og-image':
      getOgImage(sendResponse);
      return true;
  }
});
