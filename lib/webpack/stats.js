const chalk = require('chalk')

export default stats => {
  process.stdout.write('\x1Bc')

  if (stats.hasErrors() || stats.hasWarnings()) {
    console.log(stats.toString('errors-only')) // eslint-disable-line no-console
    console.log() // eslint-disable-line no-console
    console.log(chalk.bgRed.black(' ERROR '), 'Compiling failed!') // eslint-disable-line no-console
  } else {
    console.log(stats.toString({
      chunks: false,
      children: false,
      modules: false,
      colors: true
    })) // eslint-disable-line no-console
    console.log(chalk.bgGreen.black(' DONE '), 'Compiled successfully!') // eslint-disable-line no-console
  }
  console.log() // eslint-disable-line no-console
}
