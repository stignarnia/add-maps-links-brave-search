// DOM element containing the tabs
const tabsContainer = document.getElementById("primary-tabs");
let directionsButton = document.getElementsByClassName("place-body")[0];

// Build simple URL search query from search params
const searchQuery = new URLSearchParams(window.location.search).get('q');
const mapsURL = `https://maps.google.com/maps?q=${searchQuery}`;

// This is needed to check if the page has loaded the SVG icons the second time, as for some reason they load the tabs, delete their icons and the one we added, then load them again. We might as well just wait for the second batch of icons to be added and then add the Maps tab.
let pathCounter = 0;

// ---------------------------
// The observer will:
// - Watch for changes in the DOM and add the Maps tab when the third path element (seems to be a good number to tell us when it's loading icons the second time) is added to the DOM;
// - When a minimap is loaded, it will add a button to open the user's preferred maps provider;
const observer = new MutationObserver((mutationsList) => {
    for(let mutation of mutationsList) {
        if (mutation.type === 'childList' && mutation.addedNodes.length > 0) {
            mutation.addedNodes.forEach((node) => {
                if (node.nodeName.toLowerCase() === 'path') {
                    pathCounter++;
                    if (pathCounter === 3) {
                        addMapsTab();
                    }
                } else if (node.nodeName.toLowerCase() === 'canvas') {
                    if (node.classList.contains('maplibregl-canvas')) {
                        addButtonToMiniMap(node);
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

// If a "Place" snippet is shown, add a new button that allows user to open it in their preferred maps provider before the directions button
if (directionsButton) {
    directionsButton = directionsButton.childNodes[0].childNodes[2];
    console.log(directionsButton);
    // Duplicate the directionsButton
    const mapsButton = directionsButton.cloneNode(true); // Clone the button with its children (that's why we need the true argument)

    // Modify the duplicated button
    mapsButton.childNodes[1].innerText = 'Maps';
    mapsButton.href = mapsURL;

    // Insert the new button before the directionsButton
    directionsButton.parentNode.insertBefore(mapsButton, directionsButton);
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
    // Path definition for the Maps icon (from Fontawesome)
    mapsPath.setAttribute("d", "M565.6 36.2C572.1 40.7 576 48.1 576 56V392c0 10-6.2 18.9-15.5 22.4l-168 64c-5.2 2-10.9 2.1-16.1 .3L192.5 417.5l-160 61c-7.4 2.8-15.7 1.8-22.2-2.7S0 463.9 0 456V120c0-10 6.1-18.9 15.5-22.4l168-64c5.2-2 10.9-2.1 16.1-.3L383.5 94.5l160-61c7.4-2.8 15.7-1.8 22.2 2.7zM48 136.5V421.2l120-45.7V90.8L48 136.5zM360 422.7V137.3l-144-48V374.7l144 48zm48-1.5l120-45.7V90.8L408 136.5V421.2z");

    mapsIcon.appendChild(mapsPath);
    mapsLink.appendChild(mapsIcon);

    const mapsSpan = document.createElement("span");
    mapsSpan.textContent = "Maps";

    mapsLink.appendChild(mapsSpan);
    mapsListItem.appendChild(mapsLink);

    // Insert the new "Maps" element before the "News" element
    tabsContainer.insertBefore(mapsListItem, tabsContainer.children[2]);
}
    
// If a minimap is shown, add a new button within that map that allows user to open it in their preferred maps provider instead while persisting the normal behavior of extending the map container if clicked within the UI map element
function addButtonToMiniMap(mapContainer) {
    const mapWrapperLinkEl = document.createElement('a');
    mapWrapperLinkEl.text = '🗺️ Open in Maps';
    mapWrapperLinkEl.href = mapsURL;
    mapWrapperLinkEl.className = 'map-link'; // Add a class for the CSS

    // Add the CSS for the button
    document.head.insertAdjacentHTML('beforeend', `
        <style>
            .map-link {
                margin-bottom: 10px;
                margin-left: 10px;
                font-size: 16px;
                position: absolute;
                bottom: 0;
                background: #17191e;
                text-align: center;
                font-weight: bold;
                color: #7682cb;
                left: 0;
                width: 30%;
                height: 40px;
                line-height: 40px;
                text-decoration: none; /* Removes underline from link */
                border: 1px solid rgba(255, 255, 255, 0.1); /* Adds a subtle border */
                border-radius: 40px; /* Rounded borders */
                border-color: #7682cb;
                transition: border-color 0.3s ease; /* Smooth transition for hover effects */
            }

            .map-link:hover {
                border-color: #79a0f9; /* Change border color on hover */
                color: #79a0f9; /* Change text color on hover */
                text-decoration: none; /* Removes underline from link */
                box-shadow: 0 0 10px rgba(0, 0, 0, 0.5); /* Adds a subtle shadow on hover */
            }

            .map-link:visited {
                color: #79a0f9; /* Forcing the color not to change after the link has been visited */
            }
        </style>
    `);

    mapContainer.parentElement.append(mapWrapperLinkEl);
}