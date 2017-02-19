import micro from 'micro'

export default (config) => {
  const server = (req, res) => 'Hello, World!'
  return micro(server)
}
