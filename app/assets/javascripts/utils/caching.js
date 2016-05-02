const version = 'v05022016-1';

function cacheKey() {
  return [version, ...arguments].join(':');
}

export {
  cacheKey,
  version
}
