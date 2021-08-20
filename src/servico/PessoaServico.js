import Vue from "vue";
class PessoaServico {
  ObterClientesVSelect(filtro) {
    return Vue.prototype.$http({
      url: "pessoa/obter-v-select/" + filtro,
      method: "GET"
    });
  }

  ObterVSelect(filtro, tipo) {
    return Vue.prototype.$http({
      url: "/pessoa/obter-v-select/" + (tipo ? tipo + "/" : "") + "/" + filtro,
      method: "GET"
    });
  }

  ObterVSelect(filtro) {
    return Vue.prototype.$http({
      url: "pessoa/obter-v-select/" + filtro,
      method: "GET"
    });
  }

  Obter(id) {
    return Vue.prototype.$http({
      url: "pessoa/obter/" + id,
      method: "GET"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "pessoa/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "pessoa/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "pessoa/remover/" + id,
      method: "DELETE"
    });
  }

  //   ObterGrid(
  //     pagina,
  //     itensPorPagina,
  //     descricao,
  //     numero,
  //     licitacaoId,
  //     dataVencimento,
  //     pessoaVencido,
  //     presenteEmPedido
  //   ) {
  //     return Vue.prototype.$http({
  //       url:
  //         "/pessoa/obter-grid?pagina=" +
  //         pagina +
  //         "&ItensPorPagina=" +
  //         itensPorPagina +
  //         (descricao ? "&Descricao=" + descricao : "") +
  //         (numero ? "&Numero=" + numero : "") +
  //         (licitacaoId ? "&LicitacaoId=" + licitacaoId : "") +
  //         (dataVencimento ? "&DataTermino=" + dataVencimento : "") +
  //         (pessoaVencido ? "&ContratoVencido=" + pessoaVencido : "") +
  //         (presenteEmPedido ? "&PresenteEmPedido=" + presenteEmPedido : ""),
  //       method: "GET"
  //     });
  //   }
}

export default new PessoaServico();
