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
            <header class="card-header" @click="switchAbertura()">
              <div class="d-flex">
                <strong class="align-self-center">Fornecedore(s)</strong>
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
                      <label>Fornecedor</label>
                      <input
                        type="text"
                        v-model="filtro.nome"
                        class="form-control"
                      />
                    </div>
                  </div>
                  <div
                    class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                    title="Apenas fornecedores que fornecem produtos no pedido."
                  >
                    <label for>Fornecedor com Produto</label>
                    <b-form-checkbox
                      v-model="filtro.fornecedorComProduto"
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
                            variant="warning"
                            style="margin-right: 10px"
                            title="Editar produtos do fornecedor"
                            @click="SwitchEditarProdutos(data.item)"
                          >
                            <i class="fa fa-edit text-black"></i>
                          </b-button>
                          <b-button
                            variant="danger"
                            title="Remover produtos do fornecedor"
                            @click="Remover(data.item)"
                          >
                            <i class="fas fa-trash-alt text-black"></i>
                          </b-button>
                        </div>
                      </template>
                      <template v-slot:cell(valorConsumido)="data">
                        <div class="left">
                          <span>{{
                            FormataValor(data.item.valorConsumido)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(valorPedido)="data">
                        <div class="left">
                          <span>{{ FormataValor(data.item.valorPedido) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(tipoFornecedor)="data">
                        <div class="center">
                          <span>{{
                            ObterNomeTipoFornecedor(data.item.tipoFornecedor)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(valorLimite)="data">
                        <div class="left">
                          <span>{{ FormataValor(data.item.valorLimite) }}</span>
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
      Você confirma a exclusão dos produtos desse fornecedor no pedido?
    </b-modal>
    <div v-if="EditarFornecedorProduto()">
      <PedidoFornecedorProduto
        :fornecedorId="this.fornecedorId"
        :pedidoId="this.pedidoId"
        :descricaoFornecedor="this.descricaoFornecedor"
        @atualizarFornecedor="atualizarFornecedor"
      >
      </PedidoFornecedorProduto>
    </div>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import PedidoFornecedorServico from "../../servico/PedidoFornecedorServico";
import TipoFornecedorEnum from "../../enums/TipoFornecedorEnum";
import Bus from "../../util/EventBus";
import PedidoFornecedorProduto from "./PedidoFornecedorProduto.vue";

export default {
  name: "PedidoFornecedor",
  components: {
    RotateSquare,
    Bus,
    PedidoFornecedorProduto
  },
  props: {
    pedidoId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalRemover: false,
      itemEdicao: null,
      fornecedorId: "",
      fornecedorOptions: [],
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 10,
      filtro: {
        nome: "",
        fornecedorComProduto: false
      },
      itens: [],
      abrir: false,
      editarProdutos: false,
      descricaoFornecedor: "",
      fields: [
        { key: "pessoa", label: "Fornecedor", sortable: true },
        { key: "tipoFornecedor", label: "Tipo Fornecedor", sortable: true },
        { key: "valorLimite", label: "Limite Contrato", sortable: true },
        { key: "valorPedido", label: "Atendido Pedido", sortable: true },
        {
          key: "valorConsumido",
          label: "Total Atendido",
          sortable: true
        },
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
  created() {
    Bus.$on("alterado-fornecedor-produto", () => {
      this.ObterGrid(this.pagina);
    });

    Bus.$on("remocao-produto-pedido", () => {
      this.ObterGrid(this.pagina);
    });

    Bus.$on("alterado-produto-cliente", () => {
      this.ObterGrid(this.pagina);
    });
    Bus.$on("remocao-produto-fornecedor", () => {
      this.ObterGrid(this.pagina);
    });
  },
  methods: {
    ObterGrid(pagina) {
      if (this.filtro.produto) {
        this.editarProdutos = false;
      }

      this.loading = true;
      PedidoFornecedorServico.ObterGridTotal(
        pagina,
        this.itensPorPagina,
        this.pedidoId,
        this.filtro.nome,
        this.filtro.fornecedorComProduto
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
      this.itemEdicao = null;
    },
    ModalOk(evento) {
      evento.preventDefault();
      this.modalRemover = false;
      if (!this.itemEdicao) return;

      PedidoFornecedorServico.RemoverFornecedorPedido(
        this.itemEdicao.fornecedorId,
        this.itemEdicao.pedidoId
      )
        .then(() => {
          this.ObterGrid(1);
          Bus.$emit("alterado-produto-fornecedor");
          this.$notify({
            data: ["Produtos do fornecedor removidos do pedido com sucesso."],
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
      this.itemEdicao = item;
    },
    Editar() {
      this.loading = true;
      PedidoFornecedorServico.Editar(this.viewModel)
        .then(() => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Fornecedor editado com sucesso."],
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
    Limpar() {
      this.filtro.nome = "";
      this.filtro.fornecedorComProduto = false;
    },
    FormataValor(valor) {
      if (valor != null) {
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
    ObterNomeTipoFornecedor(item) {
      switch (item) {
        case TipoFornecedorEnum.Avulso:
          return "Avulso";
        case TipoFornecedorEnum.Cooperado:
          return "Cooperado";
        default:
          return "Inválido";
      }
    },
    EditarFornecedorProduto() {
      return this.editarProdutos;
    },
    SwitchEditarProdutos(item) {
      if (1 == 2 && this.pedidoId != item.pedidoId) {
        this.pedidoId = item.pedidoId;
        this.fornecedorId = item.fornecedorId;

        if (this.editarProdutos) {
          // PedidoFornecedorProduto.ObterFGrid(1);
        }

        this.editarProdutos = true;
      } else {
        this.pedidoId = item.pedidoId;
        this.fornecedorId = item.fornecedorId;
        this.editarProdutos = !this.editarProdutos;
        this.descricaoFornecedor = item.pessoa;
      }
    },
    switchAbertura() {
      this.abrir = !this.abrir;

      if (!this.abrir) {
        this.editarProdutos = false;
      }
    },
    atualizarFornecedor() {
      this.ObterGrid(this.pagina);
    }
  }
};
</script>
