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
              <template v-slot:cell(valorBase)="data">
                <div class="left">
                  <span>{{ FormataValor(data.item.valorBase) }}</span>
                </div>
              </template>
              <template v-slot:cell(quantidadeMinimaRateio)="data">
                <div class="left">
                  <span>{{
                    FormataValorMinimoRateio(data.item.quantidadeMinimaRateio)
                  }}</span>
                </div>
              </template>
              <template v-slot:cell(margemRateio)="data">
                <div class="left">
                  <span>{{
                    FormataValorMargemRateio(data.item.margemRateio)
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
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RotateSquare from "../../components/RotateSquare";
import ModalArquivoGrid from "../../components/ModalArquivoGrid";
import ProdutoServico from "../../servico/ProdutoServico";
import TipoUnidadeMedidaServico from "../../servico/TipoUnidadeMedidaServico";

export default {
  name: "Produto",
  components: {
    RotateSquare,
    ModalArquivoGrid,
    ProdutoServico
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
        { key: "descricao", label: "Descrição", sortable: true },
        { key: "valorBase", label: "Valor Base", sortable: true },
        { key: "tipoProduto", label: "Tipo Produto", sortable: true },
        {
          key: "quantidadeMinimaRateio",
          label: "Qtd. Miníma Rateio",
          sortable: true
        },
        {
          key: "margemRateio",
          label: "Margem Rateio",
          sortable: true
        },
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

      ProdutoServico.Remover(this.itemRemover.id)
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
      ProdutoServico.ObterGrid(
        this.pagina,
        this.filtro.descricao,
        this.filtro.tipoProdutoId,
        this.filtro.tipoUnidadeMedidaId,
        this.filtro.presenteEmPedido
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
    ObterTiposProdutoSelect() {
      ProdutoServico.ObterSelect()
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
      TipoUnidadeMedidaServico.ObterSelect()
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
    FormataValor(value) {
      return (value ? value : 0.0).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    },
    FormataValorMinimoRateio(valor) {
      return valor ? valor : "-";
    },
    FormataValorMargemRateio(valor) {
      return valor ? valor + "%" : "-";
    }
  }
};
</script>
