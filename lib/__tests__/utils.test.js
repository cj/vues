import * as utils from '../utils'

describe('Utils', () => {
  describe('#isObject', () => {
    it('should be false with array', () => {
      expect(utils.isObject([])).toBe(false)
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
      const b = { a: { d: 'e' } }

      expect(utils.deepMerge(a, b)).toEqual({ a: { b: 'c', d: 'e' } })
    })

    it('should deep merge array values', () => {
      const a = { a: ['b', 'c', 'd'] }
      const b = { a: ['e', 'f', 'g'] }

      expect(utils.deepMerge(a, b)).toEqual({ a: ['b', 'c', 'd', 'e', 'f', 'g'] })
    })
  })
})