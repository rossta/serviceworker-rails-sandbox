const version = 'v04302016-2';

function cacheKey() {
  return [version, ...arguments].join(':');
}

export {
  cacheKey,
  version
}
