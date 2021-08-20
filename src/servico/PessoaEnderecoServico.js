import Vue from "vue";
class PessoaEnderecoServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "pessoaendereco/obter/" + id,
      method: "GET"
    });
  }

  ObterSelect() {
    return Vue.prototype.$http({
      url: "/pessoaendereco/obter-select",
      method: "GET"
    });
  }

  ObterVSelect(filtro) {
    return Vue.prototype.$http({
      url: "/pessoaendereco/obter-v-select/" + filtro,
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, descricao) {
    return Vue.prototype.$http({
      url:
        "/pessoaendereco/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&descricao=" +
        descricao,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "pessoaendereco/remover/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "pessoaendereco/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "pessoaendereco/editar",
      data: viewModel,
      method: "PUT"
    });
  }
}

export default new PessoaEnderecoServico();
