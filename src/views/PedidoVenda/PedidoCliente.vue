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
              <!-- <header class="card-header" @click="abrir = !abrir"> -->
              <div class="d-flex">
                <strong class="align-self-center">Cliente(s)</strong>
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
                    title="Apenas clientes com produtos no pedido."
                  >
                    <label for>Com Produtos</label>
                    <b-form-checkbox
                      v-model="filtro.clienteComProduto"
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
                      empty-text="Nenhum cliente encontrado."
                    >
                      <template v-slot:empty="scope">
                        <h4>{{ scope.emptyText }}</h4>
                      </template>

                      <template v-slot:cell(acoes)="data">
                        <div class="btn-group-sm">
                          <b-button
                            variant="primary"
                            style="margin-right: 10px"
                            title="Editar Produtos do Cliente"
                            @click="SwitchEditarProdutoCliente(data.item)"
                          >
                            <i class="fas fa-cart-plus"></i>
                          </b-button>
                        </div>
                      </template>
                      <template v-slot:cell(tipoPessoa)="data">
                        <div class="center">
                          <span>{{
                            ObterTipoPessoa(data.item.tipoPessoa)
                          }}</span>
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <div v-if="EditarProdutoCliente()">
      <PedidoClienteProduto
        :pedidoPessoaId="this.pedidoPessoaId"
        :descricaoCliente="this.descricaoCliente"
        @atualizarCliente="atualizarCliente"
      >
      </PedidoClienteProduto>
    </div>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import PedidoCliente from "../../servico/PedidoClienteServico";
import TipoPessoaPedidoEnum from "../../enums/TipoPessoaEnum";
import TipoPessoaEnum from "../../enums/TipoPessoaEnum";
import PedidoClienteProduto from "./PedidoClienteProduto.vue";
import Bus from "../../util/EventBus";

export default {
  name: "PedidoCliente",
  emits: ["atualizarPedido"],
  components: {
    RotateSquare,
    Bus,
    PedidoCliente,
    TipoPessoaPedidoEnum,
    TipoPessoaEnum,
    PedidoClienteProduto
  },
  props: {
    pedidoId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      itemRemover: null,
      clienteOptions: [],
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 15,
      filtro: {
        nome: "",
        clienteComProduto: false
      },
      itens: [],
      abrir: false,
      pedidoPessoaId: "",
      descricaoCliente: "",
      editarProduto: false,
      fields: [
        { key: "pessoa", label: "Cliente", sortable: true },
        { key: "tipoPessoa", label: "Tipo Pessoa", sortable: true },
        { key: "valor", label: "Valor Produtos", sortable: true },
        { key: "rota", label: "Rota", sortable: true },
        {
          key: "acoes",
          label: "Produtos",
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
    pagina: function (val) {
      this.ObterGrid(val);
    }
  },
  created() {
    //let pedidoId = this.$route.params.id;
    //if (pedidoId) this.Obter(pedidoId);
    // this.ObterClientesSelect();

    Bus.$on("remocao-produto-pedido", () => {
      this.ObterGrid(this.pagina);
    });
  },
  methods: {
    ObterGrid(pagina) {
      if (this.filtro.nome) {
        this.editarProduto = false;
      }

      // this.loading = false;
      PedidoCliente.ObterGrid(
        pagina,
        this.itensPorPagina,
        this.pedidoId,
        this.filtro.nome,
        this.filtro.clienteComProduto
      )
        .then((resposta) => {
          this.loading = false;
          this.itens = resposta.data.itens;
          this.total = resposta.data.total;
          this.itensPorPagina = resposta.data.itensPorPagina;
          // this.editarProduto = false;
          this.$emit("atualizarPedido");
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
      this.filtro.clienteComProduto = false;
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
    RemoverCifrao(valor) {
      if (valor != null) {
        return valor; //valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
      } else {
        return valor;
      }
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
    EditarProdutoCliente() {
      return this.editarProduto;
    },
    SwitchEditarProdutoCliente(item) {
      if (1 == 2 && this.pedidoPessoaId != item.id) {
        this.pedidoPessoaId = item.id;

        if (this.editarProduto) {
          // PedidoClienteProduto.ObterFGrid(1);
        }

        this.editarProduto = true;
      } else {
        this.pedidoPessoaId = item.id;
        this.editarProduto = !this.editarProduto;
        this.descricaoCliente = item.pessoa;
      }
    },
    switchAbertura() {
      this.abrir = !this.abrir;

      if (!this.abrir) {
        this.editarProduto = false;
      }
    },
    atualizarCliente() {
      this.ObterGrid(this.pagina);
    }
  }
};
</script>
