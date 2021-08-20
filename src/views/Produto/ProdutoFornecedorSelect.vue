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
                <strong class="align-self-center">Fornecedor(s)</strong>
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
                      <label>Nome</label>
                      <input
                        type="text"
                        v-model="filtro.nome"
                        class="form-control"
                      />
                    </div>
                  </div>
                  <div
                    class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                    title="Apenas fornecedores vinculados ao produto."
                  >
                    <label for>Fornecedor Vinculado</label>
                    <b-form-checkbox
                      v-model="filtro.fornecedorVinculado"
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
                      empty-text="Nenhum fornecedor encontrado."
                    >
                      <template v-slot:empty="scope">
                        <h4>{{ scope.emptyText }}</h4>
                      </template>

                      <template v-slot:cell(acoes)="data">
                        <div class="btn-group-sm">
                          <b-button
                            v-if="isNoProduto(data.item)"
                            variant="danger"
                            style="margin-right: 10px"
                            title="Fornecedor não vinculado ao produto"
                            @click="AdicionarFornecedorProduto(data.item)"
                          >
                            <i class="fas fa-times"></i>
                          </b-button>
                          <b-button
                            v-if="!isNoProduto(data.item)"
                            variant="success"
                            style="margin-right: 10px"
                            title="Fornecedor vinculado a produto"
                            @click="RemoverFornecedorProduto(data.item)"
                          >
                            <i class="fas fa-check"></i>
                          </b-button>
                          <b-button
                            v-if="!isNoProduto(data.item)"
                            variant="info"
                            style="margin-right: 10px"
                            title="Editar fornecedor do produto"
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
                      <template v-slot:cell(tipoFornecedor)="data">
                        <div class="center">
                          <span>{{
                            ObterNomeTipoFornecedor(data.item.tipoFornecedor)
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
      v-model="modalEditarInfoFornecedor"
      title="Editar dados do fornecedor junto ao produto"
      class="modal-danger"
      ok-variant="info"
      @ok="EditarFornecedor"
      @hidden="CancelEdicao"
    >
      <div class="row">
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-4">
          <div class="form-group">
            <label for>* Valor</label>
            <currency-input
              v-model="valor"
              class="form-control"
              placeholder="Digite o valor do produto para este fornecedor"
              required
            />
          </div>
        </div>
        <!-- <div class="col-sm-12 col-md-3 col-lg-3 col-xl-6">
          <div class="form-group">
            <label for>* Quantidade</label>
            <vue-numeric
              v-bind:precision="3"
              v-bind:minus="false"
              thousand-separator="."
              decimal-separator=","
              v-model="quantidade"
              class="form-control"
              placeholder="Digite a quantidade disponível"
              required
            />
          </div>
        </div> -->
      </div>
    </b-modal>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import FornecedorProdutoServico from "../../servico/FornecedorProdutoServico";
import TipoFornecedorEnum from "../../enums/TipoFornecedorEnum";

export default {
  name: "ProdutoFornecedorSelect",
  components: { RotateSquare },
  props: {
    produtoId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalEditarInfoFornecedor: false,
      valor: 0,
      quantidade: 0,
      fornecedorProdutoId: this.$store.getters.emptyGuid,
      fornecedorId: this.$store.getters.emptyGuid,
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 15,
      itens: [],
      abrir: false,
      filtro: {
        nome: "",
        fornecedorVinculado: false
      },
      fields: [
        { key: "nome", label: "Fornecedor", sortable: true },
        { key: "tipoFornecedor", label: "Tipo Fornecedor", sortable: true },
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
      FornecedorProdutoServico.ObterGridFornecedorProduto(
        pagina,
        this.itensPorPagina,
        this.produtoId,
        this.filtro.fornecedorVinculado,
        this.filtro.nome
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
    RemoverFornecedorProduto(item) {
      FornecedorProdutoServico.Remover(item.id)
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Fornecedor removido com sucesso."],
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
    AdicionarFornecedorProduto(item) {
      FornecedorProdutoServico.Adicionar(item.fornecedorId, this.produtoId)
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Fornecedor adicionado com sucesso."],
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
      this.filtro.nome = "";
      this.filtro.fornecedorVinculado = false;
    },
    FormataValor(value) {
      return (value ? value : 0.0).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    },
    isNoProduto(item) {
      return item.id === this.$store.getters.emptyGuid;
    },
    EditarFornecedor(evento) {
      evento.preventDefault();

      if (!this.valor || this.valor <= 0) {
        this.$notify({
          data: ["Informe um valor válido."],
          type: "warn",
          duration: 3000
        });
        return;
      }

      this.modalEditarInfoFornecedor = false;

      FornecedorProdutoServico.EditarFornecedorProduto(
        this.fornecedorProdutoId,
        this.valor,
        this.quantidade,
        this.fornecedorId
      )
        .then((resposta) => {
          this.loading = false;
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Fornecedor alterado com sucesso."],
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
      this.modalEditarInfoFornecedor = false;
    },
    Edicao(item) {
      this.modalEditarInfoFornecedor = true;
      this.fornecedorProdutoId = item.id;
      this.fornecedorId = item.fornecedorId;
      this.valor = item.valor ? item.valor : 0;
      this.quantidade = item.quantidade ? item.quantidade : 0;
    },
    FormataQuantidade(valor) {
      return valor ? valor : 0;
    },
    ObterNomeTipoFornecedor(item) {
      switch (item) {
        case TipoFornecedorEnum.Avulso:
          return "Avulso";
        case TipoFornecedorEnum.Cooperado:
          return "Cooperado";
        default:
          return "Inválido";
      }
    }
  }
};
</script>
