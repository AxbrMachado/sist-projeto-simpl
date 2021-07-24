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
                  <label>Descricao</label>
                  <input
                    type="text"
                    v-model="filtro.descricao"
                    class="form-control"
                  />
                </div>
              </div>
              <!-- <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                <div class="form-group">
                  <label for>Tipo Produto</label>
                  <b-form-select
                    v-model="filtro.tipoProdutoId"
                    :options="tiposProdutoOptions"
                    required
                  ></b-form-select>
                </div>
              </div>
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                <div class="form-group">
                  <label for>Unidade Medida</label>
                  <b-form-select
                    v-model="filtro.tipoUnidadeMedidaId"
                    :options="tiposUnidadeMedidaOptions"
                    required
                  ></b-form-select>
                </div>
              </div>
              <div
                class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                title="Presente em pedido."
              >
                <label for>Presente em pedido</label>
                <b-form-checkbox
                  v-model="filtro.presenteEmPedido"
                  name="check-button"
                  switch
                >
                </b-form-checkbox>
              </div> -->
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
                    variant="warning"
                    style="margin-right: 10px"
                    title="Editar"
                    @click="Editar(data.item)"
                  >
                    <i class="fa fa-edit"></i>
                  </b-button>
                  <b-button
                    variant="danger"
                    title="Remover"
                    @click="Remover(data.item)"
                  >
                    <i class="fas fa-trash-alt"></i>
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
import Bus from "../../util/EventBus";

export default {
  name: "Rateio",
  components: {
    RotateSquare,
    RateioServico,
    Bus
  },
  data() {
    return {
      modalRemover: false,
      itemRemover: null,
      loading: false,
      itens: [],
      pagina: 1,
      total: 0,
      itensPorPagina: 20,
      tiposProdutoOptions: [],
      tiposUnidadeMedidaOptions: [],
      filtro: {
        descricao: "",
        tipoProdutoId: "",
        tipoUnidadeMedidaId: "",
        presenteEmPedido: false
      },
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
      this.filtro.descricao = "";
      this.filtro.tipoProdutoId = "";
      this.filtro.tipoUnidadeMedidaId = "";
      this.filtro.presenteEmPedido = false;
    },
    Editar(produto) {
      this.$router.push("/produto/editar/" + produto.id);
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
            data: ["Produto removida com sucesso."],
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
        this.filtro.descricao
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
          return "Pendente";
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
        return "";
      }
    }
  }
};
</script>
