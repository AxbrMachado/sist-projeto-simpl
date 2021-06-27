import Vue from "vue";
import TipoPessoaContratoEnum from "./../enums/TipoPessoaContratoEnum";

class PedidoFornecedorServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "pessoacontrato/obter/" + id,
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, pedidoId) {
    return Vue.prototype.$http({
      url:
        "/pessoacontrato/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&pedidoId=" +
        pedidoId +
        "&tipoPessoaContrato=" +
        TipoPessoaContratoEnum.Fornecedor,
      method: "GET"
    });
  }

  ObterGridTotal(
    pagina,
    itensPorPagina,
    pedidoId,
    fornecedor,
    fornecedorComProduto
  ) {
    return Vue.prototype.$http({
      url:
        "/pessoacontrato/obter-grid-fornecedor-total?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&fornecedor=" +
        fornecedor +
        "&fornecedorComProduto=" +
        fornecedorComProduto +
        "&pedidoId=" +
        pedidoId +
        "&tipoPessoaContrato=" +
        TipoPessoaContratoEnum.Fornecedor,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "pessoacontrato/remover/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "pessoacontrato/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "pessoacontrato/editar",
      data: viewModel,
      method: "PUT"
    });
  }
}

export default new PedidoFornecedorServico();
