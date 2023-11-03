function runCheck() {
    setTimeout(checkStarredRepos, 1000)
}

const webURL = "https://github.com"

chrome.tabs.onUpdated.addListener((tabId, changeInfo, tab) => {
    if (
        changeInfo.status === "complete" &&
        String(tab.url).startsWith(webURL)
    ) {
        chrome.scripting.executeScript({
            target: { tabId: tabId },
            function: runCheck,
        });
    }
});