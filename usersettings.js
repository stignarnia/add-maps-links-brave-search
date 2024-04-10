const providers = [
    "https://google.com/maps?q=%s",
    "https://www.bing.com/maps?q=%s",
    "https://www.openstreetmap.org/search?query=%s",
    "https://wego.here.com/discover/%s?map=omv"
];

const textArea = document.getElementById("mapsProvider");
const options = document.getElementsByClassName("option");

chrome.storage.sync.get(["mapsProvider"], function(result) {
    if (result.mapsProvider) {
        textArea.value = result.mapsProvider;
    } else {
        textArea.value = providers[0];
    }
});

for (let i = 0; i < options.length; i++) {
    options[i].addEventListener("click", function() {
        textArea.value = providers[i];
    });
}

document.getElementById("save").addEventListener("click", function() {
    chrome.storage.sync.set({mapsProvider: textArea.value});
});
