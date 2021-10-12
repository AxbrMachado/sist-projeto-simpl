import Vue from "vue";
class ConferenciaRateioServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "conferencia/obter/" + id,
      method: "GET"
    });
  }

  ObterSelect() {
    return Vue.prototype.$http({
      url: "/conferencia/obter-select",
      method: "GET"
    });
  }

  ObterGrid(
    pagina,
    itensPorPagina,
    pedido,
    instituicao,
    statusConferencia,
    statusRateio,
    dataEntrega
  ) {
    return Vue.prototype.$http({
      url:
        "/conferencia/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        (pedido ? "&Pedido=" + pedido : "") +
        (!instituicao ? "" : "&InstituicaoId=" + instituicao) +
        (!statusConferencia ? "" : "&StatusConferencia=" + statusConferencia) +
        (!statusRateio ? "" : "&StatusConferencia=" + statusRateio) +
        (dataEntrega ? "&dataEntrega=" + dataEntrega : ""),
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "conferencia/remover/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "conferencia/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "conferencia/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  IniciarConferencia(rateioId) {
    return Vue.prototype.$http({
      url: "conferencia/iniciarConferencia/" + rateioId,
      method: "GET"
    });
  }
}

export default new ConferenciaRateioServico();
