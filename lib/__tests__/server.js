import requestPromise                 from 'request-promise'
import listen                         from 'test-listen'
import server                         from '../server'
import vuesConfig                     from '../config'
import { fs, projectDir, vuesTmpDir } from '../utils'

describe('server', () => {
  let url
  let vuesServer

  const config  = vuesConfig()
  const request = (path, options = {}) => {
    return requestPromise(url + path, {
      resolveWithFullResponse: true,
      ...options
    })
  }

  beforeAll(async () => {
    vuesServer = await server(config)
    url        = await listen(vuesServer)
  })

  it('should return id="vues"', async () => {
    const res = await request('/')

    expect(res.body).toEqual(expect.stringContaining('id="vues"'))
    expect(res.statusCode).toBe(200)
  })

  it('should return index.html with 404', async () => {
    const res = await request('/404')

    expect(res.statusCode).toBe(200)
  })

  describe('webpack', () => {
    it('should use postcss', async () => {
      fs.writeFileSync(vuesTmpDir('App.vue'), `<style>
        :fullscreen a {
          display: flex
        }

        body {
          background-color: #000;
        }
      </style>`)

      /* eslint-disable */
      fs.writeFileSync(vuesTmpDir('client.js'), `
        import App from '${vuesTmpDir("App.vue")}'
        require("~/test.css")
      `)
      /* eslint-enable */
      fs.writeFileSync(projectDir('test.css'), `body {
        display: flex;
      }`)

      const res = await request('/client.css')
      const lines = [

        'display: -webkit-flex;',
        'display: -ms-flexbox;',
        'display: flex;',
        ':-webkit-full-screen a',
        ':-moz-full-screen a',
        ':-ms-fullscreen a',
        ':fullscreen a'
      ]

      lines.forEach(line => { expect(res.body).toEqual(expect.stringContaining(line)) })
    })
  })
})
