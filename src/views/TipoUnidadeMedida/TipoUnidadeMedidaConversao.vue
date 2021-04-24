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
            <header class="card-header" @click="abrir = !abrir">
              <div class="d-flex">
                <strong class="align-self-center">Conversões(s)</strong>
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
                  <div class="col">
                    <div class="form-group">
                      <small
                        >Campos com * são de preenchimento obrigatório</small
                      >
                    </div>
                  </div>
                </div>
                <div class="row">
                  <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div class="form-group">
                      <label for>* Descrição</label>
                      <input
                        v-model="viewModel.descricao"
                        class="form-control"
                        type="text"
                        placeholder="Digite a descrição"
                        required
                      />
                    </div>
                  </div>
                </div>
                <div class="row">
                  <!-- <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                    <div class="form-group">
                      <label for>* Unidade Medida</label>
                      <b-form-select
                        v-model="viewModel.tipoUnidadeMedidaId"
                        :options="tiposUnidadeMedidaOptions"
                      ></b-form-select>
                    </div>
                  </div> -->
                  <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                    <div class="form-group">
                      <label for>* Quantidade</label>
                      <vue-numeric
                        v-bind:precision="3"
                        v-bind:minus="false"
                        v-model="viewModel.valor"
                        class="form-control"
                        placeholder="Digite a quantidade"
                        required
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                    <div class="form-group">
                      <label for>* Unidade Medida</label>
                      <b-form-select
                        v-model="viewModel.tipoUnidadeMedidaBaseId"
                        :options="tiposUnidadeMedidaOptions"
                        required
                      ></b-form-select>
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
                <div class="btn-toolbar mb-3" role="toolbar">
                  <div class="btn-group" role="group">
                    <button class="btn btn-success mr-2" type="submit">
                      Salvar
                    </button>
                  </div>
                  <div class="btn-group" role="group">
                    <button
                      class="btn btn-secondary"
                      type="reset"
                      @click="$router.push('/tipoUnidadeMedida')"
                    >
                      Voltar
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
                      empty-text="Nenhuma conversão encontrada."
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
                            @click="Obter(data.item.id)"
                          >
                            <i class="fa fa-edit text-black"></i>
                          </b-button>
                          <b-button
                            variant="danger"
                            title="Remover"
                            @click="Remover(data.item.id)"
                          >
                            <i class="fas fa-trash-alt text-black"></i>
                          </b-button>
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
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import UnidadeMedidaServico from "../../servico/UnidadeMedidaServico";

export default {
  components: { RotateSquare },
  props: {
    tipoUnidadeMedidaId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalRemover: false,
      itemRemover: null,
      tiposUnidadeMedidaOptions: [],
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 5,
      itens: [],
      abrir: false,
      fields: [
        { key: "descricao", label: "Nome", sortable: true },
        {
          key: "tipoUnidadeMedida",
          label: "Unidade",
          sortable: true
        },
        { key: "valor", label: "Quantidade", sortable: true },
        {
          key: "tipoUnidadeMedidaBase",
          label: "Unidade",
          sortable: true
        },
        { key: "observacao", label: "Observação", sortable: true },
        {
          key: "acoes",
          label: "Ações",
          sortable: false,
          thClass: "center, wd-120-px"
        }
      ],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        descricao: "",
        tipoUnidadeMedidaId: "",
        operacao: 0,
        valor: 0,
        tipoUnidadeMedidaBaseId: "",
        observacao: ""
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
    this.ObterTiposUnidadeMedidaSelect();
  },
  methods: {
    IsNovo() {
      return this.tipoUnidadeMedidaId === this.$store.getters.emptyGuid;
    },
    ValidarForm(evt) {
      evt.preventDefault();

      if (this.tipoUnidadeMedidaId == this.viewModel.tipoUnidadeMedidaBaseId) {
        this.loading = false;
        this.$notify({
          data: ["Unidades devem ser diferentes."],
          type: "warn",
          duration: 10000
        });
        return;
      }

      if (this.viewModel.id !== this.$store.getters.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(id) {
      this.loading = true;
      UnidadeMedidaServico.Obter(id)
        .then((resposta) => {
          this.loading = false;
          this.viewModel = resposta.data;
        })
        .catch((erro) => {
          this.loading = false;
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 10000
          });
        });
    },
    ObterGrid(val) {
      this.loading = true;
      UnidadeMedidaServico.ObterGrid(
        val,
        this.itensPorPagina,
        this.tipoUnidadeMedidaId
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
            duration: 10000
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

      UnidadeMedidaServico.Remover(this.itemRemover)
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Conversão removida com sucesso."],
            type: "success",
            duration: 10000
          });
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 10000
          });
        });
    },
    Remover(id) {
      this.modalRemover = true;
      this.itemRemover = id;
    },
    Novo() {
      this.loading = true;
      this.viewModel.tipoUnidadeMedidaId = this.tipoUnidadeMedidaId;
      UnidadeMedidaServico.Novo(this.viewModel)
        .then((resposta) => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Conversão cadastrada com sucesso."],
            type: "success",
            duration: 10000
          });
        })
        .catch((erro) => {
          this.loading = false;
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 10000
          });
        });
    },
    Editar() {
      this.loading = true;
      this.viewModel.tipoUnidadeMedidaId = this.tipoUnidadeMedidaId;
      UnidadeMedidaServico.Editar(this.viewModel)
        .then(() => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Conversão editada com sucesso."],
            type: "success",
            duration: 10000
          });
        })
        .catch((erro) => {
          this.loading = false;
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 10000
          });
        });
    },
    Limpar() {
      this.viewModel.id = this.$store.getters.emptyGuid;
      this.viewModel.descricao = "";
      this.viewModel.tipoUnidadeMedidaId = "";
      this.viewModel.operacao = 0;
      this.viewModel.valor = 0;
      this.viewModel.tipoUnidadeMedidaBaseId = "";
      this.viewModel.observacao = "";
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
            duration: 10000
          });
        });
    }
  }
};
</script>
