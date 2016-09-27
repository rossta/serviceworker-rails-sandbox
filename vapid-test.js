'use strict';

const webpush = require('web-push');

const audience = "https://serviceworker.dev";
const subject = "mailto:ross@rossta.net";
const publicKey = "BNcyGTkBni3_xKHBuTA0ldfgGdE_QaLLwOO9Vo20NngWnWYixbOP8irmfsQrmOmEQpOZt7Q0AtwnlOYE4BHeIgk"
const privateKey = "y74a3L_5dWKvyOuM3k9Ai__7Ir0s49UFPrvwVgukyBA="
const expiration = 1475032046;

const headers = webpush.getVapidHeaders(audience, subject, publicKey, privateKey, expiration);

console.log("headers", headers);
