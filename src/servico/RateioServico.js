import Vue from "vue";
class RateioServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "rateio/obter/" + id,
      method: "GET"
    });
  }

  ObterGrid(
    pagina,
    itensPorPagina,
    pedido,
    instituicao,
    statusPedido,
    statusRateio,
    dataEntrega,
    dataRateio,
    rateioManual
  ) {
    return Vue.prototype.$http({
      url:
        "/rateio/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&Pedido=" +
        pedido +
        (!instituicao ? "" : "&InstituicaoId=" + instituicao) +
        (!statusPedido ? "" : "&StatusPedido=" + statusPedido) +
        (!statusRateio ? "" : "&Status=" + statusRateio) +
        "&dataEntrega=" +
        dataEntrega +
        "&DataEntrega=" +
        dataRateio +
        "&Manual=" +
        rateioManual,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "rateio/remover/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "rateio/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "rateio/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  EfetuarRateio(pedidoId) {
    return Vue.prototype.$http({
      url: "rateio/efetuarRateio/" + pedidoId,
      method: "GET"
    });
  }

  RecusarProdutoFornecedorRateio(pedidoId, fornecedorId) {
    return Vue.prototype.$http({
      url: "rateio/recusarRateio/" + pedidoId + "/" + fornecedorId,
      method: "GET"
    });
  }

  ConfirmarProdutoFornecedorRateio(pedidoId, fornecedorId) {
    return Vue.prototype.$http({
      url: "rateio/confirmarRateio/" + pedidoId + "/" + fornecedorId,
      method: "GET"
    });
  }
}

export default new RateioServico();
