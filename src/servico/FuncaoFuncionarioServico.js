import Vue from "vue";
class FuncaoFuncionarioServico {
  Obter(id) {
    return Vue.prototype.$http({
      url: "funcaoFuncionario/obter/" + id,
      method: "GET"
    });
  }

  ObterSelect() {
    return Vue.prototype.$http({
      url: "/funcaoFuncionario/obter-select",
      method: "GET"
    });
  }

  ObterGrid(pagina, itensPorPagina, descricao) {
    return Vue.prototype.$http({
      url:
        "/funcaoFuncionario/obter-grid?pagina=" +
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
      url: "funcaoFuncionario/remover/" + id,
      method: "DELETE"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "funcaoFuncionario/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "funcaoFuncionario/editar",
      data: viewModel,
      method: "PUT"
    });
  }
}

export default new FuncaoFuncionarioServico();
