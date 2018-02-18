// @flow

export type Utils = {|
  objectToQueryString: (obj: Object) => string,
|};

// Create a query string from an object
const GuUtils: Utils = {
  objectToQueryString: (obj: Object): string =>
  `?${Object.entries(obj)
    .map(([k, v]) => {
      if (typeof v === 'string') {
        return `${encodeURI(k)}=${encodeURI(v)}`
      } else {
        return '';
      }
    })
    .join("&")}`
};
