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
            <header class="card-header">
              <div class="d-flex">
                <strong class="align-self-center"
                  >{{
                    viewModel.id == this.$store.getters.emptyGuid
                      ? "Novo Pedido"
                      : "Editar Pedido"
                  }}
                </strong>
                <a
                  @click="Limpar()"
                  class="ml-auto btn btn-primary"
                  href="/#/pedidovenda/novo"
                  title="Adicionar novo pedido"
                >
                  Adicionar
                </a>
              </div>
            </header>
            <div class="card-body">
              <div class="row">
                <div class="col">
                  <div class="form-group">
                    <small>Campos com * são de preenchimento obrigatório</small>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-1">
                  <div class="form-group">
                    <label for>Número</label>
                    <input
                      disabled
                      v-model="viewModel.numero"
                      class="form-control"
                      type="text"
                      placeholder="Digite o número"
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-3">
                  <div class="form-group">
                    <label for>Descrição</label>
                    <input
                      v-model="viewModel.descricao"
                      class="form-control"
                      type="text"
                      placeholder="Digite a descrição"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-5">
                  <div class="form-group">
                    <label for>* Contrato</label>
                    <b-form-select
                      :disabled="bloqueiaContrato == 1"
                      v-model="viewModel.contratoId"
                      :options="contratoOptions"
                      required
                    ></b-form-select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>* Data Entrega</label>
                    <input
                      v-model="viewModel.dataEntrega"
                      class="form-control"
                      type="date"
                      placeholder="Digite a data de entrega"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>Valor</label>
                    <currency-input
                      disabled
                      v-model="viewModel.valor"
                      class="form-control"
                      placeholder="0,00"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <div class="form-group">
                    <label for>Observação</label>
                    <b-form-textarea
                      v-model="viewModel.observacao"
                      rows="4"
                      max-rows="12"
                      placeholder="Observações gerais..."
                    ></b-form-textarea>
                  </div>
                </div>
              </div>
            </div>
            <div class="btn-toolbar mb-3 ml-3" role="toolbar">
              <div class="btn-group" role="group">
                <button class="btn btn-success mr-2" type="submit">
                  Salvar
                </button>
              </div>
              <div class="btn-group" role="group">
                <button
                  class="btn btn-secondary"
                  type="reset"
                  @click="$router.go(-1)"
                >
                  Voltar
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <div v-if="IsEdicao()">
      <PedidoCliente
        :pedidoId="this.viewModel.id"
        @atualizarPedido="atualizarPedido"
      >
      </PedidoCliente>
      <PedidoProduto :pedidoId="viewModel.id"> </PedidoProduto>
      <PedidoFornecedor :pedidoId="viewModel.id"> </PedidoFornecedor>
      <NovoDocumento :referenciaId="this.viewModel.id"> </NovoDocumento>
      <Contato :referenciaId="this.viewModel.id"> </Contato>
    </div>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import DateTime from "../../util/DateTime";
import NovoDocumento from "../../components/NovoDocumento";
import PedidoCliente from "./PedidoCliente";
import PedidoFornecedor from "./PedidoFornecedor";
import PedidoProduto from "./PedidoProduto";
import Contato from "../../components/Contato";
import Bus from "../../util/EventBus";

export default {
  name: "NovoPedidoVenda",
  components: {
    Bus,
    RotateSquare,
    NovoDocumento,
    PedidoCliente,
    PedidoFornecedor,
    PedidoProduto,
    Contato
  },
  data() {
    return {
      bloqueiaContrato: 0,
      loading: false,
      tiposInstituicaoOptions: [],
      licitacaoOptions: [],
      contratoOptions: [],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        descricao: "",
        observacao: "",
        contratoId: this.$store.getters.emptyGuid,
        numero: 0,
        dataEntrega: "",
        dataTermino: ""
      }
    };
  },
  watch: {
    contratoOptions: function (val) {
      //this.LoadContratoLicitacao(val);
    }
  },
  created() {
    let pedidoId = this.$route.params.id;

    if (pedidoId) {
      this.viewModel.id = pedidoId;
      this.bloqueiaContrato = 1;
    } else {
      this.viewModel.id = this.$store.getters.emptyGuid;
      this.bloqueiaContrato = 0;
    }

    if (pedidoId) this.Obter(pedidoId);
    this.ObterContratosSelect();

    Bus.$on("remocao-produto-pedido", () => {
      this.atualizarPedido();
    });
  },
  methods: {
    ValidarForm(evt) {
      evt.preventDefault();
      if (this.viewModel.id !== this.$store.getters.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(pedidoId) {
      this.loading = false;
      this.$http({
        url: "pedido/obter/" + pedidoId,
        method: "GET"
      })
        .then((resposta) => {
          this.loading = false;
          resposta.data.dataEntrega = DateTime.formatar(
            resposta.data.dataEntrega
          );
          resposta.data.dataTermino = DateTime.formatar(
            resposta.data.dataTermino
          );
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
    Novo() {
      this.loading = false;
      this.$http({
        url: "pedido/novo",
        data: this.viewModel,
        method: "POST"
      })
        .then(() => {
          this.loading = false;
          this.$router.push("/pedidovenda");
          this.$notify({
            data: ["Pedido cadastrado com sucesso."],
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
      this.loading = false;
      this.$http({
        url: "pedido/editar",
        data: this.viewModel,
        method: "PUT"
      })
        .then(() => {
          this.loading = false;
          this.$router.push("/pedidovenda");
          this.$notify({
            data: ["Pedido editado com sucesso."],
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
    ObterInstituicoesSelect() {
      this.$http({
        url: "/licitacao/obter-select",
        method: "GET"
      })
        .then((response) => {
          this.licitacaoOptions = response.data;
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    ObterContratosSelect() {
      this.$http({
        url: "/contrato/obter-select",
        method: "GET"
      })
        .then((response) => {
          this.contratoOptions = response.data;
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    IsEdicao() {
      return this.viewModel.id !== this.$store.getters.emptyGuid;
    },
    Limpar() {
      this.viewModel.id = this.$store.getters.emptyGuid;
      this.viewModel.descricao = "";
      this.viewModel.observacao = "";
      this.viewModel.contratoId = this.$store.getters.emptyGuid;
      this.viewModel.numero = 0;
      this.viewModel.dataEntrega = "";
      this.viewModel.dataTermino = "";
      this.viewModel.valor = 0;

      this.ObterContratosSelect();
    },
    LoadContratoLicitacao(val) {
      //console.log(val);
    },
    atualizarPedido() {
      this.Obter(this.viewModel.id);
    }
  }
};
</script>
