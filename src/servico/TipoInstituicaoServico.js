import Vue from "vue";
class TipoInstituicaoServico {
  ObterVSelect(busca) {
    return Vue.prototype.$http({
      url: "tipoinstituicao/obter-v-select/" + busca,
      method: "GET"
    });
  }

  ObterSelect() {
    return Vue.prototype.$http({
      url: "/tipoInstituicao/obter-select",
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
  //     tipoinstituicao,
  //     presenteEmPedido
  //   ) {
  //     return Vue.prototype.$http({
  //       url:
  //         "/tipoinstituicao/obter-grid?pagina=" +
  //         pagina +
  //         (descricao ? "&Descricao=" + descricao : "") +
  //         (tipoProduto ? "&tipoProdutoId=" + tipoProduto : "") +
  //         (tipoinstituicao ? "&TipoUnidadeMedidaId=" + tipoinstituicao : "") +
  //         (presenteEmPedido ? "&PresenteEmPedido=" + presenteEmPedido : ""),
  //       method: "GET"
  //     });
  //   }
}

export default new TipoInstituicaoServico();
