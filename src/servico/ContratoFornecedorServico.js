import Vue from "vue";
import TipoPessoaContratoEnum from "./../enums/TipoPessoaContratoEnum";

class ContratoFornecedorServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "pessoacontrato/obter/" + id,
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, contratoId) {
    return Vue.prototype.$http({
      url:
        "/pessoacontrato/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&contratoId=" +
        contratoId +
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

  AdicionarTodosFornecedores(ContratoId, ValorLimite, QuantidadeLimite) {
    return Vue.prototype.$http({
      url:
        "/pessoacontrato/adicionar-todos-fornecedores?ContratoId=" +
        ContratoId +
        "&ValorLimite=" +
        ValorLimite +
        "&QuantidadeLimite=" +
        QuantidadeLimite,
      method: "GET"
    });
  }
}

export default new ContratoFornecedorServico();
