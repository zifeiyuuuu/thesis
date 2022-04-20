<template>
  <router-view id="app"/>
</template>

<script>
import jwtDecode from 'jwt-decode'
export default {
  name: 'App',

  // created: function () {
  //   this.$http.defaults.baseURL = 'http://http://120.24.215.237:96/swagger/index.html'
  //   this.$http.defaults.baseURL = 'http://120.24.215.237:96/swagger/index.html'
  //   this.$http.defaults.baseURL = 'http://120.24.215.237:96'
  // }

  created: function () {
    // this.$http.defaults.baseURL = 'https://localhost:44395/api'
    // this.$http.defaults.baseURL = 'http://120.24.215.237:96/api'
    // this.$http.defaults.baseURL = 'http://120.24.215.237:96/swagger/index.html'
    // this.$http.defaults.baseURL = 'http://http://120.24.215.237:96/swagger/index.html'
    // this.$http.defaults.baseURL = 'http://http://120.24.215.237:96/api'
    // this.$http.defaults.baseURL = 'http://120.24.215.237:96/api'
    this.$http.defaults.baseURL = 'http://120.24.215.237:96'
    const authToken = sessionStorage.getItem('authToken')
    if (authToken) {
      let user
      try {
        user = jwtDecode(authToken)
      } catch (error) {
        this.$router.push('/login')
        return
      }
      this.$store.dispatch('login', {
        authToken: authToken,
        user: user
      })
      this.$http.defaults.headers.common.Authorization = `Bearer ${authToken}`
    }
    this.$http.interceptors.request.use(function (config) {
      return config
    }, function (error) {
      return Promise.reject(error)
    })
    this.$http.interceptors.response.use((response) => {
      return response
    }, (error) => {
      switch (error.response.status) {
        case 401:
          if (sessionStorage.getItem('authToken')) {
            this.$notify.warning({
              title: '验证失败',
              message: '密钥过期，请重新登录。'
            })
          } else {
            this.$notify.warning({
              title: '验证失败',
              message: '尚未登录，请先登录。'
            })
          }
          sessionStorage.removeItem('authToken')
          this.$router.push('/login')
          return
        default:
          return Promise.reject(error)
      }
    })
  }
}
</script>
<style>
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  color: #2c3e50;
}

html,body,#app{
  height: 100%;
}
</style>
