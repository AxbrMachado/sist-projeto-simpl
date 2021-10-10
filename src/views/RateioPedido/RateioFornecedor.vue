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
            <header class="card-header" @click="switchAberturaProdutos()">
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
                          <!-- <b-button
                            v-if="AtendeProduto(data.item)"
                            variant="info"
                            style="margin-right: 10px"
                            title="Visualizar produtos atendidos"
                            @click="SwitchEditarProdutos(data.item)"
                          >
                            <i class="fas fa-cart-plus"></i>
                          </b-button> -->

                          <b-button
                            v-if="
                              AtendeProduto(data.item) ||
                              (isFornecedorAvulso(data.item) &&
                                isRateioPendente(data.item))
                            "
                            variant="info"
                            style="margin-right: 10px"
                            title="Visualizar produtos atendidos"
                            @click="SwitchEditarProdutos(data.item)"
                          >
                            <i class="fas fa-cart-plus"></i>
                          </b-button>

                          <b-button
                            v-if="AtendeProduto(data.item)"
                            variant="primary"
                            style="margin-right: 10px"
                            title="Confirmar todos os produtos atendidos"
                            @click="ConfirmarProdutosFornecedor(data.item)"
                          >
                            <i class="fas fa-thumbs-up"></i>
                          </b-button>

                          <b-button
                            v-if="AtendeProduto(data.item)"
                            variant="secondary"
                            style="margin-right: 10px"
                            title="Recusar todos os produtos atendidos"
                            @click="RecusarProdutosFornecedor(data.item)"
                          >
                            <i class="fas fa-thumbs-down"></i>
                          </b-button>

                          <b-button
                            v-if="AtendeProduto(data.item)"
                            variant="danger"
                            style="margin-right: 10px"
                            title="Remover produtos atendidos"
                            @click="Remover(data.item)"
                          >
                            <i class="fas fa-trash-alt"></i>
                          </b-button>
                          <b-button
                            v-if="
                              AtendeProduto(data.item) &&
                              FornecedorComTelefoneCadastrado(data.item)
                            "
                            variant="success"
                            style="margin-right: 10px"
                            title="Enviar solicitação via whatsapp"
                            @click="EnviarWhatsApp(data.item)"
                          >
                            <i class="fab fa-whatsapp"></i>
                          </b-button>

                          <b-button
                            v-if="AtendeProduto(data.item)"
                            variant="dark"
                            title="Imprmir informações fornecedor no rateio"
                            @click="ImprimirInformacoesFornecedor(data.item)"
                          >
                            <i class="fas fa-print"></i>
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
                      <template v-slot:cell(valorDesignado)="data">
                        <div class="left">
                          <span>{{
                            FormataValor(data.item.valorDesignado)
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
                      <template v-slot:cell(quantidadeConfirmada)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadeConfirmada)
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
      v-model="modalEnviarWhatsApp"
      title="Enviar mensagem de whatsapp para fornecedor"
      class="modal-info"
      ok-variant="info"
      @ok="modalWhatsAppOk"
      @hidden="modalWhatsAppCancel"
    >
      <div class="row">
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-7">
          <div class="form-group">
            <label>Fornecedor</label>
            <input
              disabled
              type="text"
              v-model="fornecedorWhatsApp"
              class="form-control"
            />
          </div>
        </div>
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-5">
          <div class="form-group">
            <label for="">Telefone</label>
            <the-mask
              disabled
              :mask="['+55 (##) ####-####', '+55 (##) #####-####']"
              class="form-control"
              v-model="telefoneWhatsApp"
            />
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-6 col-lg-6 col-xl-12">
          <div class="form-group">
            <label for>Mensagem</label>
            <b-form-textarea
              id="textarea-auto-height"
              v-model="mensagemWhatsApp"
              rows="1"
              max-rows="1 "
              placeholder="Digite uma mensagem"
            ></b-form-textarea>
          </div>
        </div>
      </div>
    </b-modal>
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
    <b-modal
      v-model="modalRecusar"
      title="Recusar produtos pedido para fornecedor"
      class="modal-danger"
      ok-variant="danger"
      @ok="ModalRecusarOk"
      @hidden="ModalRecusarCancel"
    >
      Ao recusar o atendimento dos produtos, o fornecedor não participa
      novamente do rateio do pedido. Confirma?
    </b-modal>
    <b-modal
      v-model="modalImpressao"
      title="Impressão"
      class="modal-info"
      ok-variant="info"
    >
      Rotina de impressão em desenvolvimento
    </b-modal>
    <b-modal
      v-model="modalAtenderTodos"
      title="Confirmar produtos pedido para fornecedor"
      class="modal-success"
      ok-variant="success"
      @ok="ModalAtenderTodosOk"
      @hidden="ModalAtenderTodosCancel"
    >
      Ao confirmar o atendimento dos produtos deste fornecedor os mesmos não
      entram mais em possíveis rateios deste pedido. Confirma?
    </b-modal>
    <div v-if="EditarFornecedorProduto()">
      <RateioFornecedorProduto
        :fornecedorId="this.fornecedorId"
        :pedidoId="this.pedidoId"
        :descricaoFornecedor="this.descricaoFornecedor"
        :telefoneWhatsAppParam="this.telefoneWhatsApp"
        :rateioId="this.rateioId"
        @atualizarFornecedor="atualizarFornecedor"
      >
      </RateioFornecedorProduto>
    </div>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import PedidoFornecedorServico from "../../servico/PedidoFornecedorServico";
import TipoFornecedorEnum from "../../enums/TipoFornecedorEnum";
import StatusRateioEnum from "../../enums/StatusRateioEnum";
import Bus from "../../util/EventBus";
import RateioServico from "../../servico/RateioServico";
import ContatoServico from "../../servico/ContatoServico";
import RateioFornecedorProduto from "./RateioFornecedorProduto";

export default {
  name: "RateioFornecedor",
  emits: ["atualizarRateio"],
  components: {
    RotateSquare,
    Bus,
    RateioServico,
    RateioFornecedorProduto
  },
  props: {
    rateioId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalRemover: false,
      modalRecusar: false,
      modalEnviarWhatsApp: false,
      modalImpressao: false,
      modalAtenderTodos: false,
      telefoneWhatsApp: "",
      mensagemWhatsApp: "",
      fornecedorWhatsApp: "",
      itemEdicao: null,
      fornecedorId: "",
      fornecedorOptions: [],
      abrir: false,
      editarProdutos: false,
      descricaoFornecedor: "",
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 15,
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
        // { key: "valorLimite", label: "Limite Contrato", sortable: true },
        // { key: "valorConsumido", label: "Total Consumido", sortable: true },
        // { key: "valorDesignado", label: "Designado", sortable: true },
        // { key: "valorPedido", label: "Atendido", sortable: true },
        { key: "quantidadeAtendida", label: "Atendido", sortable: true },
        { key: "quantidadeConfirmada", label: "Confirmado", sortable: true },
        { key: "quantidadeDesignada", label: "Designado", sortable: true },
        // {
        //   key: "fornecedorDesignado.label",
        //   label: "Fornecedor Designado",
        //   sortable: true
        // },
        // { key: "quantidadeDesignada", label: "Qtd. Designada", sortable: true },
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
    Bus.$on("rateio-efetuado", () => {
      this.ObterGrid(this.pagina);
    });

    Bus.$on("alterado-produto-fornecedor", () => {
      this.ObterGrid(this.pagina);
      this.$emit("atualizarRateio");
    });

    Bus.$on("atualiza-fornecedores-rateio", () => {
      this.ObterGrid(this.pagina);
    });
  },
  methods: {
    ObterGrid(pagina) {
      if (this.filtro.produto) {
        this.editarProdutos = false;
      }

      Bus.$emit("atualizar-produto-fornecedor");

      this.loading = false;
      PedidoFornecedorServico.ObterGridTotal(
        pagina,
        this.itensPorPagina,
        this.$store.getters.emptyGuid,
        this.rateioId,
        this.filtro.nome,
        this.filtro.fornecedorComProduto
      )
        .then((resposta) => {
          this.editarProdutos = false;
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
          this.ObterGrid(this.pagina);
          this.$emit("atualizarRateio");
          this.$notify({
            data: [
              "Produtos atendidos pelo fornecedor removidos do pedido com sucesso."
            ],
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
      this.loading = false;
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
    FormataValor(value) {
      return (value ? value : 0.0).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
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

    switchAberturaProdutos() {
      this.abrir = !this.abrir;

      if (!this.abrir) {
        this.editarProdutos = false;
      }
    },
    atualizarFornecedor() {
      this.ObterGrid(this.pagina);
    },
    FormataQuantidade(valor) {
      return valor ? valor : 0;
    },
    AtendeProduto(item) {
      return item.valorPedido;
    },
    RecusarProdutosFornecedor(item) {
      this.modalRecusar = true;
      this.itemEdicao = item;
    },
    ModalRecusarCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
    },
    ModalRecusarOk(evento) {
      evento.preventDefault();
      this.modalRecusar = false;
      if (!this.itemEdicao) return;

      RateioServico.RecusarProdutoFornecedorRateio(
        this.itemEdicao.pedidoId,
        this.itemEdicao.fornecedorId,
        this.$store.getters.emptyGuid
      )
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$emit("atualizarRateio");
          this.$notify({
            data: ["Produtos recusados pelo fornecedor com sucesso."],
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
    ImprimirInformacoesFornecedor(item) {
      this.modalImpressao = true;
    },
    FornecedorComTelefoneCadastrado(item) {
      return item.telefone;
    },
    modalWhatsAppCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
    },
    modalWhatsAppOk(evento) {
      evento.preventDefault();
      this.modalEnviarWhatsApp = false;
      if (!this.itemEdicao) return;

      ContatoServico.EnviarWhatsApp(
        this.telefoneWhatsApp,
        this.mensagemWhatsApp
      );
    },
    EnviarWhatsApp(item) {
      this.modalEnviarWhatsApp = true;
      this.itemEdicao = item;
      this.telefoneWhatsApp = item.telefone;
      this.fornecedorWhatsApp = item.pessoa;
      this.mensagemWhatsApp = "";
    },
    ConfirmarProdutosFornecedor(item) {
      this.itemEdicao = item;
      this.modalAtenderTodos = true;
    },
    ModalAtenderTodosCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
      this.modalAtenderTodos = false;
    },
    ModalAtenderTodosOk(evento) {
      evento.preventDefault();
      this.modalAtenderTodos = false;

      evento.preventDefault();
      this.modalRecusar = false;
      if (!this.itemEdicao) return;

      RateioServico.ConfirmarProdutoFornecedorRateio(
        this.itemEdicao.pedidoId,
        this.itemEdicao.fornecedorId,
        this.$store.getters.emptyGuid,
        0
      )
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$emit("atualizarRateio");
          this.$notify({
            data: ["Produtos confirmados pelo fornecedor com sucesso."],
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
        this.telefoneWhatsApp = item.telefone;
      }
    },
    switchAberturaProdutos() {
      this.abrir = !this.abrir;

      if (!this.abrir) {
        this.editarProdutos = false;
      }
    },
    isFornecedorAvulso(item) {
      return item.tipoFornecedor == TipoFornecedorEnum.Avulso;
    },
    isRateioPendente(item) {
      return item.statusRateio == StatusRateioEnum.Incompleto;
    }
  }
};
</script>
