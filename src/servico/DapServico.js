import Vue from "vue";
class DapServico {
  ObterVSelect(busca) {
    return Vue.prototype.$http({
      url: "dap/obter-v-select/" + busca,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "dap/remover/" + id,
      method: "DELETE"
    });
  }

  Obter(id) {
    return Vue.prototype.$http({
      url: "dap/obter/" + id,
      method: "GET"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "dap/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "dap/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  ObterGrid(
    pagina,
    itensPorPagina,
    numero,
    tipoEnquadramento,
    cooperadoId,
    dataVencimento,
    dapVencida,
    fornecedorDesignado,
    fornecedorExcluidoRateio
  ) {
    return Vue.prototype.$http({
      url:
        "/dap/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        (numero ? "&Numero=" + numero : "") +
        (tipoEnquadramento ? "&TipoEnquadramento=" + tipoEnquadramento : "") +
        (cooperadoId ? "&PessoaId=" + cooperadoId : "") +
        (dataVencimento ? "&Validade=" + dataVencimento : "") +
        (dapVencida ? "&DapVencida=" + dapVencida : "") +
        (fornecedorDesignado
          ? "&FornecedorDesignado=" + fornecedorDesignado
          : "") +
        (fornecedorExcluidoRateio
          ? "&FornecedorExcluidoRateio=" + fornecedorExcluidoRateio
          : ""),
      method: "GET"
    });
  }
}

export default new DapServico();
