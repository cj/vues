import { fs, projectDir, vuesTmpDir } from '../utils'

jasmine.DEFAULT_TIMEOUT_INTERVAL = 10000

jest.mock('../utils')

beforeAll(() => { fs.mkdirsSync(vuesTmpDir()) })
afterAll(()  => { fs.removeSync(projectDir('../')) })
