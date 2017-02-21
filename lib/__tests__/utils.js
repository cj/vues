import * as utils from '../utils'

jest.unmock('../utils')

describe('utils', () => {
  describe('#isObject', () => {
    it('should be false with null, undefined and arrays', () => {
      expect(utils.isObject([])).toBe(false)
      expect(utils.isObject()).toBe(false)
      expect(utils.isObject(null)).toBe(false)
    })

    it('should be true with object', () => {
      expect(utils.isObject({})).toBe(true)
    })
  })

  describe('#deepMerge', () => {
    it('should clone and merge object', () => {
      const a = { foo: 'bar' }
      const b = { bar: 'foo' }

      expect(utils.deepMerge(a, b)).toEqual({ foo: 'bar', bar: 'foo' })
      expect(a).toEqual({ foo: 'bar' })
    })

    it('should deep merge object', () => {
      const a = { a: { b: 'c' } }
      const b = { a: { d: 'e' }, f: { g: 'h' } }

      expect(utils.deepMerge(a, b)).toEqual({
        a: { b: 'c', d: 'e' }, f: { g: 'h' }
      })
    })

    it('should deep merge array values', () => {
      const a = { a: ['b', 'c', 'd'] }
      const b = { a: ['e', 'f', 'g'], h: ['i'] }

      expect(utils.deepMerge(a, b)).toEqual({
        a: ['b', 'c', 'd', 'e', 'f', 'g'], h: ['i']
      })
    })
  })

  describe('#_', () => {
    test('#humanize', () => {
      expect(utils._.humanize('test-app')).toEqual('Test App')
      expect(utils._.humanize('NA')).toEqual('NA')
    })
  })

  test('#projectDir', () => {
    expect(utils.projectDir()).toEqual(expect.stringMatching('vues'))
    expect(utils.projectDir('lib')).toEqual(expect.stringMatching('vues/lib'))
  })

  test('#vuesDir', () => {
    expect(utils.vuesDir()).toEqual(expect.stringMatching('vues'))
    expect(utils.vuesDir('lib')).toEqual(expect.stringMatching('vues/lib'))
    expect(utils.vuesDir('lib/__tests__')).toEqual(expect.stringMatching('vues/lib/__tests__'))
  })

  test('#vuesTmpDir', () => {
    expect(utils.vuesTmpDir()).toEqual(expect.stringMatching('node_modules/.vues'))
  })

  test('#vuesTmplDir', () => {
    expect(utils.vuesTmplDir()).toEqual(expect.stringMatching('vues/lib/templates'))
  })
})
