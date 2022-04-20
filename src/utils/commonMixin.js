import { isIOS } from 'mobile-device-detect'
// import FileSaver from 'file-saver'
export default {
  methods: {
    customErrorHandler: function (error) {
      console.log(error)
      if (!error.response) {
        console.error('Error: Network Error')
      } else {
        const messageList = []
        switch (error.response.status) {
          case 400:
            if (Array.isArray(error.response.data) && error.response.data.length > 1) {
              error.response.data.forEach(function (message) {
                messageList.push(message)
              })
            } else {
              messageList.push(error.response.data)
            }
            this.$notify.error({
              title: '错误',
              dangerouslyUseHTMLString: true,
              duration: 0,
              message: messageList.join('<br/>')
            })
            break
          default:
            console.error(error)
        }
      }
    },
    base64ToArrayBuffer (base64) {
      const binaryString = window.atob(base64)
      const len = binaryString.length
      const bytes = new Uint8Array(len)
      for (let i = 0; i < len; i++) {
        bytes[i] = binaryString.charCodeAt(i)
      }
      return bytes.buffer
    },
    createDownload: function (blob, fileName) {
      if (isIOS) {
        const reader = new FileReader()
        // reader.fileName = fileName
        reader.onload = function () {
          window.location.href = reader.result
        }
        reader.readAsDataURL(blob)
      } else if (typeof window.navigator.msSaveBlob !== 'undefined') {
        window.navigator.msSaveBlob(blob, fileName)
      } else {
        const link = document.createElement('a')
        link.id = 'download-link'
        link.href = window.URL.createObjectURL(blob)
        link.download = fileName
        link.click()
        // document.getElementsByTagName.removeChild(link)
      }
    }
  }
  /*
  filters: {
  }
  */
}
