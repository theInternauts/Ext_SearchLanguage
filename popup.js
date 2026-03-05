const STORAGE_KEY = 'enabled';
const checkbox = document.getElementById('enabled');

async function loadState() {
  const result = await chrome.storage.sync.get({ [STORAGE_KEY]: false });
  checkbox.checked = Boolean(result[STORAGE_KEY]);
}

checkbox.addEventListener('change', async () => {
  await chrome.storage.sync.set({ [STORAGE_KEY]: checkbox.checked });
  await chrome.runtime.sendMessage({ type: 'applyRule' });

  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTab?.id) {
    await chrome.tabs.reload(activeTab.id);
  }
});

loadState().catch((error) => {
  console.error('Failed to load extension state', error);
});
