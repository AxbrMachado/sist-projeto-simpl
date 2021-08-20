import Vue from "vue";
class DapContratoServico {
  ObterVSelect(busca) {
    return Vue.prototype.$http({
      url: "dapcontrato/obter-v-select/" + busca,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "dapcontrato/remover/" + id,
      method: "DELETE"
    });
  }

  Obter(id) {
    return Vue.prototype.$http({
      url: "dapcontrato/obter/" + id,
      method: "GET"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "dapcontrato/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "dapcontrato/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  ObterGridContrato(pagina, numero, dapId) {
    return Vue.prototype.$http({
      url:
        "/dapcontrato/obter-grid-contrato?pagina=" +
        pagina +
        "&numero=" +
        numero +
        "&dapId=" +
        dapId,
      method: "GET"
    });
  }
}

export default new DapContratoServico();
