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
              <strong class="align-self-center">Novo Usuário</strong>
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
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>* E-mail</label>
                    <input
                      v-model="viewModel.email"
                      class="form-control"
                      type="email"
                      placeholder="Digite o e-mail"
                      required
                    />
                  </div>
                </div>
                
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>* Senha</label>
                    <input
                      v-model="viewModel.senha"
                      class="form-control"
                      type="password"
                      placeholder="Digite senha"
                      required
                    />
                  </div>
                </div>
                <!-- <div
                  class="col-sm-12 col-md-4 col-lg-4 col-xl-4"
                  title="Perfil de acesso do usuário ao sistema."
                >
                  <div class="form-group">
                    <label for>* Perfil</label>
                    <select
                      v-model="viewModel.perfil"
                      class="form-control"
                      required
                    >
                      <option disabled selected value>
                        Selecione...
                      </option>
                      <option value="2">Administrador</option>
                      <option value="3">Comum</option>
                    </select>
                  </div>
                </div> -->
                <div
                  class="col-sm-6 col-md-2 col-lg-2 col-xl-1"
                  title="Informa se o usuário está ativo para utilizar o sistema."
                >
                  <label for>Ativo</label>
                  <b-form-checkbox
                    v-model="viewModel.ativo"
                    name="check-button"
                    switch
                  >
                    Sim
                  </b-form-checkbox>
                </div>
              </div>
              <!-- <div class="row">
                <div
                  class="col-sm-12 col-md-7 col-lg-7 col-xl-5"
                  title="Digite a(s) empresa(s) que o usuário será liberado."
                >
                  <div class="form-group">
                    <label for>* Empresa</label>
                  </div>
                  <v-select
                    v-model="viewModel.contas"
                    placeholder="Selecione a(s) empresa(s)"
                    :options="contaOptions"
                    multiple
                    required
                  >
                    <template slot="no-options">
                      Aguarde... Nenhum resultado para a busca.
                    </template>
                  </v-select>
                </div>
              </div> -->
            </div>
          </div>
          <button class="btn btn-success mr-2" type="submit">Salvar</button>
          <button
            class="btn btn-secondary"
            type="reset"
            @click="$router.push('/usuario')"
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
        id: this.$store.state.emptyGuid,
        atendente: false,
        ativo: true,
        email: "",
        nome: "",
        senha: ""
      }
    };
  },
  created() {
    let usuarioId = this.$route.params.id;
    if (usuarioId) this.Obter(usuarioId);
  },
  methods: {
    ValidarForm(evt) {
      evt.preventDefault();
      if (this.viewModel.id !== this.$store.state.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(usuarioId) {
      this.loading = true;
      this.$http({
        url:
          "usuario/obter/" +
          usuarioId +
          "/" +
          this.$store.getters.getAutenticacao.contaSelecionadaId,
        method: "GET"
      })
        .then((resposta) => {
          this.loading = false;
          this.viewModel = resposta.data;
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
    Novo() {
      this.loading = true;
      this.$http({
        url: "usuario/novo",
        data: this.viewModel,
        method: "POST"
      })
        .then(() => {
          this.loading = false;
          this.$router.push("/usuario");
          this.$notify({
            data: ["Usuário cadastrado com sucesso."],
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
    Editar() {
      this.loading = true;
      this.$http({
        url: "usuario/editar",
        data: this.viewModel,
        method: "PUT"
      })
        .then(() => {
          this.loading = false;
          this.$router.push("/usuario");
          this.$notify({
            data: ["Usuário editado com sucesso."],
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
