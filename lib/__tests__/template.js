import config        from '../config'
import * as generate from '../template'

jest.mock('../utils')

describe('template', () => {
  it('should generate index.html', () => {
    const html = generate.render('index.html', config())
    const tags = [ 'html', 'title', 'body', 'id="vues"' ]

    tags.forEach(tag => { expect(html).toEqual(expect.stringMatching(tag)) })
  })

  test('#files', () => {
    generate.createFiles(config())
  })
})
