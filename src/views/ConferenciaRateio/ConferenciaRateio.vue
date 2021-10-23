<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <header class="card-header">
            <div class="d-flex">
              <strong class="align-self-center">Conferência Rateio</strong>
            </div>
          </header>
          <div v-if="loading" class="loading-container">
            <RotateSquare
              class="loading-position animated fadeIn"
              size="60px"
            ></RotateSquare>
          </div>
          <div v-else class="card-body">
            <div class="row">
              <div class="col-lg-2 col-md-6 col-sm-12">
                <div class="form-group">
                  <label>Pedido</label>
                  <input
                    type="text"
                    v-model="filtro.pedido"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="form-group">
                  <label for>Instituição</label>
                  <v-select
                    placeholder="Digite uma instituição.."
                    v-model="filtro.instituicao"
                    :options="instituicaoOptions"
                    @search="ObterInstituicaoVSelect"
                  >
                    <template slot="no-options">
                      Nenhum resultado para a busca.
                    </template>
                  </v-select>
                </div>
              </div>
              <div class="col-lg-2 col-md-6 col-sm-12">
                <div class="form-group">
                  <label for>Status Conferencia</label>
                  <b-form-select
                    v-model="filtro.statusConferencia"
                    :options="statusConferenciaOptions"
                  ></b-form-select>
                </div>
              </div>
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                <div class="form-group">
                  <label for>Status Rateio</label>
                  <b-form-select
                    v-model="filtro.statusRateio"
                    :options="statusRateioOptions"
                  ></b-form-select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                <div class="form-group">
                  <label for>Previsão Entrega</label>
                  <input
                    v-model="filtro.dataEntrega"
                    class="form-control"
                    type="date"
                    placeholder="Digite a data de entrega"
                  />
                </div>
              </div>
              <div class="col-lg-4 col-md-5 col-sm-12 mt-4">
                <button
                  class="btn btn-primary mr-2"
                  type="button"
                  @click="ObterGrid(1)"
                >
                  Filtrar
                </button>
                <button
                  class="btn btn-secondary"
                  type="button"
                  @click="Limpar()"
                >
                  Limpar
                </button>
              </div>
            </div>

            <b-table
              :hover="true"
              responsive
              :items="itens"
              :fields="fields"
              striped
              :per-page="itensPorPagina"
              show-empty
              empty-text="Nenhuma conferência encontrada."
            >
              <template v-slot:empty="scope">
                <h4>{{ scope.emptyText }}</h4>
              </template>
              <template v-slot:cell(acoes)="data">
                <div class="btn-group-sm">
                  <b-button
                    v-if="!isConferenciaExistente(data.item)"
                    variant="info"
                    style="margin-right: 10px"
                    title="Iniciar Conferência"
                    @click="IniciarConferencia(data.item)"
                  >
                    <i class="fa fa-tasks"></i>
                  </b-button>
                  <b-button
                    v-if="
                      isConferenciaExistente(data.item) &&
                      isUsuarioConferente(data.item)
                    "
                    variant="warning"
                    style="margin-right: 10px"
                    title="Visualizar Conferência"
                    @click="Editar(data.item)"
                  >
                    <i class="fa fa-edit"></i>
                  </b-button>
                  <b-button
                    v-if="
                      isConferenciaExistente(data.item) &&
                      isUsuarioConferente(data.item)
                    "
                    variant="danger"
                    style="margin-right: 10px"
                    title="Cancelar Conferência"
                    @click="CancelarConferencia(data.item)"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </b-button>

                  <ModalArquivoGrid :referenciaId="data.item.id" />

                  <b-button
                    v-if="isConferenciaExistente(data.item)"
                    variant="dark"
                    style="margin-right: 10px"
                    title="Imprmir informações conferência"
                    @click="ImprimirConferenciaPedido(data.item)"
                  >
                    <i class="fas fa-print"></i>
                  </b-button>

                  <b-button
                    v-if="
                      isConferenciaExistente(data.item) &&
                      !isUsuarioConferente(data.item)
                    "
                    variant="info"
                    style="margin-right: 10px"
                    title="Assumir conferência"
                    @click="AssumirConferencia(data.item)"
                  >
                    <i class="fas fa-user-tag"></i>
                    <!-- <i class="fas fa-print"></i> -->
                  </b-button>
                </div>
              </template>
              <template v-slot:cell(dataEntrega)="data">
                <div class="center">
                  <span>{{ FormatarData(data.item.dataEntrega) }}</span>
                </div>
              </template>
              <template v-slot:cell(dataRateio)="data">
                <div class="center">
                  <span>{{ FormatarData(data.item.dataRateio) }}</span>
                </div>
              </template>
              <template v-slot:cell(valor)="data">
                <div class="left">
                  <span>{{ FormataValor(data.item.valor) }}</span>
                </div>
              </template>
              <template v-slot:cell(valorRateado)="data">
                <div class="left">
                  <span>{{ FormataValor(data.item.valorRateado) }}</span>
                </div>
              </template>
              <template v-slot:cell(statusConferencia)="data">
                <div class="left">
                  <span>{{
                    ObterNomeStatusConferencia(data.item.statusConferencia)
                  }}</span>
                </div>
              </template>
              <template v-slot:cell(statusRateio)="data">
                <div class="left">
                  <span>{{
                    ObterNomeStatusRateio(data.item.statusRateio)
                  }}</span>
                </div>
              </template>
              <template v-slot:cell(manual)="data">
                <div class="center">
                  <span v-if="!data.item.manual" class="badge badge-success">
                    Sim
                  </span>
                  <span v-else class="badge badge-danger">Não</span>
                </div>
              </template>
              <template v-slot:cell(usuarioCadastro)="data">
                <div class="left">
                  <span>{{ FormatarUsuario(data.item) }}</span>
                </div>
              </template>
            </b-table>
            <b-pagination
              v-model="pagina"
              :total-rows="total"
              :per-page="itensPorPagina"
              align="right"
              size="md"
              class="mt-2"
            ></b-pagination>
            <b-modal
              v-model="modalCancelarConferencia"
              title="Confirmar exclusão"
              class="modal-danger"
              ok-variant="danger"
              @ok="ModalCancelarConferenciaOk"
              @hidden="ModalCancelelarConferenciaCancel"
            >
              As informações de produtos conferidos serão perdidas.
              <br />Você confirma a exclusão do processo de conferência? <br />
            </b-modal>
            <b-modal
              v-model="modalImpressao"
              title="Impressão"
              class="modal-info"
              ok-variant="info"
            >
              Rotina de impressão em desenvolvimento
            </b-modal>
            <b-modal
              v-model="modalIniciarConferencia"
              title="Iniciar conferência do rateio"
              class="modal-danger"
              ok-variant="info"
              @ok="ModalIniciarConferenciaOk"
              @hidden="ModalIniciarConferenciaCancel"
            >
              Ao iniciar a confenrência do rateio o mesmo não poderá ser
              alterado. Confirma?
            </b-modal>
            <b-modal
              v-model="modalAssumirConferencia"
              title="Assumir Conferência"
              class="modal-danger"
              ok-variant="info"
              @ok="ModalAssumirConferenciaOk"
              @hidden="ModalAssumirConferenciaCancel"
            >
              <br />Confirma que você irá efetuar a conferência do rateio do
              pedido? <br />
            </b-modal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RotateSquare from "../../components/RotateSquare";
import ConferenciaRateioServico from "../../servico/ConferenciaRateioServico";
import PessoaServico from "../../servico/PessoaServico";
import StatusConferenciaEnum from "../../enums/StatusConferenciaEnum";
import StatusRateioEnum from "../../enums/StatusRateioEnum";
import TipoPessoaEnum from "../../enums/TipoPessoaEnum";
import ModalArquivoGrid from "../../components/ModalArquivoGrid";

import Bus from "../../util/EventBus";

export default {
  name: "ConferenciaRateio",
  components: {
    RotateSquare,
    ConferenciaRateioServico,
    Bus,
    ModalArquivoGrid
  },
  data() {
    return {
      modalImpressao: false,
      modalCancelarConferencia: false,
      modalIniciarConferencia: false,
      modalAssumirConferencia: false,
      rateioId: null,
      conferenciaId: null,
      itemConferencia: null,
      loading: false,
      itens: [],
      pagina: 1,
      total: 0,
      itensPorPagina: 20,
      instituicaoOptions: [],
      filtro: {
        pedido: "",
        instituicao: "",
        statusConferencia: null,
        statusRateio: null,
        dataEntrega: ""
      },
      statusConferenciaOptions: [
        { value: StatusConferenciaEnum.Pendente, text: "Pendente" },
        { value: StatusConferenciaEnum.Iniciada, text: "Iniciada" },
        { value: StatusConferenciaEnum.Completa, text: "Completa" },
        { value: StatusConferenciaEnum.Finalizada, text: "Finalizada" },
        { value: StatusConferenciaEnum.Cancelada, text: "Cancelada" }
      ],
      statusRateioOptions: [
        { value: StatusRateioEnum.Incompleto, text: "Incompleto" },
        { value: StatusRateioEnum.Atendido, text: "Atendido" },
        { value: StatusRateioEnum.Confirmado, text: "Confirmado" },
        { value: StatusRateioEnum.Conferido, text: "Conferido" },
        { value: StatusRateioEnum.Cancelado, text: "Cancelado" }
      ],
      fields: [
        { key: "pedido", label: "Pedido", sortable: true },
        // { key: "instituicao", label: "Instituição", sortable: true },
        { key: "dataEntrega", label: "Previsão Entrega", sortable: true },
        {
          key: "statusConferencia",
          label: "Status Conferência",
          sortable: true
        },
        { key: "valorRateado", label: "Valor Rateado", sortable: true },
        { key: "manual", label: "Rateio Automático", sortable: true },
        { key: "dataRateio", label: "Data Rateio", sortable: true },
        {
          key: "statusRateio",
          label: "Status Rateio",
          sortable: true
        },
        { key: "usuarioConferente", label: "Conferente", sortable: true },
        {
          key: "acoes",
          label: "Ações",
          sortable: false,
          thClass: "center, wd-120-px"
        }
      ]
    };
  },
  watch: {
    pagina: function (val) {
      this.ObterGrid(val);
    }
  },
  mounted() {
    this.ObterGrid(1);
  },
  methods: {
    Limpar() {
      this.filtro.pedido = "";
      this.filtro.instituicao = "";
      this.filtro.statusConferencia = null;
      this.filtro.statusRateio = null;
      this.filtro.dataEntrega = "";
    },
    Editar(item) {
      this.$router.push("/conferencia-rateio/editar/" + item.id);
    },
    CancelarConferencia(item) {
      this.modalCancelarConferencia = true;
      this.itemConferencia = item;
    },
    ModalCancelelarConferenciaCancel(evento) {
      evento.preventDefault();
      this.itemConferencia = null;
    },
    ModalCancelarConferenciaOk(evento) {
      evento.preventDefault();
      this.modalCancelarConferencia = false;
      if (!this.itemConferencia) return;

      ConferenciaRateioServico.CancelarConferencia(this.itemConferencia.id)
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Conferência removida com sucesso."],
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
    ObterGrid(pagina) {
      this.loading = false;
      ConferenciaRateioServico.ObterGrid(
        pagina,
        this.itensPorPagina,
        this.pedido,
        this.filtro.instituicao.id,
        this.filtro.statusConferencia,
        this.filtro.statusRateio,
        this.filtro.dataEntrega
      )
        .then((response) => {
          this.loading = false;
          this.itens = response.data.itens;
          this.total = response.data.total;
          this.pagina = response.data.pagina;
          this.itensPorPagina = response.data.itensPorPagina;
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
    ObterInstituicaoVSelect(busca) {
      if (!busca || busca.length <= 2) return;

      PessoaServico.ObterVSelect(busca, TipoPessoaEnum.Instituicao)
        .then((response) => {
          this.instituicaoOptions = response.data;
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    ObterNomeStatusConferencia(item) {
      switch (item) {
        case StatusConferenciaEnum.Pendente:
          return "Pendente";
        case StatusConferenciaEnum.Iniciada:
          return "Iniciada";
        case StatusConferenciaEnum.Completa:
          return "Completa";
        case StatusConferenciaEnum.Finalizada:
          return "Finalizada";
        case StatusConferenciaEnum.Cancelada:
          return "Cancelada";
        default:
          return "-";
      }
    },
    ObterNomeStatusRateio(item) {
      switch (item) {
        case StatusRateioEnum.Incompleto:
          return "Incompleto";
        case StatusRateioEnum.Atendido:
          return "Atendido";
        case StatusRateioEnum.Confirmado:
          return "Confirmado";
        case StatusRateioEnum.Conferido:
          return "Conferido";
        case StatusRateioEnum.Cancelado:
          return "Cancelado";
        default:
          return "-";
      }
    },
    FormatarData(value) {
      return value ? new Date(value).toLocaleDateString() : "";
    },
    FormataValor(value) {
      return (value ? value : 0.0).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    },
    FormatarUsuario(value) {
      if (value.usuarioAlteracao) {
        return value.usuarioAlteracao;
      } else if (value.usuarioCadastro) {
        return value.usuarioCadastro;
      } else {
        return "-";
      }
    },
    isConferenciaExistente(item) {
      return !item ? false : !(item.id === this.$store.getters.emptyGuid);
    },
    IniciarConferencia(item) {
      this.modalIniciarConferencia = true;
      this.rateioId = item.rateioId;
    },
    ModalIniciarConferenciaCancel(evento) {
      evento.preventDefault();
      this.rateioId = null;
    },
    ModalIniciarConferenciaOk(evento) {
      evento.preventDefault();
      this.modalIniciarConferencia = false;
      if (!this.rateioId) return;

      ConferenciaRateioServico.IniciarConferencia(this.rateioId)
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Conferência aberta com sucesso."],
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
    ImprimirConferenciaPedido(item) {
      this.modalImpressao = true;
    },
    AssumirConferencia(item) {
      this.conferenciaId = item.id;
      this.modalAssumirConferencia = true;
    },
    ModalAssumirConferenciaCancel(evento) {
      evento.preventDefault();
      this.conferenciaId = null;
    },
    ModalAssumirConferenciaOk(evento) {
      evento.preventDefault();
      this.modalAssumirConferencia = false;

      if (!this.conferenciaId) return;

      ConferenciaRateioServico.AssumirConferencia(this.conferenciaId)
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Conferência assumida com sucesso."],
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
    isUsuarioConferente(item) {
      return item.ehConferente;
    }
  }
};
</script>
