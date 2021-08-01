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
                <strong class="align-self-center">Contrato(s)</strong>
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
                      <label>Descricao</label>
                      <input
                        type="text"
                        v-model="filtro.descricao"
                        class="form-control"
                      />
                    </div>
                  </div>
                  <div
                    class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                    title="Apenas contratos vinculados ao produto."
                  >
                    <label for>Vinculado ao produto</label>
                    <b-form-checkbox
                      v-model="filtro.vinculadoAoProduto"
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
                      empty-text="Nenhum contrato encontrado."
                    >
                      <template v-slot:empty="scope">
                        <h4>{{ scope.emptyText }}</h4>
                      </template>

                      <template v-slot:cell(acoes)="data">
                        <div class="btn-group-sm">
                          <b-button
                            v-if="isContratoVinculado(data.item)"
                            variant="danger"
                            style="margin-right: 10px"
                            title="Contrato não vinculado ao produto"
                            @click="AdicionarContratoProduto(data.item)"
                          >
                            <i class="fas fa-times"></i>
                          </b-button>
                          <b-button
                            v-if="!isContratoVinculado(data.item)"
                            variant="success"
                            style="margin-right: 10px"
                            title="Contrato vinculado ao produto"
                            @click="RemoverContratoProduto(data.item)"
                          >
                            <i class="fas fa-check"></i>
                          </b-button>
                          <b-button
                            v-if="!isContratoVinculado(data.item)"
                            variant="info"
                            style="margin-right: 10px"
                            title="Editar contrato do produto"
                            @click="Edicao(data.item)"
                          >
                            <i class="fa fa-edit"></i>
                          </b-button>
                        </div>
                      </template>
                      <template v-slot:cell(dataInicio)="data">
                        <div class="center">
                          <span>{{ FormatarData(data.item.dataInicio) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(dataTermino)="data">
                        <div class="center">
                          <span>{{ FormatarData(data.item.dataTermino) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(valor)="data">
                        <div class="left">
                          <span>{{ FormataValor(data.item.valor) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidade)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidade)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(descricao)="data">
                        <div class="left">
                          <span>{{ FormataDescricao(data.item) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadeMinimaRateio)="data">
                        <div class="left">
                          <span>{{
                            FormataValorMinimoRateio(
                              data.item.quantidadeMinimaRateio
                            )
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
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </form>
    <b-modal
      v-model="modalEditarInfoContrato"
      title="Editar informação do contrato no produto"
      class="modal-danger"
      ok-variant="info"
      @ok="EditarContrato"
      @hidden="CancelEdicao"
    >
      <div class="row">
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-4">
          <div class="form-group">
            <label for>* Valor</label>
            <currency-input
              v-model="valor"
              class="form-control"
              placeholder="Informe valor"
              required
            />
          </div>
        </div>
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-4">
          <div class="form-group">
            <label for>* Unidade Medida</label>
            <b-form-select
              v-model="tipoUnidadeMedidaId"
              :options="tiposUnidadeMedidaOptions"
              required
            ></b-form-select>
          </div>
        </div>
      </div>
      <div class="row">
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-5">
          <div class="form-group">
            <label for>Margem Rateio</label>
            <vue-numeric
              v-bind:precision="0"
              v-bind:minus="false"
              thousand-separator="."
              decimal-separator=","
              v-model="margemRateio"
              class="form-control"
              placeholder="Margem ao efetuar rateio"
              required
            />
          </div>
        </div>
        <div class="col-sm-12 col-md-3 col-lg-3 col-xl-5">
          <div class="form-group">
            <label for>Quantidade Miníma Rateio</label>
            <vue-numeric
              v-bind:precision="0"
              v-bind:minus="false"
              thousand-separator="."
              decimal-separator=","
              v-model="quantidadeMinimaRateio"
              class="form-control"
              placeholder="Minímo ao efetuar rateio"
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
import ContratoProdutoServico from "../../servico/ContratoProdutoServico";

export default {
  name: "ProdutoContratoSelect",
  components: {
    RotateSquare
  },
  props: {
    produtoId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalEditarInfoContrato: false,
      valor: 0,
      margemRateio: 0,
      quantidadeMinimaRateio: 0,
      tipoUnidadeMedidaId: "",
      tiposUnidadeMedidaOptions: [],
      contratoId: this.$store.getters.emptyGuid,
      contratoClienteId: this.$store.getters.emptyGuid,
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 15,
      itens: [],
      abrir: false,
      filtro: {
        descricao: "",
        vinculadoAoProduto: false
      },
      fields: [
        { key: "descricao", label: "Descrição", sortable: true },
        // { key: "numero", label: "Número", sortable: true },
        // { key: "entidadeLicitacao", label: "Entidade", sortable: true },
        { key: "valor", label: "Valor", sortable: true },
        // { key: "quantidade", label: "Quantidade", sortable: true },
        // { key: "dataInicio", label: "Data Início", sortable: true },
        // { key: "dataTermino", label: "Data Término", sortable: true },
        // { key: "valor", label: "Valor Contrato", sortable: true },
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
        { key: "tipoUnidadeMedida", label: "Un. Medida", sortable: true },
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
    this.ObterTiposUnidadeMedidaSelect();
  },
  methods: {
    ValidarForm(evt) {},
    ObterGrid(pagina) {
      this.loading = false;
      ContratoProdutoServico.ObterGridProdutoContrato(
        pagina,
        this.itensPorPagina,
        this.produtoId,
        this.filtro.vinculadoAoProduto,
        this.filtro.descricao
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
    RemoverContratoProduto(item) {
      ContratoProdutoServico.Remover(item.id)
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Contrato removido com sucesso."],
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
    AdicionarContratoProduto(item) {
      ContratoProdutoServico.Adicionar(item.contratoId, this.produtoId)
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Contrato vinculado com sucesso."],
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
      this.filtro.descricao = "";
      this.filtro.vinculadoAoProduto = false;
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
    isContratoVinculado(item) {
      return item.id === this.$store.getters.emptyGuid;
    },
    EditarContrato(evento) {
      evento.preventDefault();

      if (!this.valor || this.valor <= 0) {
        this.$notify({
          data: ["Informe um valor válido."],
          type: "warn",
          duration: 3000
        });
        return;
      }

      if (!this.tipoUnidadeMedidaId) {
        this.$notify({
          data: ["Informe uma unidade válida."],
          type: "warn",
          duration: 3000
        });
        return;
      }

      this.modalEditarInfoContrato = false;

      ContratoProdutoServico.EditarContratoProduto(
        this.contratoClienteId,
        this.valor,
        this.quantidadeMinimaRateio,
        this.margemRateio,
        this.tipoUnidadeMedidaId,
        this.contratoId,
        this.produtoId
      )
        .then((resposta) => {
          this.loading = false;
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Contrato alterado com sucesso."],
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
      this.modalEditarInfoContrato = false;
    },
    Edicao(item) {
      this.modalEditarInfoContrato = true;
      this.contratoId = item.contratoId;
      this.contratoClienteId = item.id;
      this.valor = item.valor;
      this.margemRateio = item.margemRateio ?? 0;
      this.quantidadeMinimaRateio = item.quantidadeMinimaRateio ?? 0;
      this.tipoUnidadeMedidaId = item.tipoUnidadeMedidaId;
    },
    FormataQuantidade(valor) {
      if (valor != null) {
        return valor;
      } else {
        return 0;
      }
    },
    FormatarData(value) {
      if (value) {
        return new Date(value).toLocaleDateString();
      } else {
        return "";
      }
    },
    FormataDescricao(value) {
      return value.numero + " - " + value.entidadeLicitacao;
    },
    ObterTiposUnidadeMedidaSelect() {
      this.$http({
        url: "/tipoUnidadeMedida/obter-select",
        method: "GET"
      })
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
    FormataValorMinimoRateio(valor) {
      return valor ? valor : "-";
    },
    FormataValorMargemRateio(valor) {
      return valor ? valor + "%" : "-";
    }
  }
};
</script>
