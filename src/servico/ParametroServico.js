import Vue from "vue";
class ParametroServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "parametro/obter/" + id,
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, descricao) {
    return Vue.prototype.$http({
      url:
        "/parametro/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&descricao=" +
        descricao,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "parametro/remover/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "parametro/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "parametro/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  EditarParametro(id, conteudo, observacao) {
    return Vue.prototype.$http({
      url:
        "/parametro/editar-parametro?id=" +
        id +
        "&conteudo=" +
        conteudo +
        "&observacao=" +
        observacao,
      method: "GET"
    });
  }
}

export default new ParametroServico();
