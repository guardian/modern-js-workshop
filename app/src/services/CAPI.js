import {GuUtils} from '../utils/GuUtils';

const API_BASE = "http://content.guardianapis.com";
const API_KEY = "0ccb3e45-8ac1-429b-90aa-456ba71ec319";

export const CAPI = {
  fetchLatest: async (count = 25) => {
    const queryString = GuUtils.objectToQueryString({
      'page-size': count,
      "api-key": API_KEY
    });
    const response = await fetch(`${API_BASE}/search${queryString}`);
    return /* await */ response.json(); // async automatically awaits return
  }
};
