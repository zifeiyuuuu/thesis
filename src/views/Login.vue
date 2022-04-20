<template>
  <el-container class="is-backgrounds">
    <el-main class="main-side">
      <el-row class="row-side" type="flex" justify="center" align="middle">
        <el-form :rules="rules" :model="loginForm" v-loading="progressing"
                 class="login-form" ref="loginForm" @submit.native.prevent>
          <table>
            <tr>
              <td rowspan="6" class="logo-td">
                <!--
                <img src="../../src/img/bizhi.jpg" width="60" height="60"/>
                -->
              </td>
              <td>
                <span class="title-span">论文排版系统系统</span>
              </td>
            </tr>
            <tr v-if="broswerInValid">
              <td class="dangerInfo">
                系统侦测到您使用非最佳化之浏览器，将会有不可预期之错误产生，
                建议您使用最新版Chrome、Safari、Edge浏览器
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item prop="username" class="fix-form-item">
                  <el-input
                    type="text"
                    v-model="loginForm.username"
                    minlength="8"
                    maxlength="20"
                    placeholder="Account"
                    class="login-input"
                    clearable>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item prop="password" class="fix-form-item">
                  <el-input
                    type="password"
                    v-model="loginForm.password"
                    minlength="8"
                    maxlength="20"
                    placeholder="Password"
                    class="login-input"
                    clearable>
                  </el-input>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td>
                <el-form-item class="fix-form-item">
                  <Verify ref="verify" @success="login('loginForm')" @error="verifyFail" :type="1"></Verify>
                </el-form-item>
              </td>
            </tr>
            <tr>
              <td class="align-right">
                <el-button class="login-button" @click="checkCode">登录</el-button>
                <el-button class="login-button" @click="showForgot">忘记密码</el-button>
              </td>
            </tr>
          </table>
        </el-form>
        <el-dialog
          width="400px"
          title="忘记密码"
          :visible.sync="forgotDialogVisible"
          :close-on-click-modal="false">
          <el-form label-width="auto" :rules="forgotRules"
                   :model="forgotForm" v-loading="progressing"
                   ref="forgotForm" v-if="!forgotValid" @submit.native.prevent>
            <el-form-item label="账号" prop="username" class="fix-form-item">
              <el-input v-model="forgotForm.username" placeholder="Account" class="login-input"></el-input>
            </el-form-item>
            <el-form-item label="姓名" prop="name" class="fix-form-item">
              <el-input v-model="forgotForm.name" placeholder="姓名" class="login-input"></el-input>
            </el-form-item>
            <el-form-item label="验证码">
              <Verify ref="verifyForgot" @success="forgotCheck('forgotForm')" @error="verifyFail" :type="1"></Verify>
            </el-form-item>
            <el-row type="flex" justify="end">
              <el-button class="login-button" @click="checkCodeForgot">申请变更密码</el-button>
            </el-row>
          </el-form>
          <el-form label-width="auto" :rules="changePwdRules"
                   :model="changePwdForm" v-loading="progressing"
                   ref="changePwdForm" v-if="forgotValid"
                   @submit.native.prevent>
            <el-form-item label="新密码" prop="password" class="fix-form-item">
              <el-input v-model="changePwdForm.password" type="password" placeholder="输入新密码" class="login-input"></el-input>
            </el-form-item>
            <el-form-item label="新密码确认" prop="passwordComfirm" class="fix-form-item">
              <el-input v-model="changePwdForm.passwordComfirm" type="password" placeholder="再次输入新密码" class="login-input"></el-input>
            </el-form-item>
            <el-row type="flex" justify="end">
              <el-button class="login-button" @click="changePwd('changePwdForm')">确认修改密码</el-button>
            </el-row>
          </el-form>
        </el-dialog>
      </el-row>
    </el-main>
  </el-container>
</template>

<script>
// import jwtDecode from 'jwt-decode'
import Verify from '../components/verify/Verify'
import { isChrome, isSafari, isEdge } from 'mobile-device-detect'
export default {
  name: 'Login',
  data () {
    return {
      progressing: false,
      loginForm: {
        username: '',
        password: ''
      },
      forgotValid: false,
      forgotForm: {
        username: '',
        companyName: '',
        name: ''
      },
      changePwdForm: {
        id: 0,
        password: '',
        passwordComfirm: ''
      },
      forgotDialogVisible: false
    }
  },
  computed: {
    broswerInValid: function () {
      return !isChrome && !isSafari && !isEdge
    },
    rules: function () {
      return {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' },
          { min: 8, max: 20, message: '账号长度介于8~20', trigger: 'blur' }
        ],
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 8, max: 20, message: '密码长度介于8~20', trigger: 'blur' }
        ]
      }
    },
    forgotRules: function () {
      return {
        username: [
          { required: true, message: '请输入账号', trigger: 'blur' }
        ],
        name: [
          { required: true, message: '请输入姓名', trigger: 'blur' }
        ]
      }
    },
    changePwdRules: function () {
      return {
        password: [
          { required: true, message: '请输入密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度介于6~20', trigger: 'blur' },
          { validator: this.onlyAllowLettersAndDigits, trigger: 'blur' }
        ],
        passwordComfirm: [
          { required: true, message: '请输入新密码', trigger: 'blur' },
          { min: 6, max: 20, message: '长度介于6~20', trigger: 'blur' },
          { validator: this.sameAsPassword, trigger: 'blur' }
        ]
      }
    }
  },
  methods: {
    verifyFail: function () {
      this.$notify({
        title: '错误',
        message: '验证码错误',
        type: 'error'
      })
    },
    checkCode: function () {
      this.$refs.verify.checkCode()
    },
    login: function (formName) {
      this.$router.push('/')
      /*
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.progressing = true
          this.$http.post('/auth', {
            username: this.loginForm.username,
            password: this.loginForm.password
          }).then(response => {
            this.progressing = false
            const authToken = response.data.auth_token
            this.$http.defaults.headers.common.Authorization = `Bearer ${authToken}`
            this.$store.dispatch('login', {
              authToken: authToken,
              user: jwtDecode(authToken)
            })
            this.$router.push('/')
          }).catch(error => {
            this.progressing = false
            this.customErrorHandler(error)
          })
        }
      })
       */
    },
    showForgot: function () {
      this.forgotDialogVisible = true
      this.forgotValid = false
      this.forgotForm.username = ''
      this.forgotForm.companyName = ''
      this.forgotForm.name = ''
      this.changePwdForm.id = ''
      this.changePwdForm.password = ''
      this.changePwdForm.passwordComfirm = ''
    },
    handleDialogClose: function () {
      this.forgotDialogVisible = false
      this.forgotValid = false
    },
    checkCodeForgot: function () {
      this.$refs.verifyForgot.checkCode()
    },
    forgotCheck: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.progressing = true
          this.$http.post('/auth/forgot-validate', {
            username: this.forgotForm.username,
            companyName: this.forgotForm.companyName,
            name: this.forgotForm.name
          }).then(response => {
            this.progressing = false
            this.changePwdForm.id = response.data.id
            this.forgotValid = true
          }).catch(error => {
            this.progressing = false
            this.customErrorHandler(error)
          })
        }
      })
    },
    changePwd: function (formName) {
      this.$refs[formName].validate((valid) => {
        if (valid) {
          this.$http.post('/auth/change-password', {
            id: this.changePwdForm.id,
            password: this.changePwdForm.password
          }).then(response => {
            this.progressing = false
            this.$notify({
              title: '成功',
              message: '密码已修改成功',
              type: 'success'
            })
            this.handleDialogClose()
          }).catch(error => {
            this.progressing = false
            this.customErrorHandler(error)
          })
        }
      })
    },
    onlyAllowLettersAndDigits (rule, value, callback) {
      const reg = /^[A-Za-z0-9]+$/
      if (reg.test(value)) {
        callback()
      } else {
        callback(new Error('只能包含英文及数字'))
      }
    },
    sameAsPassword (rule, value, callback) {
      if (value === this.changePwdForm.password) {
        callback()
      } else {
        callback(new Error('密码错误，请重新输入'))
      }
    }
  },
  components: {
    Verify
  }
}
</script>

<style scoped>
  .is-backgrounds{
    background-image: url("../../src/img/abc.jpg");
    background-size: cover;
  }
  .row-side {
    height: 100%;
  }
  /*.login-form {*/
  /*  font-size: 30px;*/
  /*  max-width: 400px;*/
  /*  font-family: 微軟正黑體;*/
  /*}*/
  .login-form {
    font-size: 30px;
    max-width: 450px;
    font-family: 微软正黑体;
    border-radius: 20px;
    padding: 30px 100px;
    background-color: #E6E6FA;
  }
  .logo-td {
    vertical-align: top;
  }
  /*.title-span {*/
  /*  color: #173d7a;*/
  /*  font-size: 40px;*/
  /*}*/
  .title-span {
    /*color: #222665;*/
    /*font-size: 36px;*/
    /*font-weight: bold;*/
    color: #173d7a;
    font-size: 36px;
  }
  .fix-form-item {
    max-width: 320px;
  }
  .fix-form-item .el-form-item__error,
  .fix-form-item .el-form-item__label {
    font-family: 微软正黑体;
    font-size: 16px;
  }
  .login-input {
    color: #bcbcbc;
    font-size: 30px;
  }
  .align-right {
    text-align: right;
  }
  .login-button {
    font-size: 18px; color: #666666;
  }
  .no-click-backdrop {
    pointer-events: none;
  }
  .dangerInfo {
    color: red;
    font-size: 14px;
  }
  /* Show in Large desktops and laptops */
  /* @media (min-width: 1200px) {
    .main-side {
      background-image: url('../assets/login/pic2.png');
      background-repeat: no-repeat;
      background-size: contain;
    }
    .row-side {
      background-image: url('../assets/login/pic1.png');
      background-repeat: no-repeat;
      background-position: calc(50% + 270px) calc(50% - 220px);
    }
  }
  */
  /*Hide in Other Small Devices */
  /* Landscape tablets and medium desktops */
  /* @media (min-width: 992px) and (max-width: 1199px) { */
  @media (min-width: 992px) {
    .main-side {
      /* background-image: url('../assets/login/pic2.png'), url('../assets/login/pic4.png'); */
      background-position: left top, right top;
      background-repeat: no-repeat;
      background-size: contain;
    }
    .row-side {
    /* background-image: url('../assets/login/pic1.png'); */
      background-repeat: no-repeat;
      background-position: calc(50% + 270px) calc(50% - 220px);
  }
}

/* Portrait tablets and small desktops */
  /*
  @media (min-width: 768px) and (max-width: 991px) {
    .main-side {
      background-image: none;
    }
    .row-side {
      background-image: none;
    }
  }
  */

  /* Landscape phones and portrait tablets */
  /* @media (max-width: 767px) { */
  @media (max-width: 991px) {
    .main-side {
      background-image: none;
    }
    .row-side {
      background-image: none;
    }
  }

  /* Portrait phones and smaller */
  /*
  @media (max-width: 480px) {
    .main-side {
      background-image: none;
    }
    .row-side {
      background-image: none;
    }
  }
   */
</style>
