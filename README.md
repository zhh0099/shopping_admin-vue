# 此项目用于学习

# axios相关

## axios二次封装

[axios官方文档](https://www.kancloud.cn/yunye/axios/234845)

**为什么需要二次封装：**

* 项目中需要多次请求，二次封装使代码复用性更强，且方便管理。
* 可以在发请求前和服务器返回数据后进行一些业务逻辑判断。

**code:**

```js
import axios from "axios";
//1、创建axios实例
const requests = axios.create({
    //基础路径，requests发出的请求在端口号后面会跟改baseURl
    baseURL: process.env.VUE_APP_BASE_API,
    timeout: 5000,
})
//2、配置请求拦截器
requests.interceptors.request.use(config => {
    //config内主要是对请求头Header配置
    //比如添加token
    
    return config;
})
//3、配置相应拦截器
requests.interceptors.response.use((res) => {
    //成功的回调函数
    return  res.data;
},(error) => {
    //失败的回调函数
    console.log("响应失败"+error)
    return Promise.reject(new Error('fail'))
})
//4、对外暴露
export default requests;

```

## api接口统一管理

**将每个请求封装为一个函数，并暴露出去，发送请求时组件只需要调用相应函数即可。**

# 路由相关

### 路由传参，刷新页面后参数丢失

解决方法：

1. qury传参，这种方式传递的参数会在地址栏的 url 后面显示 `?id=?`，类似于 get 传参；**query 必须配合 path 来传参**。

2. params

   注：这种方式的传参，**路径用 name，路径用 name，路径用 name** , 用 path 会获取不到；如果在路由配置中没有添加 /:id 即 path: 'detail'，url 中不会显示 id，在详情页还是可以拿到参数 id，但刷新后参数丢失。

   - 以上这两种方式，传递的参数 id 会在 url 后面显示，如图：

   ![img](https://img2020.cnblogs.com/blog/1066214/202010/1066214-20201020152937088-1527431210.png)传递的参数会暴露在网址中。

   如果在路由中设置了params参数 /:id，但是在跳转的时候没有传递参数，会导致页面没有内容或跳转失败，可在后面加 ？代表这个参数是可选的，即 /:id?

## 路由懒加载

component: () => import('@/pages/Home')

什么是懒加载，就是动态加载，当使用到这个组件时，才会导入。

1. import(modulePath): 动态import引入模块, 被引入的模块会被单独打包
2. 组件配置的是一个函数, 函数中通过import动态加载模块并返回, 
   初始时函数不会执行, 第一次访问对应的路由才会执行, 也就是说只有一次请求对应的路由路径才会请求加载单独打包的js
   作用: 用于提高首屏的加载速度

## 编程式路由

### 多次执行相同的push问题

多次执行相同的push问题，控制台会出现警告
例如：使用this.$router.push({name:‘Search’,params:{keyword:"…"||undefined}})时，如果多次执行相同的push，控制台会出现警告。

##### 原因

push是一个promise，promise需要传递成功和失败两个参数，我们的push中没有传递。

##### 相关原理

1. 每个组件都有自己的```$route```属性，里面存储着独属自己的路由信息，也就是`$route`是每个`VueRouter`类的实例属性。

2. 整个应用只有一个`router`，它是`VueRouter`类的一个实例，可以通过组件的```$router```属性获取到。

3. `push、replace`是`VueRouter`类的原型对象(`VueRouter.prototype`)的方法。

   每次通过`this.$router.push()`，调用`push`都是顺着原型链，调用`VueRouter.prototype`中的`push`。

   `replace`亦是如此。

方法：

1. this.$router.push({name:‘Search’,params:{keyword:"…"||undefined}},()=>{},()=>{})后面两项分别代表执行成功和失败的回调函数。**这种写法治标不治本，将来在别的组件中push|replace,编程式导航还是会有类似错误**

2. 重写push和replace方法

   ```js
   //1、先把VueRouter原型对象的push，保存一份
   let originPush = VueRouter.prototype.push;
   let originReplace= VueRouter.prototype.replace;
   //2、重写push|replace
   //第一个参数：告诉原来的push，跳转的目标位置和传递了哪些参数
   //第二个参数：成功回调；第三个参数：失败回调
   VueRouter.prototype.push = function (location,resolve,reject){
       if(resolve && reject){
           originPush.call(this,location,resolve,reject)
       }else{
           originPush.call(this,location,() => {},() => {})
       }
   }
   
   VueRouter.prototype.replace = function (location,resolve,reject){
       if(resolve && reject){
           originReplace.call(this,location,resolve,reject)
       }else{
           originReplace.call(this,location,() => {},() => {})
       }
   }
   ```

# 登录业务相关

## 获取token并存储

**流程：**

1. password username作为数据，post给相关api；

2. api返回token信息，存储在store并且localStorage持久化

3. 跳转到home，home挂载结束调用`getUserInfo()`

4. 根据api文档，获取用户信息是get，且要携带token信息才能返回正确的用户信息。

   所以请求拦截，通过请求头携带token

   ```js
   if(store.state.user.token){
       config.headers.token = store.state.user.token;
     }
   ```

## 路由跳转的token权限验证

**coed：**`src\permission.js`

```js
router.beforeEach(async (to, from, next) => {
  // 加载进度条-开始
  NProgress.start();

  // 设置页面标题
  document.title = getPageTitle(to.meta.title);

  // 获取token，以便确认用户是否登录
  const hasToken = getToken();

  if (hasToken) {
    // 如果登录，不能再跳转到login路由
    if (to.path === "/login") {
      next({ path: "/" });
      NProgress.done();
    } else {
      // 如果登录，跳转到非login路由
      const hasGetUserInfo = store.getters.name;
      // 如果拥有用户信息，允许跳转
      if (hasGetUserInfo) {
        next();
      } else {
        // 登录，但没有用户信息
        try {
          // 在路由跳转之前获取用户信息后，允许跳转
          await store.dispatch("user/getInfo");
          next();
        } catch (error) {
          // token失效，删除本地token，并重新登录
          await store.dispatch("user/resetToken");
          Message.error(error || "Has Error");
          next(`/login?redirect=${to.path}`);
          NProgress.done();
        }
      }
    }
  } else {
    // 如果没有登录
    if (whiteList.indexOf(to.path) !== -1) {
      // 且跳转路由在白名单内，允许跳转
      next();
      // next({ ...to, replace: true })
    } else {
      // 跳转路由不在白名单内，重定向回login
      next(`/login`);
      // next(`/login`)
      NProgress.done();
    }
  }
});
```

## 动态路由实现权限

**code: **`src\store\modules\user.js`

```js
const mutations = {
  //最终计算出的异步路由
  SET_RESULTASYNCROUTES: (state, asyncRoutes) => {
    //vuex保存当前用户的异步路由，注意，一个用户
    //需要展示完成路由：常量、异步、任意路由
    state.resultAsyncRoutes = asyncRoutes;
    state.resultAllRoutes = constantRoutes.concat(
      state.resultAsyncRoutes,
      anyRoutes
    );
    //给路由器添加新的路由
    resetRouter();
    router.addRoutes(state.resultAllRoutes);
  },
}
const computedAsyncRoutes = (asyncRoutes, routes) => {
  //过滤出当前用户【超级管理|普通员工】需要展示的异步路由
  //console.log("登录用户拥有的权限:",routes);
  //console.log("异步路由权限:",asyncRoutes);
  return asyncRoutes.filter((item) => {
    if (routes.indexOf(item.name) != -1) {
      if (item.children && item.children.length) {
        //递归，还有2、3、4、5、6级路由
        item.children = computedAsyncRoutes(item.children, routes);
      }
      return true;
    }
  });
};
const actions = {
  .............
  .............
  .............
  //获取用户信息
  getInfo({ commit, state }) {
    return new Promise((resolve, reject) => {
      getInfo(state.token)
        .then((response) => {
          //获取用户信息:返回数据包含：
          //用户名name、用户头像avatar、
          //routes[返回的标志:不同的用户应该展示哪些菜单的标记]、
          //roles（用户角色信息）、buttons【按钮的信息：按钮权限用的标记】
          const { data } = response;
          console.log("用户信息：", data);
          //vuex存储用户全部的信息
          commit("SET_USERINFO", data);
          commit(
            "SET_RESULTASYNCROUTES",
            computedAsyncRoutes(asyncRoutes, data.routes)
          );
          if (!data) {
            return reject("Verification failed, please Login again.");
          }
          resolve(data);
        })
        .catch((error) => {
          reject(error);
        });
    });
  },
}
```

