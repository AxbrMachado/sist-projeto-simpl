import Vue from "vue";
class ArquivoServico {
    Obter(id) {
        return Vue.prototype.$http({
            url: "arquivo/obter/" + id,
            method: "GET"
        });
    }

    Novo(arquivo) {
        let formData = new FormData();
        formData.append("arquivo", arquivo);
        return Vue.prototype.$http({
            url: "arquivo/novo",
            data: formData,
            method: "POST",
            headers: {
                "Content-Type": "multipart/form-data"
            }
        });
    }
};

export default new ArquivoServico();