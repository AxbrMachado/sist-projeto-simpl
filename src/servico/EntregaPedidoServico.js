import Vue from "vue";
class EntregaPedidoServico {
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

  AssumirConferencia(rateioId) {
    return Vue.prototype.$http({
      url: "conferencia/assumirConferencia/" + rateioId,
      method: "GET"
    });
  }

  CancelarConferencia(conferenciaId) {
    return Vue.prototype.$http({
      url: "conferencia/cancelarConferencia/" + conferenciaId,
      method: "GET"
    });
  }

  ReiniciarConferencia(conferenciaId) {
    return Vue.prototype.$http({
      url: "conferencia/reiniciarConferencia/" + conferenciaId,
      method: "GET"
    });
  }

  RecusarConferenciaFornecedor(conferenciaId, fornecedorId) {
    return Vue.prototype.$http({
      url:
        "conferencia/recusarConferenciaFornecedor/" +
        conferenciaId +
        "/" +
        fornecedorId,
      method: "GET"
    });
  }

  ConfirmarConferenciaFornecedor(conferenciaId, fornecedorId) {
    return Vue.prototype.$http({
      url:
        "conferencia/confirmarConferenciaFornecedor/" +
        conferenciaId +
        "/" +
        fornecedorId,
      method: "GET"
    });
  }

  RemoverConferenciaFornecedor(conferenciaId, fornecedorId) {
    return Vue.prototype.$http({
      url:
        "conferencia/removerConferenciaFornecedor/" +
        conferenciaId +
        "/" +
        fornecedorId,
      method: "GET"
    });
  }

  FinalizarConferencia(conferenciaId) {
    return Vue.prototype.$http({
      url: "conferencia/finalizarConferencia/" + conferenciaId,
      method: "GET"
    });
  }

  RecusarConferenciaProdutoFornecedor(
    conferenciaId,
    pedidoProdutoFornecedorId
  ) {
    return Vue.prototype.$http({
      url:
        "conferencia/recusarConferenciaProdutoFornecedor/" +
        conferenciaId +
        "/" +
        pedidoProdutoFornecedorId,
      method: "GET"
    });
  }

  ConfirmarConferenciaProdutoFornecedor(
    conferenciaId,
    pedidoProdutoFornecedorId,
    quantidade
  ) {
    return Vue.prototype.$http({
      url:
        "conferencia/confirmarConferenciaProdutoFornecedor/" +
        conferenciaId +
        "/" +
        pedidoProdutoFornecedorId +
        "/" +
        quantidade,
      method: "GET"
    });
  }

  RemoverConferenciaProdutoFornecedor(
    conferenciaId,
    pedidoProdutoFornecedorId
  ) {
    return Vue.prototype.$http({
      url:
        "conferencia/removerConferenciaProdutoFornecedor/" +
        conferenciaId +
        "/" +
        pedidoProdutoFornecedorId,
      method: "GET"
    });
  }
}

export default new EntregaPedidoServico();
