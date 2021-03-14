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
              <strong class="align-self-center">Nova Dap</strong>
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
                    <label for>* Número</label>
                    <input
                      v-model="viewModel.numero"
                      class="form-control"
                      type="text"
                      placeholder="Digite o numero"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>* Tipo Enquadramento</label>
                    <b-form-select
                      v-model="viewModel.tipoEnquadramento"
                      :options="tipoEnquadramentos"
                    ></b-form-select>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>* Validade</label>
                    <input
                      v-model="viewModel.validade"
                      class="form-control"
                      type="date"
                      placeholder="Digite a validade"
                      required
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
            @click="$router.push('/dap')"
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
import TipoEnquadramentoEnum from "../../enums/TipoEnquadramentoEnum";

export default {
  name: "NovoDap",
  components: {
    RotateSquare
  },
  data() {
    return {
      loading: false,
      contaOptions: [],
      tipoEnquadramentos: [
        { value: TipoEnquadramentoEnum.Grupo_A, text: "A" },
        { value: TipoEnquadramentoEnum.Grupo_B, text: "B" },
        { value: TipoEnquadramentoEnum.GRUPO_AC, text: "AC" },
        { value: TipoEnquadramentoEnum.V, text: "V" }
      ],
      viewModel: {
        id: this.$store.state.emptyGuid,
        numero: "",
        validade: "",
        tipoEnquadramento: 0
      }
    };
  },
  created() {
    let dapId = this.$route.params.id;
    if (dapId) this.Obter(dapId);
  },
  methods: {
    ValidarForm(evt) {
      evt.preventDefault();
      if (this.viewModel.id !== this.$store.state.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(dapId) {
      this.loading = true;
      this.$http({
        url: "dap/obter/" + dapId,
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
        url: "dap/novo",
        data: this.viewModel,
        method: "POST"
      })
        .then(() => {
          this.loading = false;
          this.$router.push("/dap");
          this.$notify({
            data: ["Dap cadastrada com sucesso."],
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
        url: "dap/editar",
        data: this.viewModel,
        method: "PUT"
      })
        .then(() => {
          this.loading = false;
          this.$router.push("/dap");
          this.$notify({
            data: ["Dap editada com sucesso."],
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
