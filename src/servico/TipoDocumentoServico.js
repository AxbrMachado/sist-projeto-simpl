import Vue from "vue";
class TipoDocumentoServico {
  ObterSelect() {
    return Vue.prototype.$http({
      url: "tipodocumento/obter-select",
      method: "GET"
    });
  }

  Obter(id) {
    return Vue.prototype.$http({
      url: "tipodocumento/obter/" + id,
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, descricao) {
    return Vue.prototype.$http({
      url:
        "/tipodocumento/obter-grid?pagina=" +
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
      url: "tipodocumento/remover/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "tipodocumento/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "tipodocumento/editar",
      data: viewModel,
      method: "PUT"
    });
  }
}

export default new TipoDocumentoServico();
