// q: whats a service worker?
// a: a service worker is a file which lives in a clients browser and intercepts network requests. 
// the service worker can decide what to do if the user is offline, which often involes accessing some sort of cached data.

// https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/service-workers



// The name of the cache your app uses.
const CACHE_NAME = "my-app-cache";
// The list of static files your app needs to start.
const PRE_CACHED_RESOURCES = ["/styles/styles.css", "/", "/scripts/ajax.js"];


// this is run by the browser when the service worker (this file) is installed on the local machine
self.addEventListener("install", event => {

  async function preCacheResources() {
    // Open the app's cache.
    const cache = await caches.open(CACHE_NAME);
    // Cache all static resources.
    cache.addAll(PRE_CACHED_RESOURCES);
  }

  // without this, the service worker would not run until the user went to another page
  self.skipWaiting();
  
  event.waitUntil(preCacheResources());
});

// once installation is complete, this function is run
self.addEventListener("activate", event => {
  console.log("WORKER: activate event in progress.");
});