'use strict';

const crypto = require('crypto');
const urlBase64 = require('urlsafe-base64');
const atob = require('atob');

const curve = crypto.createECDH('prime256v1');
curve.generateKeys();

const publicKey = urlBase64.encode(curve.getPublicKey());

function urlBase64ToUint8Array(base64String) {
  const padding = '='.repeat((4 - base64String.length % 4) % 4);
  const base64 = (base64String + padding)
    .replace(/\-/g, '+')
    .replace(/_/g, '/');

  const rawData = atob(base64);
  const outputArray = new Uint8Array(rawData.length);

  console.log("padding", padding);
  console.log("base64", base64);
  console.log("rawData", rawData);
  console.log("outputArray", outputArray);

  for (let i = 0; i < rawData.length; ++i) {
    outputArray[i] = rawData.charCodeAt(i);
    console.log("rawData.charCodeAt", rawData.charCodeAt(i));
  }
  return outputArray;
}

const convertedVapidKey = urlBase64ToUint8Array(publicKey);

console.log("---------------")
console.log("convertedVapidKey", convertedVapidKey);
