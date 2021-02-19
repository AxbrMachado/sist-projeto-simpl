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
              <strong class="align-self-center">Trocar Senha</strong>
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
                    <label for>* Senha Atual</label>
                    <input
                      v-model="viewModel.senha"
                      class="form-control"
                      maxlength="35"
                      type="password"
                      placeholder="Digite senha"
                      required
                      @paste.prevent
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>* Nova Senha</label>
                    <input
                      v-model="viewModel.novaSenha"
                      class="form-control"
                      maxlength="35"
                      type="password"
                      placeholder="Digite senha"
                      required
                      @paste.prevent
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>* Confirmar Nova Senha</label>
                    <input
                      v-model="viewModel.confirmarSenha"
                      class="form-control"
                      maxlength="35"
                      type="password"
                      placeholder="Digite senha"
                      required
                      @paste.prevent
                    />
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="btn btn-success mr-2" type="submit">Salvar</button>
          <button
            class="btn btn-secondary"
            type="reset"
            @click="$router.push('/')"
          >
            Voltar
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";

export default {
  name: "NovoUsuario",
  components: {
    RotateSquare
  },
  data() {
    return {
      loading: false,
      contaOptions: [],
      viewModel: {
        novaSenha: "",
        confirmarSenha: "",
        senha: "",
        contaId: this.$store.getters.getAutenticacao.contaSelecionadaId,
        usuarioId: this.$store.getters.getAutenticacao.usuarioId
      }
    };
  },
  methods: {
    onPaste(evt) {},
    ValidarForm(evt) {
      evt.preventDefault();
      if (this.viewModel.novaSenha !== this.viewModel.confirmarSenha) {
        this.$notify({
          data: ["A nova senha não confere."],
          type: "warn",
          duration: 10000
        });
      } else {
        this.Trocar();
      }
    },
    Trocar() {
      this.loading = true;
      this.$http({
        url: "usuario/trocar-senha",
        data: this.viewModel,
        method: "POST"
      })
        .then(() => {
          this.loading = false;
          this.$router.push("/");
          this.$notify({
            data: ["Senha alterada com sucesso."],
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
    }
  }
};
</script>
