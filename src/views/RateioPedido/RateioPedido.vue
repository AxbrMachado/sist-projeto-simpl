<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <header class="card-header">
            <div class="d-flex">
              <strong class="align-self-center">Rateios Pedido de Venda</strong>
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
              <div class="col-lg-4 col-md-6 col-sm-12">
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
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <div class="form-group">
                  <label for>Status Pedido</label>
                  <b-form-select
                    v-model="filtro.statusPedido"
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
                    v-model="filtro.dataRateio"
                    class="form-control"
                    type="date"
                    placeholder="Digite a data de entrega"
                  />
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
              <div
                class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                title="Apenas pedidos completos."
              >
                <label for>Rateio Manual</label>
                <b-form-checkbox
                  v-model="filtro.rateioManual"
                  name="check-button"
                  switch
                >
                </b-form-checkbox>
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
              empty-text="Nenhum rateio encontrado."
            >
              <template v-slot:empty="scope">
                <h4>{{ scope.emptyText }}</h4>
              </template>
              <template v-slot:cell(acoes)="data">
                <div class="btn-group-sm">
                  <b-button
                    v-if="isRateioRemovivel(data.item)"
                    variant="warning"
                    style="margin-right: 10px"
                    title="Visualizar Rateio"
                    @click="Editar(data.item)"
                  >
                    <i class="fa fa-edit"></i>
                  </b-button>
                  <b-button
                    v-if="isRateioRemovivel(data.item)"
                    variant="danger"
                    style="margin-right: 10px"
                    title="Excluir Rateio"
                    @click="Remover(data.item)"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </b-button>
                  <b-button
                    variant="info"
                    style="margin-right: 10px"
                    title="Efetuar Rateio"
                    @click="EfetuarRateio(data.item.pedidoId)"
                  >
                    <i class="fa fa-random"></i>
                  </b-button>
                  <ModalArquivoGrid :referenciaId="data.item.id" />
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
              <template v-slot:cell(status)="data">
                <div class="left">
                  <span>{{ ObterNomeStatusRateio(data.item.status) }}</span>
                </div>
              </template>
              <template v-slot:cell(manual)="data">
                <div class="left">
                  <span>{{ FormataBoolean(data.item.manual) }}</span>
                </div>
              </template>
              <template v-slot:cell(usuarioCadastro)="data">
                <div class="left">
                  <span>{{ FormatarUsuario(data.item) }}</span>
                </div>
              </template>
              <template v-slot:cell(statusPedido)="data">
                <div class="left">
                  <span>{{
                    ObterNomeStatusPedido(data.item.statusPedido)
                  }}</span>
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
              v-model="modalRemover"
              title="Confirmar exclusão"
              class="modal-danger"
              ok-variant="danger"
              @ok="ModalOk"
              @hidden="ModalCancel"
            >
              Você confirma a exclusão desse registro?
            </b-modal>
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RotateSquare from "../../components/RotateSquare";
import RateioServico from "../../servico/RateioServico";
import StatusPedidoEnum from "../../enums/StatusPedidoEnum";
import StatusRateioEnum from "../../enums/StatusRateioEnum";
import TipoPessoaEnum from "../../enums/TipoPessoaEnum";
import ModalArquivoGrid from "../../components/ModalArquivoGrid";

import Bus from "../../util/EventBus";

export default {
  name: "Rateio",
  components: {
    RotateSquare,
    RateioServico,
    Bus,
    ModalArquivoGrid
  },
  data() {
    return {
      modalRemover: false,
      itemRemover: null,
      modalRateio: false,
      pedidoRateioId: null,
      loading: false,
      itens: [],
      pagina: 1,
      total: 0,
      itensPorPagina: 20,
      tiposProdutoOptions: [],
      tiposUnidadeMedidaOptions: [],
      instituicaoOptions: [],
      filtro: {
        pedido: "",
        instituicao: "",
        statusPedido: null,
        statusRateio: null,
        dataEntrega: "",
        dataRateio: "",
        rateioManual: false
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
        { value: StatusPedidoEnum.Cancelado, text: "Cancelado" }
      ],
      statusRateioOptions: [
        { value: StatusRateioEnum.Pendente, text: "Pendente" },
        { value: StatusRateioEnum.Incompleto, text: "Finalizado" },
        { value: StatusRateioEnum.Completo, text: "Cancelado" },
        { value: StatusRateioEnum.Cancelada, text: "Aberto" }
      ],

      fields: [
        { key: "pedido", label: "Pedido", sortable: true },
        // { key: "instituicao", label: "Instituição", sortable: true },
        { key: "dataEntrega", label: "Previsão Entrega", sortable: true },
        { key: "statusPedido", label: "Status Pedido", sortable: true },
        { key: "valor", label: "Valor", sortable: true },
        { key: "valorRateado", label: "Valor Rateado", sortable: true },
        { key: "manual", label: "Rateio Manual", sortable: true },

        { key: "dataRateio", label: "Data Rateio", sortable: true },
        { key: "status", label: "Status Rateio", sortable: true },
        { key: "usuarioCadastro", label: "Usuário", sortable: true },
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
      this.filtro.dataRateio = "";
      this.filtro.rateioManual = false;
    },
    Editar(item) {
      //POR ENQNTO NAO VAI ABRIR..
      if (!item) {
        this.$router.push("/rateio/detalhe/" + item.id);
      }
    },
    ModalCancel(evento) {
      evento.preventDefault();
      this.itemRemover = null;
    },
    ModalOk(evento) {
      evento.preventDefault();
      this.modalRemover = false;
      if (!this.itemRemover) return;

      RateioServico.Remover(this.itemRemover.id)
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Rateio removido com sucesso."],
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
    Remover(item) {
      this.modalRemover = true;
      this.itemRemover = item;
    },
    ObterGrid(pagina) {
      this.loading = false;
      RateioServico.ObterGrid(
        pagina,
        this.itensPorPagina,
        this.filtro.pedido,
        this.filtro.instituicao.id,
        this.filtro.statusPedido,
        this.filtro.statusRateio,
        this.filtro.dataEntrega,
        this.filtro.dataRateio,
        this.filtro.rateioManual
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

      this.$http({
        url:
          "/pessoa/obter-v-select/" + TipoPessoaEnum.Instituicao + "/" + busca,
        method: "GET"
      })
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
    ObterNomeStatusPedido(item) {
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
        default:
          return "Inválido";
      }
    },
    ObterNomeStatusRateio(item) {
      switch (item) {
        case StatusRateioEnum.Pendente:
          return "Pendente";
        case StatusRateioEnum.Completo:
          return "Completo";
        case StatusRateioEnum.Incompleto:
          return "Incompleto";
        case StatusRateioEnum.Cancelada:
          return "Cancelado";
        default:
          return "-";
      }
    },
    FormatarData(value) {
      if (value) {
        return new Date(value).toLocaleDateString();
      } else {
        return "-";
      }
    },
    FormataValor(valor) {
      if (valor) {
        return valor.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL"
        });
      } else {
        return (0.0).toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL"
        });
      }
    },
    FormataBoolean(item) {
      return item == undefined ? "-" : item ? "Sim" : "Não";
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
    isRateioRemovivel(item) {
      return !(item.id === this.$store.getters.emptyGuid);
    },
    EfetuarRateio(pedidoId) {
      this.modalRateio = true;
      this.pedidoRateioId = pedidoId;
    },
    ModalRateioCancel(evento) {
      evento.preventDefault();
      this.pedidoRateioId = null;
    },
    ModalRateioOk(evento) {
      evento.preventDefault();
      this.modalRateio = false;
      if (!this.pedidoRateioId) return;

      RateioServico.EfetuarRateio(this.pedidoRateioId)
        .then(() => {
          this.ObterGrid(1);
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
