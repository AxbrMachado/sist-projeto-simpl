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
  RateioPedido: {
    _name: "CSidebarNavItem",
    name: "Rateio Pedido Venda",
    to: "/rateio-pedido",
    icon: "cil-chart-pie",
    permission: "RateioPedido"
  },
  PedidoVenda: {
    _name: "CSidebarNavItem",
    name: "Pedido Venda",
    to: "/pedidovenda",
    icon: "cil-list",
    permission: "PedidoVenda"
  },
  Contrato: {
    _name: "CSidebarNavItem",
    name: "Contrato",
    to: "/contrato",
    icon: "cil-layers",
    permission: "Contrato"
  },
  Pessoa: {
    _name: "CSidebarNavItem",
    name: "Pessoa",
    to: "/pessoa",
    icon: "cil-people",
    permission: "Pessoa"
  },
  Fornecedor: {
    _name: "CSidebarNavItem",
    name: "Fornecedor",
    to: "/fornecedor",
    icon: "cil-people",
    permission: "Fornecedor"
  },
  Produto: {
    _name: "CSidebarNavItem",
    name: "Produto",
    to: "/produto",
    icon: "cil-apple",
    permission: "Produto"
  },
  Dap: {
    _name: "CSidebarNavItem",
    name: "DAP",
    to: "/dap",
    icon: "cil-task",
    permission: "Dap"
  },
  Configuracao: {
    _name: "CSidebarNavTitle",
    _children: ["Configurações"]
  },
  Usuarios: {
    _name: "CSidebarNavItem",
    name: "Usuários",
    to: "/usuario",
    icon: "cil-face",
    permission: "Usuario"
  },

  TipoDocumento: {
    _name: "CSidebarNavItem",
    name: "Tipo Documento",
    to: "/tipo-documento",
    icon: "cil-description",
    permission: "TipoDocumento"
  },

  TipoProduto: {
    _name: "CSidebarNavItem",
    name: "Tipo Produto",
    to: "/tipo-produto",
    icon: "cil-description",
    permission: "TipoProduto"
  },

  TipoCliente: {
    _name: "CSidebarNavItem",
    name: "Tipo Cliente",
    to: "/tipo-cliente",
    icon: "cil-description",
    permission: "TipoCliente"
  },

  TipoUnidadeMedida: {
    _name: "CSidebarNavItem",
    name: "Tipo Unidade Medida",
    to: "/tipo-unidade-medida",
    icon: "cil-description",
    permission: "TipoUnimedadeMedida"
  },

  UnidadeMedida: {
    _name: "CSidebarNavItem",
    name: "Conversão Unidade Medida",
    to: "/unidadeMedida",
    icon: "cil-description",
    permission: "UnidadeMedida"
  },

  TipoInstituicao: {
    _name: "CSidebarNavItem",
    name: "Tipo Instituição",
    to: "/tipo-instituicao",
    icon: "cil-description",
    permission: "TipoInstituicao"
  },
  TipoEndereco: {
    _name: "CSidebarNavItem",
    name: "Tipo Endereço",
    to: "/tipo-endereco",
    icon: "cil-location-pin",
    permission: "TipoEndereco"
  },

  Licitacao: {
    _name: "CSidebarNavItem",
    name: "Licitação",
    to: "/licitacao",
    icon: "cil-description",
    permission: "Licitacao"
  },

  Parametro: {
    _name: "CSidebarNavItem",
    name: "Parâmetros",
    route: "/parametro",
    to: "/parametro",
    icon: "cil-star",
    permission: "Parametro"
  },

  GrupoUsuario: {
    _name: "CSidebarNavItem",
    name: "Grupo Usuário",
    to: "/grupo-usuario",
    icon: "cil-lock-locked",
    permission: "GrupoUsuario"
  }
};

export default Menu;
