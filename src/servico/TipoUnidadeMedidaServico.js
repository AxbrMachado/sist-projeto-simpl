import Vue from "vue";
class TipoUnidadeServico {
  ObterVSelect(busca) {
    return Vue.prototype.$http({
      url: "tipoUnidadeMedida/obter-v-select/" + busca,
      method: "GET"
    });
  }

  ObterSelect() {
    return Vue.prototype.$http({
      url: "/tipoUnidadeMedida/obter-select",
      method: "GET"
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

  //   ObterGrid(
  //     pagina,
  //     descricao,
  //     tipoProduto,
  //     tipoUnidadeMedida,
  //     presenteEmPedido
  //   ) {
  //     return Vue.prototype.$http({
  //       url:
  //         "/tipoUnidadeMedida/obter-grid?pagina=" +
  //         pagina +
  //         (descricao ? "&Descricao=" + descricao : "") +
  //         (tipoProduto ? "&tipoProdutoId=" + tipoProduto : "") +
  //         (tipoUnidadeMedida ? "&TipoUnidadeMedidaId=" + tipoUnidadeMedida : "") +
  //         (presenteEmPedido ? "&PresenteEmPedido=" + presenteEmPedido : ""),
  //       method: "GET"
  //     });
  //   }
}

export default new TipoUnidadeServico();
