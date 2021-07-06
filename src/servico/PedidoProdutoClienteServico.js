import Vue from "vue";
class PedidoProdutoClienteServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "pedidopessoaproduto/obter/" + id,
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, pedidoPessoaId, produto, produtosNoPedido) {
    return Vue.prototype.$http({
      url:
        "/pedidopessoaproduto/obter-grid-produto?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&produto=" +
        produto +
        "&produtosNoPedido=" +
        produtosNoPedido +
        "&pedidoPessoaId=" +
        pedidoPessoaId,
      method: "GET"
    });
  }

  ObterGridTotal(pagina, itensPorPagina, pedidoId, produto, produtosNoPedido) {
    return Vue.prototype.$http({
      url:
        "/pedidopessoaproduto/obter-grid-produto-total?pagina=" +
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
      url: "pedidopessoaproduto/remover/" + id,
      method: "DELETE"
    });
  }

  RemoverProdutoPedido(id) {
    return Vue.prototype.$http({
      url: "pedidopessoaproduto/removerprodutopedido/" + id,
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

  EditarQuantidade(id, QuantidadeSolicitada) {
    return Vue.prototype.$http({
      url:
        "/pedidopessoaproduto/editar-quantidade?id=" +
        id +
        "&QuantidadeSolicitada=" +
        QuantidadeSolicitada,
      method: "GET"
    });
  }
}

export default new PedidoProdutoClienteServico();
