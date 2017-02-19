import config from '../config'

describe('Config', () => {
  it('should deep merge', () => {
    const vuesConfig = config({ env: ['TEST'] })

    expect(vuesConfig.env).toEqual(['NODE_ENV', 'TEST'])
  })
})
