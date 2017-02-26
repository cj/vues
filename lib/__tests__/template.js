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
    const chokidar = require('chokidar')
    const config = vuesConfig({
      spinner: {
        start: jest.fn(),
        text: jest.fn()
      }
    })
    chokidar.__mockConfig = config

    it('should trigger for viewsDir', () => {
      chokidar.__mockPath = config.viewsDir

      template.watchFiles(config)

      expect(config.spinner.start.mock.calls.length).toBeGreaterThan(0)
      expect(config.spinner.text.length).toBeGreaterThan(0)
    })

    it('should trigger for storeDir', () => {
      chokidar.__mockPath = config.storeDir

      template.watchFiles(config)

      expect(config.spinner.start.mock.calls.length).toBeGreaterThan(0)
      expect(config.spinner.text.length).toBeGreaterThan(0)
    })
  })
})
