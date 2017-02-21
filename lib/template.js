import { _, fs, vuesTmpDir, vuesTmplDir, glob } from './utils'

export const createFiles = config => {
  const files  = glob.sync('*.*', { cwd: vuesTmplDir() })
  const tmpDir = vuesTmpDir()

  // istanbul ignore next
  if (!fs.existsSync(tmpDir)) fs.mkdirsSync(tmpDir)

  files.forEach(file => {
    fs.writeFileSync(vuesTmpDir(file), render(file, config))
  })
}

export const content = file => {
  return fs.readFileSync(vuesTmplDir(file))
}

export const render = (file, data) => {
  return _.template(content(file), { interpolate: /{{([\s\S]+?)}}/g })({...{_}, ...data})
}
