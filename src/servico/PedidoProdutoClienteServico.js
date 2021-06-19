import Vue from "vue";
class PedidoProdutoClienteServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "pedidopessoaproduto/obter/" + id,
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, pedidoPessoaId) {
    return Vue.prototype.$http({
      url:
        "/pedidopessoaproduto/obter-grid-produto?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&pedidoPessoaId=" +
        pedidoPessoaId,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "pedidopessoaproduto/remover/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "pedidopessoaproduto/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "pedidopessoaproduto/editar",
      data: viewModel,
      method: "PUT"
    });
  }
}

export default new PedidoProdutoClienteServico();
