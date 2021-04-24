import Vue from "vue";
class DocumentoServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "unidadeMedida/obter/" + id,
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, tipoUnidadeMedidaId) {
    return Vue.prototype.$http({
      url:
        "/unidadeMedida/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&tipoUnidadeMedidaId=" +
        tipoUnidadeMedidaId,
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

export default new DocumentoServico();
