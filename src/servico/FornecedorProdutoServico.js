import Vue from "vue";
class DocumentoServico {
    Obter(id) {
        return Vue.prototype.$http({
            url: "fornecedorProduto/obter/" + id,
            method: "GET"
        });
    }

    ObterGrid(pagina, itensPorPagina, fornecedorId) {
        return Vue.prototype.$http({
          url:
          "/fornecedorProduto/obter-grid?pagina=" +
          pagina +
          "&ItensPorPagina=" +
          itensPorPagina +
          "&fornecedorId=" +
          fornecedorId,
        method: "GET"
        });
    }

    Remover(id) {
        return Vue.prototype.$http({
            url: "fornecedorProduto/remover/" + id,
            method: "DELETE"
        });
    }

    Novo(viewModel) {
        return Vue.prototype.$http({
            url: "fornecedorProduto/novo",
            data: viewModel,
            method: "POST"
        });
    }

    Editar(viewModel) {
        return Vue.prototype.$http({
            url: "fornecedorProduto/editar",
            data: viewModel,
            method: "PUT"
        });
    }

};

export default new DocumentoServico();