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
                <strong class="align-self-center">Contato(s)</strong>
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
                  <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                    <div class="form-group">
                      <label for="">* Nome</label>
                      <input
                        class="form-control"
                        type="text"
                        v-model="viewModel.nome"
                        required
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                    <div class="form-group">
                      <label for="">Telefone</label>
                      <input
                        class="form-control"
                        type="text"
                        v-model="viewModel.telefone"
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                    <div class="form-group">
                      <label for="">E-mail</label>
                      <input
                        class="form-control"
                        type="email"
                        v-model="viewModel.email"
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
                      @click="$router.back()"
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
                      empty-text="Nenhum contato encontrado."
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
import RotateSquare from "../components/RotateSquare";
import ContatoServico from "../servico/ContatoServico";

export default {
  components: { RotateSquare },
  props: {
    referenciaId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalRemover: false,
      itemRemover: null,
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 5,
      itens: [],
      abrir: false,
      fields: [
        { key: "nome", label: "Nome", sortable: true },
        { key: "telefone", label: "Telefone", sortable: true },

        { key: "email", label: "E-mail", sortable: true },
        {
          key: "acoes",
          label: "Ações",
          sortable: false,
          thClass: "center, wd-120-px"
        }
      ],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        nome: "",
        observacao: "",
        email: "",
        telefone: null,
        referenciaId: ""
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
  methods: {
    ModalCancel(evento) {
      evento.preventDefault();
      this.itemRemover = null;
    },
    ModalOk(evento) {
      evento.preventDefault();
      this.modalRemover = false;
      if (!this.itemRemover) return;

      ContatoServico.Remover(this.itemRemover)
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Contato removido com sucesso."],
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
    Remover(item) {
      this.modalRemover = true;
      this.itemRemover = item;
    },
    ValidarForm(evt) {
      evt.preventDefault();
      if (this.viewModel.id !== this.$store.getters.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(id) {
      this.loading = true;
      ContatoServico.Obter(id)
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
      ContatoServico.ObterGrid(val, this.referenciaId)
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
    Novo() {
      this.loading = true;
      this.viewModel.referenciaId = this.referenciaId;
      ContatoServico.Novo(this.viewModel)
        .then((resposta) => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Contato cadastrado com sucesso."],
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
      ContatoServico.Editar(this.viewModel)
        .then(() => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Contato editado com sucesso."],
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
      this.viewModel.telefone = "";
      this.viewModel.nome = "";
      this.viewModel.email = null;
      this.viewModel.referenciaId = "";
    }
  }
};
</script>
