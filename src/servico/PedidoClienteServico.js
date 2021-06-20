import Vue from "vue";
import TipoPessoaContratoEnum from "./../enums/TipoPessoaContratoEnum";

class PedidoClienteServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "pedidopessoa/obter/" + id,
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, pedidoId, nome) {
    return Vue.prototype.$http({
      url:
        "/pedidopessoa/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&pedidoId=" +
        pedidoId +
        "&nome=" +
        nome +
        "&tipoPessoaContrato=" +
        TipoPessoaContratoEnum.Cliente,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "pedidopessoa/remover/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "pedidopessoa/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "pedidopessoa/editar",
      data: viewModel,
      method: "PUT"
    });
  }
}

export default new PedidoClienteServico();
