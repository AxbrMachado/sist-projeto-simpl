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
                      <label>Descrição</label>
                      <input
                        type="text"
                        v-model="filtro.descricao"
                        class="form-control"
                      />
                    </div>
                  </div>
                  <div
                    class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                    title="Apenas contratos presentes no fornecedor."
                  >
                    <label for>Presente no Fornecedor</label>
                    <b-form-checkbox
                      v-model="filtro.contratosNoFornecedor"
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
                            v-if="isNoFornecedor(data.item)"
                            variant="danger"
                            style="margin-right: 10px"
                            title="Contrato não vinculado ao fornecedor"
                            @click="AdicionarContratoFornecedor(data.item)"
                          >
                            <i class="fas fa-times"></i>
                          </b-button>
                          <b-button
                            v-if="!isNoFornecedor(data.item)"
                            variant="success"
                            style="margin-right: 10px"
                            title="Contrato vinculado ao fornecedor"
                            @click="RemoverContratoFornecedor(data.item)"
                          >
                            <i class="fas fa-check"></i>
                          </b-button>
                          <b-button
                            v-if="!isNoFornecedor(data.item)"
                            variant="info"
                            style="margin-right: 10px"
                            title="Editar contrato do fornecedor"
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
                      <template v-slot:cell(valorLimite)="data">
                        <div class="left">
                          <span>{{ FormataValor(data.item.valorLimite) }}</span>
                        </div>
                      </template>
                     <template v-slot:cell(valorConsumido)="data">
                        <div class="left">
                          <span>{{
                            FormataValor(data.item.valorConsumido)
                          }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(valorRestante)="data">
                        <div class="left">
                          <span>{{ FormataValorRestante(data.item) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(descricao)="data">
                        <div class="left">
                          <span>{{ FormataDescricao(data.item) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(quantidadeLimite)="data">
                        <div class="left">
                          <span>{{
                            FormataQuantidade(data.item.quantidadeLimite)
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
      title="Editar dados do contrato junto ao fornecedor"
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
              placeholder="Digite o valor do contrato para este fornecedor"
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
import ContratoFornecedorServico from "../../servico/ContratoFornecedorServico";
import TipoPessoaContratoEnum from "../../enums/TipoPessoaContratoEnum";

export default {
  name: "FornecedorContratoSelect",
  components: { RotateSquare, TipoPessoaContratoEnum },
  props: {
    pessoaId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalEditarInfoContrato: false,
      valor: 0,
      quantidade: 0,
      pessoaContratoId: this.$store.getters.emptyGuid,
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 10,
      itens: [],
      abrir: false,
      filtro: {
        descricao: "",
        contratosNoFornecedor: false
      },
      fields: [
        { key: "descricao", label: "Descrição", sortable: true },
        // { key: "numero", label: "Número", sortable: true },
        // { key: "entidadeLicitacao", label: "Entidade", sortable: true },
        { key: "valorLimite", label: "Valor Limite", sortable: true },
        // { key: "quantidadeLimite", label: "Quantidade Limite", sortable: true },
        { key: "valorConsumido", label: "Valor Consumido", sortable: true },
        { key: "valorRestante", label: "Valor Disponível", sortable: true },
        // { key: "dataInicio", label: "Data Início", sortable: true },
        // { key: "dataTermino", label: "Data Término", sortable: true },
        // { key: "valor", label: "Valor Contrato", sortable: true },
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
      ContratoFornecedorServico.ObterGridFornecedor(
        pagina,
        this.itensPorPagina,
        this.pessoaId,
        this.filtro.contratosNoFornecedor,
        this.filtro.descricao,
        TipoPessoaContratoEnum.Fornecedor
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
    RemoverContratoFornecedor(item) {
      ContratoFornecedorServico.Remover(item.id)
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
    AdicionarContratoFornecedor(item) {
      ContratoFornecedorServico.Adicionar(
        item.contratoId,
        this.pessoaId,
        TipoPessoaContratoEnum.Fornecedor
      )
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Contrato adicionado com sucesso."],
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
      this.filtro.contratosNoFornecedor = false;
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
    isNoFornecedor(item) {
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

      this.modalEditarInfoContrato = false;

      ContratoFornecedorServico.EditarContrato(
        this.pessoaContratoId,
        this.valor,
        this.quantidade,
        this.pessoaId,
        TipoPessoaContratoEnum.Fornecedor
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
      this.pessoaContratoId = item.id;
      this.pessoaId = item.pessoaId;
      this.valor = item.valorLimite ? item.valorLimite : 0;
      this.quantidade = item.quantidadeLimite ? item.quantidadeLimite : 0;
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
    FormataValorRestante(item) {
      var valor = 0;
      if (!item.valorLimite) {
        valor = 0;
      } else {
        if (item.valorConsumido) {
          valor = item.valorLimite - item.valorConsumido;
        } else {
          valor = item.valorLimite;
        }
      }

      return valor.toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    }
  }
};
</script>
