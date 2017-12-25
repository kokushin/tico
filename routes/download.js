const fs = require('fs')
const express = require('express')
const base64 = require('urlsafe-base64')
const uuidv4 = require('uuid/v4')
const archiver = require('archiver')
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
  let createCount = 0
  uuid = uuidv4()

  new Promise ((resolve, reject) => {
    fs.mkdir(`cache/${uuid}`, (err) => {
      if (err) { throw err }

      for (let i = 0; i < src.length; i++) {
        fs.writeFile(`cache/${uuid}/icon${src[i].size}x${src[i].size}.png`, src[i].image, (_err) => {
          if (_err) { throw _err }

          console.log(`Created cache/${uuid}/icon${src[i].size}x${src[i].size}.png`)

          createCount++
          if (createCount === src.length) {
            resolve()
          }
        })
      }
    })
  })
    .then(() => {
      convertZip(uuid)
    })
    .then(() => {
      res.end()
    })
}

const convertZip = (path) => {
  const archive = archiver.create('zip', {})
  const output = fs.createWriteStream(`cache/${path}.zip`)

  output.on('end', () => removeCache())

  archive.on('error', (err) => {
    throw err
  })

  archive.pipe(output)

  archive.glob('*.png', {
    cwd: `cache/${path}`
  })

  archive.finalize()
}

const removeCache = () => {
  console.log(1);
}

module.exports = router
