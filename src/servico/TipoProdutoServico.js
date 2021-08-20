import Vue from "vue";
class TipoProdutoServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "tipoproduto/obter/" + id,
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, descricao) {
    return Vue.prototype.$http({
      url:
        "/tipoproduto/obter-grid?pagina=" +
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
      url: "tipoproduto/remover/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "tipoproduto/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "tipoproduto/editar",
      data: viewModel,
      method: "PUT"
    });
  }
}

export default new TipoProdutoServico();
