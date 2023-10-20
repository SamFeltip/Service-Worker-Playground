// q: whats a service worker?
// a: a service worker is a file which lives in a clients browser and intercepts network requests. 
//    the service worker can decide what to do if the user is offline, which often involes accessing some sort of cached data.

// q: what happens on page load?
// a: the first time a user joins a page, the service worker is installed. typically, the service worker is activated on page refresh or page redirect.
//    this service worker immediately activates the service worker after it is installed
//    this service worker takes control of the site on activation (see activation event listener), and becomes a middle man of any network requests (see fetch event listener)





const CACHE_NAME = "my-app-cache";

// include all the resources that will be loaded when the user visits the site for the first time
// include all resources needed for offline use and app use
const ALL_RESOURCES = [
  "/styles/index.css", "/scripts/ajax.js", "/", 
  "/favicon.ico", "/information", "/offline",  "/offlineAjax", "/manifest.json"
]

// this is run by the browser when the user first joins the site
self.addEventListener("install", function (event) {

  async function preCacheResources() {

    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(ALL_RESOURCES);
    
    console.log('precached the following resources: ', ALL_RESOURCES)
  }

  // attempt to activate the service worker immediately, instead of waiting on page refresh
  self.skipWaiting();
  
  // run preCache and do not terminate installation until it is completed
  event.waitUntil(preCacheResources());
});


self.addEventListener('activate', function (event) {
// makes sure the first time you join the page, the service worker takes control of the site
  event.waitUntil(self.clients.claim());
});







async function navigateOrDisplayOfflinePage(event) {
  console.log('navigating...', event.request.url);
  const cache = await caches.open(CACHE_NAME);

  try {
    // Try to load the page from the network.
    const networkResponse = await fetch(event.request);
    
    if(networkResponse.ok){
      console.log('got response from network ', networkResponse);
      cache.put(event.request, networkResponse.clone()); //update cache if successful
      console.log('successfully completed network request and cached ', event.request.url);
    }

    return networkResponse;
  } catch (error) {
    console.log('could not complete navigation to ', event.request.url);
    
    // The network call failed, the device is offline. 
    const cachedResponse = await cache.match(event.request);
    
    if (cachedResponse) {
      console.log('found cache match for ', event.request.url);
      
      return cachedResponse;
    } else {
      // If both network and cache fail, send a generic fallback:
      console.log('could not find cache of ', event.request.url);
      console.log('fallback to generic offline page');
      return caches.match('/offline');
    }
  }
}

async function fetchResourceOrFetchCache(event) {
  console.log('fetching resource from network or cache (non-cors request) ', event.request.url);

  const cache = await caches.open(CACHE_NAME);

  try {
    const networkResponse = await fetch(event.request);
    cache.put(event.request, networkResponse.clone()); //update cache if successful
    console.log('successfully completed network request and cached ', event.request.url);
    return networkResponse;

  }catch(err){
    console.log('could not fetch resource from network ', event.request.url);

    const cachedResponse = await cache.match(event.request);
    
    if (cachedResponse) {
      console.log('found cache match for ', event.request.url);
      return cachedResponse;
    } else {
      // If both network and cache fail, send a generic fallback:
      console.log('could not find cache of ', event.request.url);
      console.log('fallback to generic offline ajax');
      return caches.match('/offlineAjax');
    }

  }
}

async function fetchCorsOrDisplayOfflineWarning(event) {
  console.log('doing a cross origin request, possibly an ajax request (cors) ', event.request.url);

  const cache = await caches.open(CACHE_NAME);

  try {
    
    const networkResponse = await fetch(event.request);
    // cache.put(event.request, networkResponse.clone()); //update cache if successful
    // console.log('successfully completed network request and cached ', event.request.url);
    
    console.log('successfully completed network request ', event.request.url);
    return networkResponse;

  }catch(err){
    console.log('could not fetch resource from network ', event.request.url);
    
    const cachedResponse = await cache.match(event.request);
    
    if (cachedResponse) {
      console.log('found cache match for ', event.request.url);
      return cachedResponse;
    } else {
      // If both network and cache fail, send a generic fallback:
      console.log('could not find cache of ', event.request.url);
      console.log('fallback to generic offline ajax');
      return caches.match('/offlineAjax');
    }

  }
}


// runs whenever a network request is made
self.addEventListener("fetch", function (event) {

  console.log('requested fetch for ', event.request.url);

  // when moving between pages
  if (event.request.mode === 'navigate') {
    event.respondWith(navigateOrDisplayOfflinePage(event));
  }

  // when fetching unimportant resources like CSS, javascript, or favicons
  if(event.request.mode === 'no-cors') {
    event.respondWith(fetchResourceOrFetchCache(event));
  }

  // when doing cross site requests (ajax is included in this)
  if(event.request.mode === 'cors') {
    event.respondWith(fetchCorsOrDisplayOfflineWarning(event));
  }

});