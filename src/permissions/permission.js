import router from "../router/index";
import store from "../store";

router.beforeEach(async (to, from, next) => {
  if (to.matched.some((record) => record.meta.requiresAuth)) {
    // const hasToken = store.getters.getAtutenticacao.
    if (!store.getters.getAutenticacao.administrador && to.meta.admin) {
      next("/404");
    }
    if (store.getters.isLoggedIn) {
      next();
      return;
    }
    next("/login");
  } else {
    next();
  }
});
