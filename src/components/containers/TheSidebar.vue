<template>
  <CSidebar fixed :minimize="minimize" colorScheme="dark" :show.sync="show">
    <b-link class="c-sidebar-brand d-md-down-none router-link-active" to="/">
      <!-- <img
        class="sidebar-image-logo c-sidebar-brand-full c-icon c-icon-custom-size"
        src="img/logo.png"
        alt="Cooperar Logo"
      />
      <img
        class="sidebar-image-small-logo c-sidebar-brand-minimized c-icon c-icon-custom-size"
        src="/img/5_quadrado.png"
        alt="Cooperar Logo"
      /> -->
      <h2>Cooperar</h2>
    </b-link>
    <CRenderFunction flat :content-to-render="MontarMenu()" />
    <CSidebarMinimizer
      class="d-md-down-none"
      @click.native="minimize = !minimize"
    />
  </CSidebar>
</template>

<script>
import Nav from "./_nav";
import TipoPerfil from "../../enums/TipoPerfil";

export default {
  name: "TheSidebar",
  data() {
    return {
      minimize: false,
      show: "responsive"
    };
  },
  mounted() {
    this.$root.$on("toggle-sidebar", () => {
      const sidebarOpened = this.show === true || this.show === "responsive";
      this.show = sidebarOpened ? false : "responsive";
    });
    this.$root.$on("toggle-sidebar-mobile", () => {
      const sidebarClosed = this.show === "responsive" || this.show === false;
      this.show = sidebarClosed ? true : "responsive";
    });
    this.MontarMenu();
  },
  methods: {
    MontarMenu() {
      let perfil = this.$store.getters.getAutenticacao.perfil;
      let menu = [];
      menu.push({
        _name: "CSidebarNav",
        _children: []
      });
      switch (perfil) {
        //Quando houver necessidade do pefil Sistema ter um menu diferente do Administrador, favor realizar a separação
        case TipoPerfil.Sistema:
        case TipoPerfil.Administrador:
          menu[0]._children.push(Nav.Dashboard);
          // menu[0]._children.push(Nav.Principal);
          // menu[0]._children.push(Nav.Conversas);
          // menu[0]._children.push(Nav.Email);
          // menu[0]._children.push(Nav.Atendimentos);
          // menu[0]._children.push(Nav.Orcamentos);
          // menu[0]._children.push(Nav.Relatorio);
          // menu[0]._children.push(Nav.Pessoas);
          // menu[0]._children.push(Nav.Etapas);
          // menu[0]._children.push(Nav.Midias);
          // menu[0]._children.push(Nav.Escapo);
          menu[0]._children.push(Nav.Configuracao);
          menu[0]._children.push(Nav.Usuarios);
          // menu[0]._children.push(Nav.Telefones);
          // menu[0]._children.push(Nav.ConfiguracaoEmail);
          // menu[0]._children.push(Nav.ConfiguracaoPagamento);
          // menu[0]._children.push(Nav.MensagemPadrao);
          // menu[0]._children.push(Nav.Parametro);
          break;
        case TipoPerfil.Comum:
          menu[0]._children.push(Nav.Dashboard);
          // menu[0]._children.push(Nav.Principal);
          // menu[0]._children.push(Nav.Conversas);
          // menu[0]._children.push(Nav.Email);
          // menu[0]._children.push(Nav.Atendimentos);
          // menu[0]._children.push(Nav.Orcamentos);
          // menu[0]._children.push(Nav.Pessoas);
          // menu[0]._children.push(Nav.Midias);
          break;
        default:
          break;
      }

      return menu;
    }
  }
};
</script>

<style lang="scss">
.sidebar-image-logo {
  max-width: 85%;
  max-height: 85%;
  margin: 0.5rem 1rem 0.5rem 1rem;
}

.sidebar-image-small-logo {
  max-width: 85%;
  max-height: 85%;
  margin: 0.5rem 1rem 0.5rem 1rem;
}
</style>
