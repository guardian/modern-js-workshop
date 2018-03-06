import {GuUtils} from '../GuUtils';

describe('Query string converter', () => {
  test('should convert an object to a query string', () => {
    expect(GuUtils.objectToQueryString({
      foo: 'foo',
      bar: 'bar'
    })).toEqual('?foo=foo&bar=bar');
  })
})
