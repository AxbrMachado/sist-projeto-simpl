<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <header class="card-header">
            <div class="d-flex">
              <strong class="align-self-center">Pedidos</strong>
              <a
                class="ml-auto btn btn-primary"
                href="/#/pedido/novo"
                title="Adicionar novo pedido"
              >
                Adicionar
              </a>
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
                  <label>Número</label>
                  <input
                    type="text"
                    v-model="filtro.Numero"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="form-group">
                  <label for>Contrato</label>
                  <v-select
                    placeholder="Digite um contrato.."
                    v-model="filtro.Contrato"
                    :options="contratoOptions"
                    @search="ObterContratoVSelect"
                  >
                    <template slot="no-options">
                      Nenhum resultado para a busca.
                    </template>
                  </v-select>
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="form-group">
                  <label for>Instituição</label>
                  <v-select
                    placeholder="Digite uma instituição.."
                    v-model="filtro.Instituicao"
                    :options="instituicaoOptions"
                    @search="ObterInstituicaoVSelect"
                  >
                    <template slot="no-options">
                      Nenhum resultado para a busca.
                    </template>
                  </v-select>
                </div>
              </div>
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <div class="form-group">
                  <label for>Status</label>
                  <b-form-select
                    v-model="filtro.Status"
                    :options="statusOptions"
                  ></b-form-select>
                </div>
              </div>
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                <div class="form-group">
                  <label for>Data Entrega</label>
                  <input
                    v-model="filtro.DataEntrega"
                    class="form-control"
                    type="date"
                    placeholder="Digite a data de entrega"
                  />
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="form-group">
                  <label>Descrição</label>
                  <input
                    type="text"
                    v-model="filtro.Descricao"
                    class="form-control"
                  />
                </div>
              </div>
              <!-- <div
                class="col-sm-6 col-md-2 col-lg-2 col-xl-1"
                title="Apenas pedidos gerados sem contrato."
              >
                <label for>Avulso</label>
                <b-form-checkbox
                  v-model="filtro.PedidoAvulso"
                  name="check-button"
                  switch
                >
                  Sim
                </b-form-checkbox>
              </div> -->
              <div
                class="col-sm-6 col-md-2 col-lg-2 col-xl-1"
                title="Apenas pedidos completos."
              >
                <label for>Completo</label>
                <b-form-checkbox
                  v-model="filtro.PedidoCompleto"
                  name="check-button"
                  switch
                >
                </b-form-checkbox>
              </div>
              <!-- <div
                class="col-sm-6 col-md-2 col-lg-2 col-xl-1"
                title="Apenas pedidos entregues."
              >
                <label for>Entregue</label>
                <b-form-checkbox
                  v-model="filtro.PedidoEntregue"
                  name="check-button"
                  switch
                >
                </b-form-checkbox>
              </div> -->
            </div>
            <div class="row">
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
            <div class="row">
              <div class="col-lg-4 col-md-5 col-sm-12 mt-4"></div>
            </div>

            <b-table
              :hover="true"
              responsive
              :items="itens"
              :fields="fields"
              striped
              :per-page="itensPorPagina"
              show-empty
              empty-text="Nenhum pedido encontrado."
            >
              <template v-slot:empty="scope">
                <h4>{{ scope.emptyText }}</h4>
              </template>
              <template v-slot:cell(acoes)="data">
                <div class="btn-group-sm">
                  <b-button
                    variant="warning"
                    style="margin-right: 10px"
                    title="Editar"
                    @click="Editar(data.item)"
                  >
                    <i class="fa fa-edit text-black"></i>
                  </b-button>
                  <b-button
                    variant="danger"
                    title="Remover"
                    @click="Remover(data.item)"
                  >
                    <i class="fas fa-trash-alt text-black"></i>
                  </b-button>
                </div>
              </template>
              <template v-slot:cell(dataEntrega)="data">
                <div class="center">
                  <span>{{ FormatarData(data.item.dataEntrega) }}</span>
                </div>
              </template>
              <template v-slot:cell(valor)="data">
                <div class="left">
                  <span>{{ FormataValor(data.item.valor) }}</span>
                </div>
              </template>
              <template v-slot:cell(status)="data">
                <div class="left">
                  <span>{{ ObterNomeStatusPedido(data.item.status) }}</span>
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
            <!-- <b-modal v-model="modalShow">Hello From Modal!</b-modal> -->
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RotateSquare from "../../components/RotateSquare";
import StatusPedidoEnum from "../../enums/StatusPedidoEnum";
import TipoPessoaEnum from "../../enums/TipoPessoaEnum";

export default {
  name: "Pedido",
  components: {
    RotateSquare
  },
  data() {
    return {
      modalRemover: false,
      itemRemover: null,
      loading: false,
      itens: [],
      contratoOptions: [],
      statusOptions: [],
      instituicaoOptions: [],
      pagina: 1,
      total: 0,
      itensPorPagina: 0,
      statusOptions: [
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

      filtro: {
        Descricao: "",
        Numero: "",
        Contrato: "",
        Status: 0,
        DataEntrega: "",
        Instituicao: "",
        PedidoAvulso: false,
        PedidoCompleto: false,
        PedidoEntregue: false
      },
      fields: [
        { key: "numero", label: "Número", sortable: true },
        { key: "dataEntrega", label: "Data Entrega", sortable: true },
        { key: "valor", label: "Valor", sortable: true },
        { key: "instituicao", label: "Instituição", sortable: true },
        { key: "status", label: "Status", sortable: true },
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
      this.filtro.Descricao = "";
      this.filtro.Numero = "";
      this.filtro.Contrato = "";
      this.filtro.Status = 0;
      this.filtro.DataEntrega = "";
      this.filtro.Instituicao = "";
      this.filtro.PedidoAvulso = false;
      this.filtro.PedidoCompleto = false;
      this.filtro.PedidoEntregue = false;

      this.ObterGrid(1);
    },
    Editar(pedido) {
      this.$router.push("/pedido/editar/" + pedido.id);
    },
    ModalCancel(evento) {
      evento.preventDefault();
      this.itemRemover = null;
    },
    ModalOk(evento) {
      evento.preventDefault();
      this.modalRemover = false;
      if (!this.itemRemover) return;

      this.$http({
        url: "pedido/remover/" + this.itemRemover.id,
        method: "DELETE"
      })
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Pedido removido com sucesso."],
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
      this.loading = true;
      this.$http({
        url: "/pedido/obter-grid?pagina=" + pagina + this.MontaFiltro(),
        method: "GET"
      })
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
    MontaFiltro() {
      // console.log("Descricao -> " + this.filtro.Descricao);
      // console.log("Numero -> " + this.filtro.Numero);
      // console.log("ContratoId -> " + this.filtro.Contrato);
      // console.log("Status -> " + this.filtro.Status);
      // console.log("DataEntrega -> " + this.filtro.DataEntrega);
      // console.log("InstituicaoId -> " + this.filtro.Instituicao.id);
      // console.log("PedidoAvulso -> " + this.filtro.PedidoAvulso);
      // console.log("PedidoCompleto -> " + this.filtro.PedidoCompleto);
      // console.log("PedidoEntregue -> " + this.filtro.PedidoEntregue);

      var filtros = "";
      var filtros = filtros + "&Descricao=" + this.filtro.Descricao;
      var filtros = filtros + "&Numero=" + this.filtro.Numero;

      if (this.filtro.Contrato) {
        var filtros = filtros + "&ContratoId=" + this.filtro.Contrato.id;
      }

      if (this.filtro.Status != 0) {
        var filtros = filtros + "&Status=" + this.filtro.Status;
      }

      var filtros = filtros + "&DataEntrega=" + this.filtro.DataEntrega;
      var filtros = filtros + "&PedidoAvulso=" + this.filtro.PedidoAvulso;
      var filtros = filtros + "&PedidoCompleto=" + this.filtro.PedidoCompleto;
      var filtros = filtros + "&PedidoEntregue=" + this.filtro.PedidoEntregue;

      if (this.filtro.Instituicao) {
        var filtros = filtros + "&InstituicaoId=" + this.filtro.Instituicao.id;
      }

      return filtros;
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

    FormatarData(validade) {
      var dataValidade = new Date(validade);
      return dataValidade.toLocaleDateString();
    },
    FormataValor(valor) {
      return valor.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    },
    ObterContratoVSelect(busca) {
      if (!busca || busca.length <= 2) return;

      this.$http({
        url: "/contrato/obter-v-select/" + busca,
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
    }
  }
};
</script>
