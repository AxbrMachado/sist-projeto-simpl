import Vue from "vue";
class LicitacaoServico {
  ObterInstituicoesSelect() {
    return this.ObterSelect(false);
  }

  ObterSelect() {
    return this.ObterSelect(false);
  }

  ObterSelect(vigente) {
    return Vue.prototype.$http({
      url: "/licitacao/obter-select/" + vigente,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "licitacao/remover/" + id,
      method: "DELETE"
    });
  }

  Obter(id) {
    return Vue.prototype.$http({
      url: "licitacao/obter/" + id,
      method: "GET"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "licitacao/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "licitacao/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  ObterGrid(
    pagina,
    itensPorPagina,
    numero,
    instituicaiId,
    status,
    tipoInstituicao,
    dataVencimento,
    licitacaoVenciada
  ) {
    return Vue.prototype.$http({
      url:
        "/licitacao/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        (numero ? "&Numero=" + numero : "") +
        (instituicaiId ? "&PessoaId=" + instituicaiId : "") +
        (status ? "&Status=" + status : "") +
        (tipoInstituicao ? "&TipoInstituicaoId=" + tipoInstituicao : "") +
        (dataVencimento ? "&DataVencimento=" + dataVencimento : "") +
        (licitacaoVenciada ? "&LicitacaoVencida=" + licitacaoVenciada : ""),
      method: "GET"
    });
  }
}

export default new LicitacaoServico();
