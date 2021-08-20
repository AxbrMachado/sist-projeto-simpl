import Vue from "vue";
class TipoInstituicaoServico {
  ObterVSelect(busca) {
    return Vue.prototype.$http({
      url: "tipoinstituicao/obter-v-select/" + busca,
      method: "GET"
    });
  }

  ObterSelect() {
    return Vue.prototype.$http({
      url: "/tipoInstituicao/obter-select",
      method: "GET"
    });
  }

  Obter(id) {
    return Vue.prototype.$http({
      url: "tipoInstituicao/obter/" + id,
      method: "GET"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "tipoInstituicao/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "tipoInstituicao/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  ObterGrid(pagina, itensPorPagina, descricao) {
    return Vue.prototype.$http({
      url:
        "/tipoInstituicao/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        "&descricao=" +
        descricao,
      method: "GET"
    });
  }
}

export default new TipoInstituicaoServico();
