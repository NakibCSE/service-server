const express = require('express')
const cors = require('cors');
const app = express()
const port = process.env.PORT || 5001
app.use(cors())

app.use(express.json())
app.get('/', (req, res) => {
  res.send('Picman Service working')
})

app.listen(port, () => {
  console.log(`Picman Service  listening on port ${port}`)
})