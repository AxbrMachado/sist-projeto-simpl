<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <header class="card-header">
            <div class="d-flex">
              <strong class="align-self-center">Contrato</strong>
              <a
                class="ml-auto btn btn-primary"
                href="/#/contrato/novo"
                title="Adicionar novo contrato"
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
                  <label>Descrição</label>
                  <input
                    type="text"
                    v-model="filtro.descricao"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="col-lg-2 col-md-6 col-sm-12">
                <div class="form-group">
                  <label>Número</label>
                  <input
                    type="text"
                    v-model="filtro.numero"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <div class="form-group">
                  <label for>Licitação</label>
                  <b-form-select
                    v-model="filtro.licitacaoId"
                    :options="licitacaoOptions"
                    required
                  ></b-form-select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                <div class="form-group">
                  <label for>Data Vencimento</label>
                  <input
                    v-model="filtro.dataVencimento"
                    class="form-control"
                    type="date"
                    placeholder="Digite a data de vencimento"
                  />
                </div>
              </div>
              <div
                class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                title="Apenas licitações vencidas."
              >
                <label for>Contratos Vencidos</label>
                <b-form-checkbox
                  v-model="filtro.contratoVencido"
                  name="check-button"
                  switch
                >
                </b-form-checkbox>
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
              empty-text="Nenhum contrato encontrado."
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
              <template v-slot:cell(dataInicio)="data">
                <div class="center">
                  <span>{{ FormatarData(data.item.dataInicio) }}</span>
                </div>
              </template>
              <template v-slot:cell(dataTermino)="data">
                <div class="center">
                  <span>{{ FormatarData(data.item.dataTermino) }}</span>
                </div>
              </template>
              <template v-slot:cell(valor)="data">
                <div class="left">
                  <span>{{ FormataValor(data.item.valor) }}</span>
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

export default {
  name: "Contrato",
  components: {
    RotateSquare
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
      licitacaoOptions: [],
      filtro: {
        numero: "",
        descricao: "",
        contratoVencido: false,
        licitacaoId: "",
        dataVencimento: "",
        presenteEmPedido: false
      },
      fields: [
        { key: "descricao", label: "Descrição", sortable: true },
        { key: "numero", label: "Número", sortable: true },
        { key: "licitacao", label: "Licitação", sortable: true },
        { key: "dataInicio", label: "Data Início", sortable: true },
        { key: "dataTermino", label: "Data Término", sortable: true },
        { key: "valor", label: "Valor", sortable: true },
        { key: "valorEntregue", label: "Valor Entregue", sortable: true },
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
    this.ObterInstituicoesSelect();
  },
  methods: {
    Limpar() {
      this.filtro.numero = "";
      this.filtro.descricao = "";
      this.filtro.contratoVencido = false;
      this.filtro.licitacaoId = "";
      this.filtro.dataVencimento = "";
      this.filtro.presenteEmPedido = false;
    },
    Editar(contrato) {
      this.$router.push("/contrato/editar/" + contrato.id);
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
        url: "contrato/remover/" + this.itemRemover.id,
        method: "DELETE"
      })
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Contrato removido com sucesso."],
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
      this.$http({
        url: "/contrato/obter-grid?pagina=" + pagina + this.MontaFiltro(),
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
      var filtros = "";
      var filtros = filtros + "&Descricao=" + this.filtro.descricao;
      var filtros = filtros + "&Numero=" + this.filtro.numero;

      if (this.filtro.licitacaoId) {
        var filtros = filtros + "&LicitacaoId=" + this.filtro.licitacaoId;
      }

      var filtros = filtros + "&DataTermino=" + this.filtro.dataVencimento;
      var filtros = filtros + "&ContratoVencido=" + this.filtro.contratoVencido;

      var filtros =
        filtros + "&PresenteEmPedido=" + this.filtro.presenteEmPedido;

      return filtros;
    },
    FormatarData(value) {
      if (value) {
        return new Date(value).toLocaleDateString();
      } else {
        return "";
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
    ObterInstituicoesSelect() {
      this.$http({
        url: "/licitacao/obter-select",
        method: "GET"
      })
        .then((response) => {
          this.licitacaoOptions = response.data;
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
