import Vue from "vue";
import BootstrapVue from "bootstrap-vue";
import CoreuiVue from "@coreui/vue";
import { iconsSet as icons } from "./assets/icons/icons.js";
import Axios from "axios";
import Notifications from "vue-notification";
import VSelect from "vue-select";
import "./directives/outsideClickHandler";
import router from "./router";
import store from "./store/index";
import App from "./App.vue";

var axiosInstance = Axios.create({
  baseURL: store.getters.baseURL
});

// declare a response interceptor
axiosInstance.interceptors.response.use(
  (response) => {
    return response;
  },
  (error) => {
    if (error && error.response && error.response.status === 401) {
      localStorage.removeItem("user-token");
      window.location.reload();
    }
    return Promise.reject(error);
  }
);

Vue.prototype.$http = axiosInstance;
const token = JSON.parse(localStorage.getItem("user-token"));

if (token) {
  Vue.prototype.$http.defaults.headers.common["Authorization"] =
    "bearer " + token.tokenDeAcesso;
}

Vue.use(CoreuiVue);
Vue.use(BootstrapVue);

Vue.use(Notifications);
Vue.component("v-select", VSelect);

Vue.config.productionTip = false;

router.beforeEach((to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    if (!store.getters.isLoggedIn) {
      next("/login");
      return;
    }
    if (
      to.meta.perfil &&
      to.meta.perfil.length > 0 &&
      to.meta.perfil.filter((x) => x === store.getters.getAutenticacao.perfil)
        .length <= 0
    ) {
      next("/403");
    }
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
  } else {
    next();
  }
});

new Vue({
  router,
  store,
  icons,
  render: (h) => h(App)
}).$mount("#app");
