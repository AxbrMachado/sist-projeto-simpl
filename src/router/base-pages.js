// Views - Pages
const Page404 = () => import("@/views/pages/Page404");
const Page500 = () => import("@/views/pages/Page500");
const Login = () => import("@/views/pages/Login");
const ForgotPassword = () => import("@/views/pages/ForgotPassword");

const BasePages = {
  path: "/",
  redirect: "/pages/404",
  name: "Pages",
  component: {
    render(c) {
      return c("router-view");
    }
  },
  children: [
    {
      path: "404",
      name: "Page404",
      component: Page404
    },
    {
      path: "500",
      name: "Page500",
      component: Page500
    },
    {
      path: "login",
      name: "Login",
      component: Login,
      meta: {
        requiresAuth: false,
        guest: true
      },
      children: [
        {
          path: ":id",
          component: Login
        }
      ]
    },
    {
      path: "esqueci-senha",
      name: "Esqueci minha senha",
      component: ForgotPassword,
      meta: {
        requiresAuth: false,
        guest: true
      },
      children: [
        {
          path: ":id",
          name: "Trocar senha",
          component: ForgotPassword,
          meta: {
            requiresAuth: false,
            guest: true
          }
        }
      ]
    }
  ]
};

export default BasePages;
