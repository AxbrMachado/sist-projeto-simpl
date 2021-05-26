//#### IR NO ARQUIVO TheSiderbar.vue  E CONFIGURAR O MENU PARA CADA PERFIL ####

const Menu = {
  Dashboard: {
    _name: "CSidebarNavItem",
    name: "Dashboard",
    to: "/dashboard",
    icon: "cil-speedometer",
    badge: {
      color: "info-dark"
    }
  },
  Principal: {
    _name: "CSidebarNavTitle",
    _children: ["Principal"]
  },
  PedidoVenda: {
    _name: "CSidebarNavItem",
    name: "Pedido Venda",
    to: "/pedido-venda",
    icon: "cil-list"
  },
  Contrato: {
    _name: "CSidebarNavItem",
    name: "Contrato",
    to: "/contrato",
    icon: "cil-layers"
  },
  Pessoa: {
    _name: "CSidebarNavItem",
    name: "Pessoa",
    to: "/pessoa",
    icon: "cil-people"
  },
  Fornecedor: {
    _name: "CSidebarNavItem",
    name: "Fornecedor",
    to: "/fornecedor",
    icon: "cil-people"
  },
  Produto: {
    _name: "CSidebarNavItem",
    name: "Produto",
    to: "/produto",
    icon: "cil-apple"
  },
  Dap: {
    _name: "CSidebarNavItem",
    name: "DAP",
    to: "/dap",
    icon: "cil-task"
  },
  Configuracao: {
    _name: "CSidebarNavTitle",
    _children: ["Configurações"]
  },
  Usuarios: {
    _name: "CSidebarNavItem",
    name: "Usuários",
    to: "/usuario",
    icon: "cil-face"
  },

  TipoDocumento: {
    _name: "CSidebarNavItem",
    name: "Tipo Documento",
    to: "/tipo-documento",
    icon: "cil-description"
  },

  TipoProduto: {
    _name: "CSidebarNavItem",
    name: "Tipo Produto",
    to: "/tipo-produto",
    icon: "cil-description"
  },

  TipoUnidadeMedida: {
    _name: "CSidebarNavItem",
    name: "Tipo Unidade Medida",
    to: "/tipo-unidade-medida",
    icon: "cil-description"
  },

  UnidadeMedida: {
    _name: "CSidebarNavItem",
    name: "Conversão Unidade Medida",
    to: "/unidade-medida",
    icon: "cil-description"
  },

  TipoInstituicao: {
    _name: "CSidebarNavItem",
    name: "Tipo Instituição",
    to: "/tipo-instituicao",
    icon: "cil-description"
  },
  TipoEndereco: {
    _name: "CSidebarNavItem",
    name: "Tipo Endereço",
    to: "/tipo-endereco",
    icon: "cil-description"
  },

  Licitacao: {
    _name: "CSidebarNavItem",
    name: "Licitação",
    to: "/licitacao",
    icon: "cil-description"
  },

  Parametro: {
    _name: "CSidebarNavItem",
    name: "Parâmetro",
    route: "/parametro",
    to: "/parametro",
    icon: "cil-library"
  },

  GrupoUsuario: {
    _name: "CSidebarNavItem",
    name: "Grupo Usuário",
    to: "/grupo-usuario",
    icon: "cil-library"
  }
};

export default Menu;
