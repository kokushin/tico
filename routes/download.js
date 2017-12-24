const fs = require('fs')
const express = require('express')
const base64 = require('urlsafe-base64')
const uuidv4 = require('uuid/v4')
const router = express.Router()

let uuid = ''

router.post('/', (req, res) => {
  const data = req.body.data.split(',')[1]
  const src = base64.decode(data)

  createImageFile(src)
})

const createImageFile = (src) => {
  uuid = uuidv4()

  fs.mkdir(`cache/${uuid}`, (err) => {
    if (!err) {
      fs.writeFile(`cache/${uuid}/icon.png`, src, (_err) => {
        if (!_err) {
          console.log(`Created cache/${uuid}/icon.png`)
        } else {
          throw _err
        }
      })
    } else {
      throw err
    }
  })
}

module.exports = router
