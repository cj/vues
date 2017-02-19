import Request from 'request-promise'
import listen  from 'test-listen'
import server  from '../server'

describe('server', () => {
  let vuesServer = server()

  const request = async (options = {}) => {
    return Request(await listen(vuesServer), {
      resolveWithFullResponse: true, ...options
    })
  }

  it('should return Hello, World!', async () => {
    const res = await request()

    expect(res.body).toEqual('Hello, World!')
    expect(res.statusCode).toBe(200)
  })
})
