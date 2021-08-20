import Vue from "vue";
class EnderecoServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "endereco/obter/" + id,
      method: "GET"
    });
  }

  ObterSelect() {
    return Vue.prototype.$http({
      url: "/endereco/obter-select",
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, pessoaId) {
    return Vue.prototype.$http({
      url:
        "endereco/obter-grid/" + pagina + "/" + itensPorPagina + "/" + pessoaId,
      method: "GET"
    });
  }

  ObterCep(cep) {
    return Vue.prototype.$http({
      url: "endereco/obter-cep/" + cep,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "endereco/remover/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "endereco/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "endereco/editar",
      data: viewModel,
      method: "PUT"
    });
  }
}

export default new EnderecoServico();
