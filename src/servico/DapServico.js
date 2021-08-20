import Vue from "vue";
class DapServico {
    ObterVSelect(busca) {
        return Vue.prototype.$http({
            url: "dap/obter-v-select/" + busca,
            method: "GET"
        });
    }

    Obter(id) {
        return Vue.prototype.$http({
            url: "dap/obter/" + id,
            method: "GET"
        });
    }

    Novo(viewModel) {
        return Vue.prototype.$http({
            url: "dap/novo",
            data: viewModel,
            method: "POST"
        });
    }

    Editar(viewModel) {
        return Vue.prototype.$http({
            url: "dap/editar",
            data: viewModel,
            method: "PUT"
        });
    }
};

export default new DapServico();