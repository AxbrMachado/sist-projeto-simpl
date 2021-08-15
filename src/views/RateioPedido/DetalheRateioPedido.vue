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
              <div class="d-flex">
                <strong class="align-self-center">Rateio</strong>
              </div>
            </header>
            <div class="card-body">
              <!-- <div class="row">
                <div class="col">
                  <div class="form-group">
                    <small>Campos com * são de preenchimento obrigatório</small>
                  </div>
                </div>
              </div> -->
              <div class="row">
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-6">
                  <div class="form-group">
                    <label for>Pedido</label>
                    <input
                      disabled
                      v-model="viewModel.pedido"
                      class="form-control"
                      type="text"
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                  <div class="form-group">
                    <label for>Previsão Entrega</label>
                    <input
                      disabled
                      v-model="viewModel.previsaEntrega"
                      class="form-control"
                      type="date"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>Status Pedido</label>
                    <b-form-select
                      disabled
                      v-model="viewModel.statusPedido"
                      :options="statusPedidoOptions"
                    ></b-form-select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                  <div class="form-group">
                    <label for>Data Rateio</label>
                    <input
                      disabled
                      v-model="viewModel.dataRateio"
                      class="form-control"
                      type="date"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                  <div class="form-group">
                    <label for>Status Rateio</label>
                    <b-form-select
                      disabled
                      v-model="viewModel.status"
                      :options="statusRateioOptions"
                    ></b-form-select>
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                  <div class="form-group">
                    <label for>Valor Pedido</label>
                    <currency-input
                      disabled
                      v-model="viewModel.valorPedido"
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                  <div class="form-group">
                    <label for>Valor Rateado</label>
                    <currency-input
                      disabled
                      v-model="viewModel.valorRateado"
                      class="form-control"
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                  <div class="form-group">
                    <label for>Rateio Automático</label>
                    <input
                      disabled
                      v-model="viewModel.automatico"
                      class="form-control"
                      type="text"
                    />
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
    <div v-if="IsEdicao()">
      <!-- <PedidoCliente
        :pedidoId="this.viewModel.id"
        @atualizarRateio="atualizarRateio"
      >
      </PedidoCliente>
      <PedidoProduto :pedidoId="viewModel.id"> </PedidoProduto>
      <PedidoFornecedor :pedidoId="viewModel.id"> </PedidoFornecedor> -->
      <NovoDocumento :referenciaId="this.viewModel.id"> </NovoDocumento>
      <Contato :referenciaId="this.viewModel.id"> </Contato>
    </div>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import DateTime from "../../util/DateTime";
import NovoDocumento from "../../components/NovoDocumento";
import StatusPedidoEnum from "../../enums/StatusPedidoEnum";
import StatusRateioEnum from "../../enums/StatusRateioEnum";
// import PedidoCliente from "./PedidoCliente";
// import PedidoFornecedor from "./PedidoFornecedor";
// import PedidoProduto from "./PedidoProduto";
import Contato from "../../components/Contato";
import Bus from "../../util/EventBus";

export default {
  name: "DetalheRateioPedido",
  components: {
    Bus,
    RotateSquare,
    NovoDocumento,
    StatusPedidoEnum,
    StatusRateioEnum,
    Contato

    // PedidoCliente,
    // PedidoFornecedor,
    // PedidoProduto,
    // Contato
  },
  data() {
    return {
      descricaoRateio: "teste",
      loading: false,
      statusPedidoOptions: [
        { value: StatusPedidoEnum.Pendente, text: "Pendente" },
        { value: StatusPedidoEnum.Aberto, text: "Aberto" },
        {
          value: StatusPedidoEnum.AguardandoProdutos,
          text: "Aguardando Produtos"
        },
        { value: StatusPedidoEnum.Incompleto, text: "Incompleto" },
        { value: StatusPedidoEnum.EmRota, text: "Em Rota" },
        { value: StatusPedidoEnum.Entregue, text: "Entregue" },
        { value: StatusPedidoEnum.Finalizado, text: "Finalizado" },
        { value: StatusPedidoEnum.Cancelado, text: "Cancelado" }
      ],
      statusRateioOptions: [
        { value: StatusRateioEnum.Pendente, text: "Pendente" },
        { value: StatusRateioEnum.Incompleto, text: "Finalizado" },
        { value: StatusRateioEnum.Completo, text: "Cancelado" },
        { value: StatusRateioEnum.Cancelada, text: "Aberto" }
      ],
      tiposInstituicaoOptions: [],
      licitacaoOptions: [],
      contratoOptions: [],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        descricao: ""
      }
    };
  },
  watch: {},
  created() {
    let rateioId = this.$route.params.id;

    if (rateioId) {
      this.viewModel.id = rateioId;
    } else {
      this.viewModel.id = this.$store.getters.emptyGuid;
    }

    if (rateioId) this.Obter(rateioId);
    this.ObterContratosSelect();

    Bus.$on("remocao-produto-pedido", () => {
      this.atualizarRateio();
    });
  },
  methods: {
    ValidarForm(evt) {
      evt.preventDefault();
      this.Editar();
    },
    Obter(rateioId) {
      this.loading = false;
      this.$http({
        url: "rateio/obter/" + rateioId,
        method: "GET"
      })
        .then((resposta) => {
          this.loading = false;
          resposta.data.previsaEntrega = DateTime.formatar(
            resposta.data.previsaEntrega
          );
          resposta.data.dataRateio = DateTime.formatar(
            resposta.data.dataRateio
          );
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
    Editar() {
      this.loading = false;
      this.$http({
        url: "rateio/editar",
        data: this.viewModel,
        method: "PUT"
      })
        .then(() => {
          this.loading = false;
          this.$router.push("/rateiopedido");
          this.$notify({
            data: ["Rateio editado com sucesso."],
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
    ObterContratosSelect() {
      this.$http({
        url: "/contrato/obter-select",
        method: "GET"
      })
        .then((response) => {
          this.contratoOptions = response.data;
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    IsEdicao() {
      return this.viewModel.id !== this.$store.getters.emptyGuid;
    },
    Limpar() {
      this.viewModel.id = this.$store.getters.emptyGuid;
      this.viewModel.descricao = "";
      this.viewModel.observacao = "";
      this.viewModel.contratoId = this.$store.getters.emptyGuid;
      this.viewModel.numero = 0;
      this.viewModel.dataEntrega = "";
      this.viewModel.dataTermino = "";
      this.viewModel.valor = 0;

      this.ObterContratosSelect();
    },
    atualizarRateio() {
      this.Obter(this.viewModel.id);
    }
  }
};
</script>
