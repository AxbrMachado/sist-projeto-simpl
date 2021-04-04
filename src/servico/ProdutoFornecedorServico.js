import Vue from "vue";
class DocumentoServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "fornecedorproduto/obter/" + id,
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, produtoId) {
    return Vue.prototype.$http({
      url:
        "/fornecedorproduto/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&produtoId=" +
        produtoId,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "fornecedorproduto/remover/" + id,
      method: "DELETE"
    }); 
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "fornecedorproduto/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "fornecedorproduto/editar",
      data: viewModel,
      method: "PUT"
    });
  }
}

export default new DocumentoServico();
