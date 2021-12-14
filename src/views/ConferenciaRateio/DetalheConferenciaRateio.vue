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
                <strong class="align-self-center"
                  >Conferência Rateio Pedido</strong
                >
                <a
                  @click="ReiniciarConferencia()"
                  class="ml-auto btn btn-danger"
                  title="Reiniciar conferência?"
                  href="#"
                >
                  Reiniciar Conferência
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
                      v-model="viewModel.previsaoEntrega"
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
                    <label for>Status Conferência</label>
                    <b-form-select
                      disabled
                      v-model="viewModel.statusConferencia"
                      :options="statusConferenciaOptions"
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
                    <label for>Valor Conferido</label>
                    <currency-input
                      disabled
                      v-model="viewModel.valorConferido"
                      class="form-control"
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
                  class="btn btn-secondary mr-2"
                  type="reset"
                  @click="$router.go(-1)"
                >
                  Voltar
                </button>
              </div>
              <div
                v-if="isConferenciaCompleta()"
                class="btn-group"
                role="group"
              >
                <a
                  @click="FinalizarConferencia()"
                  class="ml-auto btn btn-info"
                  title="Finalizar conferência?"
                  href="#"
                >
                  Finalizar Conferência
                </a>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <b-modal
      v-model="modalReiniciarConferencia"
      title="Reiniciar Conferência"
      class="modal-danger"
      ok-variant="info"
      @ok="modalReiniciarConferenciaOk"
      @hidden="modalReiniciarConferenciaCancel"
    >
      Você confirma o reinício da conferência do pedido?
    </b-modal>
    <b-modal
      v-model="modalFinalizarConferencia"
      title="Finalizar Conferência"
      class="modal-info"
      ok-variant="info"
      @ok="modalFinalizarConferenciaOk"
      @hidden="modalFinalizarConferenciaCancel"
    >
      Você confirma a finalização da conferência do pedido?
    </b-modal>
    <div>
      <ConferenciaFornecedor
        :rateioId="this.viewModel.rateioId"
        :conferenciaId="this.viewModel.id"
        @atualizarConferencia="LoadConferencia"
      >
      </ConferenciaFornecedor>
      <!-- <ConferenciaProduto
        :rateioId="this.viewModel.rateioId"
        :conferenciaId="this.viewModel.id"
        :pedidoId="this.viewModel.pedidoId"
        @atualizarConferencia="LoadConferencia"
      >
      </ConferenciaProduto> -->
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
import StatusConferenciaEnum from "../../enums/StatusConferenciaEnum";
import ConferenciaFornecedor from "./ConferenciaFornecedor";
import ConferenciaProduto from "./ConferenciaProduto";
import ConferenciaRateioServico from "../../servico/ConferenciaRateioServico";
import Contato from "../../components/Contato";
import Bus from "../../util/EventBus";

export default {
  name: "DetalheConferenciaRateio",
  components: {
    Bus,
    RotateSquare,
    NovoDocumento,
    StatusPedidoEnum,
    StatusRateioEnum,
    Contato,
    ConferenciaFornecedor,
    ConferenciaProduto,
    ConferenciaRateioServico
  },
  data() {
    return {
      loading: false,
      modalReiniciarConferencia: false,
      modalFinalizarConferencia: false,
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
      statusConferenciaOptions: [
        { value: StatusConferenciaEnum.Pendente, text: "Pendente" },
        { value: StatusConferenciaEnum.Iniciada, text: "Iniciada" },
        { value: StatusConferenciaEnum.Completa, text: "Completa" },
        { value: StatusConferenciaEnum.Finalizada, text: "Finalizada" },
        { value: StatusConferenciaEnum.Cancelada, text: "Cancelado" }
      ],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        rateioId: this.$store.getters.emptyGuid,
        descricao: ""
      }
    };
  },
  watch: {},
  created() {
    this.viewModel.id = this.$route.params.id;
    this.Obter(this.$route.params.id);

    Bus.$on("alterado-produto-fornecedor", () => {
      this.LoadConferencia();
    });

    Bus.$on("alterado-rateio-produtor", () => {
      this.LoadConferencia();
    });
  },
  methods: {
    ValidarForm(evt) {
      evt.preventDefault();
      this.Editar();
    },
    Obter(conferenciaId) {
      this.loading = false;

      ConferenciaRateioServico.Obter(conferenciaId)
        .then((resposta) => {
          this.loading = false;
          resposta.data.previsaoEntrega = DateTime.formatar(
            resposta.data.previsaoEntrega
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

      ConferenciaRateioServico.Editar(this.viewModel)
        .then(() => {
          this.loading = false;
          this.$router.push("/conferencia-rateio");
          this.$notify({
            data: ["Conferência salva com sucesso."],
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
    LoadConferencia() {
      this.Obter(this.viewModel.id);
      Bus.$emit("rateio-efetuado");
    },
    ReiniciarConferencia() {
      this.modalReiniciarConferencia = true;
    },
    modalReiniciarConferenciaCancel(evento) {
      evento.preventDefault();
      this.modalReiniciarConferencia = false;
    },
    modalReiniciarConferenciaOk(evento) {
      evento.preventDefault();
      this.modalReiniciarConferencia = false;
      if (!this.viewModel.id) return;
      ConferenciaRateioServico.ReiniciarConferencia(this.viewModel.id)
        .then(() => {
          this.Obter(this.viewModel.id);
          Bus.$emit("rateio-efetuado");
          this.$notify({
            data: ["Conferência reiniciada com sucesso."],
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
    },
    isConferenciaCompleta() {
      return this.viewModel.statusConferencia == StatusConferenciaEnum.Completa;
    },
    FinalizarConferencia() {
      this.modalFinalizarConferencia = true;
    },
    modalFinalizarConferenciaCancel(evento) {
      evento.preventDefault();
      this.modalFinalizarConferencia = false;
    },
    modalFinalizarConferenciaOk(evento) {
      ConferenciaRateioServico.FinalizarConferencia(this.viewModel.id)
        .then(() => {
          this.Obter(this.viewModel.id);
          Bus.$emit("rateio-efetuado");
          this.$notify({
            data: ["Conferência finalizada com sucesso."],
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
