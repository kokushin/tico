(function() {

  var app = new Vue({
    el: '#app',
    data: {
      download: false,
      text: 'T',
      type: 'square',
      textColor: 'white',
      backgroundColor: 'black',
      size: [
        16,
        32,
        96,
        114,
        144,
        180,
        500
      ]
    },
    methods: {
      getImageData () {
        var _this = this
        var pushCount = 0
        var data = []
        var imageSizeLength = _this.size.length
        var imageSize = 0
        var defaltImageSize = document.getElementById('preview').clientWidth

        this.download = true

        new Promise(function (resolve, reject) {
          for (var i = 0; i < imageSizeLength; i++) {
            imageSize = _this.size[i]

            html2canvas(document.querySelector('#preview'), {
              backgroundColor: null,
              logging: false,
              scale: imageSize / defaltImageSize,
              width: imageSize / (imageSize / defaltImageSize),
              height: imageSize / (imageSize / defaltImageSize),
            })
            .then(function (canvas) {
              if (imageSizeLength === 1) {
                data.push({
                  size: _this.size[pushCount],
                  src: canvas.toDataURL()
                })
                resolve()
              } else {
                data.push({
                  size: _this.size[pushCount],
                  src: canvas.toDataURL()
                })
                pushCount++
                if (pushCount === imageSizeLength) {
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
