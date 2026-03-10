const STORAGE_KEY = 'enabled';
const toggleButton = document.getElementById('toggle');
const stateIcon = document.getElementById('stateIcon');
const ENABLED_ICON = 'icons/eagle_color.png';
const DISABLED_ICON = 'icons/eagle_outline.png';

async function loadState() {
  const result = await chrome.storage.sync.get({ [STORAGE_KEY]: false });
  const enabled = Boolean(result[STORAGE_KEY]);
  applyUiState(enabled);
}

function applyUiState(enabled) {
  stateIcon.src = enabled ? ENABLED_ICON : DISABLED_ICON;
  stateIcon.alt = enabled ? 'Enabled' : 'Disabled';
  toggleButton.setAttribute('aria-pressed', String(enabled));
}

toggleButton.addEventListener('click', async () => {
  const result = await chrome.storage.sync.get({ [STORAGE_KEY]: false });
  const enabled = !Boolean(result[STORAGE_KEY]);
  await chrome.storage.sync.set({ [STORAGE_KEY]: enabled });
  applyUiState(enabled);
  await chrome.runtime.sendMessage({ type: 'applyRule' });

  const [activeTab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (activeTab?.id) {
    await chrome.tabs.reload(activeTab.id);
  }
});

loadState().catch((error) => {
  console.error('Failed to load extension state', error);
});
