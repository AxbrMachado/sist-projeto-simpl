import Vue from "vue";
class PessoaPedidoProduto {
  ObterGrid(pagina, itensPorPagina, pedidoId, pessoaId, produto) {
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
}

export default new PessoaPedidoProduto();
