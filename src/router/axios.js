import axios from 'axios'


const HttpServer = {}

HttpServer.install = function (Vue) {
  axios.defaults.baseURL = "http://localhost:8888/api/private/v1/"

  // 请求拦截器
  axios.interceptors.request.use(function (config) {

    // 所有请求发起之后,进行筛选,请求标识是不是login
    // 如果标识是login,不要头部->请求继续发起
    // 当请求标识不是login,先设置头部,再发送请求
    if (config.url !== "login") {
      const AUTH_TOKEN = localStorage.getItem("token");
      // axios.defaults.headers.common["Authorization"] = AUTH_TOKEN;
      config.headers["Authorization"] = AUTH_TOKEN;

    }

    return config;
  }, function (error) {
    // 对请求错误做些什么
    return Promise.reject(error);
  });



  Vue.prototype.$http = axios
}

// MyPlugin.install = function (Vue, options) {
//   // 1. 添加全局方法或属性,比如说过滤器之类的
//   Vue.myGlobalMethod = function () {
//     // 逻辑...
//   }

//   // 2. 添加全局资源 ，比如说写一个全局的指令
//   Vue.directive('my-directive', {
//     bind(el, binding, vnode, oldVnode) {
//       // 逻辑...
//     }

//   })

//   // 3. 注入组件 比如封装的面包屑导航
//   Vue.mixin({
//     created: function () {
//         // 逻辑...
//       }

//   })

//   // 4. 添加实例方法
//   Vue.prototype.$myMethod = function (methodOptions) {
//     // 逻辑...
//   }
// }
export default HttpServer


//在vue中，只有vue功能下的插件才能直接使用vue.use来进行使用
/*
1.在VUE.js中的官网里面，有一个开发插件选项，按照里面的代码进行添加
2.在Vue提供的这个函数里面进行里面，中上所述第四个方法正好符合我们的要求

*/
