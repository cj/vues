import requestPromise from 'request-promise'
import listen         from 'test-listen'
import server         from '../server'
import config         from '../config'

describe('server', () => {
  let url

  beforeAll(async () => { url = await listen(vuesServer) })

  const vuesServer = server(config())
  const request    = (path, options = {}) => {
    return requestPromise(url + path, {
      resolveWithFullResponse: true,
      ...options
    })
  }

  it('should return Hello, World!', async () => {
    const res = await request('/')

    expect(res.body).toEqual(expect.stringMatching('id="vues"'))
    expect(res.statusCode).toBe(200)
  })

  it('should return index.html with 404', async () => {
    const res = await request('/404')

    expect(res.statusCode).toBe(200)
  })
})
