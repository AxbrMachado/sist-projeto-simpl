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

  Remover(id) {
    return Vue.prototype.$http({
      url: "pessoacontrato/remover/" + id,
      method: "DELETE"
    });
  }

  ObterGridContrato(
    pagina,
    itensPorPagina,
    contratoId,
    vinculadoAoContrato,
    nome,
    tipoPessoaContrato
  ) {
    return Vue.prototype.$http({
      url:
        "/pessoacontrato/obter-grid-contrato?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&contratoId=" +
        contratoId +
        "&vinculadoAoContrato=" +
        vinculadoAoContrato +
        "&nome=" +
        nome +
        "&TipoPessoaContrato=" +
        tipoPessoaContrato,
      method: "GET"
    });
  }

  ObterGridFornecedor(
    pagina,
    itensPorPagina,
    pessoaId,
    vinculadoAoContrato,
    descricao,
    tipoPessoaContrato
  ) {
    return Vue.prototype.$http({
      url:
        "/pessoacontrato/obter-grid-fornecedor?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&pessoaId=" +
        pessoaId +
        "&vinculadoAoContrato=" +
        vinculadoAoContrato +
        "&descricao=" +
        descricao +
        "&TipoPessoaContrato=" +
        tipoPessoaContrato,
      method: "GET"
    });
  }

  Adicionar(contratoId, pessoaId, tipoPessoaContrato) {
    return Vue.prototype.$http({
      url:
        "/pessoacontrato/adicionar?contratoId=" +
        contratoId +
        "&pessoaId=" +
        pessoaId +
        "&TipoPessoaContrato=" +
        tipoPessoaContrato,

      method: "GET"
    });
  }

  EditarFornecedor(
    contratoClienteId,
    valorLimite,
    quantidadeLimite,
    tipoPessoaContrato,
    contratoId
  ) {
    return Vue.prototype.$http({
      url:
        "/pessoacontrato/editar-contrato-pessoa?id=" +
        contratoClienteId +
        "&valorLimite=" +
        valorLimite +
        "&quantidadeLimite=" +
        quantidadeLimite +
        "&tipoPessoaContrato=" +
        tipoPessoaContrato +
        "&contratoId=" +
        contratoId,
      method: "GET"
    });
  }

  EditarContrato(
    contratoClienteId,
    valorLimite,
    quantidadeLimite,
    pessoaId,
    tipoPessoaContrato
  ) {
    return Vue.prototype.$http({
      url:
        "/pessoacontrato/editar-contrato-pessoa?id=" +
        contratoClienteId +
        "&valorLimite=" +
        valorLimite +
        "&quantidadeLimite=" +
        quantidadeLimite +
        "&tipoPessoaContrato=" +
        tipoPessoaContrato +
        "&pessoaId=" +
        pessoaId,
      method: "GET"
    });
  }
}

export default new ContratoFornecedorServico();
