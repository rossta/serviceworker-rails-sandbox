const version = 'v04302016-4';

function cacheKey() {
  return [version, ...arguments].join(':');
}

export {
  cacheKey,
  version
}
