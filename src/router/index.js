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
const RateioPedido = () => import("@/views/RateioPedido/RateioPedido");
const DetalheRateioPedido = () =>
  import("@/views/RateioPedido/DetalheRateioPedido");
const PedidoVenda = () => import("@/views/PedidoVenda/PedidoVenda");
const NovoPedidoVenda = () => import("@/views/PedidoVenda/NovoPedidoVenda");
const Pessoa = () => import("@/views/Pessoa/Pessoa");
const NovaPessoa = () => import("@/views/Pessoa/NovaPessoa");
const Produto = () => import("@/views/Produto/Produto");
const NovoProduto = () => import("@/views/Produto/NovoProduto");
const TipoDocumento = () => import("@/views/TipoDocumento/TipoDocumento");
const NovoTipoDocumento = () =>
  import("@/views/TipoDocumento/NovoTipoDocumento");
const TipoEndereco = () => import("@/views/TipoEndereco/TipoEndereco");
const NovoTipoEndereco = () => import("@/views/TipoEndereco/NovoTipoEndereco");
const TipoProduto = () => import("@/views/TipoProduto/TipoProduto");
const NovoTipoProduto = () => import("@/views/TipoProduto/NovoTipoProduto");
const TipoCliente = () => import("@/views/TipoCliente/TipoCliente");
const NovoTipoCliente = () => import("@/views/TipoCliente/NovoTipoCliente");
const FuncaoFuncionario = () =>
  import("@/views/FuncaoFuncionario/FuncaoFuncionario");
const NovaFuncaoFuncionario = () =>
  import("@/views/FuncaoFuncionario/NovaFuncaoFuncionario");
const TipoUnidadeMedida = () =>
  import("@/views/TipoUnidadeMedida/TipoUnidadeMedida");
const NovoTipoUnidadeMedida = () =>
  import("@/views/TipoUnidadeMedida/NovoTipoUnidadeMedida");
const UnidadeMedida = () => import("@/views/UnidadeMedida/UnidadeMedida");
const NovoUnidadeMedida = () =>
  import("@/views/UnidadeMedida/NovoUnidadeMedida");
const TipoInstituicao = () => import("@/views/TipoInstituicao/TipoInstituicao");
const NovoTipoInstituicao = () =>
  import("@/views/TipoInstituicao/NovoTipoInstituicao");
const Licitacao = () => import("@/views/Licitacao/Licitacao");
const NovaLicitacao = () => import("@/views/Licitacao/NovaLicitacao");
const Fornecedor = () => import("@/views/Fornecedor/Fornecedor");
const NovoFornecedor = () => import("@/views/Fornecedor/NovoFornecedor");

const NovoGrupoUsuario = () => import("@/views/GrupoUsuario/NovoGrupoUsuario");
const GrupoUsuario = () => import("@/views/GrupoUsuario/GrupoUsuario");
const Permissao = () => import("@/views/GrupoUsuario/Permissao");
const SemPermissao = () => import("@/views/GrupoUsuario/SemPermissao");

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
            requiresAuth: true,
            permission: ""
          }
        },

        {
          path: "sem-permissao",
          name: "SemPermissao",
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
              component: SemPermissao,
              meta: {
                requiresAuth: true
              }
            }
          ]
        },

        //Cadastro de usuário
        {
          path: "usuario",
          name: "Usuário",
          // component: Usuario,
          meta: {
            requiresAuth: true,
            permission: "Usuario.Visualizar"
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
                permission: "Usuario.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoUsuario,
              meta: {
                requiresAuth: true,
                permission: "Usuario.Adicionar"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoUsuario,
              meta: {
                requiresAuth: true,
                permission: "Usuario.Adicionar"
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
            requiresAuth: true,
            permission: "Licitacao.Visualizar"
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
                requiresAuth: true,
                permission: "Licitacao.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovaLicitacao,
              meta: {
                requiresAuth: true,
                permission: "Licitacao.Adicionar"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovaLicitacao,
              meta: {
                requiresAuth: true,
                permission: "Licitacao.Adicionar"
              }
            }
          ]
        },

        //Cadastro de contrato
        {
          path: "contrato",
          name: "Contrato",
          meta: {
            requiresAuth: true,
            permission: "Contrato.Visualizar"
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
                requiresAuth: true,
                permission: "Contrato.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoContrato,
              meta: {
                requiresAuth: true,
                permission: "Contrato.Adicionar"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoContrato,
              meta: {
                requiresAuth: true,
                permission: "Contrato.Adicionar"
              }
            }
          ]
        },

        //Cadastro de Dap
        {
          path: "dap",
          name: "Dap",
          meta: {
            requiresAuth: true,
            permission: "Dap.Visualizar"
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
                requiresAuth: true,
                permission: "Dap.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovaDap,
              meta: {
                requiresAuth: true,
                permission: "Dap.Adicionar"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovaDap,
              meta: {
                requiresAuth: true,
                permission: "Dap.Adicionar"
              }
            }
          ]
        },

        //rateio pedido venda
        {
          path: "rateio-pedido",
          name: "RateioPedido",
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
              component: RateioPedido,
              meta: {
                requiresAuth: true
              }
            },
            {
              path: "editar/:id",
              name: "editar",
              component: DetalheRateioPedido,
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
            requiresAuth: true,
            permission: "PedidoVenda.Visualizar"
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
                requiresAuth: true,
                permission: "PedidoVenda.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "editar",
              component: NovoPedidoVenda,
              meta: {
                requiresAuth: true,
                permission: "PedidoVenda.Adicionar"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoPedidoVenda,
              meta: {
                requiresAuth: true,
                permission: "PedidoVenda.Adicionar"
              }
            }
          ]
        },

        //Cadastro de pessoa
        {
          path: "pessoa",
          name: "Pessoa",
          meta: {
            requiresAuth: true,
            permission: "Pessoa.Visualizar"
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
                requiresAuth: true,
                permission: "Pessoa.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovaPessoa,
              meta: {
                requiresAuth: true,
                permission: "Pessoa.Adicionar"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovaPessoa,
              meta: {
                requiresAuth: true,
                permission: "Pessoa.Adicionar"
              }
            }
          ]
        },

        //Cadastro de fornecedor
        {
          path: "fornecedor",
          name: "Fornecedor",
          meta: {
            requiresAuth: true,
            permission: "Fornececdor.Visualizar"
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "",
              component: Fornecedor,
              meta: {
                requiresAuth: true,
                permission: "Fornececdor.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoFornecedor,
              meta: {
                requiresAuth: true,
                permission: "Fornececdor.Adicionar"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoFornecedor,
              meta: {
                requiresAuth: true,
                permission: "Fornececdor.Adicionar"
              }
            }
          ]
        },

        //Cadastro de produto
        {
          path: "produto",
          name: "Produto",
          meta: {
            requiresAuth: true,
            permission: "Produto.Visualizar"
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
                requiresAuth: true,
                permission: "Produto.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoProduto,
              meta: {
                requiresAuth: true,
                permission: "Produto.Adicionar"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoProduto,
              meta: {
                requiresAuth: true,
                permission: "Produto.Adicionar"
              }
            }
          ]
        },

        //Cadastro de tipo documento
        {
          path: "tipo-documento",
          name: "TipoDocumento",
          meta: {
            requiresAuth: true,
            permission: "TipoDocumento.Visualizar"
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
                requiresAuth: true,
                permission: "TipoDocumento.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoTipoDocumento,
              meta: {
                requiresAuth: true,
                permission: "TipoDocumento.Adicionar"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoTipoDocumento,
              meta: {
                requiresAuth: true,
                permission: "TipoDocumento.Adicionar"
              }
            }
          ]
        },

        // //Cadastro de tipo endereco
        {
          path: "tipo-endereco",
          name: "TipoEndereco",
          meta: {
            requiresAuth: true,
            permission: "TipoEndereco.Visualizar"
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
                requiresAuth: true,
                permission: "TipoEndereco.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoTipoEndereco,
              meta: {
                requiresAuth: true,
                permission: "TipoEndereco.Adicionar"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoTipoEndereco,
              meta: {
                requiresAuth: true,
                permission: "TipoEndereco.Adicionar"
              }
            }
          ]
        },

        //Cadastro de tipo Instituicao
        {
          path: "tipo-instituicao",
          name: "TipoInstituicao",
          meta: {
            requiresAuth: true,
            permission: "TipoInstituicao.Visualizar"
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
                requiresAuth: true,
                permission: "TipoInstituicao.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoTipoInstituicao,
              meta: {
                requiresAuth: true,
                permission: "TipoInstituicao.Adicionar"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoTipoInstituicao,
              meta: {
                requiresAuth: true,
                permission: "TipoInstituicao.Adicionar"
              }
            }
          ]
        },

        //Cadastro de tipo produto
        {
          path: "tipo-produto",
          name: "TipoProduto",
          meta: {
            requiresAuth: true,
            permission: "TipoProduto.Visualizar"
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
                requiresAuth: true,
                permission: "TipoProduto.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoTipoProduto,
              meta: {
                requiresAuth: true,
                permission: "TipoProduto.Adicionar"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoTipoProduto,
              meta: {
                requiresAuth: true,
                permission: "TipoProduto.Adicionar"
              }
            }
          ]
        },

        //Cadastro de tipo cliente
        {
          path: "tipo-cliente",
          name: "TipoCliente",
          meta: {
            requiresAuth: true,
            permission: "TipoCliente.Visualizar"
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },

          children: [
            {
              path: "",
              component: TipoCliente,
              meta: {
                requiresAuth: true,
                permission: "TipoCliente.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoTipoCliente,
              meta: {
                requiresAuth: true,
                permission: "TipoCliente.Adicionar"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoTipoCliente,
              meta: {
                requiresAuth: true,
                permission: "TipoCliente.Adicionar"
              }
            }
          ]
        },

        //Cadastro de tipo unidade medida
        {
          path: "tipo-unidade-medida",
          name: "TipoUnidadeMedida",
          meta: {
            requiresAuth: true,
            permission: "TipoUnidadeMedida.Visualizar"
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "",
              component: TipoUnidadeMedida,
              meta: {
                requiresAuth: true,
                permission: "TipoUnidadeMedida.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoTipoUnidadeMedida,
              meta: {
                requiresAuth: true,
                permission: "TipoUnidadeMedida.Adicionar"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoTipoUnidadeMedida,
              meta: {
                requiresAuth: true,
                permission: "TipoUnidadeMedida.Adicionar"
              }
            }
          ]
        },

        //Cadastro de unidade medida
        {
          path: "unidade-medida",
          name: "UnidadeMedida",
          meta: {
            requiresAuth: true,
            permission: "UnidadeMedida.Visualizar"
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "",
              component: UnidadeMedida,
              meta: {
                requiresAuth: true,
                permission: "UnidadeMedida.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoUnidadeMedida,
              meta: {
                requiresAuth: true,
                permission: "UnidadeMedida.Adicionar"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoUnidadeMedida,
              meta: {
                requiresAuth: true,
                permission: "UnidadeMedida.Adicionar"
              }
            }
          ]
        },

        //Cadastro grupo de usuário
        {
          path: "grupo-usuario",
          name: "GrupoUsuario",
          meta: {
            requiresAuth: true,
            permission: "GrupoUsuario.Visualizar"
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },
          children: [
            {
              path: "",
              component: GrupoUsuario,
              meta: {
                requiresAuth: true,
                permission: "GrupoUsuario.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovoGrupoUsuario,
              meta: {
                requiresAuth: true,
                permission: "GrupoUsuario.Adicionar"
              }
            },
            {
              path: "permissao/:id",
              name: "Permissão",
              component: Permissao,
              meta: {
                requiresAuth: true,
                permission: "GrupoUsuario.Permissao"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovoGrupoUsuario,
              meta: {
                requiresAuth: true,
                permission: "GrupoUsuario.Adicionar"
              }
            }
          ]
        },

        //Cadastro de funcao funcionario
        {
          path: "funcao-funcionario",
          name: "FuncaoFuncionario",
          meta: {
            requiresAuth: true,
            permission: "FuncaoFuncionario.Visualizar"
          },
          component: {
            render(c) {
              return c("router-view");
            }
          },

          children: [
            {
              path: "",
              component: FuncaoFuncionario,
              meta: {
                requiresAuth: true,
                permission: "FuncaoFuncionario.Visualizar"
              }
            },
            {
              path: "editar/:id",
              name: "Editar",
              component: NovaFuncaoFuncionario,
              meta: {
                requiresAuth: true,
                permission: "FuncaoFuncionario.Adicionar"
              }
            },
            {
              path: "novo",
              name: "Novo",
              component: NovaFuncaoFuncionario,
              meta: {
                requiresAuth: true,
                permission: "FuncaoFuncionario.Adicionar"
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
            permission: "Parametro.Visualizar"
          }
        }
      ]
    },
    BasePages
  ]
});
