<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <header class="card-header">
            <div class="d-flex">
              <strong class="align-self-center">Pessoas</strong>
              <a
                class="ml-auto btn btn-primary"
                href="/#/pessoa/novo"
                title="Adicionar nova pessoa"
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
                  <label>Nome</label>
                  <input
                    type="text"
                    v-model="filtro.Nome"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="col-lg-3 col-md-6 col-sm-12">
                <div class="form-group">
                  <label for>Cidade</label>
                  <v-select
                    placeholder="Digite uma cidade.."
                    v-model="filtro.Cidade"
                    :options="cidadeOptions"
                    @search="ObterCidadesVSelect"
                  >
                    <template slot="no-options">
                      Nenhum resultado para a busca.
                    </template>
                  </v-select>
                </div>
              </div>
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                <div class="form-group">
                  <label for>Tipo</label>
                  <b-form-select
                    v-model="filtro.TipoPessoa"
                    :options="tipoOptions"
                  ></b-form-select>
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
              empty-text="Nenhuma pessoa encontrada."
            >
              <template v-slot:empty="scope">
                <h4>{{ scope.emptyText }}</h4>
              </template>
              <template v-slot:cell(ativo)="data">
                <div class="center">
                  <span v-if="data.item.ativo" class="badge badge-success">
                    Sim
                  </span>
                  <span v-else class="badge badge-secondary">Não</span>
                </div>
              </template>
              <template v-slot:cell(tipoPessoa)="data">
                <div class="center">
                  <span>{{
                    ObterTipoPessoa(data.item.tipoPessoa) +
                    ObterNomeTipoFornecedor(data.item.tipoFornecedor)
                  }}</span>
                </div>
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
import TipoPessoaEnum from "../../enums/TipoPessoaEnum";
import TipoFornecedorEnum from "../../enums/TipoFornecedorEnum";

export default {
  name: "Pessoa",
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
      tipoOptions: [
        { value: TipoPessoaEnum.Funcionario, text: "Funcionário" },
        { value: TipoPessoaEnum.Fornecedor, text: "Fornecedor" },
        { value: TipoPessoaEnum.Cliente, text: "Cliente" },
        { value: TipoPessoaEnum.Instituicao, text: "Instituicao" }
      ],
      cidadeOptions: [],
      filtro: {
        Nome: "",
        Cidade: "",
        TipoPessoa: 0
      },
      fields: [
        { key: "nome", label: "Nome", sortable: true },
        { key: "cidade", label: "Cidade", sortable: true },
        { key: "tipoPessoa", label: "Tipo", sortable: true },
        { key: "observacao", label: "Observação", sortable: true },
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
      this.filtro.Nome = "";
      this.filtro.Cidade = "";
      this.filtro.TipoPessoa = 0;

      this.ObterGrid(1);
    },
    Editar(pessoa) {
      this.$router.push("/pessoa/editar/" + pessoa.id);
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
        url: "pessoa/remover/" + this.itemRemover.id,
        method: "DELETE"
      })
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Pessoa removida com sucesso."],
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
        url: "/pessoa/obter-grid?pagina=" + pagina + this.MontaFiltro(),
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
      var filtros = filtros + "&Nome=" + this.filtro.Nome;

      if (this.filtro.Cidade) {
        var filtros = filtros + "&Cidade=" + this.filtro.Cidade.label;
      }

      if (this.filtro.TipoPessoa != 0) {
        var filtros = filtros + "&TipoPessoa=" + this.filtro.TipoPessoa;
      }

      return filtros;
    },
    ObterTipoPessoa(item) {
      switch (item) {
        case TipoPessoaEnum.Funcionario:
          return "Funcionário";
        case TipoPessoaEnum.Fornecedor:
          return "Fornecedor";
        case TipoPessoaEnum.Cliente:
          return "Cliente";
        case TipoPessoaEnum.Instituicao:
          return "Instituição";
        default:
          return "Inválido";
      }
    },
    ObterNomeTipoFornecedor(item) {
      switch (item) {
        case TipoFornecedorEnum.Avulso:
          return "/Avulso";
        case TipoFornecedorEnum.Cooperado:
          return "/Cooperado";
        default:
          return "";
      }
    },
    ObterCidadesVSelect(busca) {
      if (!busca || busca.length <= 2) return;

      this.$http({
        url: "/pessoaendereco/obter-v-select/" + busca,
        method: "GET"
      })
        .then((response) => {
          this.cidadeOptions = response.data;
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
