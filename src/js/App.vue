<template>
  <div id="app">
    <link :href="'https://fonts.googleapis.com/css?family=' + font" rel="stylesheet">
    <header class="header">
      <h1>tico</h1>
    </header>
    <div class="main">
      <div class="main_input">
        <div class="option">
          <div class="option_box">
            <label class="option_title" for="text">Text:</label>
            <input type="text" v-model="text" id="text">
          </div>
          <div class="option_box">
            <label class="option_title" for="scale_fontSize">Text size:</label>
            <input type="number" id="scale_fontSize" v-model="scale.fontSize">
          </div>
          <div class="option_box">
            <label class="option_title" for="scale_width">Width:</label>
            <input type="number" id="scale_width" v-model="scale.width">
          </div>
          <div class="option_box">
            <label class="option_title" for="scale_height">Height:</label>
            <input type="number" id="scale_height" v-model="scale.height">
          </div>
          <div class="option_box">
            <label class="option_title" for="font">Font:</label>
            <input type="text" v-model="font" id="font">
          </div>
          <div class="option_box">
            <span class="option_title">Type:</span>
            <label for="type_square">
              <input type="radio" id="type_square" value="square" v-model="type"> square
            </label>
            <label for="type_round">
              <input type="radio" id="type_round" value="round" v-model="type"> round
            </label>
          </div>
          <div class="option_box">
            <span class="option_title">Text color:</span>
            <label for="text_color_black">
              <input type="radio" id="text_color_black" value="black" v-model="textColor"> black
            </label>
            <label for="text_color_white">
              <input type="radio" id="text_color_white" value="white" v-model="textColor"> white
            </label>
          </div>
          <div class="option_box">
            <span class="option_title">Background color:</span>
            <label for="background_color_black">
              <input type="radio" id="background_color_black" value="black" v-model="backgroundColor"> black
            </label>
            <label for="background_color_white">
              <input type="radio" id="background_color_white" value="white" v-model="backgroundColor"> white
            </label>
          </div>
        </div>
        <button class="main_input_button" v-if="!download" @click="getImageData">Donwload</button>
        <button class="main_input_button" v-else disabled>Generating...</button>
      </div>

      <div class="main_output">
        <p class="main_output_title">Preview: </p>
        <div class="main_output_canvas">
          <div class="preview" :data-type="type" :data-text-color="textColor" :data-background-color="backgroundColor" id="preview">
            <div class="preview_background" :style="{ width: scale.width + 'px', height: scale.height + 'px' }" id="preview-background">
              <div class="preview_text" :style="{ fontSize: scale.fontSize + 'px', fontFamily: font }" id="preview-text">{{ text }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
  import html2canvas from 'html2canvas'
  import axios from 'axios'

  export default {
    name: 'app',
    data () {
      return {
        download: false,
        font: 'Roboto',
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
      }
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
    }
  }
</script>
