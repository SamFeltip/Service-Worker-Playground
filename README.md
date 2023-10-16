## Service worker playground
This repo contains an express server used to experiment with caching and service workers for offline use.

## Setup:

### Dependencies

`git clone https://github.com/SamFeltip/Service-Worker-Playground.git`

`cd Service-Worker-Playground/`

`npm install`

### creating HTTPS certificates

You'll need to create some self signed https certificates too.
I used this tutorial to create `cert.pem` and `key.pem` files:

`https://timonweb.com/django/https-django-development-server-ssl-certificate/`

`brew install mkcert`
`mkcert -install`
`mkcert -cert-file cert.pem -key-file key.pem localhost 127.0.0.1`

### running the server

Once this is done, run this command to run the server:
`node server.js`