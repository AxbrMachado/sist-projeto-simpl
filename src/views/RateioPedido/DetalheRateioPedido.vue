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
                <a
                  @click="RecalcularRateioAutomatico()"
                  class="ml-auto btn btn-danger"
                  title="Recalcular rateio automático"
                  href="#"
                >
                  Recalcular Rateio Automático
                </a>
              </div>
            </header>
            <div class="card-body">
              <div class="row">
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-6">
                  <div class="form-group">
                    <label for>Pedido</label>
                    <input
                      bold
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
    <b-modal
      v-model="modalRateio"
      title="Confirmar execução rateio"
      class="modal-danger"
      ok-variant="info"
      @ok="ModalRateioOk"
      @hidden="ModalRateioCancel"
    >
      Você confirma a execução do rateio para este pedido?
    </b-modal>
    <div>
      <RateioFornecedor
        :rateioId="this.viewModel.id"
        :conferenciaId="this.viewModel.conferenciaId"
        @atualizarRateio="AtualizarRateio"
      >
      </RateioFornecedor>
      <RateioProduto
        :rateioId="this.viewModel.id"
        :conferenciaId="this.viewModel.conferenciaId"
        :pedidoId="this.viewModel.pedidoId"
        @atualizarRateio="AtualizarRateio"
      >
      </RateioProduto>
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
import RateioFornecedor from "./RateioFornecedor";
import RateioProduto from "./RateioProduto";
import RateioServico from "../../servico/RateioServico";
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
    Contato,
    RateioFornecedor,
    RateioServico,
    RateioProduto
  },
  data() {
    return {
      loading: false,
      modalRateio: false,
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
        { value: StatusPedidoEnum.Cancelado, text: "Cancelado" },
        { value: StatusPedidoEnum.AguardandoRateio, text: "Aguardando Rateio" },
        {
          value: StatusPedidoEnum.AguardandoConferencia,
          text: "Aguardando Conferência"
        },
        { value: StatusPedidoEnum.Conferido, text: "Conferido" }
      ],
      statusRateioOptions: [
        { value: StatusRateioEnum.Incompleto, text: "Incompleto" },
        { value: StatusRateioEnum.Atendido, text: "Atendido" },
        { value: StatusRateioEnum.Confirmado, text: "Confirmado" },
        { value: StatusRateioEnum.Conferido, text: "Conferido" },
        { value: StatusRateioEnum.Cancelado, text: "Cancelado" }
      ],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        conferenciaId: this.$store.getters.emptyGuid,
        descricao: ""
      }
    };
  },
  watch: {},
  created() {
    this.viewModel.id = this.$route.params.id;
    this.Obter(this.$route.params.id);

    Bus.$on("alterado-produto-fornecedor", () => {
      this.AtualizarRateio();
    });

    Bus.$on("alterado-rateio-produtor", () => {
      this.AtualizarRateio();
    });
  },
  methods: {
    ValidarForm(evt) {
      evt.preventDefault();
      this.Editar();
    },
    Obter(rateioId) {
      this.loading = false;

      RateioServico.Obter(rateioId)
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

      RateioServico.Editar(this.viewModel)
        .then(() => {
          this.loading = false;
          this.$router.push("/rateio-pedido");
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
    AtualizarRateio() {
      this.Obter(this.viewModel.id);
      Bus.$emit("rateio-efetuado");
    },
    RecalcularRateioAutomatico() {
      this.modalRateio = true;
    },
    ModalRateioCancel(evento) {
      evento.preventDefault();
      this.modalRateio = false;
    },
    ModalRateioOk(evento) {
      evento.preventDefault();
      this.modalRateio = false;
      if (!this.viewModel.pedidoId) return;
      RateioServico.EfetuarRateio(this.viewModel.pedidoId)
        .then(() => {
          this.Obter(this.viewModel.id);
          Bus.$emit("rateio-efetuado");
          this.$notify({
            data: ["Rateio executado com sucesso."],
            type: "success",
            duration: 5000
          });
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
