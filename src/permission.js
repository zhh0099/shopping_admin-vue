import router from "./router";
import store from "./store";
import { Message } from "element-ui";
import NProgress from "nprogress"; // 进度条
import "nprogress/nprogress.css"; // 进图条style
import { getToken } from "@/utils/auth";
import getPageTitle from "@/utils/get-page-title";

NProgress.configure({ showSpinner: false }); // 进度条配置

// 白名单
const whiteList = ["/login"];

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

router.afterEach(() => {
  // finish progress bar
  NProgress.done();
});
