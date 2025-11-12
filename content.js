// DOM element containing the tabs
let tabsContainer = document.getElementById("primary-tabs");
let directionsButton = document.getElementsByClassName("place-body")[0];

// Data attributes used to avoid duplicating elements added by the extension
const MAPS_TAB_ATTRIBUTE = "data-extension-maps-tab";
const MAPS_MINIMAP_ATTRIBUTE = "data-extension-maps-minimap";

// Path definition for the Maps icon (from Fontawesome)
const mapIcon = "M565.6 36.2C572.1 40.7 576 48.1 576 56V392c0 10-6.2 18.9-15.5 22.4l-168 64c-5.2 2-10.9 2.1-16.1 .3L192.5 417.5l-160 61c-7.4 2.8-15.7 1.8-22.2-2.7S0 463.9 0 456V120c0-10 6.1-18.9 15.5-22.4l168-64c5.2-2 10.9-2.1 16.1-.3L383.5 94.5l160-61c7.4-2.8 15.7-1.8 22.2 2.7zM48 136.5V421.2l120-45.7V90.8L48 136.5zM360 422.7V137.3l-144-48V374.7l144 48zm48-1.5l120-45.7V90.8L408 136.5V421.2z";
const iconViewBox = "0 0 576 512";

// Variables for user chosen maps provider and the current query
const mapsName = "Maps";
const query = new URLSearchParams(window.location.search).get("q") || "";
let mapsURL = getDefaultMapsUrl(query);

// The observer will:
// - Watch for changes in the DOM and add the Maps tab when no new elements have been added for some time
// - When a minimap is loaded, it will add a button to open the user's preferred maps provider
const observer = new MutationObserver((mutationsList) => {
    let shouldEnsureMapsTab = false;

    for (let mutation of mutationsList) {
        if (mutation.type === "childList") {
            if (mutation.addedNodes.length > 0) {
                shouldEnsureMapsTab = true;
                for (let node of mutation.addedNodes) {
                    if (node.nodeName.toLowerCase() === "canvas" && node.classList.contains("maplibregl-canvas")) {
                        addButtonToMiniMap(node);
                    }
                }
            }

            if (mutation.removedNodes.length > 0) {
                shouldEnsureMapsTab = true;
            }
        }
    }

    if (shouldEnsureMapsTab) {
        addMapsTab();
    }
});

observer.observe(document, { attributes: false, childList: true, subtree: true });
addMapsTab();

// Getting the base URL from user settings
chrome.storage.sync.get(["mapsProvider"], function(result) {
    if (result.mapsProvider) {
        mapsURL = buildMapsUrlFromSetting(result.mapsProvider, query);
    } else {
        mapsURL = getDefaultMapsUrl(query);
    }

    refreshMapsLinks();
});

// if tabs exist, add the maps tab
function addMapsTab() {
    const tabs = getTabsContainer();
    if (!tabs || tabs.querySelector(`[${MAPS_TAB_ATTRIBUTE}="true"]`)) {
        return false;
    }

    const newsTabLink = tabs.querySelector('a[href^="/news"]');
    const newsTab = newsTabLink ? newsTabLink.closest("li") : null;
    const fallbackTab = tabs.querySelector(".tab-item");
    const tabToClone = newsTab || fallbackTab;

    if (!tabToClone) {
        return false;
    }

    const mapsTab = tabToClone.cloneNode(true); // Clone the button with its children (that's why we need the true argument)
    const mapsTabLink = mapsTab.querySelector("a");
    if (!mapsTabLink) {
        return false;
    }

    const mapsLabel = mapsTabLink.querySelector("span");

    // Modify the duplicated tab
    mapsTab.setAttribute(MAPS_TAB_ATTRIBUTE, "true");
    mapsTab.classList.remove("active");
    mapsTabLink.setAttribute(MAPS_TAB_ATTRIBUTE, "true");
    mapsTabLink.href = mapsURL;
    mapsTabLink.removeAttribute("aria-current");

    if (mapsLabel) {
        mapsLabel.innerText = mapsName;
    } else {
        mapsTabLink.textContent = mapsName;
    }
    //swapSvg(mapsTab);

    if (newsTab) {
        if (window.location.pathname === "/news") {
            newsTab.insertAdjacentElement("afterend", mapsTab);
        } else {
            tabs.insertBefore(mapsTab, newsTab);
        }
    } else {
        tabs.appendChild(mapsTab);
    }

    if (directionsButton) {
        addButtonToPlaceSnippet();
    }

    return true;
}

// If a "Place" snippet is shown, add a new button that allows user to open it in their preferred maps provider before the directions button
function addButtonToPlaceSnippet() {
    directionsButton = directionsButton.childNodes[0].childNodes[2];  // We need the children to get the directions button we want to clone because it itself doesn't have a unique identifier
    const mapsButton = directionsButton.cloneNode(true); // Clone the button with its children (that's why we need the true argument)

    // Modify the duplicated button
    mapsButton.childNodes[2].innerText = mapsName;
    swapSvg(mapsButton);

    // Add the event listener to the new button as for some reason setting the href attribute doesn't work
    mapsButton.addEventListener("click", function() {
        window.location.href = mapsURL;
    });

    // Insert the new button before the directionsButton
    directionsButton.parentNode.insertBefore(mapsButton, directionsButton);
}
    
// If a minimap is shown, add a new button within that map that allows user to open it in their preferred maps provider instead while persisting the normal behavior of extending the map container if clicked within the UI map element
function addButtonToMiniMap(mapContainer) {
    const parentNode = mapContainer.parentNode;

    if (!parentNode || parentNode.querySelector(`[${MAPS_MINIMAP_ATTRIBUTE}="true"]`)) {
        return;
    }

    const mapWrapperLinkEl = document.createElement("a");
    mapWrapperLinkEl.href = mapsURL;
    mapWrapperLinkEl.classList.add("map-link", "custom-button"); // Add a class for the CSS
    mapWrapperLinkEl.setAttribute(MAPS_MINIMAP_ATTRIBUTE, "true");

    const mapsIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    mapsIcon.width = "24";
    mapsIcon.height = "24";
    mapsIcon.setAttribute("viewBox", iconViewBox);
    mapsIcon.classList.add("icon", "map-icon"); // Add a class for the CSS

    const mapsPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    mapsPath.setAttribute("fill-rule", "evenodd");
    mapsPath.setAttribute("clip-rule", "evenodd");
    mapsPath.setAttribute("d", mapIcon);

    mapsIcon.appendChild(mapsPath);
    mapWrapperLinkEl.prepend(mapsIcon);

    parentNode.append(mapWrapperLinkEl);
}

function swapSvg(element) {
    const svgElement = element.childNodes[0].childNodes[0];
    svgElement.setAttribute("viewBox", iconViewBox);
    svgElement.childNodes[0].setAttribute("d", mapIcon);
}

function getDefaultMapsUrl(searchQuery) {
    return "https://google.com/maps?q=" + encodeURIComponent(searchQuery);
}

function buildMapsUrlFromSetting(provider, searchQuery) {
    if (!provider) {
        return getDefaultMapsUrl(searchQuery);
    }

    if (provider.includes("%s")) {
        return provider.replace("%s", searchQuery);
    }

    return provider + searchQuery;
}

function refreshMapsLinks() {
    const tabLink = document.querySelector(`a[${MAPS_TAB_ATTRIBUTE}="true"]`);

    if (tabLink) {
        tabLink.href = mapsURL;
    }

    document.querySelectorAll(`a[${MAPS_MINIMAP_ATTRIBUTE}="true"]`).forEach((link) => {
        link.href = mapsURL;
    });
}

function getTabsContainer() {
    const container = document.getElementById("primary-tabs");
    if (container && container !== tabsContainer) {
        tabsContainer = container;
    }

    return container;
}
