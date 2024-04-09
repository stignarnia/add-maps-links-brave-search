// DOM elements
const tabsContainer = document.getElementById("primary-tabs"); // tabs right below the search input

// Using selector array as sometimes multiple different selectors are used for the same element depending on the variant rendered by Google
const smallMapThumbnailElement = ['.lu-fs', '.V1GY4c']; // small thumbnail with a map, usually on the right side
const addressMapContainer = document.querySelector('#pimg_1');
const placesMapContainer = document.querySelector('.S7dMR')
const countryMapContainer = document.querySelector('.CYJS5e.W0urI.SodP3b.GHMsie.ZHugbd.UivI7b');

// Build simple URL search query from search params
const searchQuery = new URLSearchParams(window.location.search).get('q');
const mapsURL = `https://maps.google.com/maps?q=${searchQuery}`;

// This is needed to check if the page has loaded the SVG icons the second time, as for some reason they load the tabs, delete their icons and the one we added, then load them again. We might as well just wait for the second batch of icons to be added and then add the Maps tab.
let pathCounter = 0;

// ---------------------------
// The observer will watch for changes in the DOM and add the Maps tab when the third path element (seems to be a good number to tell us when it's loading icons the second time) is added to the DOM
const observer = new MutationObserver((mutationsList, observer) => {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName.toLowerCase() === 'path') {
                    pathCounter++;
                    if (pathCounter === 3) {
                        addMapsTab();
                        observer.disconnect();
                    }
                }
            });
        }
    }
});

// If tabs exist, start the observer
if (tabsContainer) {
    observer.observe(document, { attributes: false, childList: true, subtree: true });
}

// if tabs exist, add the maps tab
function addMapsTab() {
    // Create a new list item element for "Maps"
    const mapsListItem = document.createElement("li");
    mapsListItem.classList.add("tab-item", "svelte-1nkoeut"); // Add necessary classes

    // Create the content for the list item
    const mapsLink = document.createElement("a");
    mapsLink.href = mapsURL; // Set the link URL for Maps
    mapsLink.classList.add("svelte-1nkoeut", "desktop-default-regular"); // Add necessary classes

    const mapsIcon = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    mapsIcon.setAttribute("width", "24");
    mapsIcon.setAttribute("height", "24");
    mapsIcon.classList.add("icon");
    mapsIcon.setAttribute("viewBox", "0 0 576 512");

    const mapsPath = document.createElementNS("http://www.w3.org/2000/svg", "path");
    mapsPath.setAttribute("fill-rule", "evenodd");
    mapsPath.setAttribute("clip-rule", "evenodd");
    // Add the path definition for the Maps icon here
    mapsPath.setAttribute("d", "M565.6 36.2C572.1 40.7 576 48.1 576 56V392c0 10-6.2 18.9-15.5 22.4l-168 64c-5.2 2-10.9 2.1-16.1 .3L192.5 417.5l-160 61c-7.4 2.8-15.7 1.8-22.2-2.7S0 463.9 0 456V120c0-10 6.1-18.9 15.5-22.4l168-64c5.2-2 10.9-2.1 16.1-.3L383.5 94.5l160-61c7.4-2.8 15.7-1.8 22.2 2.7zM48 136.5V421.2l120-45.7V90.8L48 136.5zM360 422.7V137.3l-144-48V374.7l144 48zm48-1.5l120-45.7V90.8L408 136.5V421.2z");

    mapsIcon.appendChild(mapsPath);
    mapsLink.appendChild(mapsIcon);

    const mapsSpan = document.createElement("span");
    mapsSpan.textContent = "Maps";

    mapsLink.appendChild(mapsSpan);
    mapsListItem.appendChild(mapsLink);

    // Get the third element in the list (which should be "News")
    const secondElement = tabsContainer.children[2];

    // Insert the new "Maps" element before the third element
    tabsContainer.insertBefore(mapsListItem, secondElement);
}

// if map thumbnail exists
if (smallMapThumbnailElement.length) {
    setTimeout(() => {
        smallMapThumbnailElement.forEach((elementSelector) => {
            const targettedElement = document.querySelector(elementSelector);
            
            // check if element exists on the page
            if (targettedElement) {
                if (targettedElement.parentNode.tagName.toLowerCase() === 'a') {
                    // if its already an a tag, just update its href attribute with the generated maps link
                    targettedElement.parentNode.href = mapsURL;
                } else {
                    // otherwise create a new a tag with href attribute set to generated maps link, then wrap it around the element
                    const wrapperLink = document.createElement('a');
                    wrapperLink.href = mapsURL;
                    targettedElement.parentNode.insertBefore(wrapperLink, targettedElement);
                    targettedElement.parentNode.removeChild(targettedElement);
                    wrapperLink.appendChild(targettedElement);
                }
            }
        });
        
    }, 0)
}

// if address map is shown (the one right below search bar), make it clickable
if (addressMapContainer) {
    const mapWrapperLinkEl = document.createElement('a');
    mapWrapperLinkEl && (mapWrapperLinkEl.href = mapsURL);

    addressMapContainer.parentElement.insertBefore(mapWrapperLinkEl, addressMapContainer);
    mapWrapperLinkEl.appendChild(addressMapContainer);
}

// if places map is shown (the one right below search bar), make it clickable
if (placesMapContainer) {
    const mapWrapperLinkEl = document.createElement('a');
    mapWrapperLinkEl.text = 'OPEN IN MAPS';
    mapWrapperLinkEl.style.cssText = `
        font-size: 32px;
        position: absolute;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        text-align: center;
        color: #fff;
        cursor: pointer;
        left: 0;
        right: 0;
        height: 60px;
        line-height: 60px;
        text-decoration: none; /* Removes underline from link */
        border: 1px solid rgba(255, 255, 255, 0.2); /* Adds a subtle border */
        transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition for hover effects */
        `;

    placesMapContainer.style.position = 'relative';
    mapWrapperLinkEl && (mapWrapperLinkEl.href = mapsURL);
    placesMapContainer.append(mapWrapperLinkEl);
}
    
// if "green tinted country map" is shown (the one that appears below search bar), add a new button within that map that allows user to open it 
// in google maps instead while persisting the normal behavior of extending the map container if clicked within the UI map element
if (countryMapContainer) {
    const mapWrapperLinkEl = document.createElement('a');
    mapWrapperLinkEl.text = 'OPEN IN MAPS';
    mapWrapperLinkEl.style.cssText = `
        font-size: 32px;
        position: absolute;
        bottom: 0;
        background: rgba(0, 0, 0, 0.85);
        text-align: center;
        color: #fff;
        cursor: pointer;
        left: 0;
        right: 0;
        height: 100px;
        line-height: 100px;
        text-decoration: none; /* Removes underline from link */
        border: 1px solid rgba(255, 255, 255, 0.2); /* Adds a subtle border */
        transition: background-color 0.3s ease, color 0.3s ease; /* Smooth transition for hover effects */
        `;

    mapWrapperLinkEl && (mapWrapperLinkEl.href = mapsURL);
    countryMapContainer.append(mapWrapperLinkEl);
}