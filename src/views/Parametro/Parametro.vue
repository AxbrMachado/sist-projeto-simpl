<template>
  <div>
    <div class="animated fadeIn">
      <div v-if="loading" class="loading-container">
        <RotateSquare
          class="loading-position animated fadeIn"
          size="60px"
        ></RotateSquare>
      </div>
      <div v-else class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-6">
          <div class="card">
            <header class="card-header">
              <strong>Outros</strong>
            </header>
            <div class="card-body">
              <div class="row">
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <label for>Versão: {{ viewModel.versao }}</label>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <button class="btn btn-success mr-2" @click="Salvar()">Salvar</button>
      <button class="btn btn-secondary" @click="$router.push('/')">
        Voltar
      </button>
    </div>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";

export default {
  name: "Parametro",
  components: {
    RotateSquare
  },
  data() {
    return {
      loading: false,
      viewModel: {
        versao: "",
        quantidadeUsuario: 0
      }
    };
  },
  computed: {},
  mounted() {
    this.Obter();
  },
  methods: {
    Salvar() {
      this.loading = true;
      this.$http({
        url: "parametro/editar",
        data: this.viewModel,
        method: "POST"
      })
        .then(() => {
          this.loading = false;
          this.$notify({
            data: ["Parâmetros salvo com sucesso."],
            type: "success",
            duration: 10000
          });
        })
        .catch((erro) => {
          this.loading = false;
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 10000
          });
        });
    },
    Obter() {
      this.loading = true;
      this.$http({
        url:
          "parametro/obter/" +
          this.$store.getters.getAutenticacao.contaSelecionadaId,
        method: "GET"
      })
        .then((resp) => {
          this.viewModel = resp.data;
          this.loading = false;
        })
        .catch((erro) => {
          this.loading = false;
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 10000
          });
        });
    }
  }
};
</script>
