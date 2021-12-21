<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <header class="card-header">
            <div class="d-flex">
              <strong class="align-self-center">Entrega Pedido</strong>
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
              <div class="col-lg-1 col-md-6 col-sm-12">
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
                  <label for>Status Pedido</label>
                  <b-form-select
                    v-model="filtro.statusPedido"
                    :options="statusPedidoOptions"
                  ></b-form-select>
                </div>
              </div>

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
              empty-text="Nenhuma Entrega encontrada."
            >
              <template v-slot:empty="scope">
                <h4>{{ scope.emptyText }}</h4>
              </template>
              <template v-slot:cell(acoes)="data">
                <div class="btn-group-sm">
                  <b-button
                    variant="info"
                    style="margin-right: 10px"
                    title="Iniciar Entrega"
                    @click="Teste(data.item)"
                  >
                    <i class="fa fa-tasks"></i>
                  </b-button>
                  <b-button
                    variant="warning"
                    style="margin-right: 10px"
                    title="Visualizar Entrega"
                    @click="Teste(data.item)"
                  >
                    <i class="fa fa-edit"></i>
                  </b-button>
                  <b-button
                    variant="danger"
                    style="margin-right: 10px"
                    title="Cancelar Entrega"
                    @click="Teste(data.item)"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </b-button>

                  <ModalArquivoGrid :referenciaId="data.item.id" />

                  <b-button
                    variant="dark"
                    style="margin-right: 10px"
                    title="Imprimir informações Entrega"
                    @click="Teste(data.item)"
                  >
                    <i class="fas fa-print"></i>
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
              <template v-slot:cell(statusPedido)="data">
                <div class="left">
                  <span>{{
                    ObterNomestatusPedido(data.item.statusPedido)
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
              <br />Você confirma a exclusão do processo de Entrega? <br />
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
              title="Iniciar Entrega do rateio"
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
              title="Assumir Entrega"
              class="modal-danger"
              ok-variant="info"
              @ok="ModalAssumirConferenciaOk"
              @hidden="ModalAssumirConferenciaCancel"
            >
              <br />Confirma que você irá efetuar a Entrega do rateio do pedido?
              <br />
            </b-modal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RotateSquare from "../../components/RotateSquare";
import EntregaPedidoServico from "../../servico/EntregaPedidoServico";
import PessoaServico from "../../servico/PessoaServico";
import StatusPedidoEnum from "../../enums/StatusPedidoEnum";
import StatusRateioEnum from "../../enums/StatusRateioEnum";
import TipoPessoaEnum from "../../enums/TipoPessoaEnum";
import ModalArquivoGrid from "../../components/ModalArquivoGrid";

import Bus from "../../util/EventBus";

export default {
  name: "ConferenciaRateio",
  components: {
    RotateSquare,
    EntregaPedidoServico,
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
        statusPedido: null,
        statusRateio: null,
        dataEntrega: ""
      },
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
      fields: [
        { key: "pedido", label: "Pedido", sortable: true },
        // { key: "instituicao", label: "Instituição", sortable: true },
        { key: "dataEntrega", label: "Entrega", sortable: true },
        {
          key: "statusPedido",
          label: "Status",
          sortable: true
        },
        { key: "valorRateado", label: "Valor", sortable: true },
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
      this.filtro.statusPedido = null;
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

      EntregaPedidoServico.CancelarConferencia(this.itemConferencia.id)
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Entrega removida com sucesso."],
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
      EntregaPedidoServico.ObterGrid(
        pagina,
        this.itensPorPagina,
        this.pedido,
        this.filtro.instituicao.id,
        this.filtro.statusPedido,
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
    ObterNomestatusPedido(item) {
      switch (item) {
         case StatusPedidoEnum.Pendente:
          return "Pendente";
        case StatusPedidoEnum.Pendente:
          return "Pendente";
        case StatusPedidoEnum.Aberto:
          return "Aberto";
        case StatusPedidoEnum.AguardandoProdutos:
          return "Aguardando Produtos";
        case StatusPedidoEnum.Incompleto:
          return "Incompleto";
        case StatusPedidoEnum.EmRota:
          return "Em Rota";
        case StatusPedidoEnum.Entregue:
          return "Entregue";
        case StatusPedidoEnum.Finalizado:
          return "Finalizado";
        case StatusPedidoEnum.Cancelado:
          return "Cancelado";
        case StatusPedidoEnum.AguardandoRateio:
          return "Aguardando Rateio";
        case StatusPedidoEnum.AguardandoConferencia:
          return "Aguardando Conferência";
        case StatusPedidoEnum.Conferido:
          return "Conferido";
        default:
          return "Inválido";
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
    isRateioConfirmado(item) {
      return !item ? false : item.statusRateio == StatusRateioEnum.Confirmado;
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

      EntregaPedidoServico.IniciarConferencia(this.rateioId)
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Entrega aberta com sucesso."],
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

      EntregaPedidoServico.AssumirConferencia(this.conferenciaId)
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Entrega assumida com sucesso."],
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
    },
    Teste(item) {
      console.log("teste");
    }
  }
};
</script>
