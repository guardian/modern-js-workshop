import {CAPI} from '../CAPI';

const fetch = jest.fn();
const json = jest.fn();
const responseJson = {
  foo: 'foo'
}

fetch.mockReturnValue(
  {
    json: json
  }
)

json.mockReturnValue(responseJson)

global.fetch = fetch;
global.json = json;

describe('Calls the API and receives a response', () => {
  test('should call fetch', () => {
    CAPI.fetchLatest();
    expect(global.fetch).toHaveBeenCalled();
  })

  test('should call json() on response from fetch', () => {
    CAPI.fetchLatest()
    expect(global.json).toHaveBeenCalled();
  })

  test('should return value of json()', async() => {
    const jsonValue = await CAPI.fetchLatest()
    expect(jsonValue).toEqual(responseJson)
  })
})