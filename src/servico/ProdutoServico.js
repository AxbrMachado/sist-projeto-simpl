import Vue from "vue";
class ProdutoServico {
  ObterVSelect(busca) {
    return Vue.prototype.$http({
      url: "produto/obter-v-select/" + busca,
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

  ObterGrid(
    pagina,
    descricao,
    tipoProduto,
    tipoUnidadeMedida,
    presenteEmPedido
  ) {
    return Vue.prototype.$http({
      url:
        "/produto/obter-grid?pagina=" +
        pagina +
        (descricao ? "&Descricao=" + descricao : "") +
        (tipoProduto ? "&tipoProdutoId=" + tipoProduto : "") +
        (tipoUnidadeMedida ? "&TipoUnidadeMedidaId=" + tipoUnidadeMedida : "") +
        (presenteEmPedido ? "&PresenteEmPedido=" + presenteEmPedido : ""),
      method: "GET"
    });
  }

  ObterVSelectProdutoDesignado(
    descricao,
    contrato,
    produto,
    quantidadeDesignada
  ) {
    return Vue.prototype.$http({
      url:
        "/produto/obter-v-select-produto-designado?" +
        (descricao ? "&Descricao=" + descricao : "") +
        (contrato ? "&ContratoId=" + contrato : "") +
        (produto ? "&ProdutoOrigemId=" + produto : "") +
        (quantidadeDesignada
          ? "&QuantidadeDesignada=" + quantidadeDesignada
          : ""),

      method: "GET"
    });
  }
}

export default new ProdutoServico();
