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
                >Permissão {{ viewModel.nomeGrupo }}</strong
              >
            </header>
            <div class="card-body">
              <div class="row">
                <div class="col-sm-12 col-md-8 col-lg-6 col-xl-6">
                  <b-table striped responsive :items="viewModel.permissoes">
                    <template v-slot:cell(valor)="data">
                      <div class="center">
                        <span> {{ FormatarNome(data.item.valor) }} </span>
                      </div>
                    </template>
                    <template v-slot:cell(ativo)="data">
                      <div class="center">
                        <b-form-checkbox
                          v-model="data.item.ativo"
                          name="check-button"
                          switch
                        >
                        </b-form-checkbox>
                      </div>
                    </template>
                  </b-table>
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
        permissoes: [],
        nomeGrupo: ""
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
      this.Salvar();
    },
    FormatarNome(nome) {
      return nome.replaceAll(".", " / ");
    },
    Salvar() {
      this.loading = true;
      GrupoUsuarioServico.Permissao(this.viewModel)
        .then((resposta) => {
          this.loading = false;
          this.$notify({
            data: ["Permissão atualizada com sucesso."],
            type: "success",
            duration: 5000
          });
          this.$router.go(-1);
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
    Obter(grupoId) {
      this.loading = true;
      GrupoUsuarioServico.ObterPermissao(grupoId)
        .then((resposta) => {
          this.loading = false;
          this.viewModel = resposta.data;
        })
        .catch((erro) => {
          this.loading = false;
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    }
  }
};
</script>
