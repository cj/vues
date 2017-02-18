import Config from '../config'

describe('config', () => {
  it('should deep merge', () => {
    const config = Config({ env: ['TEST'] })

    expect(config.env).toEqual(['NODE_ENV', 'TEST'])
  })
})
