import Vue from "vue";
class LicitacaoContratoServico {
  ObterInstituicoesSelect() {
    return Vue.prototype.$http({
      url: "/licitacaoContrato/obter-select",
      method: "GET"
    });
  }

  ObterSelect() {
    return Vue.prototype.$http({
      url: "/licitacaoContrato/obter-select",
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "licitacaoContrato/remover/" + id,
      method: "DELETE"
    });
  }

  Obter(id) {
    return Vue.prototype.$http({
      url: "licitacaoContrato/obter/" + id,
      method: "GET"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "licitacaoContrato/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "licitacaoContrato/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  ObterGrid(pagina, itensPorPagina, numero, licitacaoId) {
    return Vue.prototype.$http({
      url:
        "/licitacaocontrato/obter-grid-contrato?pagina=" +
        pagina +
        "&numero=" +
        numero +
        "&licitacaoId=" +
        licitacaoId,
      method: "GET"
    });
  }
}

export default new LicitacaoContratoServico();
