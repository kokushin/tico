const fs = require('fs')
const path = require('path')
const del = require('del')
const express = require('express')
const base64 = require('urlsafe-base64')
const uuidv4 = require('uuid/v4')
const archiver = require('archiver')
const router = express.Router()

const publicPath = path.join(__dirname, '../public')
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
  let index = 0

  uuid = uuidv4()

  new Promise ((resolve, reject) => fs.mkdir(`${publicPath}/files/${uuid}`, (err) => {
    if (err) { throw err }

    for (let i = 0; i < src.length; i++) {
      fs.writeFile(`${publicPath}/files/${uuid}/icon${src[i].size}x${src[i].size}.png`, src[i].image, (_err) => {
        if (_err) { throw _err }

        console.log(`Created ${publicPath}/files/${uuid}/icon${src[i].size}x${src[i].size}.png`)

        index++
        if (index === src.length) {
          resolve()
        }
      })
    }
  }))
  .then(() => convertZip(uuid))
  .then(() => res.send({ link: `/files/${uuid}.zip` }))
}

const convertZip = (path) => {
  const archive = archiver.create('zip', {})
  const output = fs.createWriteStream(`${publicPath}/files/${path}.zip`)

  output.on('close', () => removeCache(path))

  archive.on('error', (err) => {
    throw err
  })

  archive.pipe(output)

  archive.glob('*.png', {
    cwd: `${publicPath}/files/${path}`
  })

  archive.finalize()
}

const removeCache = (path) => del(`${publicPath}/files/${path}`)

module.exports = router
