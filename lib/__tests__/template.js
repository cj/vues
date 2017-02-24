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
      projectName: 'test'
    }))

    expect(files).toEqual(createdFiles)
  })

  describe('#fileMethods', () => {
    test('#routerJs', () => {
      const config = vuesConfig()

      fs.mkdirsSync(`${config.viewsDir}/foo`)
      fs.writeFileSync(`${config.viewsDir}/index.vue`)
      fs.writeFileSync(`${config.viewsDir}/foo/bar.vue`)

      const response = template.fileMethods.routerJs(config)

      expect(response.routes).toEqual([
        {
          file: projectDir('views/about.vue'),
          name: 'about',
          path: '/about'
        },
        {
          file: projectDir('views/foo/bar.vue'),
          name: 'fooBar',
          path: '/foo/bar'
        },
        {
          file: projectDir('views/index.vue'),
          name: 'index',
          path: '/'
        }
      ])
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
