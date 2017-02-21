import { fs, projectDir, vuesTmpDir } from '../utils'

jest.mock('../utils')

beforeAll(() => { fs.mkdirsSync(vuesTmpDir()) })
afterAll(()  => { fs.removeSync(projectDir('../')) })
