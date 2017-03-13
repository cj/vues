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

  describe('#dirFileName', () => {
    it("should throw an error if the path doesn't match a file", () => {
      expect(() => {
        template.dirFileName('no-path', vuesConfig())
      }).toThrowError("no-path doesn't have a dirFileName")
    })
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

      it('should handle layouts', () => {
        const config            = vuesConfig({ router: {} })
        const defaultLayoutPath = `${config.layoutsDir}/default.vue`

        fs.mkdirsSync(`${config.layoutsDir}`)
        fs.writeFileSync(defaultLayoutPath, 'export default () => {}')

        const response = template.fileMethods.appVue(config)

        expect(response.layouts).toEqual([{
          name: 'defaultLayout',
          path: defaultLayoutPath
        }])
      })
    })

    describe('#filtersJs', () => {
      it('should return filter files', () => {
        const config   = vuesConfig({ router: {} })
        const filePath = `${config.filtersDir}/humanize.js`

        fs.mkdirsSync(`${config.filtersDir}`)
        fs.writeFileSync(filePath)

        const response = template.fileMethods.filtersJs(config)

        expect(response).toEqual({ filters: [
          ['humanize', filePath]
        ]})
      })
    })

    describe('#storeJs', () => {
      it('should handle files', () => {
        const config   = vuesConfig({ router: {} })
        const filePath = `${config.storesDir}/current-user.js`

        fs.mkdirsSync(`${config.storesDir}`)
        fs.writeFileSync(filePath)

        const response = template.fileMethods.storeJs(config)

        expect(response.stores).toEqual([
          { name: 'currentUser', componentName: 'currentUserStore', path: filePath }
        ])
      })

      test('storeConfig handling function', () => {
        const config   = vuesConfig({ store () { return true } })
        const response = template.fileMethods.storeJs(config)

        expect(response.storeConfig).toEqual(expect.stringContaining('function store()'))
      })

      test('storeConfig handling null', () => {
        const config   = vuesConfig({ store: null })
        const response = template.fileMethods.storeJs(config)

        expect(response.storeConfig).toBeNull()
      })
    })
  })

  describe('#watchFiles', () => {
    let webpackHotMiddleware
    let config
    let chokidar = require('chokidar')

    const dirs = ['viewsDir', 'storesDir', 'filtersDir', 'layoutsDir']

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
        fs.mkdirsSync(`${config[dir]}`)

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
