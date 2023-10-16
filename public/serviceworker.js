// q: whats a service worker?
// a: a service worker is a file which lives in a clients browser and intercepts network requests. 
// the service worker can decide what to do if the user is offline, which often involes accessing some sort of cached data.

// https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/service-workers



// The name of the cache your app uses.
const CACHE_NAME = "my-app-cache";
// The list of static files your app needs to start.
const PRE_CACHED_RESOURCES = ["/", "/information", "/offline", "styles/index.css"];


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


async function navigateOrDisplayOfflinePage(event) {
  try {
    // Try to load the page from the network.
    const networkResponse = await fetch(event.request);
    return networkResponse;
  } catch (error) {
    // The network call failed, the device is offline.
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match("/offline");
    return cachedResponse;
  }
}


async function fetchResourceOrLogError(event) {
  try {
    const networkResponse = await fetch(event.request);
    return networkResponse;
  }catch(err){
    console.error(err);
    return '';
  }
}

async function fetchAjaxOrDisplayOfflineWarning(event) {
  try {
    // Try to load the page from the network.
    const networkResponse = await fetch(event.request);
    return networkResponse;
  } catch (error) {
    // The network call failed, the device is offline.
    
    const cache = await caches.open(CACHE_NAME);
    const cachedResponse = await cache.match("/offline");
    return cachedResponse
  }
}


self.addEventListener("fetch", event => {

  console.log(event.request.mode);

  // when moving between pages
  if (event.request.mode === 'navigate') {
    event.respondWith(navigateOrDisplayOfflinePage(event));
  }

  // when fetching resources like CSS, javascript, or favicons
  if(event.request.mode === 'no-cors') {
    event.respondWith(fetchResourceOrLogError(event));
  }

  // when doing AJAX
  if(event.request.mode === 'cors') {
    event.respondWith(fetchAjaxOrDisplayOfflineWarning(event));
  }

});