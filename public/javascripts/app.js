(function() {

  var app = new Vue({
    el: '#app',
    data: {
      text: 'x',
      type: 'round',
      textColor: 'black',
      backgroundColor: 'white'
    },
    methods: {
      getImageData () {
        var _this = this
        html2canvas(document.querySelector("#preview"), {
          backgroundColor: null
        }).then(function (canvas) {
          _this.sendImageData(canvas.toDataURL())
        })
      },
      sendImageData (data) {
        axios.post('/download', {
          data: data
        })
        .then(function (res) {
          console.log(res)
        })
        .catch(function (err) {
          console.log(err)
        })
      }
    }
  })

})();
