import Vue from "vue";
class TipoUnidadeServico {
  ObterVSelect(busca) {
    return Vue.prototype.$http({
      url: "tipoUnidadeMedida/obter-v-select/" + busca,
      method: "GET"
    });
  }

  ObterSelect() {
    return Vue.prototype.$http({
      url: "/tipoUnidadeMedida/obter-select",
      method: "GET"
    });
  }

  Obter(id) {
    return Vue.prototype.$http({
      url: "tipoUnidadeMedida/obter/" + id,
      method: "GET"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "tipoUnidadeMedida/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "tipoUnidadeMedida/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  ObterGrid(pagina, itensPorPagina, descricao) {
    return Vue.prototype.$http({
      url:
        "/tipoUnidadeMedida/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&descricao=" +
        descricao,
      method: "GET"
    });
  }
}

export default new TipoUnidadeServico();
