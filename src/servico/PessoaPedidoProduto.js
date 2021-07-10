import Vue from "vue";
class PessoaPedidoProduto {
  ObterGridProdutoPedidoCliente(
    pagina,
    itensPorPagina,
    pedidoId,
    pessoaId,
    produto
  ) {
    return Vue.prototype.$http({
      url:
        "/pedidopessoaproduto/obter-grid-produto-pedido-cliente?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&pedidoId=" +
        pedidoId +
        "&pessoaId=" +
        pessoaId +
        "&produto=" +
        produto,
      method: "GET"
    });
  }

  ObterGridProdutoPedidoContrato(pagina, itensPorPagina, pedidoId, produto) {
    return Vue.prototype.$http({
      url:
        "/pedidopessoaproduto/obter-grid-produto-pedido-contrato?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&pedidoId=" +
        pedidoId +
        "&produto=" +
        produto,
      method: "GET"
    });
  }

  ObterGridProdutoPedidoFornecedor(
    pagina,
    itensPorPagina,
    pedidoId,
    fornecedorId,
    produto
  ) {
    return Vue.prototype.$http({
      url:
        "/pedidopessoaproduto/obter-grid-produto-pedido-fornecedor?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&pedidoId=" +
        pedidoId +
        "&fornecedorId=" +
        fornecedorId +
        "&produto=" +
        produto,
      method: "GET"
    });
  }
}

export default new PessoaPedidoProduto();
