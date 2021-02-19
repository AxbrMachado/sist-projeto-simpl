import Vue from "vue";
import Router from "vue-router";
import BasePages from "./base-pages";

//Pages
const TheContainer = () => import("@/components/containers/TheContainer");
const Dashboard = () => import("@/views/Dashboard");
const Parametro = () => import("@/views/Parametro/Parametro");
const Usuario = () => import("@/views/Usuario/Usuario");
const NovoUsuario = () => import("@/views/Usuario/NovoUsuario");
const TrocarSenha = () => import("@/views/Usuario/TrocarSenha");

Vue.use(Router);

export default new Router({
  mode: "hash",
  linkActiveClass: "open active",
  scrollBehavior: () => ({
    y: 0
  }),
  routes: [
    {
      path: "/",
      name: "Home",
      component: TheContainer,
      redirect: "/dashboard",
      meta: {
        requiresAuth: true
      },
      children: [
        {
          path: "dashboard",
          name: "Dashboard",
          component: Dashboard,
          meta: {
            requiresAuth: true
          }
        },
        //Cadastro de usuário
        {
          path: "usuario",
          name: "Usuário",
          // component: Usuario,
          meta: {
            requiresAuth: true,
            perfil: [1, 2]
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "",
              component: Usuario,
              meta: {
                requiresAuth: true,
                perfil: [1, 2]
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoUsuario,
              meta: {
                requiresAuth: true,
                perfil: [1, 2]
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoUsuario,
              meta: {
                requiresAuth: true,
                perfil: [1, 2]
              }
            },
            {
              path: "trocar-senha",
              name: "Trocar Senha",
              component: TrocarSenha,
              meta: {
                requiresAuth: true,
                perfil: [1, 2, 3]
              }
            }
          ]
        },

        // Parametros do sistema
        {
          path: "parametro",
          name: "Parametro",
          component: Parametro,
          meta: {
            requiresAuth: true,
            perfil: [1, 2]
          }
        }
      ]
    },
    BasePages
  ]
});
