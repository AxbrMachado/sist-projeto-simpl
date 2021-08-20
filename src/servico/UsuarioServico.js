import Vue from "vue";
class UsuarioServico {
  ObterVSelect(busca) {
    return Vue.prototype.$http({
      url: "usuario/obter-v-select/" + busca,
      method: "GET"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "usuario/remover/" + id,
      method: "DELETE"
    });
  }

  Obter(id) {
    return Vue.prototype.$http({
      url: "usuario/obter/" + id,
      method: "GET"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "usuario/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "usuario/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  TrocarSenha(viewModel) {
    return Vue.prototype.$http({
      url: "usuario/trocar-senha",
      data: viewModel,
      method: "POST"
    });
  }

  ObterGrid(pagina) {
    return Vue.prototype.$http({
      url: "/usuario/obter-grid/" + pagina + "/20",
      method: "GET"
    });
  }
}

export default new UsuarioServico();
