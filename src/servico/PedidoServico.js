import Vue from "vue";
class PedidoServico {
  ObterVSelect(filtro) {
    return Vue.prototype.$http({
      url: "pedido/obter-v-select/" + filtro,
      method: "GET"
    });
  }

  Obter(id) {
    return Vue.prototype.$http({
      url: "pedido/obter/" + id,
      method: "GET"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "pedido/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "pedido/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "pedido/remover/" + id,
      method: "DELETE"
    });
  }

  ObterGrid(
    pagina,
    itensPorPagina,
    Descricao,
    Numero,
    contratoId,
    fornecedorId,
    pessoaId,
    produtoId,
    Status,
    DataEntrega,
    PedidoAvulso,
    PedidoCompleto,
    PedidoPendente,
    PedidoEntregue,
    InstituicaoId
  ) {
    return Vue.prototype.$http({
      url:
        "/pedido/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        (Descricao ? "&Descricao=" + Descricao : "") +
        (Numero ? "&Numero=" + Numero : "") +
        (contratoId ? "&ContratoId=" + contratoId : "") +
        (fornecedorId ? "&FornecedorId=" + fornecedorId : "") +
        (pessoaId ? "&PessoaId=" + pessoaId : "") +
        (produtoId ? "&ProdutoId=" + produtoId : "") +
        (Status ? "&Status=" + Status : "") +
        (DataEntrega ? "&DataEntrega=" + DataEntrega : "") +
        (PedidoAvulso ? "&PedidoAvulso=" + PedidoAvulso : "") +
        (PedidoCompleto ? "&PedidoCompleto=" + PedidoCompleto : "") +
        (PedidoPendente ? "&PedidoPendente=" + PedidoPendente : "") +
        (PedidoEntregue ? "&PedidoEntregue=" + PedidoEntregue : "") +
        (InstituicaoId ? "&InstituicaoId=" + InstituicaoId : ""),

      method: "GET"
    });
  }

  RelatorioImpressao(pedidoId) {
    return Vue.prototype.$http({
      url: "pedido/relatorio/" + pedidoId,
      method: "GET"
    });
  }
}

export default new PedidoServico();
