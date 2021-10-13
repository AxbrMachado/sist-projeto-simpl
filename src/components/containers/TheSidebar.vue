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
      <h2 class="c-sidebar-brand-full">{{ NomeEmpresa(true) }}</h2>
      <h2 class="c-sidebar-brand-minimized">{{ NomeEmpresa(false) }}</h2>
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
    NomeEmpresa(full) {
      let nome = "";
      if (
        this.$store.getters.getAutenticacao &&
        this.$store.getters.getAutenticacao.contaSelecionada &&
        this.$store.getters.getAutenticacao.contaSelecionada.apelido
      )
        nome = this.$store.getters.getAutenticacao.contaSelecionada.apelido;
      else nome = "";

      return full ? nome : nome.charAt(0);
    },
    MontarMenu() {
      let menu = [];
      menu.push({
        _name: "CSidebarNav",
        _children: []
      });
      // console.log(Nav);
      let permissao = this.$store.getters.getAutenticacao.permissoes;
      // console.log(permissao);

      menu[0]._children.push(Nav.Dashboard);
      menu[0]._children.push(Nav.Principal);

      if (
        Nav.Licitacao.permission &&
        permissao.filter((x) => x.startsWith(Nav.Licitacao.permission)).length >
          0
      )
        menu[0]._children.push(Nav.Licitacao);

      if (
        Nav.Contrato.permission &&
        permissao.filter((x) => x.startsWith(Nav.Contrato.permission)).length >
          0
      )
        menu[0]._children.push(Nav.Contrato);

      if (
        Nav.Pessoa.permission &&
        permissao.filter((x) => x.startsWith(Nav.Pessoa.permission)).length > 0
      )
        menu[0]._children.push(Nav.Pessoa);

      if (
        Nav.Fornecedor.permission &&
        permissao.filter((x) => x.startsWith(Nav.Fornecedor.permission))
          .length > 0
      )
        menu[0]._children.push(Nav.Fornecedor);

      if (
        Nav.Dap.permission &&
        permissao.filter((x) => x.startsWith(Nav.Dap.permission)).length > 0
      )
        menu[0]._children.push(Nav.Dap);

      if (
        Nav.Produto.permission &&
        permissao.filter((x) => x.startsWith(Nav.Produto.permission)).length > 0
      )
        menu[0]._children.push(Nav.Produto);

      menu[0]._children.push(Nav.Venda);

      if (
        Nav.PedidoVenda.permission &&
        permissao.filter((x) => x.startsWith(Nav.PedidoVenda.permission))
          .length > 0
      )
        menu[0]._children.push(Nav.PedidoVenda);

      if (
        Nav.RateioPedido.permission &&
        permissao.filter((x) => x.startsWith(Nav.RateioPedido.permission))
          .length > 0
      )
        menu[0]._children.push(Nav.RateioPedido);

      if (
        Nav.ConferenciaRateio.permission &&
        permissao.filter((x) => x.startsWith(Nav.ConferenciaRateio.permission))
          .length > 0
      )
        menu[0]._children.push(Nav.ConferenciaRateio);

      menu[0]._children.push(Nav.Configuracao);

      if (
        Nav.Parametro.permission &&
        permissao.filter((x) => x.startsWith(Nav.Parametro.permission)).length >
          0
      )
        menu[0]._children.push(Nav.Parametro);

      if (
        Nav.Usuarios.permission &&
        permissao.filter((x) => x.startsWith(Nav.Usuarios.permission)).length >
          0
      )
        menu[0]._children.push(Nav.Usuarios);

      if (
        Nav.GrupoUsuario.permission &&
        permissao.filter((x) => x.startsWith(Nav.GrupoUsuario.permission))
          .length > 0
      )
        menu[0]._children.push(Nav.GrupoUsuario);

      if (
        Nav.TipoDocumento.permission &&
        permissao.filter((x) => x.startsWith(Nav.TipoDocumento.permission))
          .length > 0
      )
        menu[0]._children.push(Nav.TipoDocumento);

      if (
        Nav.TipoEndereco.permission &&
        permissao.filter((x) => x.startsWith(Nav.TipoEndereco.permission))
          .length > 0
      )
        menu[0]._children.push(Nav.TipoEndereco);

      if (
        Nav.TipoProduto.permission &&
        permissao.filter((x) => x.startsWith(Nav.TipoProduto.permission))
          .length > 0
      )
        menu[0]._children.push(Nav.TipoProduto);

      if (
        Nav.TipoCliente.permission &&
        permissao.filter((x) => x.startsWith(Nav.TipoCliente.permission))
          .length > 0
      )
        menu[0]._children.push(Nav.TipoCliente);

      if (
        Nav.TipoUnidadeMedida.permission &&
        permissao.filter((x) => x.startsWith(Nav.TipoUnidadeMedida.permission))
          .length > 0
      )
        menu[0]._children.push(Nav.TipoUnidadeMedida);

      if (
        Nav.TipoInstituicao.permission &&
        permissao.filter((x) => x.startsWith(Nav.TipoInstituicao.permission))
          .length > 0
      )
        menu[0]._children.push(Nav.TipoInstituicao);

      if (
        Nav.UnidadeMedida.permission &&
        permissao.filter((x) => x.startsWith(Nav.UnidadeMedida.permission))
          .length > 0
      )
        menu[0]._children.push(Nav.UnidadeMedida);

      if (
        Nav.FuncaoFuncionario.permission &&
        permissao.filter((x) => x.startsWith(Nav.FuncaoFuncionario.permission))
          .length > 0
      )
        menu[0]._children.push(Nav.FuncaoFuncionario);

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
