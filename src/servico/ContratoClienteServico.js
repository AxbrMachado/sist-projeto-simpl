import Vue from "vue";
import TipoPessoaContratoEnum from "./../enums/TipoPessoaContratoEnum";

class ContratoClienteServico {
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
        TipoPessoaContratoEnum.Cliente,
      method: "GET"
    });
  }

  ObterGridContrato(
    pagina,
    itensPorPagina,
    contratoId,
    vinculadoAoContrato,
    nome
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
        nome,
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

  EditarCliente(contratoClienteId, rota, tipoPessoaContrato, contratoId) {
    return Vue.prototype.$http({
      url:
        "/pessoacontrato/editar-cliente?id=" +
        contratoClienteId +
        "&rota=" +
        rota +
        "&TipoPessoaContrato=" +
        tipoPessoaContrato +
        "&contratoId=" +
        contratoId,
      method: "GET"
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

export default new ContratoClienteServico();
