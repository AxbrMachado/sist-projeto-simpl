import Vue from "vue";
class ContratoProdutoServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "contratoProduto/obter/" + id,
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, contratoId) {
    return Vue.prototype.$http({
      url:
        "/contratoproduto/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&contratoId=" +
        contratoId,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "contratoProduto/remover/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "contratoProduto/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "contratoProduto/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  ObterGridContrato(
    pagina,
    itensPorPagina,
    contratoId,
    vinculadoAoContrato,
    produto
  ) {
    return Vue.prototype.$http({
      url:
        "/contratoProduto/obter-grid-contrato?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&contratoId=" +
        contratoId +
        "&vinculadoAoContrato=" +
        vinculadoAoContrato +
        "&produto=" +
        produto,
      method: "GET"
    });
  }

  Adicionar(contratoId, produtoId) {
    return Vue.prototype.$http({
      url:
        "/contratoProduto/adicionar?contratoId=" +
        contratoId +
        "&produtoId=" +
        produtoId,

      method: "GET"
    });
  }

  EditarProduto(contratoClienteId, valor, quantidade, contratoId, produtoId) {
    return Vue.prototype.$http({
      url:
        "/contratoProduto/editar-contrato-produto?id=" +
        contratoClienteId +
        "&valor=" +
        valor +
        "&quantidade=" +
        quantidade +
        "&contratoId=" +
        contratoId +
        "&produtoId=" +
        produtoId,
      method: "GET"
    });
  }
}

export default new ContratoProdutoServico();
