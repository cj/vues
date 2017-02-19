import micro   from 'micro'
import Request from 'request-promise'
import listen  from 'test-listen'

import Server  from '../server'

describe('Server', () => {
  let server = Server()

  const getUrl = fn => {
    const srv = micro(fn)

    return listen(srv)
  }

  const request = async (options = {}) => {
    return Request(await getUrl(server), {
      resolveWithFullResponse: true, ...options
    })
  }

  it('should return Hello, World!', async () => {
    const res = await request()

    expect(res.body).toEqual('Hello, World!')
    expect(res.statusCode).toBe(200)
  })
})
