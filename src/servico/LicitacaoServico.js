import Vue from "vue";
class LicitacaoServico {
  ObterInstituicoesSelect() {
    return Vue.prototype.$http({
      url: "/licitacao/obter-select",
      method: "GET"
    });
  }

  ObterSelect() {
    return Vue.prototype.$http({
      url: "/licitacao/obter-select",
      method: "GET"
    });
  }
}

export default new LicitacaoServico();
