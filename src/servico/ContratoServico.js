import Vue from "vue";
class ContratoServico {
  ObterVSelect(filtro) {
    return Vue.prototype.$http({
      url: "contrato/obter-v-select/" + filtro,
      method: "GET"
    });
  }

  ObterSelect() {
    ObterSelect(false);
  }

  ObterSelect(vigente) {
    return Vue.prototype.$http({
      url: "/contrato/obter-select/" + vigente,
      method: "GET"
    });
  }

  Obter(id) {
    return Vue.prototype.$http({
      url: "contrato/obter/" + id,
      method: "GET"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "contrato/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "contrato/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "contrato/remover/" + id,
      method: "DELETE"
    });
  }

  ObterGrid(
    pagina,
    itensPorPagina,
    descricao,
    numero,
    licitacaoId,
    dataVencimento,
    contratoVencido,
    presenteEmPedido
  ) {
    return Vue.prototype.$http({
      url:
        "/contrato/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        (descricao ? "&Descricao=" + descricao : "") +
        (numero ? "&Numero=" + numero : "") +
        (licitacaoId ? "&LicitacaoId=" + licitacaoId : "") +
        (dataVencimento ? "&DataTermino=" + dataVencimento : "") +
        (contratoVencido ? "&ContratoVencido=" + contratoVencido : "") +
        (presenteEmPedido ? "&PresenteEmPedido=" + presenteEmPedido : ""),
      method: "GET"
    });
  }
}

export default new ContratoServico();
