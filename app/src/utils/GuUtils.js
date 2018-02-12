// Create a query string from an object
const GuUtils = {
  objectToQueryString: obj =>
  `?${Object.entries(obj)
    .map(([k, v]) => `${encodeURI(k)}=${encodeURI(v)}`)
    .join("&")}`
};
