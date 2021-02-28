<template>
  <div class="container fade-in">
    <div class="min-vh-100 d-flex justify-content-center align-content-center">
      <div class="m-auto col-lg-8">
        <div class="card-group">
          <div class="card p-4">
            <div class="card-body">
              <div v-if="loading" class="loading-container">
                <RotateSquare
                  class="loading-position animated fadeIn"
                  size="60px"
                ></RotateSquare>
              </div>
              <form v-else @submit="onFormValidate">
                <h1>Login</h1>
                <p class="text-muted">Efetue o login.</p>
                <div class="d-flex flex-column">
                  <div class="input-group mb-3">
                    <div class="input-group-append">
                      <span class="input-group-text">
                        <CIcon name="cil-user" />
                      </span>
                    </div>
                    <input
                      v-model="email"
                      type="text"
                      class="form-control"
                      placeholder="Usuário"
                      required
                    />
                  </div>

                  <div class="input-group mb-3">
                    <div class="input-group-append">
                      <span class="input-group-text">
                        <CIcon name="cil-lock-locked" />
                      </span>
                    </div>
                    <input
                      v-model="senha"
                      type="password"
                      class="form-control"
                      placeholder="Senha"
                      required
                    />
                  </div>
                  <div
                    v-if="mensagem"
                    class="alert alert-warning alert-dismissible fade show"
                    role="alert"
                  >
                    <strong>{{ mensagem }}</strong>
                    <button
                      type="button"
                      class="close"
                      data-dismiss="alert"
                      aria-label="Close"
                      @click="Fechar()"
                    >
                      <span aria-hidden="true">&times;</span>
                    </button>
                  </div>
                </div>

                <div class="d-flex align-content-around mt-5">
                  <!-- <button class="btn px-4 btn-primary mr-auto" type="submit">Login</button> -->
                  <button class="btn px-4 btn-primary mr-auto" type="submit">
                    Login
                  </button>

                  <button
                    class="btn px-0 btn-link"
                    @click="$router.push('/esqueci-senha')"
                  >
                    Esqueceu a Senha?
                  </button>
                </div>
              </form>
            </div>
          </div>
          <div
            class="card text-center py-5 d-md-down-none bg-primary text-white"
          >
            <h2 class="m-2">Ainda não tem uma conta?</h2>
            <p class="m-5">
              Entre em contato com nossa equipe de vendas para maiores
              informações.
            </p>
            <div>
              <button
                href="https://www.cooperar.coop.br/"
                target="_blank"
                class="btn btn-primary active mt-3"
              >
                Contratar agora!
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";

export default {
  name: "Login",
  components: { RotateSquare },
  data() {
    return {
      loading: false,
      email: "",
      senha: "",
      mensagem: ""
    };
  },
  computed: {
    ViewModel() {
      return {
        Email: this.email,
        Senha: this.senha
      };
    }
  },
  mounted() {
    if (this.$store.getters.isLoggedIn) {
      this.$router.push("/");
    }
  },
  methods: {
    onFormValidate(evt) {
      evt.preventDefault();

      this.Login();
    },
    Fechar() {
      this.mensagem = "";
    },
    Login() {
      this.loading = true;
      this.$http({
        url: "login/autenticar",
        data: this.ViewModel,
        method: "POST"
      })
        .then((resp) => {
          this.loading = false;
          const token = resp.data;
          // Add the following line:
          this.$http.defaults.headers.common["Authorization"] =
            "bearer " + token.tokenDeAcesso;
          this.$store
            .dispatch("login", token)
            .then(() => this.$router.push("/"));
        })
        .catch((erro) => {
          this.loading = false;
          console.error("Erro Login:", erro);
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 10000
          });
          localStorage.removeItem("user-token");
        });
    }
  }
};
</script>
