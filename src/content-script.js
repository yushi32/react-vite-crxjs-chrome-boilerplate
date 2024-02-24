const getOgImage = async (sendResponse) => {
  const metaOgImage = document.querySelector('meta[property="og:image"]');
  const ogImage = metaOgImage ? metaOgImage.getAttribute('content') : null;
  sendResponse({ ogImage });
};

chrome.runtime.onMessage.addListener((message, sender, sendResponse) => {
  switch (message.type) {
    case 'get-og-image':
      getOgImage(sendResponse);
      return true;
  }
});
