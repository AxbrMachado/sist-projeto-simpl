<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <header class="card-header">
            <div class="d-flex">
              <strong class="align-self-center">Produto</strong>
              <a
                class="ml-auto btn btn-primary"
                href="/#/produto/novo"
                title="Adicionar nova produto"
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
                  <label>Descricao</label>
                  <input
                    type="text"
                    v-model="filtro.descricao"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                <div class="form-group">
                  <label for>* Tipo Produto</label>
                  <b-form-select
                    v-model="filtro.tipoProdutoId"
                    :options="tiposProdutoOptions"
                    required
                  ></b-form-select>
                </div>
              </div>
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-2">
                <div class="form-group">
                  <label for>* Unidade Medida</label>
                  <b-form-select
                    v-model="filtro.tipoUnidadeMedidaId"
                    :options="tiposUnidadeMedidaOptions"
                    required
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
              empty-text="Nenhum produto encontrado."
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
              <template v-slot:cell(valorBase)="data">
                <div class="left">
                  <span>{{ FormataValor(data.item.valorBase) }}</span>
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

export default {
  name: "Produto",
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
      tiposProdutoOptions: [],
      tiposUnidadeMedidaOptions: [],
      filtro: {
        descricao: "",
        tipoProdutoId: "",
        tipoUnidadeMedidaId: ""
      },
      fields: [
        { key: "descricao", label: "Descrição", sortable: true },
        { key: "valorBase", label: "Valor Base", sortable: true },
        { key: "tipoProduto", label: "Tipo Produto", sortable: true },
        { key: "tipoUnidadeMedida", label: "Unidade Medida", sortable: true },
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
    this.ObterTiposProdutoSelect();
    this.ObterTiposUnidadeMedidaSelect();
  },
  methods: {
    Limpar() {
      this.filtro.descricao = "";
      this.filtro.tipoProdutoId = "";
      this.filtro.tipoUnidadeMedidaId = "";

      this.ObterGrid(1);
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

      this.$http({
        url: "produto/remover/" + this.itemRemover.id,
        method: "DELETE"
      })
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
      this.loading = true;
      this.$http({
        url: "/produto/obter-grid?pagina=" + pagina + this.MontaFiltro(),
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

      if (this.filtro.tipoProdutoId) {
        var filtros = filtros + "&tipoProdutoId=" + this.filtro.tipoProdutoId;
      }

      if (this.filtro.tipoUnidadeMedidaId) {
        var filtros =
          filtros + "&tipoUnidadeMedidaId=" + this.filtro.tipoUnidadeMedidaId;
      }

      return filtros;
    },
    ObterTiposProdutoSelect() {
      this.$http({
        url: "/tipoProduto/obter-select",
        method: "GET"
      })
        .then((response) => {
          this.tiposProdutoOptions = response.data;
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    ObterTiposUnidadeMedidaSelect() {
      this.$http({
        url: "/tipoUnidadeMedida/obter-select",
        method: "GET"
      })
        .then((response) => {
          this.tiposUnidadeMedidaOptions = response.data;
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    FormataValor(valor) {
      return valor.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    }
  }
};
</script>
