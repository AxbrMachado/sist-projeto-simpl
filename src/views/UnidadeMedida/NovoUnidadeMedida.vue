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
                >{{
                  viewModel.id == this.$store.getters.emptyGuid
                    ? "Nova Conversão unidade medida"
                    : "Editar Conversão unidade medida"
                }}
              </strong>
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
                    <label for>* Descrição</label>
                    <input
                      v-model="viewModel.descricao"
                      class="form-control"
                      type="text"
                      placeholder="Digite a descrição"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>* Unidade Medida</label>
                    <b-form-select
                      v-model="viewModel.tipoUnidadeMedidaId"
                      :options="tiposUnidadeMedidaOptions"
                      required
                    ></b-form-select>
                  </div>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>* Quantidade</label>
                    <vue-numeric
                        v-bind:precision="3"
                        v-bind:minus="false"
                        thousand-separator="."
                        decimal-separator=","
                      v-model="viewModel.valor"
                      class="form-control"
                      placeholder="Digite a quantidade"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>* Unidade Medida</label>
                    <b-form-select
                      v-model="viewModel.tipoUnidadeMedidaBaseId"
                      :options="tiposUnidadeMedidaOptions"
                      required
                    ></b-form-select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <div class="form-group">
                    <label for>Observação</label>
                    <b-form-textarea
                      v-model="viewModel.observacao"
                      rows="4"
                      max-rows="12"
                      placeholder="Observações gerais..."
                    ></b-form-textarea>
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
                  @click="$router.push('/unidadeMedida')"
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
import UnidadeMedidaServico from "../../servico/UnidadeMedidaServico";

export default {
  name: "NovoUnidadeMedida",
  components: {
    RotateSquare,
    UnidadeMedidaServico
  },
  data() {
    return {
      loading: false,
      tiposUnidadeMedidaOptions: [],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        descricao: "",
        tipoUnidadeMedidaId: "",
        valor: 0,
        tipoUnidadeMedidaBaseId: ""
      }
    };
  },
  created() {
    let unidadeMedidaId = this.$route.params.id;
    if (unidadeMedidaId) this.Obter(unidadeMedidaId);
    this.ObterTiposUnidadeMedidaSelect();
  },
  methods: {
    ValidarForm(evt) {
      evt.preventDefault();

      if (
        this.viewModel.tipoUnidadeMedidaId ==
        this.viewModel.tipoUnidadeMedidaBaseId
      ) {
        this.loading = false;
        this.$notify({
          data: ["Unidades devem ser diferentes."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      if (this.viewModel.id !== this.$store.getters.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(unidadeMedidaId) {
      this.loading = false;
      UnidadeMedidaServico.Obter(unidadeMedidaId)
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
    },
    Novo() {
      this.loading = false;
      UnidadeMedidaServico.Novo(this.viewModel)
        .then(() => {
          this.loading = false;
          this.$router.push("/unidadeMedida");
          this.$notify({
            data: ["Conversão cadastrada com sucesso."],
            type: "success",
            duration: 5000
          });
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
    Editar() {
      this.loading = false;
      UnidadeMedidaServico.Editar(this.viewModel)
        .then(() => {
          this.loading = false;
          this.$router.push("/unidadeMedida");
          this.$notify({
            data: ["Conversão editado com sucesso."],
            type: "success",
            duration: 5000
          });
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
    ObterTiposUnidadeMedidaSelect() {
      this.$http({
        url: "/tipoUnidadeMedida/obter-select",
        method: "GET"
      })
        .then((response) => {
          this.tiposUnidadeMedidaOptions = response.data;
        })
        .catch((erro) => {
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
