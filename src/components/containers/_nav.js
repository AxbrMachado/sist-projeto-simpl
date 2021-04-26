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
    to: "/tipoDocumento",
    icon: "cil-description"
  },

  TipoProduto: {
    _name: "CSidebarNavItem",
    name: "Tipo Produto",
    to: "/tipoProduto",
    icon: "cil-description"
  },

  TipoUnidadeMedida: {
    _name: "CSidebarNavItem",
    name: "Tipo Unidade Medida",
    to: "/tipoUnidadeMedida",
    icon: "cil-description"
  },

  UnidadeMedida: {
    _name: "CSidebarNavItem",
    name: "Conversão Unidade Medida",
    to: "/unidadeMedida",
    icon: "cil-description"
  },

  TipoInstituicao: {
    _name: "CSidebarNavItem",
    name: "Tipo Instituição",
    to: "/tipoInstituicao",
    icon: "cil-description"
  },
  TipoEndereco: {
    _name: "CSidebarNavItem",
    name: "Tipo Endereço",
    to: "/tipoEndereco",
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
  }
};

export default Menu;
