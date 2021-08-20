import Vue from "vue";
class LoginServico {
  Autenticar(viewModel) {
    return Vue.prototype.$http({
      url: "login/autenticar",
      data: viewModel,
      method: "POST"
    });
  }
}

export default new LoginServico();
