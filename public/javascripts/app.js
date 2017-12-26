(function() {

  var app = new Vue({
    el: '#app',
    data: {
      download: false,
      text: 'Tico',
      type: 'square',
      textColor: 'white',
      backgroundColor: 'black',
      scale: {
        width: 160,
        height: 160,
        fontSize: 48
      },
      size: [
        16,
        32,
        96,
        114,
        144,
        180,
        240,
        500
      ]
    },
    methods: {
      getImageData () {
        var _this = this
        var data = []
        var index = 0
        var imageSize = 0
        var imageSizeLength = _this.size.length
        var clientImageWidth = document.getElementById('preview').clientWidth
        var clientImageHeight = document.getElementById('preview').clientHeight

        this.download = true

        new Promise(function (resolve, reject) {
          for (var i = 0; i < imageSizeLength; i++) {
            imageSize = _this.size[i]

            html2canvas(document.querySelector('#preview'), {
              backgroundColor: null,
              logging: false,
              scale: imageSize / clientImageWidth,
              width: imageSize / (imageSize / clientImageWidth),
              height: imageSize / (imageSize / clientImageHeight),
            })
            .then(function (canvas) {
              if (imageSizeLength === 1) {
                data.push({
                  size: _this.size[index],
                  src: canvas.toDataURL()
                })
                resolve()
              } else {
                data.push({
                  size: _this.size[index],
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
        .then(function () {
          _this.sendImageData(data)
        })
      },
      sendImageData (data) {
        var _this = this

        axios.post('/download', {
          data: data
        })
        .then(function (res) {
          _this.donwloadZipFile(res.data.link)
        })
        .catch(function (err) {
          console.log(err)
        })
      },
      donwloadZipFile (link) {
        var download = document.createElement('a')

        download.href = link
        download.click()

        this.download = false
      }
    },
    mounted: function () {
      document.body.setAttribute('data-loaded', true)
    }
  })

})();
