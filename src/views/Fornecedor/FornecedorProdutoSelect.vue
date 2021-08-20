<template>
  <div class="animated fadeIn">
    <div v-if="loading" class="loading-container">
      <RotateSquare
        class="loading-position animated fadeIn"
        size="60px"
      ></RotateSquare>
    </div>
    <form v-else>
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div class="card">
            <header class="card-header" @click="abrir = !abrir">
              <div class="d-flex">
                <strong class="align-self-center">Produtos(s)</strong>
                <small class="ml-2 mt-1">Clique para abrir/esconder</small>

                <i
                  :class="
                    abrir
                      ? 'ml-auto mt-1 fas fa-chevron-up'
                      : 'ml-auto mt-1 fas fa-chevron-down'
                  "
                ></i>
              </div>
            </header>
            <div :class="abrir ? 'collapse-show' : 'collapse'">
              <div class="card-body">
                <div class="row">
                  <div class="col-lg-5 col-md-6 col-sm-12">
                    <div class="form-group">
                      <label>Produto</label>
                      <input
                        type="text"
                        v-model="filtro.produto"
                        class="form-control"
                      />
                    </div>
                  </div>
                  <div
                    class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                    title="Apenas produtos presentes no fornecedor."
                  >
                    <label for>Presente no Fornecedor</label>
                    <b-form-checkbox
                      v-model="filtro.produtosNoFornecedor"
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
                <div class="row">
                  <div class="col-12">
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
                            v-if="isNoFornecedor(data.item)"
                            variant="danger"
                            style="margin-right: 10px"
                            title="Produto não fornecido pelo fornecedor"
                            @click="AdicionarProdutoFornecedor(data.item)"
                          >
                            <i class="fas fa-times"></i>
                          </b-button>
                          <b-button
                            v-if="!isNoFornecedor(data.item)"
                            variant="success"
                            style="margin-right: 10px"
                            title="Produto fornecido pelo fornecedor"
                            @click="RemoverProdutoFornecedor(data.item)"
                          >
                            <i class="fas fa-check"></i>
                          </b-button>
                          <b-button
                            v-if="!isNoFornecedor(data.item)"
                            variant="info"
                            style="margin-right: 10px"
                            title="Editar produto do fornecedor"
                            @click="Edicao(data.item)"
                          >
                            <i class="fa fa-edit"></i>
                          </b-button>
                        </div>
                      </template>
                      <template v-slot:cell(valor)="data">
                        <div class="left">
                          <span>{{ FormataValor(data.item.valor) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(valorDesignado)="data">
                        <div class="left">
                          <span>{{
                            FormataValor(data.item.valorDesignado)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(valorAtendido)="data">
                        <div class="left">
                          <span>{{
                            FormataValor(data.item.valorAtendido)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(valorEntregue)="data">
                        <div class="left">
                          <span>{{
                            FormataValor(data.item.valorEntregue)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidade)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidade)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadeAtendida)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadeAtendida)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadeDesignada)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadeDesignada)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadeEntregue)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadeEntregue)
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <b-modal
      v-model="modalEditarInfoProduto"
      title="Editar dados do produto junto ao fornecedor"
      class="modal-danger"
      ok-variant="info"
      @ok="EditarProduto"
      @hidden="CancelEdicao"
    >
      <div class="row">
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-4">
          <div class="form-group">
            <label for>* Valor</label>
            <currency-input
              v-model="valorProduto"
              class="form-control"
              placeholder="Digite o valor do produto para este fornecedor"
              required
            />
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import FornecedorProdutoServico from "../../servico/FornecedorProdutoServico";

export default {
  name: "FornecedorProdutoSelect",
  components: { RotateSquare },
  props: {
    fornecedorId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalEditarInfoProduto: false,
      valorProduto: 0,
      quantidadeProduto: 0,
      fornecedorProdutoId: this.$store.getters.emptyGuid,
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 15,
      itens: [],
      abrir: false,
      filtro: {
        produto: "",
        produtosNoFornecedor: false
      },
      fields: [
        { key: "produto", label: "Produto", sortable: true },
        { key: "tipoProduto", label: "Tipo Produto", sortable: true },
        { key: "valor", label: "Valor", sortable: true },
        { key: "quantidadeAtendida", label: "Qtd. Atendida", sortable: true },
        { key: "valorAtendido", label: "Valor Atendido", sortable: true },
        { key: "quantidadeDesignada", label: "Qtd. Designada", sortable: true },
        { key: "valorDesignado", label: "Valor Designado", sortable: true },
        { key: "quantidadeEntregue", label: "Qtd. Entregue", sortable: true },
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
  mounted() {
    this.ObterGrid(1);
  },
  watch: {
    pagina: function (pagina) {
      this.ObterGrid(pagina);
    }
  },
  created() {},
  methods: {
    ValidarForm(evt) {},
    ObterGrid(pagina) {
      this.loading = false;
      FornecedorProdutoServico.ObterGridProdutoFornecedor(
        pagina,
        this.itensPorPagina,
        this.fornecedorId,
        this.filtro.produtosNoFornecedor,
        this.filtro.produto
      )
        .then((resposta) => {
          this.loading = false;
          this.itens = resposta.data.itens;
          this.total = resposta.data.total;
          this.itensPorPagina = resposta.data.itensPorPagina;
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
    RemoverProdutoFornecedor(item) {
      FornecedorProdutoServico.Remover(item.id)
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Produto removido com sucesso."],
            type: "success",
            duration: 1000
          });
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 1000
          });
        });
    },
    AdicionarProdutoFornecedor(item) {
      FornecedorProdutoServico.Adicionar(this.fornecedorId, item.produtoId)
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Produto adicionado com sucesso."],
            type: "success",
            duration: 1000
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
    Limpar() {
      this.filtro.produto = "";
      this.filtro.produtosNoFornecedor = false;
    },
    isNoFornecedor(item) {
      return item.id === this.$store.getters.emptyGuid;
    },
    EditarProduto(evento) {
      evento.preventDefault();

      if (!this.valorProduto || this.valorProduto <= 0) {
        this.$notify({
          data: ["Informe um valor válido."],
          type: "warn",
          duration: 3000
        });
        return;
      }

      // if (!this.quantidadeProduto) {
      //   this.quantidadeProduto = 0;
      // }

      this.modalEditarInfoProduto = false;

      FornecedorProdutoServico.EditarFornecedorProduto(
        this.fornecedorProdutoId,
        this.valorProduto,
        this.quantidadeProduto,
        this.fornecedorId
      )
        .then((resposta) => {
          this.loading = false;
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Produto alterado com sucesso."],
            type: "success",
            duration: 5000
          });
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
    CancelEdicao(evento) {
      evento.preventDefault();
      this.modalEditarInfoProduto = false;
    },
    Edicao(item) {
      this.modalEditarInfoProduto = true;
      this.fornecedorProdutoId = item.id;
      this.fornecedorId = item.fornecedorId;
      this.valorProduto = item.valor ? item.valor : 0;
      this.quantidadeProduto = item.quantidade ? item.quantidade : 0;
    },
    FormataValor(value) {
      return (value ? value : 0.0).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    },
    FormataQuantidade(valor) {
      return valor ? valor : 0;
    }
  }
};
</script>
