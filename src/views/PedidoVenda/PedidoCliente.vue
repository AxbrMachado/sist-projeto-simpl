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
                            variant="warning"
                            style="margin-right: 10px"
                            title="Editar"
                            @click="SwitchEditarProdutoCliente(data.item.id)"
                          >
                            <i class="fa fa-edit text-black"></i>
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
      Você confirma a exclusão desse registro?
    </b-modal>
    <div v-if="EditarProdutoCliente()">
      <PedidoClienteProduto :pedidoPessoaId="this.pedidoPessoaId">
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

export default {
  components: {
    RotateSquare,
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
      modalRemover: false,
      itemRemover: null,
      clienteOptions: [],
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 10,
      itens: [],
      abrir: false,
      pedidoPessoaId: "",
      editarProduto: false,
      fields: [
        { key: "pessoa", label: "Cliente", sortable: true },
        { key: "tipoPessoa", label: "Tipo Pessoa", sortable: true },
        { key: "rota", label: "Rota", sortable: true },
        {
          key: "acoes",
          label: "Produtos",
          sortable: false,
          thClass: "center, wd-120-px"
        }
      ],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        pessoaId: "",
        pessoa: {},
        pedidoId: "",
        rota: "",
        valorLimite: 0,
        quantidadeLimite: 0,
        tipoPessoaPedido: TipoPessoaPedidoEnum.Cliente
      }
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
  },
  methods: {
    IsNovo() {
      return this.pedidoId === this.$store.getters.emptyGuid;
    },
    ValidarForm(evt) {
      evt.preventDefault();

      if (!this.viewModel.pessoa || this.viewModel.pessoa.id == undefined) {
        this.loading = false;
        this.$notify({
          data: ["Informe um cliente."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      if (this.viewModel.id !== this.$store.getters.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(id) {
      this.loading = true;
      PedidoCliente.Obter(id)
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
      this.loading = true;
      PedidoCliente.ObterGrid(val, this.itensPorPagina, this.pedidoId)
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
      if (!this.itemRemover) return;

      PedidoCliente.Remover(this.itemRemover)
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Cliente removido com sucesso."],
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
    Remover(id) {
      this.modalRemover = true;
      this.itemRemover = id;
    },
    Novo() {
      this.loading = true;
      this.viewModel.pedidoId = this.pedidoId;
      this.viewModel.pessoaId = this.viewModel.pessoa.id;
      PedidoCliente.Novo(this.viewModel)
        .then((resposta) => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Cliente cadastrado com sucesso."],
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
    Editar() {
      this.loading = true;
      this.viewModel.pedidoId = this.pedidoId;
      this.viewModel.pessoaId = this.viewModel.pessoa.id;
      PedidoCliente.Editar(this.viewModel)
        .then(() => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Cliente editado com sucesso."],
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
      this.viewModel.id = this.$store.getters.emptyGuid;
      this.viewModel.pessoaId = "";
      this.viewModel.pedidoId = "";
      this.viewModel.rota = "";
      this.viewModel.valorLimite = 0;
      this.viewModel.quantidadeLimite = 0;
      this.viewModel.pessoa = {};
    },
    FormataValor(valor) {
      if (valor != null) {
        return valor.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL"
        });
      } else {
        return valor;
      }
    },
    RemoverCifrao(valor) {
      if (valor != null) {
        return valor; //valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
      } else {
        return valor;
      }
    },
    FormataValor(valor) {
      if (valor != null) {
        return valor.toLocaleString("pt-br", {
          style: "currency",
          currency: "BRL"
        });
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
    SwitchEditarProdutoCliente(value) {
      if (this.pedidoPessoaId != value) {
        this.pedidoPessoaId = value;
        this.editarProduto = true;
      } else {
        this.pedidoPessoaId = value;
        this.editarProduto = !this.editarProduto;
      }
    },
    switchAbertura() {
      this.abrir = !this.abrir;

      if (!this.abrir) {
        this.editarProduto = false;
      }
    }
  }
};
</script>
