import Vue from "vue";
class PedidoProdutoFornecedorServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "pedidoprodutofornecedor/obter/" + id,
      method: "GET"
    });
  }

  ObterGrid(
    pagina,
    itensPorPagina,
    pedidoProdutoId,
    fornecedor,
    fornecedorComProduto
  ) {
    return Vue.prototype.$http({
      url:
        "/pedidoprodutofornecedor/obter-grid-produto?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&fornecedor=" +
        fornecedor +
        "&fornecedorComProduto=" +
        fornecedorComProduto +
        "&pedidoProdutoId=" +
        pedidoProdutoId,
      method: "GET"
    });
  }

  ObterGridTotal(
    pagina,
    itensPorPagina,
    pedidoProdutoId,
    fornecedor,
    fornecedorComProduto
  ) {
    return Vue.prototype.$http({
      url:
        "/pedidoprodutofornecedor/obter-grid-produto-total?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&fornecedor=" +
        fornecedor +
        "&fornecedorComProduto=" +
        fornecedorComProduto +
        "&pedidoProdutoId=" +
        pedidoProdutoId,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "pedidoprodutofornecedor/remover/" + id,
      method: "DELETE"
    });
  }

  RemoverProdutoPedido(id) {
    return Vue.prototype.$http({
      url: "pedidoprodutofornecedor/removerprodutopedido/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "pedidoprodutofornecedor/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "pedidoprodutofornecedor/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  EditarQuantidade(viewModel) {
    return Vue.prototype.$http({
      url: "pedidoprodutofornecedor/editarquantidade",
      data: viewModel,
      method: "PUT"
    });
  }
}

export default new PedidoProdutoFornecedorServico();
