function updateMainMessageForNonMediumArticles() {
    const mainMessage = document.getElementById("main");
    mainMessage.innerText = "The extension is developed to work only for medium articles! Contact the developer for more information.";

}
// fix: not used and will not work as document references the popup.html document and not the actual page
function getNodeByInnerTextContaining(text) {
    return document.evaluate("//*[contains(text(), '" + text + "')]", document, null, XPathResult.FIRST_ORDERED_NODE_TYPE, null).singleNodeValue;
}
// not used
const KEY_TEXTS = ["Read the rest of this story with a free account", "Unlock with Medium", "Unlock with a Medium account", "Get unlimited access"]
// not used
function isMediumArticleLocked() {
    for (let keyText of KEY_TEXTS) {
        if (getNodeByInnerTextContaining(keyText)) {
            return true;
        }
    }
    return false;
}
async function unlockMediumArticle() {
    const url = await getCurrentTabUrl();
    chrome.windows.create({ "url": url, "incognito": true, type: "normal", state: 'maximized' })
}
async function getCurrentTabUrl() {
    let queryOptions = { active: true, lastFocusedWindow: true };
    let [tab] = await chrome.tabs.query(queryOptions);
    return tab.pendingUrl || tab.url;
}
async function isCurrentTabUrlAMediumArticle() {
    return (await getCurrentTabUrl()).toLowerCase().includes("medium");
}
isCurrentTabUrlAMediumArticle().then(
    (isMediumArticle) => {
        if (isMediumArticle)
            unlockMediumArticle();
        else
            updateMainMessageForNonMediumArticles();
    }
)

