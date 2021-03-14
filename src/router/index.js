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
const Contrato = () => import("@/views/Contrato/Contrato");
const NovoContrato = () => import("@/views/Contrato/NovoContrato");
const Dap = () => import("@/views/Dap/Dap");
const NovaDap = () => import("@/views/Dap/NovaDap");
const PedidoVenda = () => import("@/views/PedidoVenda/PedidoVenda");
const NovoPedidoVenda = () => import("@/views/PedidoVenda/NovoPedidoVenda");
const Pessoa = () => import("@/views/Pessoa/Pessoa");
const NovaPessoa = () => import("@/views/Pessoa/NovaPessoa");
const Produto = () => import("@/views/Produto/Produto");
const NovoProduto = () => import("@/views/Produto/NovoProduto");
const TipoDocumento = () => import("@/views/TipoDocumento/TipoDocumento");
const NovoTipoDocumento =() => import("@/views/TipoDocumento/NovoTipoDocumento");
const TipoEndereco = () => import("@/views/TipoEndereco/TipoEndereco");
const NovoTipoEndereco = () => import("@/views/TipoEndereco/NovoTipoEndereco");
const TipoProduto = () => import("@/views/TipoProduto/TipoProduto");
const NovoTipoProduto = () => import("@/views/TipoProduto/NovoTipoProduto");
const TipoInstituicao = () => import("@/views/TipoInstituicao/TipoInstituicao");
const NovoTipoInstituicao = () => import("@/views/TipoInstituicao/NovoTipoInstituicao");
const Licitacao = () => import("@/views/Licitacao/Licitacao");
const NovaLicitacao = () => import("@/views/Licitacao/NovaLicitacao");

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
            requiresAuth: true
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
                requiresAuth: true
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoUsuario,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoUsuario,
              meta: {
                requiresAuth: true
              }
            },

            {
              path: "trocar-senha",
              name: "Trocar Senha",
              component: TrocarSenha,
              meta: {
                requiresAuth: true
              }
            }
          ]
        },

         //Cadastro de licitacao
         {
          path: "licitacao",
          name: "Licitacao",
          meta: {
            requiresAuth: true
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "",
              component: Licitacao,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovaLicitacao,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovaLicitacao,
              meta: {
                requiresAuth: true
              }
            }
          ]
        },

        //Cadastro de contrato
        {
          path: "contrato",
          name: "Contrato",
          meta: {
            requiresAuth: true
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "",
              component: Contrato,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoContrato,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoContrato,
              meta: {
                requiresAuth: true
              }
            }
          ]
        },

        //Cadastro de Dap
        {
          path: "dap",
          name: "Dap",
          meta: {
            requiresAuth: true
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "",
              component: Dap,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovaDap,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovaDap,
              meta: {
                requiresAuth: true
              }
            }
          ]
        },

        //Cadastro de pedido venda
        {
          path: "pedido-venda",
          name: "PedidoVenda",
          meta: {
            requiresAuth: true
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "",
              component: PedidoVenda,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoPedidoVenda,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoPedidoVenda,
              meta: {
                requiresAuth: true
              }
            }
          ]
        },

        //Cadastro de pessoa
        {
          path: "pessoa",
          name: "Pessoa",
          meta: {
            requiresAuth: true
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "",
              component: Pessoa,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovaPessoa,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovaPessoa,
              meta: {
                requiresAuth: true
              }
            }
          ]
        },

        //Cadastro de pedido venda
        {
          path: "produto",
          name: "Produto",
          meta: {
            requiresAuth: true
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "",
              component: Produto,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoProduto,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoProduto,
              meta: {
                requiresAuth: true
              }
            }
          ]
        },

        //Cadastro de tipo documento
        {
          path: "tipoDocumento",
          name: "TipoDocumento",
          meta: {
            requiresAuth: true
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "",
              component: TipoDocumento,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoTipoDocumento,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoTipoDocumento,
              meta: {
                requiresAuth: true
              }
            }
          ]
        },

        // //Cadastro de tipo endereco
        {
          path: "tipoEndereco",
          name: "TipoEndereco",
          meta: {
            requiresAuth: true
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "",
              component: TipoEndereco,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoTipoEndereco,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoTipoEndereco,
              meta: {
                requiresAuth: true
              }
            }
          ]
        },

        //Cadastro de tipo Instituicao
        {
          path: "tipoInstituicao",
          name: "TipoInstituicao",
          meta: {
            requiresAuth: true
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "",
              component: TipoInstituicao,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoTipoInstituicao,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoTipoInstituicao,
              meta: {
                requiresAuth: true
              }
            }
          ]
        },

        //Cadastro de tipo produto
        {
          path: "tipoProduto",
          name: "TipoProduto",
          meta: {
            requiresAuth: true
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "",
              component: TipoProduto,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoTipoProduto,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoTipoProduto,
              meta: {
                requiresAuth: true
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
            requiresAuth: true
          }
        }
      ]
    },
    BasePages
  ]
});
