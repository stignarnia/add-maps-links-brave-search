// DOM element containing the tabs
const tabsContainer = document.getElementById("primary-tabs");
let directionsButton = document.getElementsByClassName("place-body")[0];

// Path definition for the Maps icon (from Fontawesome)
const mapIcon = "M565.6 36.2C572.1 40.7 576 48.1 576 56V392c0 10-6.2 18.9-15.5 22.4l-168 64c-5.2 2-10.9 2.1-16.1 .3L192.5 417.5l-160 61c-7.4 2.8-15.7 1.8-22.2-2.7S0 463.9 0 456V120c0-10 6.1-18.9 15.5-22.4l168-64c5.2-2 10.9-2.1 16.1-.3L383.5 94.5l160-61c7.4-2.8 15.7-1.8 22.2 2.7zM48 136.5V421.2l120-45.7V90.8L48 136.5zM360 422.7V137.3l-144-48V374.7l144 48zm48-1.5l120-45.7V90.8L408 136.5V421.2z";
const iconViewBox = "0 0 576 512";

// Variables for user chosen maps provider and the current query
const mapsName = "Maps";
const query = new URLSearchParams(window.location.search).get("q");
let mapsURL;

// Variables for the MutationObserver
const timeoutDelay = 250;
let i = 0;
let lastIncrementTime = Date.now();
let timeoutId = null;

// The observer will:
// - Watch for changes in the DOM and add the Maps tab when no new elements have been added for some time
// - When a minimap is loaded, it will add a button to open the user's preferred maps provider
const observer = new MutationObserver((mutationsList) => {
    for (let mutation of mutationsList) {
        if (mutation.type === "childList" && mutation.addedNodes.length > 0) {
            for (let node of mutation.addedNodes) {
                i++;
                lastIncrementTime = Date.now();
                
                // Clear any existing timeout
                if (timeoutId) {
                    clearTimeout(timeoutId);
                }
                
                // Set new timeout to check if some time has passed without new increments
                timeoutId = setTimeout(() => {
                    const timeSinceLastIncrement = Date.now() - lastIncrementTime;
                    if (timeSinceLastIncrement >= timeoutDelay) {
                        addMapsTab();
                        observer.disconnect(); // Stop observing once we've added the tab
                    }
                }, timeoutDelay);

                if (node.nodeName.toLowerCase() === "canvas" && node.classList.contains("maplibregl-canvas")) {
                    addButtonToMiniMap(node);
                }
            }
        }
    }
});

// If tabs exist, start the observer
if (tabsContainer) {
    observer.observe(document, { attributes: false, childList: true, subtree: true });
}

// Getting the base URL from user settings
chrome.storage.sync.get(["mapsProvider"], function(result) {
    if (result.mapsProvider) {
        if (result.mapsProvider.includes("%s")) {
            mapsURL = result.mapsProvider.replace("%s", query);
        } else {
            mapsURL = result.mapsProvider + query;
        }
    } else {
        mapsURL = "https://google.com/maps?q=" + query;
    }
});

// if tabs exist, add the maps tab
function addMapsTab() {
    let newsTab;
    let areWeInNews = false;

    if (window.location.pathname === "/news") {
        newsTab = tabsContainer.childNodes[3];
        areWeInNews = true;
    } else {
        newsTab = tabsContainer.childNodes[6];
    }

    const mapsTab = newsTab.cloneNode(true); // Clone the button with its children (that's why we need the true argument)

    // Modify the duplicated tab
    mapsTab.childNodes[0].href = mapsURL;
    mapsTab.childNodes[0].childNodes[3].innerText = mapsName;
    //swapSvg(mapsTab);

    if (areWeInNews) {
        tabsContainer.insertBefore(mapsTab, newsTab.nextSibling);
    } else {
        tabsContainer.insertBefore(mapsTab, newsTab);
    }

    if (directionsButton) {
        addButtonToPlaceSnippet();
    }
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
    const mapWrapperLinkEl = document.createElement("a");
    mapWrapperLinkEl.href = mapsURL;
    mapWrapperLinkEl.classList.add("map-link", "custom-button"); // Add a class for the CSS

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

    mapContainer.parentNode.append(mapWrapperLinkEl);
}

function swapSvg(element) {
    const svgElement = element.childNodes[0].childNodes[0];
    svgElement.setAttribute("viewBox", iconViewBox);
    svgElement.childNodes[0].setAttribute("d", mapIcon);
}