# Maps links in Brave Search

- Introduces a new tab on the search results page, which provides a link to your chosen maps service, showing the location related to your search query;
- Adds a button to the minimaps in the search results to open the location in your preferred maps provider;
- Adds a button to the "Place" snippet in the search results to open the location in your preferred maps provider (Brave already does this for getting directions from here).

This is the code repository for the [Maps links in Brave Search extension](https://chromewebstore.google.com/detail/maps-links-in-brave-searc/ondbffgahgofdhonchkcoiigkolcbdmk). [Firefox version](https://addons.mozilla.org/firefox/addon/maps-links-in-brave-search/).

It's open source so you know what is being installed on your machine (you can also use [code extractor](https://chromewebstore.google.com/detail/chrome-extension-source-v/jifpbeccnghkjeaalbbjmodiffmgedin) on the extension directly).

If you have any issues with the extension or want to suggest a new feature, please let me know in the comments on the extension page or in this repository by [creating an issue](https://github.com/stignarnia/add-maps-links-brave-search/issues).

Many thanks to [Re-introduce google maps links to search page](https://github.com/mrakowski0/readd-gmaps-links-chrome-extension). I forked it to use as a template for this extension.

## Screenshots

![Tab](https://github.com/user-attachments/assets/c1ecb242-f638-4372-a9cc-354bc8d1db51)

![Minimap](https://github.com/stignarnia/add-maps-links-brave-search/assets/80171209/5e7fd2d5-6d4f-4269-9cfe-183511cd65d1)

![UI](https://github.com/user-attachments/assets/b5bcc91f-9bf3-4db3-83f3-1ceaa3f20029)

![Places](https://github.com/stignarnia/add-maps-links-brave-search/assets/80171209/e8b37541-e5e0-4e68-ab0a-b15d1674a64d)

![Minimap-s](https://github.com/stignarnia/add-maps-links-brave-search/assets/80171209/b84f9629-14f4-4cda-b09f-39c7a116a1d4)

## Manual Installation

- Download this repository by clicking the green `Code` button in the top right corner and then `Download ZIP`;
- Extract the downloaded file in a folder of choice (you can't move it after you install it or you'll have to repeat the next steps);
-   | Chromium [see notes] | Firefox |
    | :----: | :---: |
    | Go to `chrome://extensions/` | Go to `about:debugging#/runtime/this-firefox` |
    | Enable `Developer mode` | Click `Load Temporary Add-on...` |
    | Click `Load unpacked extension` | Select the `manifest.json` file in the folder where you cloned this repository |
    | Select the folder where you cloned this repository | Do not restart the browser or it will disappear [see notes] |

### Notes

- Chromium also includes Google Chrome, Microsoft Edge, and others;
- Firefox requires extension signing to survive restarts, to work around this you can download Firefox Developer Edition or Nightly and, on `about:config`, set `xpinstall.signatures.required` to `false`. At this point, it becomes installable by following these steps:
    - Create a `.zip` file of all the files in this repository;
    - Upload it from `about:addons`, gear icon, `Install Add-on From File...`.
