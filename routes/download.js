const fs = require('fs')
const express = require('express')
const base64 = require('urlsafe-base64')
const uuidv4 = require('uuid/v4')
const router = express.Router()

let uuid = ''

router.post('/', (req, res) => {
  const data = req.body.data
  let src = []

  for (let i = 0; i < data.length; i++) {
    src.push({
      size: data[i].size,
      image: base64.decode(data[i].src.split(',')[1])
    })
  }

  createImageFile(src, res)
})

const createImageFile = (src, res) => {
  uuid = uuidv4()

  fs.mkdir(`cache/${uuid}`, (err) => {
    if (!err) {
      for (let i = 0; i < src.length; i++) {
        fs.writeFile(`cache/${uuid}/icon${src[i].size}x${src[i].size}.png`, src[i].image, (_err) => {
          if (!_err) {
            console.log(`Created cache/${uuid}/icon${src[i].size}x${src[i].size}.png`)
          } else {
            throw _err
          }
        })
      }
      res.end()
    } else {
      throw err
    }
  })
}

module.exports = router
