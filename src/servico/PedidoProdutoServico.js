import Vue from "vue";
class PedidoProdutoServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "pedidoproduto/obter/" + id,
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, pedidoId) {
    return Vue.prototype.$http({
      url:
        "/pedidoproduto/obter-grid-produto?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&pedidoId=" +
        pedidoId,
      method: "GET"
    });
  }

  ObterGridTotal(pagina, itensPorPagina, pedidoId, produto, produtosNoPedido) {
    return Vue.prototype.$http({
      url:
        "/pedidoproduto/obter-grid-produto-total?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&produto=" +
        produto +
        "&produtosNoPedido=" +
        produtosNoPedido +
        "&pedidoId=" +
        pedidoId,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "pedidoproduto/remover/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "pedidoproduto/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "pedidoproduto/editar",
      data: viewModel,
      method: "PUT"
    });
  }
}

export default new PedidoProdutoServico();
