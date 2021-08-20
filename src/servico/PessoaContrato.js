import Vue from "vue";
class PessoaContratoServico {
  ObterVSelect(busca) {
    return Vue.prototype.$http({
      url: "pessoaContrato/obter-v-select/" + busca,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "pessoaContrato/remover/" + id,
      method: "DELETE"
    });
  }

  Obter(id) {
    return Vue.prototype.$http({
      url: "pessoaContrato/obter/" + id,
      method: "GET"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "pessoaContrato/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "pessoaContrato/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  ObterGrid(pagina, numero, tipoPessoa, pessoaId) {
    return Vue.prototype.$http({
      url:
        "/pessoacontrato/obter-grid?pagina=" +
        pagina +
        (numero ? "&numero=" + numero : "") +
        (tipoPessoa ? "&TipoPessoaContrato=" + tipoPessoa : "") +
        (pessoaId ? "&pessoaId=" + pessoaId : ""),
      method: "GET"
    });
  }
}

export default new PessoaContratoServico();
