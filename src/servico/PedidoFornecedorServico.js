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
    rateioId,
    conferenciaId,
    nome,
    fornecedorComProduto
  ) {
    return Vue.prototype.$http({
      url:
        "/pessoacontrato/obter-grid-fornecedor-total?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&nome=" +
        nome +
        "&fornecedorComProduto=" +
        fornecedorComProduto +
        "&pedidoId=" +
        pedidoId +
        "&rateioId=" +
        rateioId +
        "&conferenciaId=" +
        conferenciaId +
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

  RemoverFornecedorPedido(fornecedorId, pedidoId) {
    return Vue.prototype.$http({
      url:
        "/pedidoprodutofornecedor/remover-fornecedor-pedido?fornecedorId=" +
        fornecedorId +
        "&pedidoId=" +
        pedidoId,
      method: "GET"
    });
  }
}

export default new PedidoFornecedorServico();
