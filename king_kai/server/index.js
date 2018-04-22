const http = require('http')
const app = require('./lib/app')
const PORT = process.env.PORT || 9000
require('./lib/mongoose-setup')

const server = http.createServer(app)

server.listen(PORT, () => {
  console.log(`Server started on port: ${server.address().port}`)
})
