import config from '../config'
import { writeFileSync, unlinkSync, projectDir, existsSync } from '../utils'

const vuesConfigFile = projectDir('vues.config.js')

describe('Config', () => {
  // remove vues.config.js file if it exists
  beforeEach(() => { if (existsSync(vuesConfigFile)) unlinkSync(vuesConfigFile) })

  it('should deep merge', () => {
    const vuesConfig = config({ envs: ['TEST'] })

    expect(vuesConfig.envs).toEqual(['NODE_ENV', 'TEST'])
  })

  it('should load custom config', () => {
    writeFileSync(vuesConfigFile, 'export default { envs: ["FROM_FILE"] }')

    const vuesConfig = config()

    expect(vuesConfig.envs).toEqual(['NODE_ENV', 'FROM_FILE'])

    unlinkSync(vuesConfigFile) // make sure to remove
  })
})
