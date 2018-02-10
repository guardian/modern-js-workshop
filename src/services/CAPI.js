const API_BASE = "http://content.guardianapis.com/search";
const API_KEY = "0ccb3e45-8ac1-429b-90aa-456ba71ec319";

const CAPI = {
  fetchTheNews: async (params = {}) => {
    const queryString = GuUtils.objectToQueryString({
      ...params,
      "api-key": API_KEY
    });
    const response = await fetch(`${API_BASE}${queryString}`);
    return /* await */ response.json(); // async automatically awaits return
  }
};
