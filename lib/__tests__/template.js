import vuesConfig                from '../config'
import * as generate             from '../template'
import { fs, glob, vuesTmplDir } from '../utils'

describe('template', () => {
  it('should generate index.html', () => {
    const html = generate.render('index.html', vuesConfig())
    const tags = [ 'html', 'title', 'body', 'id="vues"' ]

    tags.forEach(tag => { expect(html).toEqual(expect.stringContaining(tag)) })
  })

  test('#files', async () => {
    const files  = glob.sync('*.*', { cwd: vuesTmplDir() })
    const createdFiles = await generate.createFiles(vuesConfig())

    expect(files).toEqual(createdFiles)
  })

  describe('#fileMethods', () => {
    test('#routerJs', () => {
      const config = vuesConfig()

      fs.mkdirsSync(`${config.viewsDir}/Foo`)
      fs.writeFileSync(`${config.viewsDir}/Index.vue`)
      fs.writeFileSync(`${config.viewsDir}/Foo/Bar.vue`)

      const response = generate.fileMethods.routerJs(config)

      expect(response.routes).toEqual([
        {
          file: '/Users/cj/Sync/npmjs/vues/lib/__setup__/tmp/vuesApp/views/Foo/Bar.vue',
          name: 'fooBar',
          path: '/foo/bar'
        },
        {
          file: '/Users/cj/Sync/npmjs/vues/lib/__setup__/tmp/vuesApp/views/Index.vue',
          name: 'index',
          path: '/'
        }
      ])
    })
  })
})
