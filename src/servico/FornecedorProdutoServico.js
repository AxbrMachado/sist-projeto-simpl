import Vue from "vue";
class FornecedorProdutoServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "fornecedorProduto/obter/" + id,
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, fornecedorId) {
    return Vue.prototype.$http({
      url:
        "/fornecedorProduto/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&fornecedorId=" +
        fornecedorId,
      method: "GET"
    });
  }

  ObterGridProduto(
    pagina,
    itensPorPagina,
    fornecedorId,
    produtosNoFornecedor,
    produto
  ) {
    return Vue.prototype.$http({
      url:
        "/fornecedorProduto/obter-grid-produto-fornecedor?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&produto=" +
        produto +
        "&produtosNoFornecedor=" +
        produtosNoFornecedor +
        "&fornecedorId=" +
        fornecedorId,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "fornecedorProduto/remover/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "fornecedorProduto/novo",
      data: viewModel,
      method: "POST"
    });
  }

  EditarProduto(
    fornecedorProdutoId,
    valorProduto,
    quantidadeProduto,
    fornecedorId
  ) {
    return Vue.prototype.$http({
      url:
        "/fornecedorProduto/editar-produto?id=" +
        fornecedorProdutoId +
        "&valor=" +
        valorProduto +
        "&quantidade=" +
        quantidadeProduto +
        "&fornecedorId=" +
        fornecedorId,
      method: "GET"
    });
  }

  Adicionar(fornecedorId, produtoId) {
    return Vue.prototype.$http({
      url:
        "/fornecedorProduto/adicionar?fornecedorId=" +
        fornecedorId +
        "&produtoId=" +
        produtoId,
      method: "GET"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "fornecedorProduto/editar",
      data: viewModel,
      method: "PUT"
    });
  }
}

export default new FornecedorProdutoServico();
