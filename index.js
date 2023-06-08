const express = require('express')
const mysql = require('mysql')

const app = express()
const port = 3000

const dbConfig = {
  host: "",
  port: "",
  user: "",
  password: "",
  database: ""
}
const db = mysql.createConnection(dbConfig)
db.connect((error) => {
  if (error) {
    console.log(error.message)
    return
  } else {
    console.log("SQL Connected")

  }
})

function getLatestData (callback) {
  const query = `SELECT * FROM soilData ORDER BY id DESC LIMIT 10`
  db.query(query, (error, results) => {
    if (error) {
      console.log(error.message)
      callback(error, null)
    } else {
      if (results.length > 0) {
        const latestData = results
        callback(null, latestData)
      } else
        callback(null, null)
    }
  })
}

app.get('/api/latest_data', (req, res) => {
  getLatestData((error, latestData) => {
    if (error) {
      console.log(error)
      res.sendStatus(500)
    } else {
      console.log('Latest Data: ', latestData)
      res.json(latestData)
    }
  })

})
setInterval(() => {
  getLatestData((error, latestData) => {
    if (error) {
      console.log(error)
    } else {
      console.log('Latest Data: ', latestData)
    }
  })
}, 10000)

app.listen(port, () => {
  console.log(`Server is running on port ${port}`)
})


