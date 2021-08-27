import Vue from "vue";
class PedidoProdutoFornecedorServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "pedidoprodutofornecedor/obter/" + id,
      method: "GET"
    });
  }

  ObterGridProduto(
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

  ObterGridFornecedor(
    pagina,
    itensPorPagina,
    pedidoId,
    fornecedorId,
    produto,
    produtosNoFornecedor
  ) {
    return Vue.prototype.$http({
      url:
        "/pedidoprodutofornecedor/obter-grid-produto-fornecedor?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&produto=" +
        produto +
        "&produtosNoFornecedor=" +
        produtosNoFornecedor +
        "&pedidoId=" +
        pedidoId +
        "&fornecedorId=" +
        fornecedorId,
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

  EditarQuantidade(id, quantidade) {
    return Vue.prototype.$http({
      url:
        "/pedidoprodutofornecedor/editar-quantidade?id=" +
        id +
        "&quantidadeAtendida=" +
        quantidade,
      method: "GET"
    });
  }

  EditarFornecedorProduto(
    id,
    quantidade,
    fornecedorDesignadoId,
    quantidadeDesignada
  ) {
    return Vue.prototype.$http({
      url:
        "/pedidoprodutofornecedor/editar-quantidade?id=" +
        id +
        "&quantidadeAtendida=" +
        quantidade +
        (!fornecedorDesignadoId
          ? ""
          : "&fornecedorDesignadoId=" + fornecedorDesignadoId) +
        "&quantidadeDesignada=" +
        quantidadeDesignada,
      method: "GET"
    });
  }

  RemoverProdutoFornecedorPedido(id) {
    return Vue.prototype.$http({
      url:
        "/pedidoprodutofornecedor/remover-produto-fornecedor-pedido?Id=" + id,
      method: "GET"
    });
  }

  RemoverFornecedorDesignado(id) {
    return Vue.prototype.$http({
      url: "/pedidoprodutofornecedor/remover-fornecedor-designado/" + id,
      method: "GET"
    });
  }

  LoadMensagemProdutosFornecedorPedido(fornecedorId, pedidoId) {
    return Vue.prototype.$http({
      url:
        "/pedidoprodutofornecedor/load-mensagem-produtos-fornecedor-pedido/" +
        fornecedorId +
        "/" +
        pedidoId,
      method: "GET"
    }).data;
  }
}

export default new PedidoProdutoFornecedorServico();
