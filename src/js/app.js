import Vue from 'vue'
import html2canvas from 'html2canvas'
import axios from 'axios'

const app = new Vue({
  el: '#app',
  data: {
    download: false,
    text: 'T',
    type: 'square',
    textColor: 'white',
    backgroundColor: 'black',
    scale: {
      width: 160,
      height: 160,
      fontSize: 100
    },
    size: [
      16, 32, 96, 114, 144, 180, 240, 500
    ]
  },
  methods: {
    getImageData () {
      let index = 0
      let imageSize = 0
      const data = []
      const imageSizeLength = this.size.length
      const clientImageWidth = document.getElementById('preview').clientWidth
      const clientImageHeight = document.getElementById('preview').clientHeight

      this.download = true

      new Promise((resolve, reject) => {
        for (let i = 0; i < imageSizeLength; i++) {
          imageSize = this.size[i]

          html2canvas(document.querySelector('#preview'), {
            logging: false,
            backgroundColor: null,
            scale: imageSize / clientImageWidth,
            width: imageSize / (imageSize / clientImageWidth),
            height: imageSize / (imageSize / clientImageHeight),
          })
          .then((canvas) => {
            if (imageSizeLength === 1) {
              data.push({
                size: this.size[index],
                src: canvas.toDataURL()
              })
              resolve()
            } else {
              data.push({
                size: this.size[index],
                src: canvas.toDataURL()
              })
              index++
              if (index === imageSizeLength) {
                resolve()
              }
            }
          })
        }
      })
      .then(() => {
        this.sendImageData(data)
      })
    },
    sendImageData (data) {
      axios.post('/download', {
        data: data
      })
      .then((res) => {
        this.donwloadZipFile(res.data.link)
      })
      .catch((err) => {
        console.log(err)
      })
    },
    donwloadZipFile (link) {
      const download = document.createElement('a')

      download.href = link
      download.click()

      this.download = false
    }
  },
  mounted: function () {
    document.body.setAttribute('data-loaded', true)
  }
})
