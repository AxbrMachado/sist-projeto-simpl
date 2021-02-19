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
