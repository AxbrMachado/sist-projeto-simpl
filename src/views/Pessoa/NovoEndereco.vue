<template>
  <div class="animated fadeIn">
    <div v-if="loading" class="loading-container">
      <RotateSquare
        class="loading-position animated fadeIn"
        size="60px"
      ></RotateSquare>
    </div>
    <form v-else @submit="ValidarForm">
      <div class="card">
        <header class="card-header" @click="abrir = !abrir">
          <div class="d-flex">
            <strong class="align-self-center">Endereço(s)</strong>
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
              <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                <div class="form-group">
                  <label for>* Tipo</label>
                  <b-form-select
                    v-model="viewModel.tipoEnderecoId"
                    :options="tipos"
                    required
                  ></b-form-select>
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-6 col-lg-3 col-xl-2">
                <div class="form-group">
                  <label>* CEP</label>
                  <input
                    v-model="viewModel.cep"
                    type="number"
                    class="form-control"
                    @change="ConsultarCep"
                  />
                </div>
              </div>
              <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                <div class="form-group">
                  <label>* Rua</label>
                  <input
                    v-model="viewModel.logradouro"
                    type="text"
                    class="form-control"
                    placeholder="Rua, Av..."
                  />
                </div>
              </div>
              <div class="col-sm-12 col-md-6 col-lg-3 col-xl-3">
                <div class="form-group">
                  <label>* Número</label>
                  <input
                    v-model="viewModel.numero"
                    type="text"
                    class="form-control"
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-4 col-lg-4 col-xl-2">
                <div class="form-group">
                  <label>* Bairro</label>
                  <input
                    v-model="viewModel.bairro"
                    type="text"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="col-sm-12 col-md-6 col-lg-4 col-xl-3">
                <div class="form-group">
                  <label>* Cidade</label>
                  <input
                    v-model="viewModel.cidade"
                    type="text"
                    class="form-control"
                  />
                </div>
              </div>
              <div class="col-sm-12 col-md-6 col-lg-5 col-xl-5">
                <div class="form-group">
                  <label>Complemento</label>
                  <input
                    v-model="viewModel.complemento"
                    type="text"
                    class="form-control"
                    placeholder="apartamento, casa, fundos..."
                  />
                </div>
              </div>
            </div>
            <div class="row">
              <div class="col-sm-12 col-md-6 col-lg-3 col-xl-2">
                <div class="form-group">
                  <label for>* UF</label>
                  <select v-model="viewModel.uf" class="form-control" required>
                    <option disabled selected value>Selecione...</option>
                    <option value="AC">AC</option>
                    <option value="AL">AL</option>
                    <option value="AP">AP</option>
                    <option value="AM">AM</option>
                    <option value="BA">BA</option>
                    <option value="CE">CE</option>
                    <option value="DF">DF</option>
                    <option value="ES">ES</option>
                    <option value="GO">GO</option>
                    <option value="MA">MA</option>
                    <option value="MT">MT</option>
                    <option value="MS">MS</option>
                    <option value="MG">MG</option>
                    <option value="PA">PA</option>
                    <option value="PB">PB</option>
                    <option value="PR">PR</option>
                    <option value="PE">PE</option>
                    <option value="PI">PI</option>
                    <option value="RJ">RJ</option>
                    <option value="RN">RN</option>
                    <option value="RS">RS</option>
                    <option value="RO">RO</option>
                    <option value="RR">RR</option>
                    <option value="SC">SC</option>
                    <option value="SP">SP</option>
                    <option value="SE">SE</option>
                    <option value="TO">TO</option>
                  </select>
                </div>
              </div>
              <div class="col-sm-12 col-md-6 col-lg-3 col-xl-2">
                <div class="form-group">
                  <label for>* País</label>
                  <input
                    type="text"
                    v-model="viewModel.pais"
                    class="form-control"
                    required
                  />
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
                  @click="abrir = !abrir"
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
                  empty-text="Nenhum endereço encontrado."
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
import DateTime from "../../util/DateTime";

export default {
  components: { RotateSquare },
  props: {
    pessoaId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalRemover: false,
      itemRemover: null,
      tipos: [],
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 5,
      itens: [],
      abrir: false,
      fields: [
        { key: "tipo", label: "Tipo", sortable: true },
        { key: "cep", label: "CEP", sortable: true },
        { key: "logradouro", label: "Logradouro", sortable: true },
        { key: "bairro", label: "Bairro", sortable: true },
        { key: "cidade", label: "Cidade", sortable: true },

        {
          key: "acoes",
          label: "Ações",
          sortable: false,
          thClass: "center, wd-120-px"
        }
      ],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        tipoEnderecoId: "",
        cep: "",
        logradouro: "",
        numero: "",
        pessoaId: "",
        bairro: "",
        cidade: "",
        uf: "",
        pais: "Brasil",
        complemento: "",
        referencia: ""
      }
    };
  },
  mounted() {
    this.ObeterTipoEndereco();
    this.ObterGrid(1);
  },
  watch: {
    pagina: function (val) {
      this.ObterGrid(val);
    }
  },
  methods: {
    ConsultarCep() {
      if (!this.viewModel.cep) return;
      this.$http({
        url: "endereco/obter-cep/" + this.viewModel.cep,
        method: "GET"
      })
        .then((resposta) => {
          this.viewModel.bairro = resposta.data.bairro;
          this.viewModel.uf = resposta.data.uf;
          this.viewModel.cidade = resposta.data.localidade;
          this.viewModel.logradouro = resposta.data.logradouro;
          this.viewModel.bairro = resposta.data.bairro;
        })
        .catch(() => {});
    },
    ObeterTipoEndereco() {
      this.loading = true;
      this.$http({
        url: "tipoendereco/obter-select",
        method: "GET"
      })
        .then((resposta) => {
          this.loading = false;
          this.tipos = resposta.data;
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
    IsNovo() {
      return this.pessoaId === this.$store.getters.emptyGuid;
    },
    ValidarForm(evt) {
      evt.preventDefault();
      if (this.viewModel.id !== this.$store.getters.emptyGuid) this.Editar();
      else this.Novo();
    },
    Obter(id) {
      this.loading = true;
      this.$http({
        url: "endereco/obter/" + id,
        method: "GET"
      })
        .then((resposta) => {
          this.loading = false;
          resposta.data.validade = DateTime.formatar(resposta.data.validade);
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
      this.$http({
        url:
          "endereco/obter-grid/" +
          val +
          "/" +
          this.itensPorPagina +
          "/" +
          this.pessoaId,
        method: "GET"
      })
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

      this.$http({
        url: "endereco/remover/" + this.itemRemover,
        method: "DELETE"
      })
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Endereço removido com sucesso."],
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
      this.viewModel.pessoaId = this.pessoaId;
      this.$http({
        url: "endereco/novo",
        data: this.viewModel,
        method: "POST"
      })
        .then((resposta) => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Endereço cadastrado com sucesso."],
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
      this.viewModel.pessoaId = this.pessoaId;

      this.$http({
        url: "endereco/editar",
        data: this.viewModel,
        method: "PUT"
      })
        .then(() => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Endereço editado com sucesso."],
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
      this.viewModel.tipoEnderecoId = "";
      this.viewModel.cep = "";
      this.viewModel.logradouro = "";
      this.viewModel.numero = "";
      this.viewModel.pessoaId = "";
      this.viewModel.bairro = "";
      this.viewModel.cidade = "";
      this.viewModel.uf = "";
      this.viewModel.pais = "Brasil";
      this.viewModel.complemento = "";
      this.viewModel.referencia = "";
    }
  }
};
</script>
