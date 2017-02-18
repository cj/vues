import { resolve } from 'path'
import deepMerge   from 'n-deep-merge'

export default (config) => {
  const projectDir = resolve('./')
  const srcDir     = projectDir

  return deepMerge({
    projectDir,
    srcDir,
    include: [srcDir],
    env: ['NODE_ENV']
  }, config)
}
