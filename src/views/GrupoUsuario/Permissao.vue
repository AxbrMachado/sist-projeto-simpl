<template>
  <div class="animated fadeIn">
    <div v-if="loading" class="loading-container">
      <RotateSquare
        class="loading-position animated fadeIn"
        size="60px"
      ></RotateSquare>
    </div>
    <form v-else @submit="ValidarForm">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div class="card">
            <header class="card-header">
              <strong class="align-self-center"
                >Permissão {{ nomeGrupo }}</strong
              >
            </header>
            <div class="card-body">
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <small>Campos com * são de preenchimento obrigatório</small>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>* Nome</label>
                    <input
                      v-model="viewModel.nome"
                      class="form-control"
                      type="text"
                      placeholder="Digite o nome"
                      required
                    />
                  </div>
                </div>
              </div>
            </div>
            <div class="btn-toolbar mb-3 ml-3" role="toolbar">
              <div class="btn-group" role="group">
                <button class="btn btn-success mr-2" type="submit">
                  Salvar
                </button>
              </div>
              <div class="btn-group" role="group">
                <button
                  class="btn btn-secondary"
                  type="reset"
                  @click="$router.go(-1)"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import GrupoUsuarioServico from "../../servico/GrupoUsuarioServico";

export default {
  name: "Permissao",
  components: {
    RotateSquare
  },
  data() {
    return {
      loading: false,
      contaOptions: [],
      nomeGrupo: "",
      viewModel: {
        id: this.$store.getters.emptyGuid,
        nome: ""
      }
    };
  },
  created() {
    let grupo = this.$route.params.id;
    if (grupo) this.Obter(grupo);
  },
  methods: {
    ValidarForm(evt) {
      evt.preventDefault();
      if (this.viewModel.id !== this.$store.getters.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(grupoId) {
      this.loading = true;
      GrupoUsuarioServico.Obter(grupoId)
        .then((resposta) => {
          this.loading = false;
          this.nomeGrupo = resposta.data.nome;
        })
        .catch((erro) => {
          this.loading = false;
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
  }
};
</script>
