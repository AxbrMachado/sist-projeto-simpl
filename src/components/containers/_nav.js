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

  Parametro: {
    _name: "CSidebarNavItem",
    name: "Parâmetro",
    route: "/parametro",
    to: "/parametro",
    icon: "cil-library"
  }
};

export default Menu;
