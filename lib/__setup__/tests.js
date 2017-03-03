import { fs, projectDir, vuesTmpDir } from '../utils'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 15000

jest.mock('../utils')

beforeAll(() => { fs.mkdirsSync(vuesTmpDir()) })
afterAll(()  => { fs.removeSync(projectDir('../')) })
