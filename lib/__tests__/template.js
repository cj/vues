import vuesConfig                            from '../config'
import * as template                         from '../template'
import { fs, glob, vuesTmplDir, projectDir } from '../utils'

jest.mock('chokidar')

describe('template', () => {
  it('should template index.html', () => {
    const html = template.render('index.html', vuesConfig())
    const tags = [ 'html', 'title', 'body', 'id="vues"' ]

    tags.forEach(tag => { expect(html).toEqual(expect.stringContaining(tag)) })
  })

  test('#createFiles', async () => {
    const files  = glob.sync('*.*', { cwd: vuesTmplDir() })
    const createdFiles = await template.createFiles(vuesConfig())

    expect(files).toEqual(createdFiles)
  })

  test('#createInitFiles', async () => {
    const files  = glob.sync('**/*.*', { cwd: vuesTmplDir('init') })
    const createdFiles = await template.createInitFiles(vuesConfig({
      projectName: 'test',
      vuesVersion: '0.0.1'
    }))

    expect(files).toEqual(createdFiles)
  })

  describe('#fileMethods', () => {
    describe('#routerJs', () => {
      it('should handle router object and return routes', () => {
        const config = vuesConfig({ router: {} })

        fs.mkdirsSync(`${config.viewsDir}/foo`)
        fs.writeFileSync(`${config.viewsDir}/index.vue`)
        fs.writeFileSync(`${config.viewsDir}/foo/bar.vue`)

        const response = template.fileMethods.routerJs(config)

        expect(response.routes).toEqual([
          {
            componentName: 'AboutView',
            file: projectDir('views/about.vue'),
            name: 'about',
            path: '/about'
          },
          {
            componentName: 'FooBarView',
            file: projectDir('views/foo/bar.vue'),
            name: 'foo-bar',
            path: '/foo/bar'
          },
          {
            componentName: 'IndexView',
            file: projectDir('views/index.vue'),
            name: 'index',
            path: '/'
          }
        ])
      })

      it('should handle function as router', () => {
        const config = vuesConfig({ router () { return true } })
        const response = template.fileMethods.routerJs(config)

        expect(response.router).toEqual(expect.stringContaining('function router()'))
      })

      it('should handle null router config', () => {
        const config = vuesConfig({ router: null })
        const response = template.fileMethods.routerJs(config)

        expect(response.router).toBeNull()
      })
    })

    describe('#appVue', () => {
      it('should handle all Lifecycle Hooks', () => {
        const config   = vuesConfig({ beforeMount () { return true } })
        const response = template.fileMethods.appVue(config)
        const hook     = response.hooks[0]

        expect(hook.name).toEqual('beforeMount')
        expect(hook.callback).toEqual(expect.stringContaining('function beforeMount()'))
      })
    })
  })

  describe('#watchFiles', () => {
    let webpackHotMiddleware
    let config
    let chokidar = require('chokidar')

    const dirs = ['viewsDir', 'storeDir', 'filtersDir']

    beforeEach(() => {
      webpackHotMiddleware = {
        publish: jest.fn()
      }
      config = vuesConfig({
        spinner: {
          start: jest.fn(),
          text: jest.fn()
        }
      })

      chokidar.__mockConfig    = config
      chokidar.__mockEventName = 'addDir'
    })

    dirs.forEach(dir => {
      it(`should trigger for ${dir}`, async () => {
        chokidar.__mockPath = config[dir]

        template.watchFiles(config, webpackHotMiddleware)

        await Promise.all(chokidar.__mockPromises)

        expect(webpackHotMiddleware.publish.mock.calls[0][0]).toEqual({
          action: 'vuesConfigUpdated'
        })
        expect(config.spinner.start.mock.calls.length).toBeGreaterThan(0)
        expect(config.spinner.text.length).toBeGreaterThan(0)
      })
    })
  })
})
