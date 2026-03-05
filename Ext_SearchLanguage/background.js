const STORAGE_KEY = 'enabled';
const RULE_ID = 1;

const enabledRule = {
  id: RULE_ID,
  priority: 1,
  action: {
    type: 'redirect',
    redirect: {
      transform: {
        queryTransform: {
          addOrReplaceParams: [
            { key: 'gl', value: 'us' },
            { key: 'hl', value: 'en' }
          ]
        }
      }
    }
  },
  condition: {
    regexFilter: '^https?://([a-z0-9-]+\\.)?google\\.com/search\\?.*\\bq=',
    resourceTypes: ['main_frame']
  }
};

const disabledRule = {
  id: RULE_ID,
  priority: 1,
  action: {
    type: 'redirect',
    redirect: {
      transform: {
        queryTransform: {
          removeParams: ['gl', 'hl']
        }
      }
    }
  },
  condition: {
    regexFilter: '^https?://([a-z0-9-]+\\.)?google\\.com/search\\?.*\\bq=',
    resourceTypes: ['main_frame']
  }
};

async function getEnabled() {
  const result = await chrome.storage.sync.get({ [STORAGE_KEY]: false });
  return Boolean(result[STORAGE_KEY]);
}

async function applyRule() {
  const enabled = await getEnabled();
  await chrome.declarativeNetRequest.updateDynamicRules({
    removeRuleIds: [RULE_ID],
    addRules: [enabled ? enabledRule : disabledRule]
  });
}

chrome.runtime.onInstalled.addListener(async () => {
  const result = await chrome.storage.sync.get(STORAGE_KEY);
  if (typeof result[STORAGE_KEY] !== 'boolean') {
    await chrome.storage.sync.set({ [STORAGE_KEY]: false });
  }
  await applyRule();
});

chrome.runtime.onStartup.addListener(() => {
  applyRule().catch((error) => {
    console.error('Failed to apply startup rule', error);
  });
});

chrome.storage.onChanged.addListener((changes, areaName) => {
  if (areaName !== 'sync' || !changes[STORAGE_KEY]) {
    return;
  }

  applyRule().catch((error) => {
    console.error('Failed to apply updated rule', error);
  });
});

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== 'applyRule') {
    return;
  }

  applyRule()
    .then(() => sendResponse({ ok: true }))
    .catch((error) => {
      console.error('Failed to apply rule from message', error);
      sendResponse({ ok: false, error: String(error) });
    });

  return true;
});
