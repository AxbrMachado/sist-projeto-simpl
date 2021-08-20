import Vue from "vue";
class PessoaServico {
  ObterVSelect(filtro, tipo) {
    return Vue.prototype.$http({
      url: "/pessoa/obter-v-select/" + (tipo ? tipo + "/" : "") + "/" + filtro,
      method: "GET"
    });
  }

  ObterVSelect(filtro) {
    return Vue.prototype.$http({
      url: "pessoa/obter-v-select/" + filtro,
      method: "GET"
    });
  }

  ObterSelect(tipoPessoa) {
    return Vue.prototype.$http({
      url: "/pessoa/obter-select/" + tipoPessoa,
      method: "GET"
    });
  }

  Obter(id) {
    return Vue.prototype.$http({
      url: "pessoa/obter/" + id,
      method: "GET"
    });
  }

  Novo(viewModel) {
    return Vue.prototype.$http({
      url: "pessoa/novo",
      data: viewModel,
      method: "POST"
    });
  }

  Editar(viewModel) {
    return Vue.prototype.$http({
      url: "pessoa/editar",
      data: viewModel,
      method: "PUT"
    });
  }

  Remover(id) {
    return Vue.prototype.$http({
      url: "pessoa/remover/" + id,
      method: "DELETE"
    });
  }

  ObterGrid(
    pagina,
    itensPorPagina,
    nome,
    cidade,
    tipoPessoa,
    presenteEmPedido
  ) {
    return Vue.prototype.$http({
      url:
        "/pessoa/obter-grid?pagina=" +
        pagina +
        "&ItensPorPagina=" +
        itensPorPagina +
        (nome ? "&Nome=" + nome : "") +
        (cidade ? "&Cidade=" + cidade : "") +
        (tipoPessoa ? "&TipoPessoa=" + tipoPessoa : "") +
        (presenteEmPedido ? "&PresenteEmPedido=" + presenteEmPedido : ""),
      method: "GET"
    });
  }
}

export default new PessoaServico();
