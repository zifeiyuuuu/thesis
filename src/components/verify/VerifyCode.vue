<template>
  <table>
    <tr>
      <td>
        <div class="verify-input-area">
          <el-input v-model="inputValue" placeholder="验证码" class="varify-input-code"/>
        </div>
      </td>
      <td>
        <div class="verify-code"
             @click="setCode"
             :style="{
             'width': width,
             'height': height,
             'line-height': height,
             'font-size': fontSize,
             'background-color': containerBackgroundColor,
             'color': containerColor}">
          <!-- 显示字符串 -->
          <span :style="code.style" v-for="(code, index) in codeShow" :key="index">
            {{code.char || code}}
          </span>
        </div>
      </td>
      <td>
        <div class="verify-change-area" @click="setCode">
          <font-awesome-icon :icon="['fas', 'sync']" fixed-width />
          <!--<a class="verify-change-code">換一張</a>-->
        </div>
      </td>
    </tr>
  </table>
</template>
<script type="text/babel">
/* *
 * Code
 * @description 常规的图片文字识别或者数字计算
 * */
import { codeChars, codeColor1, codeColor2 } from './lib/util'

export default {
  name: 'VerifyCode',
  props: {
    type: {
      type: String,
      default: '1'
    }, // 位数，仅在type=2时生效
    figure: {
      type: Number,
      default: 100
    }, // 算法，支持加减乘，0为随机，仅在type=2时生效
    arith: {
      type: Number,
      default: 0
    },
    width: {
      type: String,
      default: '150px'
    },
    height: {
      type: String,
      default: '45px'
      // default: '60px'
    },
    fontSize: {
      type: String,
      default: '20px'
    },
    codeLength: {
      type: Number,
      default: 6
    }
  },
  data () {
    return {
      isEnd: false,
      // 输入的值
      inputValue: '',
      // 颜色
      containerBackgroundColor: '#fff',
      containerColor: '#fff',

      codeChose: '', // 应该输入的code
      codeShow: [] // 显示用的
    }
  },
  methods: {
    init () {
      this.setCode()
      this.$parent.$emit('ready', this)
    },

    /**
     * setCode
     * @description 设置验证码
     * */
    setCode () {
      if (this.isEnd === false) {
        this.containerBackgroundColor = codeColor1[Math.floor(Math.random() * 3)]
        this.containerColor = codeColor2[Math.floor(Math.random() * 5)]

        this.inputValue = ''

        this.codeShow = []
        this.codeChose = ''

        if (this.type === '1') {
          // 普通验证码 图片选择
          for (var i = 0; i < this.codeLength; i++) {
            var charNum = Math.floor(Math.random() * 52)
            // var tmpStyle = (charNum % 2 === 0) ? 'font-style:italic;margin-right: 10px' : 'font-weight:bolder'
            var tmpStyle = (charNum % 2 === 0) ? 'font-style:italic;' : 'font-weight:bolder'
            tmpStyle += (Math.floor(Math.random() * 2) === 1) ? 'font-weight:bolder' : ''

            this.codeChose += codeChars[charNum]
            this.codeShow.push({
              style: tmpStyle,
              char: codeChars[charNum]
            })
          }
        } else if (this.type === '2') {
          // 算法验证码
          var num1 = Math.floor(Math.random() * this.figure)
          var num2 = Math.floor(Math.random() * this.figure)

          let codeShow = ''

          if (this.arith === 0) {
            var tmparith = Math.floor(Math.random() * 3)
          }

          switch (tmparith) {
            case 1 :
              this.codeChose = parseInt(num1) + parseInt(num2)
              codeShow = num1 + ' + ' + num2 + ' = ?'
              break
            case 2 :
              if (parseInt(num1) < parseInt(num2)) {
                var tmpnum = num1
                num1 = num2
                num2 = tmpnum
              }
              this.codeChose = parseInt(num1) - parseInt(num2)
              codeShow = num1 + ' - ' + num2 + ' = ?'
              break
            default :
              this.codeChose = parseInt(num1) * parseInt(num2)
              codeShow = num1 + ' × ' + num2 + ' = ?'
              break
          }

          this.codeShow = codeShow.split('') // 转数组
        }
      }
    },
    /**
     * checkCode
     * @description 验证验证码
     * */
    checkCode () {
      let inputValue
      let codeChose
      if (this.type === '1') {
        // 普通驗證碼
        inputValue = this.inputValue.toUpperCase()
        codeChose = this.codeChose.toUpperCase()
      } else {
        inputValue = this.inputValue
        codeChose = this.codeChose
      }

      // console.log(inputValue)
      // console.log(codeChose)
      // console.log(inputValue === codeChose)

      if (inputValue === codeChose) {
        this.isEnd = true
        this.$parent.$emit('success', this)
      } else {
        this.$parent.$emit('error', this)
        this.setCode()
      }
    },
    /**
     * refresh
     * @description 刷新
     * */
    refresh () {
      this.isEnd = false
      this.inputValue = ''
      this.setCode()
    }
  },
  watch: {
    // type变化则全面刷新
    type: {
      immediate: true,
      handler () {
        this.init()
      }
    }
  },
  mounted () {
    // 禁止拖拽
    this.$el.onselectstart = function () {
      return false
    }
  },
  i18n: {
    messages: {
      'en-US': {},
      'zh-CN': {}
    }
  }
}
</script>
