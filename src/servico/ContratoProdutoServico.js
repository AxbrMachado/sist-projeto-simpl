import Vue from "vue";
class ContratoProdutoServico {
    Obter(id) {
        return Vue.prototype.$http({
            url: "contratoProduto/obter/" + id,
            method: "GET"
        });
    }

    ObterGrid(pagina, itensPorPagina, contratoId) {
        return Vue.prototype.$http({
          url:
          "/contratoproduto/obter-grid?pagina=" +
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
            url: "contratoProduto/remover/" + id,
            method: "DELETE"
        });
    }

    Novo(viewModel) {
        return Vue.prototype.$http({
            url: "contratoProduto/novo",
            data: viewModel,
            method: "POST"
        });
    }

    Editar(viewModel) {
        return Vue.prototype.$http({
            url: "contratoProduto/editar",
            data: viewModel,
            method: "PUT"
        });
    }

};

export default new ContratoProdutoServico();