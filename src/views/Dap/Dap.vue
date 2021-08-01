<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <header class="card-header">
            <div class="d-flex">
              <strong class="align-self-center">Dap's</strong>
              <a
                class="ml-auto btn btn-primary"
                href="/#/dap/novo"
                title="Adicionar nova dap"
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
              <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="form-group">
                  <label>Número</label>
                  <input
                    type="text"
                    v-model="filtro.numero"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                <div class="form-group">
                  <label for>Tipo Enquadramento</label>
                  <b-form-select
                    v-model="filtro.tipoEnquadramento"
                    :options="tipoEnquadramentos"
                  ></b-form-select>
                </div>
              </div>
              <div class="col-lg-4 col-md-6 col-sm-12">
                <div class="form-group">
                  <label for>Cooperado</label>
                  <v-select
                    placeholder="Digite um cooperado.."
                    v-model="filtro.cooperado"
                    :options="cooperadoOptions"
                    @search="ObterCooperadoVSelect"
                  >
                    <template slot="no-options">
                      Nenhum resultado para a busca.
                    </template>
                  </v-select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                <div class="form-group">
                  <label for>Data Validade</label>
                  <input
                    v-model="filtro.dataVencimento"
                    class="form-control"
                    type="date"
                    placeholder="Digite a data de validade"
                  />
                </div>
              </div>
              <div
                class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                title="Apenas daps vencidas."
              >
                <label for>Daps Vencidas</label>
                <b-form-checkbox
                  v-model="filtro.dapVencida"
                  name="check-button"
                  switch
                >
                </b-form-checkbox>
              </div>
              <div
                class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                title="Apenas daps com fornecedor designado."
              >
                <label for>Fornecedor Designado</label>
                <b-form-checkbox
                  v-model="filtro.fornecedorDesignado"
                  name="check-button"
                  switch
                >
                </b-form-checkbox>
              </div>
              <div
                class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                title="Apenas daps com fornecedor excluído temporariamente de rateios."
              >
                <label for>Excluído Rateio</label>
                <b-form-checkbox
                  v-model="filtro.fornecedorExcluidoRateio"
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
              empty-text="Nenhuma dap encontrada."
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
                    style="margin-right: 10px"
                    title="Remover"
                    @click="Remover(data.item)"
                  >
                    <i class="fas fa-trash-alt"></i>
                  </b-button>
                  <ModalArquivoGrid :referenciaId="data.item.id" />
                </div>
              </template>
              <template v-slot:cell(tipoEnquadramento)="data">
                <div class="center">
                  <span>{{
                    ObterNomeEnquadramento(data.item.tipoEnquadramento)
                  }}</span>
                </div>
              </template>
              <template v-slot:cell(validade)="data">
                <div class="center">
                  <span>{{ FormatarData(data.item.validade) }}</span>
                </div>
              </template>
              <template v-slot:cell(limiteExclusaoRateio)="data">
                <div class="center">
                  <span>{{
                    FormatarData(data.item.limiteExclusaoRateio)
                  }}</span>
                </div>
              </template>
              <template v-slot:cell(fornecedorDesignado)="data">
                <div class="center">
                  <span
                    v-if="data.item.fornecedorDesignado"
                    class="badge badge-success"
                  >
                    Sim
                  </span>
                  <span v-else class="badge badge-danger">Não</span>
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
import TipoEnquadramentoEnum from "../../enums/TipoEnquadramentoEnum";
import TipoPessoaEnum from "../../enums/TipoPessoaEnum";
import ModalArquivoGrid from "../../components/ModalArquivoGrid";

export default {
  name: "Dap",
  components: {
    RotateSquare,
    ModalArquivoGrid
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
      cooperadoOptions: [],
      tipoEnquadramentos: [
        { value: TipoEnquadramentoEnum.Grupo_A, text: "A" },
        { value: TipoEnquadramentoEnum.Grupo_B, text: "B" },
        { value: TipoEnquadramentoEnum.Grupo_AC, text: "AC" },
        { value: TipoEnquadramentoEnum.Grupo_V, text: "V" }
      ],
      filtro: {
        numero: "",
        tipoEnquadramento: 0,
        dataVencimento: "",
        dapVencida: false,
        fornecedorDesignado: false,
        fornecedorExcluidoRateio: false,
        cooperado: ""
      },
      fields: [
        { key: "numero", label: "Número", sortable: true },
        { key: "tipoEnquadramento", label: "Enquadramento", sortable: true },
        {
          key: "fornecedorDesignado",
          label: "Fornecedor Designado",
          sortable: true
        },
        { key: "validade", label: "Válidade", sortable: true },
        {
          key: "limiteExclusaoRateio",
          label: "Limite Exclusão Rateio",
          sortable: true
        },

        { key: "pessoaNome", label: "Cooperado", sortable: true },
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
      this.filtro.numero = "";
      this.filtro.tipoEnquadramento = 0;
      this.filtro.dataVencimento = "";
      this.filtro.dapVencida = false;
      this.filtro.fornecedorDesignado = false;
      this.filtro.fornecedorExcluidoRateio = false;
      this.filtro.cooperado = "";

      this.ObterGrid(1);
    },
    Editar(dap) {
      this.$router.push("/dap/editar/" + dap.id);
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
        url: "dap/remover/" + this.itemRemover.id,
        method: "DELETE"
      })
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Dap removida com sucesso."],
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
        url: "/dap/obter-grid?pagina=" + pagina + this.MontaFiltro(),
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
      var filtros = filtros + "&Numero=" + this.filtro.numero;

      if (this.filtro.tipoEnquadramento) {
        var filtros =
          filtros + "&TipoEnquadramento=" + this.filtro.tipoEnquadramento;
      }

      if (this.filtro.cooperado) {
        var filtros = filtros + "&PessoaId=" + this.filtro.cooperado.id;
      }

      var filtros = filtros + "&Validade=" + this.filtro.dataVencimento;
      var filtros = filtros + "&DapVencida=" + this.filtro.dapVencida;

      var filtros =
        filtros + "&FornecedorDesignado=" + this.filtro.fornecedorDesignado;

      var filtros =
        filtros +
        "&FornecedorExcluidoRateio=" +
        this.filtro.fornecedorExcluidoRateio;

      return filtros;
    },
    ObterNomeEnquadramento(item) {
      switch (item) {
        case TipoEnquadramentoEnum.Grupo_A:
          return "A";
        case TipoEnquadramentoEnum.Grupo_B:
          return "B";
        case TipoEnquadramentoEnum.Grupo_AC:
          return "AC";
        case TipoEnquadramentoEnum.Grupo_V:
          return "V";
        default:
          return "Inválido";
      }
    },

    FormatarData(value) {
      if (value) {
        return new Date(value).toLocaleDateString();
      } else {
        return "";
      }
    },
    ObterCooperadoVSelect(busca) {
      if (!busca || busca.length <= 2) return;

      this.$http({
        url:
          "/pessoa/obter-v-select/" + TipoPessoaEnum.Fornecedor + "/" + busca,
        method: "GET"
      })
        .then((response) => {
          this.cooperadoOptions = response.data;
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
