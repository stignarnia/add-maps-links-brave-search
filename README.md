# Maps links in Brave Search

- Introduces a new tab on the search results page, which provides a link to your chosen maps service, showing the location related to your search query;
- Adds a button to the minimaps in the search results to open the location in your preferred maps provider;
- Adds a button to the "Place" snippet in the search results to open the location in your preferred maps provider (Brave already does this for getting directions from here).

This is the code repository for [Maps links in Brave Search extension](https://chromewebstore.google.com/detail/maps-links-in-brave-searc/ondbffgahgofdhonchkcoiigkolcbdmk).

It's open source so you know what is being installed on your machine (you can also use [code extractor](https://chromewebstore.google.com/detail/chrome-extension-source-v/jifpbeccnghkjeaalbbjmodiffmgedin) on the extension directly).

If you have any issues with the extension or want to suggest a new feature, please let me know in the comments on the extension page or in this repository by [creating an issue](https://github.com/stignarnia/add-maps-links-brave-search/issues).

Many thanks to [Re-introduce google maps links to search page](https://github.com/mrakowski0/readd-gmaps-links-chrome-extension). I forked it to use as a template for this extension.

## Screenshots

![Tab](https://github.com/stignarnia/add-maps-links-brave-search/assets/80171209/1065a534-9d93-4d82-9921-288579718b36)

![Minimap](https://github.com/stignarnia/add-maps-links-brave-search/assets/80171209/5e7fd2d5-6d4f-4269-9cfe-183511cd65d1)

![UI](https://github.com/stignarnia/add-maps-links-brave-search/assets/80171209/ab4f37cc-8f7d-4e86-81ee-b996d27a25db)

![Places](https://github.com/stignarnia/add-maps-links-brave-search/assets/80171209/e8b37541-e5e0-4e68-ab0a-b15d1674a64d)

![Minimap-s](https://github.com/stignarnia/add-maps-links-brave-search/assets/80171209/b84f9629-14f4-4cda-b09f-39c7a116a1d4)

## Manual Installation (only one available for Firefox)

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
    - Open the `manifest.json` file and add at the end:
        ``` json
        ,
        "browser_specific_settings": {
            "gecko": {
                "id": "example@example.org"
            }
        }
        ```
      then save and close;
    - Create a `.zip` file of all the files in this repository;
    - Upload it from `about:addons`, gear icon, `Install Add-on From File...`.