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

  ObterGridTotal(
    pagina,
    itensPorPagina,
    pedidoId,
    rateioId,
    conferenciaId,
    produto,
    produtosNoPedido
  ) {
    return Vue.prototype.$http({
      url:
        "/pedidoproduto/obter-grid-produto-total?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&produto=" +
        produto +
        (produtosNoPedido ? "&produtosNoPedido=" + produtosNoPedido : "") +
        "&pedidoId=" +
        pedidoId +
        "&rateioId=" +
        rateioId +
        "&conferenciaId=" +
        conferenciaId,
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

  ObterEquivalenciaProdutoDesignado(
    produtoOriginal,
    quantidadeDesignada,
    produtoDesignado,
    contrato
  ) {
    return Vue.prototype.$http({
      url:
        "/pedidoproduto/obter-equivalencia-produto-designado?ProdutoId=" +
        produtoOriginal +
        "&QuantidadeProdutoDesignado=" +
        quantidadeDesignada +
        "&ProdutoDesignadoId=" +
        produtoDesignado +
        "&ContratoId=" +
        contrato,
      method: "GET"
    });
  }

  DefinirProdutoDesignado(
    pedidoProdutoId,
    quantidadeDesignada,
    quantidadeDesignadaEquivalente,
    produtoDesignado,
    valorQuantidadeDesignada
  ) {
    return Vue.prototype.$http({
      url:
        "/pedidoproduto/definir-produto-designado?id=" +
        pedidoProdutoId +
        "&QuantidadeProdutoDesignado=" +
        quantidadeDesignada +
        "&quantidadeProdutoDesignadoEquivalente=" +
        quantidadeDesignadaEquivalente +
        "&ProdutoDesignadoId=" +
        produtoDesignado +
        "&ValorProdutoDesignado=" +
        valorQuantidadeDesignada,
      method: "GET"
    });
  }

  RemoverProdutoDesignado(pedidoProdutoId) {
    return Vue.prototype.$http({
      url: "/pedidoproduto/remover-produto-designado?id=" + pedidoProdutoId,
      method: "GET"
    });
  }
}

export default new PedidoProdutoServico();
