import config from '../config'
import { projectDir, fs } from '../utils'

const vuesConfigFile = projectDir('vues.config.js')

describe('Config', () => {
  // remove vues.config.js file if it exists
  beforeEach(() => { if (fs.existsSync(vuesConfigFile)) fs.unlinkSync(vuesConfigFile) })

  it('should deep merge', () => {
    const vuesConfig = config({ envs: ['TEST'] })

    expect(vuesConfig.envs).toEqual(['NODE_ENV', 'TEST'])
  })

  it('should load custom config', () => {
    fs.writeFileSync(vuesConfigFile, 'export default { envs: ["FROM_FILE"] }')

    const vuesConfig = config()

    expect(vuesConfig.envs).toEqual(['NODE_ENV', 'FROM_FILE'])

    fs.unlinkSync(vuesConfigFile) // make sure to remove
  })
})
