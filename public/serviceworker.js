// q: whats a service worker?
// a: a service worker is a file which lives in a clients browser and intercepts network requests. 
// the service worker can decide what to do if the user is offline, which often involes accessing some sort of cached data.

// https://learn.microsoft.com/en-us/microsoft-edge/progressive-web-apps-chromium/how-to/service-workers



const CACHE_NAME = "my-app-cache";
const PRE_CACHED_RESOURCES = ["/", "/information", "/offline",  "/offlineAjax", "/favicon.ico", "/manifest.json"];


// this is run by the browser when the service worker (this file) is installed on the local machine
self.addEventListener("install", event => {

  async function preCacheResources() {
    // Open the app's cache.
    const cache = await caches.open(CACHE_NAME);
    // Cache all static resources.
    cache.addAll(PRE_CACHED_RESOURCES);
    console.log('precached the following resources: ', PRE_CACHED_RESOURCES);
  }

  // without this, the service worker would not run until the user went to another page
  self.skipWaiting();
  
  event.waitUntil(preCacheResources());
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
  console.log('doing a cross origin request, possibly with ajax or some sensitive resource (cors) ', event.request.url);

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
self.addEventListener("fetch", event => {

  console.log('requested fetch for ', event.request.url);

  // when moving between pages
  if (event.request.mode === 'navigate') {
    event.respondWith(navigateOrDisplayOfflinePage(event));
  }

  // when fetching unimportant resources like CSS, javascript, or favicons
  if(event.request.mode === 'no-cors') {
    event.respondWith(fetchResourceOrFetchCache(event));
  }

  // when doing potentially risky things like AJAX
  if(event.request.mode === 'cors') {
    event.respondWith(fetchCorsOrDisplayOfflineWarning(event));
  }

});