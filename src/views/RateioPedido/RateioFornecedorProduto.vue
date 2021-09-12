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
                <strong class="align-self-center"
                  >Produto - {{ this.descricaoFornecedor }}</strong
                >
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
                    title="Apenas clientes presentes no pedido."
                  >
                    <label for>Presente no Rateio</label>
                    <b-form-checkbox
                      v-model="filtro.produtoNoRateio"
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
                            v-if="!AtendeProduto(data.item)"
                            variant="warning"
                            style="margin-right: 10px"
                            title="Atender Produto"
                            @click="ConfirmarProdutoFornecedor(data.item)"
                          >
                            <i class="far fa-hand-point-up"></i>
                          </b-button>

                          <b-button
                            v-if="AtendeProduto(data.item)"
                            variant="primary"
                            style="margin-right: 10px"
                            title="Confirmar produto"
                            @click="ConfirmarProdutoFornecedor(data.item)"
                          >
                            <i class="fas fa-thumbs-up"></i>
                          </b-button>

                          <b-button
                            v-if="AtendeProduto(data.item)"
                            variant="secondary"
                            style="margin-right: 10px"
                            title="Recusar produto"
                            @click="RecusarProdutoFornecedor(data.item)"
                          >
                            <i class="fas fa-thumbs-down"></i>
                          </b-button>
                          <b-button
                            v-if="
                              AtendeProduto(data.item) &&
                              FornecedorComTelefoneCadastrado()
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
                            variant="danger"
                            title="Remover produto fornecedor"
                            @click="Remover(data.item)"
                          >
                            <i class="fas fa-trash-alt"></i>
                            <!-- <i class="fa fa-edit"></i> -->
                          </b-button>
                        </div>
                      </template>
                      <template v-slot:cell(valorUnitario)="data">
                        <div class="left">
                          <span>{{
                            FormataValor(data.item.valorUnitario)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(valorTotal)="data">
                        <div class="left">
                          <span>{{ FormataValor(data.item.valorTotal) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadeSolicitada)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadeSolicitada)
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
      @ok="ModalRemocaoOk"
      @hidden="ModalRemocaoCancel"
    >
      Confirma a remoção do rateio?
    </b-modal>
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
      v-model="modalRecusar"
      title="Recusar produto no rateio"
      class="modal-danger"
      ok-variant="danger"
      @ok="ModalRecusarOk"
      @hidden="ModalRecusarCancel"
    >
      Ao recusar o atendimento deste produto, o fornecedor não participa
      novamente do rateio para esse produto no pedido. Confirma?
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
      v-model="modalAtenderProduto"
      title="Confirma produto"
      class="modal-success"
      ok-variant="success"
      @ok="ModalAtenderProdutoOk"
      @hidden="ModalAtenderProdutoCancel"
    >
      A quantidade confirmada deste produto deixa de ser rateada entre os
      fornecedores e fica limitada a este fornecedor. Confirma?

      <br />
      <br />
      <div class="row">
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-5">
          <div class="form-group">
            <label for>* Quantidade Confirmada</label>
            <vue-numeric
              v-bind:precision="3"
              v-bind:minus="false"
              thousand-separator="."
              decimal-separator=","
              v-model="itemEdicaoQuantidadeConfirmada"
              class="form-control"
              placeholder="Quantidade confirmada"
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
import RateioServico from "../../servico/RateioServico";
import PedidoProdutoFornecedorServico from "../../servico/PedidoProdutoFornecedorServico";
import ContatoServico from "../../servico/ContatoServico";
import Bus from "../../util/EventBus";

export default {
  name: "RateioFornecedorProduto",
  emits: ["atualizarFornecedor"],
  components: {
    RotateSquare,
    Bus,
    ContatoServico
  },
  props: {
    fornecedorId: { type: String, default: "" },
    pedidoId: { type: String, default: "" },
    descricaoFornecedor: { type: String, default: "" },
    telefoneWhatsAppParam: { type: String, default: "" },
    rateioId: { type: String, default: "" }
  },
  data() {
    return {
      itemEdicao: null,
      itemEdicaoQuantidadeConfirmada: 0,
      modalRemover: false,
      modalRecusar: false,
      modalEnviarWhatsApp: false,
      modalImpressao: false,
      modalAtenderProduto: false,
      telefoneWhatsApp: "",
      mensagemWhatsApp: "",
      fornecedorWhatsApp: "",
      produtoOptions: [],
      loading: false,
      abrir: true,
      pagina: 1,
      total: 0,
      itensPorPagina: 15,
      filtro: {
        produto: "",
        produtoNoRateio: true
      },
      itens: [],
      fields: [
        { key: "produto", label: "Produto", sortable: true },
        { key: "tipoProduto", label: "Tipo Produto", sortable: true },
        { key: "tipoUnidadeMedida", label: "Unidade Medida", sortable: true },
        { key: "quantidadeAtendida", label: "Atendido", sortable: true },
        { key: "quantidadeConfirmada", label: "Confirmado", sortable: true },
        { key: "quantidadeDesignada", label: "Designado", sortable: true },
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
    pagina: function (val) {
      this.ObterGrid(val);
    }
  },
  created() {
    Bus.$on("atualizar-produto-fornecedor", () => {
      this.ObterGrid(this.pagina);
    });
  },
  methods: {
    ObterGrid(val) {
      this.loading = false;
      this.itemEdicao = null;

      PedidoProdutoFornecedorServico.ObterGridFornecedor(
        val,
        this.itensPorPagina,
        this.pedidoId,
        this.fornecedorId,
        this.filtro.produto,
        this.filtro.produtoNoRateio,
        this.rateioId
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
    ModalRemocaoCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
    },
    ModalRemocaoOk(evento) {
      evento.preventDefault();
      this.modalRemover = false;

      if (!this.itemEdicao) return;

      PedidoProdutoFornecedorServico.RemoverProdutoFornecedorPedido(
        this.itemEdicao.id
      )
        .then(() => {
          this.ObterGrid(1);
          this.$emit("atualizarFornecedor");
          Bus.$emit("alterado-produto-fornecedor");
          this.$notify({
            data: ["Produto removido com sucesso."],
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
    Limpar() {
      this.filtro.produto = "";
      this.filtro.produtoNoRateio = true;
    },
    FormataValor(value) {
      return (value ? value : 0.0).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    },
    RemoverCifrao(valor) {
      if (valor) {
        return valor; //valor.toLocaleString("pt-BR", { minimumFractionDigits: 2 });
      } else {
        return valor;
      }
    },
    FormataQuantidade(valor) {
      return valor ? valor : 0;
    },
    AtendeProduto(item) {
      return item.quantidadeAtendida;
    },
    RecusarProdutoFornecedor(item) {
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
        this.pedidoId,
        this.itemEdicao.fornecedorId,
        this.itemEdicao.id
      )
        .then(() => {
          this.ObterGrid(this.pagina);
          Bus.$emit("alterado-produto-fornecedor");
          this.$notify({
            data: ["Produto recusado pelo fornecedor com sucesso."],
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
    ConfirmarProdutoFornecedor(item) {
      this.itemEdicao = item;
      this.modalAtenderProduto = true;
    },
    ModalAtenderProdutoCancel(evento) {
      evento.preventDefault();
      this.itemEdicao = null;
      this.modalAtenderProduto = false;
    },
    ModalAtenderProdutoOk(evento) {
      evento.preventDefault();

      evento.preventDefault();
      if (!this.itemEdicao) return;

      if (!this.itemEdicaoQuantidadeConfirmada) {
        this.loading = false;
        this.$notify({
          data: ["Quantidade confirmada deve ser informada."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      if (
        this.itemEdicaoQuantidadeConfirmada > this.itemEdicao.quantidadeAtendida
      ) {
        this.loading = false;
        this.$notify({
          data: ["Quantidade confirmada maior que quantidade atendida."],
          type: "warn",
          duration: 5000
        });
        return;
      }

      this.modalAtenderProduto = false;

      RateioServico.ConfirmarProdutoFornecedorRateio(
        this.pedidoId,
        this.itemEdicao.fornecedorId,
        this.itemEdicao.id,
        this.itemEdicaoQuantidadeConfirmada
      )
        .then(() => {
          this.ObterGrid(this.pagina);
          Bus.$emit("alterado-produto-fornecedor");
          this.$notify({
            data: ["Produto confirmado pelo fornecedor com sucesso."],
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
    ConfirmarProdutoFornecedor(item) {
      this.itemEdicao = item;
      this.modalAtenderProduto = true;
      this.itemEdicaoQuantidadeConfirmada = item.quantidadeConfirmada
        ? item.quantidadeConfirmada
        : item.quantidadeConfirmadaAnterior
        ? item.quantidadeConfirmadaAnterior
        : item.quantidadeAtendida;
    },
    RecusarProdutoFornecedor(item) {
      this.modalRecusar = true;
      this.itemEdicao = item;
    },
    FornecedorComTelefoneCadastrado() {
      return this.telefoneWhatsAppParam;
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
      this.telefoneWhatsApp = this.telefoneWhatsAppParam;
      this.fornecedorWhatsApp = item.pessoa;
      this.mensagemWhatsApp = "";
    }
  }
};
</script>
