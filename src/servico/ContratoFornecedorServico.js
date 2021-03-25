import Vue from "vue";
class DocumentoServico {
    Obter(id) {
        return Vue.prototype.$http({
            url: "pessoacontrato/obter/" + id,
            method: "GET"
        });
    }

    ObterGrid(pagina, itensPorPagina, contratoId) {
        return Vue.prototype.$http({
          url:
          "/pessoacontrato/obter-grid-pessoa?pagina=" +
          pagina +
          "&ItensPorPagina=" +
          itensPorPagina +
          "&contratoId=" +
          contratoId,
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

};

export default new DocumentoServico();