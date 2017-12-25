const fs = require('fs')
const del = require('del')
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
    fs.mkdir(`public/files/${uuid}`, (err) => {
      if (err) { throw err }

      for (let i = 0; i < src.length; i++) {
        fs.writeFile(`public/files/${uuid}/icon${src[i].size}x${src[i].size}.png`, src[i].image, (_err) => {
          if (_err) { throw _err }

          console.log(`Created public/files/${uuid}/icon${src[i].size}x${src[i].size}.png`)

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
    res.send({
      link: `/files/${uuid}.zip`
    })
  })
}

const convertZip = (path) => {
  const archive = archiver.create('zip', {})
  const output = fs.createWriteStream(`public/files/${path}.zip`)

  output.on('close', () => removeCache(path))

  archive.on('error', (err) => {
    throw err
  })

  archive.pipe(output)

  archive.glob('*.png', {
    cwd: `public/files/${path}`
  })

  archive.finalize()
}

const removeCache = (path) => {
  del(`public/files/${path}`)
}

module.exports = router
