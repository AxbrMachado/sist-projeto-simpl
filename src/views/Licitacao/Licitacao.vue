<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <header class="card-header">
            <div class="d-flex">
              <strong class="align-self-center">Licitação</strong>
              <a
                class="ml-auto btn btn-primary"
                href="/#/licitacao/novo"
                title="Adicionar nova licitação"
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
              <div class="col-lg-4 col-md-6 col-sm-12">
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
                  <label for>Tipo Instituição</label>
                  <b-form-select
                    v-model="filtro.TipoInstituicao"
                    :options="tiposInstituicaoOptions"
                  ></b-form-select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                <div class="form-group">
                  <label for>Data Vencimento</label>
                  <input
                    v-model="filtro.DataVencimento"
                    class="form-control"
                    type="date"
                    placeholder="Digite a data de vencimento"
                  />
                </div>
              </div>
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                <div class="form-group">
                  <label for>Status</label>
                  <b-form-select
                    v-model="filtro.Status"
                    :options="statusOptions"
                  ></b-form-select>
                </div>
              </div>
              <div
                class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                title="Apenas licitações vencidas."
              >
                <label for>Licitações Vencidas</label>
                <b-form-checkbox
                  v-model="filtro.LicitacaoVencida"
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
              empty-text="Nenhuma licitação encontrada."
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
              <template v-slot:cell(valor)="data">
                <div class="left">
                  <span>{{ FormataValor(data.item.valor) }}</span>
                </div>
              </template>
              <template v-slot:cell(dataVencimento)="data">
                <div class="center">
                  <span>{{ formatarData(data.item.dataVencimento) }}</span>
                </div>
              </template>
              <template v-slot:cell(status)="data">
                <div class="center">
                  <span>{{ ObterNomeStatus(data.item.status) }}</span>
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
import LicitacaoServico from "../../servico/LicitacaoServico";
import StatusLicitacaoEnum from "../../enums/StatusLicitacaoEnum";

export default {
  name: "Licitacao",
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
      itensPorPagina: 0,
      tiposInstituicaoOptions: [],
      instituicaoOptions: [],
      statusOptions: [
        { value: StatusLicitacaoEnum.Pendente, text: "Pendente" },
        { value: StatusLicitacaoEnum.Aprovada, text: "Aprovada" },
        { value: StatusLicitacaoEnum.Reprovada, text: "Reprovada" },
        { value: StatusLicitacaoEnum.Cancelada, text: "Cancelada" }
      ],

      filtro: {
        Numero: "",
        TipoInstituicao: "",
        Instituicao: "",
        DataVencimento: "",
        Status: 0,
        LicitacaoVencida: false
      },
      fields: [
        { key: "numero", label: "Número", sortable: true },
        { key: "instituicao", label: "Instituição", sortable: true },
        { key: "tipoInstituicao", label: "Tipo Instituição", sortable: true },
        { key: "dataVencimento", label: "Data Vencimento", sortable: true },
        { key: "valor", label: "Valor", sortable: true },
        { key: "valorEntregue", label: "Valor Entregue", sortable: true },
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
    this.ObterTiposInstituicoesSelect();
  },
  methods: {
    Limpar() {
      this.filtro.Numero = "";
      this.filtro.TipoInstituicao = "";
      this.filtro.Instituicao = "";
      this.filtro.DataVencimento = "";
      this.filtro.Status = 0;
      this.filtro.LicitacaoVencida = false;

      this.ObterGrid(1);
    },
    Editar(licitacao) {
      this.$router.push("/licitacao/editar/" + licitacao.id);
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
        url: "licitacao/remover/" + this.itemRemover.id,
        method: "DELETE"
      })
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Licitação removida com sucesso."],
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
        url: "/licitacao/obter-grid?pagina=" + pagina + this.MontaFiltro(),
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
      var filtros = filtros + "&Numero=" + this.filtro.Numero;

      if (this.filtro.Instituicao) {
        var filtros = filtros + "&PessoaId=" + this.filtro.Instituicao.id;
      }

      if (this.filtro.Status) {
        var filtros = filtros + "&Status=" + this.filtro.Status;
      }

      if (this.filtro.TipoInstituicao != 0) {
        var filtros =
          filtros + "&TipoInstituicaoId=" + this.filtro.TipoInstituicao;
      }

      var filtros = filtros + "&DataVencimento=" + this.filtro.DataVencimento;
      var filtros =
        filtros + "&LicitacaoVencida=" + this.filtro.LicitacaoVencida;

      return filtros;
    },
    formatarData(validade) {
      var dataValidade = new Date(validade);
      return dataValidade.toLocaleDateString();
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
    ObterTiposInstituicoesSelect() {
      this.$http({
        url: "/tipoInstituicao/obter-select",
        method: "GET"
      })
        .then((response) => {
          this.tiposInstituicaoOptions = response.data;
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
    },
    ObterNomeStatus(item) {
      switch (item) {
        case StatusLicitacaoEnum.Pendente:
          return "Pendente";
        case StatusLicitacaoEnum.Aprovada:
          return "Aprovada";
        case StatusLicitacaoEnum.Reprovada:
          return "Reprovada";
        case StatusLicitacaoEnum.Cancelado:
          return "Cancelada";
        default:
          return "Inválido";
      }
    }
  }
};
</script>
