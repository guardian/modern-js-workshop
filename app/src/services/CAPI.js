// @flow

const API_BASE: string = "http://content.guardianapis.com";
const API_KEY: string = "0ccb3e45-8ac1-429b-90aa-456ba71ec319";


// See API response: http://open-platform.theguardian.com/documentation/search
type ArticleResponse = {
  id: string,
  type: string,
  sectionId: string,
  sectionName: string,
  webPublicationDate: string,
  webTitle: string,
  webUrl: string,
  apiUrl: string,
  isHosted: boolean,
  pillarId: string,
  pillarName: string,
};

type SearchResponse = {
  response : {
    status: string,
    userTier: string,
    total: number,
    startIndex: number,
    pageSize: number,
    currentPage: number,
    pages: number,
    orderBy: string,
    results: ArticleResponse[],
  }
};

export type CAPIService = {|
  fetchLatest: (number) => Promise<SearchResponse>,
|};


const CAPI: CAPIService = {
  fetchLatest: async (count: number = 25): Promise<SearchResponse> => {
    const queryString = GuUtils.objectToQueryString({
      'page-size': count,
      "api-key": API_KEY
    });
    const response = await fetch(`${API_BASE}/search${queryString}`);
    return /* await */ response.json(); // async automatically awaits return
  }
};
