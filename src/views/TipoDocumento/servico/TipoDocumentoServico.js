import Vue from "vue";
class TipoDocumentoServico {
    ObterSelect() {
        return Vue.prototype.$http({
            url: "tipodocumento/obter-select",
            method: "GET"
        });
    }
};

export default new TipoDocumentoServico();