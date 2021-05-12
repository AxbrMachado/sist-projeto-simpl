import Vue from "vue";
class NotificacaoServico {
    Lido(id) {
        return Vue.prototype.$http({
            url: "notificacao/lido/" + id,
            method: "GET"
        });
    }

    Obter(id) {
        return Vue.prototype.$http({
            url: "notificacao/obter/" + id,
            method: "GET"
        });
    }

    ObterGrid(pagina, itensPorPagina) {
        return Vue.prototype.$http({
            url:
                "/unidadeMedida/obter-grid?pagina=" +
                pagina +
                "&ItensPorPagina=" +
                itensPorPagina,
            method: "GET"
        });
    }


};

export default new NotificacaoServico();