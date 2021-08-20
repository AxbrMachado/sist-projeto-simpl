import Vue from "vue";
class FornecedorServico {
  ObterVSelect(busca) {
    return Vue.prototype.$http({
      url: "fornecedor/obter-v-select/" + busca,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "fornecedor/remover/" + id,
      method: "DELETE"
    });
  }

  Obter(id) {
    return Vue.prototype.$http({
      url: "fornecedor/obter/" + id,
      method: "GET"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "fornecedor/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "fornecedor/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  ObterGrid(pagina, nome, presenteEmPedido) {
    return Vue.prototype.$http({
      url:
        "/fornecedor/obter-grid?pagina=" +
        pagina +
        (nome ? "&nome=" + nome : "") +
        (presenteEmPedido ? "&presenteEmPedido=" + presenteEmPedido : ""),
      method: "GET"
    });
  }
}

export default new FornecedorServico();
