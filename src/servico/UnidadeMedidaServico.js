import Vue from "vue";
class UnidadeMedidaServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "unidadeMedida/obter/" + id,
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, descricao) {
    return Vue.prototype.$http({
      url:
        "/unidadeMedida/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&descricao=" +
        descricao,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "unidadeMedida/remover/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "unidadeMedida/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "unidadeMedida/editar",
      data: viewModel,
      method: "PUT"
    });
  }
}

export default new UnidadeMedidaServico();
