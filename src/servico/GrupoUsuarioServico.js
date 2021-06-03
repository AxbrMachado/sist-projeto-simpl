import Vue from "vue";
class GrupoUsuarioServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "grupousuario/obter/" + id,
      method: "GET"
    });
  }

  ObterPermissao(id) {
    return Vue.prototype.$http({
      url: "grupousuario/obter-permissoes/" + id,
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina) {
    return Vue.prototype.$http({
      url:
        "/grupousuario/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "grupousuario/remover/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "grupousuario/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "grupousuario/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  Permissao(viewModel) {
    return Vue.prototype.$http({
      url: "grupousuario/permissao",
      data: viewModel,
      method: "PUT"
    });
  }
}

export default new GrupoUsuarioServico();
