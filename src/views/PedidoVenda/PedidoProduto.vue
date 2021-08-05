<template>
  <div class="animated fadeIn">
    <div v-if="loading" class="loading-container">
      <RotateSquare
        class="loading-position animated fadeIn"
        size="60px"
      ></RotateSquare>
    </div>
    <form v-else @submit="ValidarForm">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div class="card">
            <header class="card-header" @click="switchAbertura()">
              <!-- <header class="card-header" @click="abrir = !abrir"> -->
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
                    title="Apenas produtos presentes no pedido."
                  >
                    <label for>Produto Solicitado</label>
                    <b-form-checkbox
                      v-model="filtro.produtosNoPedido"
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
                            variant="primary"
                            style="margin-right: 10px"
                            title="Editar Fornecedores do Produtos"
                            @click="SwitchEditarFornecedor(data.item)"
                          >
                            <i class="fas fa-binoculars"></i>
                            <!-- <i class="fas fa-cart-plus"></i> -->
                          </b-button>
                          <b-button
                            variant="danger"
                            style="margin-right: 10px"
                            title="Remover"
                            @click="Remover(data.item)"
                          >
                            <i class="fas fa-trash-alt"></i>
                          </b-button>
                          <b-button
                            v-if="produtoSolicitado(data.item)"
                            variant="warning"
                            title="Produto Designado"
                            @click="edicaoProdutoDesignado(data.item)"
                          >
                            <i class="fas fa-apple-alt"></i>
                          </b-button>
                        </div>
                      </template>
                      <template v-slot:cell(valorPedido)="data">
                        <div class="left">
                          <span>{{ FormataValor(data.item.valorPedido) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(valorUnitario)="data">
                        <div class="left">
                          <span>{{
                            FormataValor(data.item.valorUnitario)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadeSolicitada)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadeSolicitada)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadePendente)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidadePendente(data.item)
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
                      <template v-slot:cell(quantidadeAtendida)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadeAtendida)
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
      v-model="modalRemover"
      title="Confirmar exclusão"
      class="modal-danger"
      ok-variant="danger"
      @ok="ModalOk"
      @hidden="ModalCancel"
    >
      Você confirma a exclusão desse produto do pedido?
    </b-modal>
    <b-modal
      v-model="modalProdutoDesignado"
      title="Definir Produto Designado"
      class="modal-danger"
      ok-variant="info"
      @ok="modalProdutoDesignadoOk"
      @hidden="modalProdutoDesignadoCancel"
    >
      <div class="row">
        <div class="col-lg-5 col-md-6 col-sm-12">
          <div class="form-group">
            <label>Produto</label>
            <input
              disabled
              type="text"
              v-model="itemDescricaoProdutoOrigem"
              class="form-control"
            />
          </div>
        </div>
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-5">
          <div class="form-group">
            <label for>Quantidade Solicitada</label>
            <vue-numeric
              disabled
              v-bind:precision="3"
              v-bind:minus="false"
              thousand-separator="."
              decimal-separator=","
              v-model="itemQuantidadeSolicitada"
              class="form-control"
              placeholder="Digite a quantidade"
              requerid
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-12">
          <div class="form-group">
            <br />
            <label for>Informações do produto designado</label>
            <br />
            <br />
            <div class="row">
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-4">
                <div class="form-group">
                  <label for>Qtd. Designada</label>
                  <vue-numeric
                    v-bind:precision="3"
                    v-bind:minus="false"
                    thousand-separator="."
                    decimal-separator=","
                    v-model="itemQuantidadeProdutoDesignada"
                    class="form-control"
                    placeholder=""
                    requerid
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-10">
                <div class="form-group">
                  <label for>Produto</label>
                  <v-select
                    placeholder=""
                    v-model="itemProdutoDesignado"
                    :options="produtosDesignadosOptions"
                    @search="ObterProdutosDesignadosVSelect"
                  >
                    <template slot="no-options">
                      Nenhum resultado para a busca.
                    </template>
                  </v-select>
                </div>
                <!-- <div class="btn-group-sm">
                  <b-button
                    class="btn btn-secondary"
                    variant="success"
                    title="Procurar produto mais proxímo"
                  >
                    <i class="fas fa-search-location"></i>
                  </b-button>
                </div> -->
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-5">
                <div class="form-group">
                  <label for>Qtd. Designada Equivalente</label>
                  <vue-numeric
                    disabled
                    v-bind:precision="3"
                    v-bind:minus="false"
                    thousand-separator="."
                    decimal-separator=","
                    v-model="itemQuantidadeSolicitadaEquivalente"
                    class="form-control"
                    placeholder=""
                    requerid
                  />
                </div>
              </div>
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-5">
                <div class="form-group">
                  <label for>Valor Equivalente</label>
                  <currency-input
                    disabled
                    v-model="itemValorQuantidadeDesignada"
                    class="form-control"
                    placeholder="Digite o valor do contrato para este fornecedor"
                    required
                  />
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </b-modal>
    <div v-if="EditarFornecedorProduto()">
      <PedidoProdutoFornecedor
        :pedidoProdutoId="this.pedidoProdutoId"
        :descricaoProduto="this.descricaoProduto"
        @atualizarproduto="atualizarproduto"
      >
      </PedidoProdutoFornecedor>
    </div>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import PedidoProdutoServico from "../../servico/PedidoProdutoServico";
import PedidoProdutoClienteServico from "../../servico/PedidoProdutoClienteServico";
import PedidoProdutoFornecedor from "./PedidoProdutoFornecedor.vue";
import Bus from "../../util/EventBus";
import ProdutoServico from "../../servico/ProdutoServico";

export default {
  name: "PedidoProduto",
  components: {
    RotateSquare,
    Bus,
    PedidoProdutoFornecedor,
    ProdutoServico
  },
  props: {
    pedidoId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalProdutoDesignado: false,
      itemQuantidadeSolicitada: 0,
      itemQuantidadeSolicitadaEquivalente: 0,
      itemDescricaoProdutoOrigem: "",
      itemQuantidadeProdutoDesignada: 0,
      itemValorQuantidadeDesignada: 0,
      itemEdicao: null,

      itemProdutoDesignado: "",
      produtosDesignadosOptions: [],

      modalRemover: false,
      itemRemover: null,
      produtoOptions: [],
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 15,
      filtro: {
        produto: "",
        produtosNoPedido: false
      },
      itens: [],
      abrir: false,
      editarFornecedor: false,
      descricaoProduto: "",
      fields: [
        { key: "produto", label: "Produto", sortable: true },
        { key: "tipoProduto", label: "Tipo Produto", sortable: true },
        { key: "valorUnitario", label: "Valor Un.", sortable: true },
        { key: "valorPedido", label: "Valor Total", sortable: true },
        {
          key: "quantidadeSolicitada",
          label: "Qtd. Solicitada",
          sortable: true
        },
        {
          key: "quantidadeAtendida",
          label: "Qtd. Atendida",
          sortable: true
        },
        { key: "margemRateio", label: "% Rateio", sortable: true },
        { key: "quantidadePendente", label: "Qtd. Pendente", sortable: true },
        // { key: "disponivel", label: "Disponivel", sortable: true },
        { key: "tipoUnidadeMedida", label: "Unidade Medida", sortable: true },
        {
          key: "acoes",
          label: "Ações",
          sortable: false,
          thClass: "center, wd-120-px"
        }
      ],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        produtoId: "",
        produto: {},
        pedidoId: "",
        valor: 0,
        quantidade: 0
      }
    };
  },
  mounted() {
    this.ObterGrid(1);
  },
  watch: {
    itemQuantidadeProdutoDesignada: function (quantidadeDesignada) {
      this.buscaEquivalenciaProdutoDesignado(quantidadeDesignada);
    },

    pagina: function (pagina) {
      this.ObterGrid(pagina);
    }
  },
  created() {
    Bus.$on("alterado-produto-cliente", () => {
      this.ObterGrid(this.pagina);
    });
    Bus.$on("alterado-produto-fornecedor", () => {
      this.ObterGrid(this.pagina);
    });
    Bus.$on("remocao-produto-fornecedor", () => {
      this.ObterGrid(this.pagina);
    });
  },
  methods: {
    IsNovo() {
      return this.pedidoId === this.$store.getters.emptyGuid;
    },
    ValidarForm(evt) {
      evt.preventDefault();

      if (!this.viewModel.produto || this.viewModel.produto.id == undefined) {
        this.loading = false;
        this.$notify({
          data: ["Informe um produto."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      if (this.viewModel.id !== this.$store.getters.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(id) {
      this.loading = false;
      this.itemEdicao = null;
      this.itemProdutoDesignado = "";

      PedidoProdutoServico.Obter(id)
        .then((resposta) => {
          this.loading = false;
          //resposta.data.validade = DateTime.formatar(resposta.data.validade);
          this.viewModel = resposta.data;
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
    ObterGrid(val) {
      this.loading = false;

      if (this.filtro.produto) {
        this.editarFornecedor = false;
      }

      PedidoProdutoServico.ObterGridTotal(
        val,
        this.itensPorPagina,
        this.pedidoId,
        this.filtro.produto,
        this.filtro.produtosNoPedido
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
    ModalCancel(evento) {
      evento.preventDefault();
      this.itemRemover = null;
    },
    ModalOk(evento) {
      evento.preventDefault();
      this.modalRemover = false;
      if (!this.itemRemover.id) return;

      PedidoProdutoClienteServico.RemoverProdutoPedido(this.itemRemover.id)
        .then(() => {
          this.ObterGrid(1);
          Bus.$emit("remocao-produto-pedido");
          this.$notify({
            data: ["Produtos removido com sucesso."],
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
    Limpar() {
      this.viewModel.id = this.$store.getters.emptyGuid;
      this.viewModel.produtoId = "";
      this.viewModel.pedidoId = "";
      this.viewModel.valor = 0;
      this.viewModel.quantidade = 0;
      this.viewModel.produto = {};
      this.filtro.produto = "";
      this.filtro.produtosNoPedido = false;
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
    EditarFornecedorProduto() {
      return this.editarFornecedor;
    },
    SwitchEditarFornecedor(item) {
      if (1 == 2 && this.pedidoProdutoId != item.id) {
        this.pedidoProdutoId = item.id;

        if (this.editarFornecedor) {
          // PedidoClienteProduto.ObterFGrid(1);
        }

        this.editarFornecedor = true;
      } else {
        this.pedidoProdutoId = item.id;
        this.editarFornecedor = !this.editarFornecedor;
        this.descricaoProduto = item.produto;
      }
    },
    switchAbertura() {
      this.abrir = !this.abrir;

      if (!this.abrir) {
        this.editarFornecedor = false;
      }
    },
    atualizarproduto() {
      this.ObterGrid(this.pagina);
    },
    FormataQuantidade(valor) {
      return valor ? valor : 0;
    },
    FormataQuantidadePendente(item) {
      return item.quantidadeSolicitada - item.quantidadeAtendidaSemMargem;
    },
    FormataValorMargemRateio(valor) {
      return valor ? valor + "%" : "-";
    },
    edicaoProdutoDesignado(item) {
      this.modalProdutoDesignado = true;
      this.itemEdicao = item;
      this.itemQuantidadeSolicitadaEquivalente = 18; //item.quantidadeProdutoDesignadoEquivalente ?? 0;
      this.itemValorQuantidadeDesignada = 147.78; //item.valorProdutoDesignado ?? 0;

      this.itemProdutoDesignado = item.produtoDesignado;
      this.itemQuantidadeSolicitada = item.quantidadeSolicitada ?? 0;
      this.itemDescricaoProdutoOrigem = item.produto;
      this.itemQuantidadeProdutoDesignada =
        item.quantidadeProdutoDesignado ?? 0;
    },
    modalProdutoDesignadoCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
      this.itemQuantidadeSolicitada = 0;
      this.itemQuantidadeSolicitadaEquivalente = 0;
      this.itemQuantidadeProdutoDesignada = 0;
      this.itemValorQuantidadeDesignada = 0;
      this.itemProdutoDesignado = "";
      this.itemDescricaoProdutoOrigem = "";
      this.produtosDesignadosOptions = [];
    },

    modalProdutoDesignadoOk(evento) {
      evento.preventDefault();
      // this.modalProdutoDesignado = false;

      // if (!this.itemEdicao || !this.itemEdicaoQuantidade) return;

      // if (this.itemEdicaoQuantidade > this.itemEdicao.quantidadePedido) {
      //   this.loading = false;
      //   this.$notify({
      //     data: ["Quantidade maior que a solicitada no pedido."],
      //     type: "warn",
      //     duration: 5000
      //   });
      //   return;
      // }

      // if (this.itemEdicaoQuantidadeDesignada > this.itemEdicaoQuantidade) {
      //   this.loading = false;
      //   this.$notify({
      //     data: ["Quantidade designada maior que a atendida."],
      //     type: "warn",
      //     duration: 5000
      //   });
      //   return;
      // }

      // if (this.itemEdicaoQuantidadeDesignada) {
      //   if (!this.itemProdutoDesignado) {
      //     this.loading = false;
      //     this.$notify({
      //       data: ["Fornecedor designado deve ser informado."],
      //       type: "warn",
      //       duration: 5000
      //     });
      //     return;
      //   }
      // }

      // if (this.itemProdutoDesignado) {
      //   if (!this.itemEdicaoQuantidadeDesignada) {
      //     this.loading = false;
      //     this.$notify({
      //       data: ["Quantidade designada deve ser informada."],
      //       type: "warn",
      //       duration: 5000
      //     });
      //     return;
      //   }
      // }

      // this.modalProdutoDesignado = false;

      // PedidoProdutoFornecedorServico.EditarFornecedorProduto(
      //   this.itemEdicao.id,
      //   this.itemEdicaoQuantidade,
      //   this.itemProdutoDesignado?.id ?? null,
      //   this.itemEdicaoQuantidadeDesignada
      // )
      //   .then(() => {
      //     this.ObterGrid(1);
      //     this.$emit("atualizarproduto");
      //     Bus.$emit("alterado-produto-cliente");
      //     Bus.$emit("alterado-fornecedor-produto");
      //     this.$notify({
      //       data: ["Quantidade definida com sucesso."],
      //       type: "success",
      //       duration: 5000
      //     });
      //   })
      //   .catch((erro) => {
      //     this.$notify({
      //       data: erro.response.data.erros,
      //       type: "warn",
      //       duration: 5000
      //     });
      //   });
    },
    produtoSolicitado(item) {
      return item.quantidadeSolicitada ? true : false;
    },
    ObterProdutosDesignadosVSelect(descricao) {
      if (!descricao || descricao.length <= 2) return;

      if (
        this.itemQuantidadeProdutoDesignada >
        this.itemEdicao.quantidadeSolicitada
      ) {
        this.loading = false;
        this.itemProdutoDesignado = "";
        this.produtosDesignadosOptions = [];

        this.$notify({
          data: ["Quantidade designada maior que quantidade solicitada."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      if (!this.itemQuantidadeProdutoDesignada) {
        this.loading = false;
        this.itemProdutoDesignado = "";
        this.produtosDesignadosOptions = [];
        this.$notify({
          data: ["Quantidade designada não informada."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      ProdutoServico.ObterVSelectProdutoDesignado(
        descricao,
        this.itemEdicao.contratoId,
        this.itemEdicao.produtoId,
        this.itemQuantidadeProdutoDesignada
      )
        .then((response) => {
          this.produtosDesignadosOptions = response.data;
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    buscaEquivalenciaProdutoDesignado() {
      console.clear();
      if (this.itemQuantidadeProdutoDesignada) {
        if (this.itemProdutoDesignado) {
          console.log("Contrato             -> " + this.itemEdicao.contratoId);
          console.log("Produto Origem       -> " + this.itemEdicao.produtoId);
          console.log("Produto Designado    -> " + this.itemProdutoDesignado.label);
          console.log("Produto Designado    -> " + this.itemProdutoDesignado.id);
          console.log("Quantidade Designada -> " + this.itemQuantidadeProdutoDesignada
          );
        }
      }
    }
  }
};
</script>
