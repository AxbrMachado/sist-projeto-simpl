<template>
  <div class="animated fadeIn">
    <div v-if="loading" class="loading-container">
      <RotateSquare
        class="loading-position animated fadeIn"
        size="60px"
      ></RotateSquare>
    </div>
    <form v-else @submit="ValidarFormDocumento">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div class="card">
            <header class="card-header" @click="abrir = !abrir">
              <div class="d-flex">
                <strong class="align-self-center">Documento(s)</strong>
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
                      <label for="">* Número</label>
                      <input
                        class="form-control"
                        type="text"
                        v-model="viewModel.numero"
                        required
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                    <div class="form-group">
                      <label for="">Validade</label>
                      <input
                        class="form-control"
                        type="date"
                        v-model="viewModel.validade"
                      />
                    </div>
                  </div>
                  <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                    <div class="form-group">
                      <label for>* Tipo</label>
                      <b-form-select
                        v-model="viewModel.tipoDocumentoId"
                        :options="tipos"
                        required
                      ></b-form-select>
                    </div>
                  </div>
                </div>
                <div v-if="IsNovo()" class="row">
                  <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                    <div class="form-group">
                      <label for>Arquivo </label> <small>Limite 5MB</small>
                      <b-form-file
                        v-model="arquivo"
                        :state="Boolean(arquivo)"
                        placeholder="Escolha o arquivo..."
                        accept=".jpg, .png, .jpeg, .pdf, .doc, .docx, .xls, .xlsx"
                        browse-text="Procurar"
                      ></b-form-file>
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
                      @click="$router.push('/pessoa')"
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
                      empty-text="Nenhum documento encontrado."
                    >
                      <template v-slot:empty="scope">
                        <h4>{{ scope.emptyText }}</h4>
                      </template>

                      <template v-slot:cell(acoes)="data">
                        <div class="btn-group-sm">
                          <a
                            class="btn btn-secondary mr-2"
                            :href="
                              $store.getters.baseURL +
                              'arquivo/obter/' +
                              data.item.arquivoId
                            "
                            title="Baixar"
                            target="_blank"
                          >
                            <i class="fas fa-download text-black"></i>
                          </a>
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
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import DateTime from "../../util/DateTime";
import DocumentoServico from "../../servico/DocumentoServico";
import TipoDocumentoServico from "../../views/TipoDocumento/servico/TipoDocumentoServico";
import ArquivoServico from "../../servico/ArquivoServico";

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
      tipos: [],
      loading: false,
      loadingArquivo: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 5,
      itens: [],
      abrir: false,
      arquivo: null,
      fields: [
        { key: "numero", label: "Número", sortable: true },
        { key: "tipoDocumento", label: "Tipo", sortable: true },
        {
          key: "acoes",
          label: "Ações",
          sortable: false,
          thClass: "center, wd-120-px"
        }
      ],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        tipoDocumentoId: "",
        numero: "",
        observacao: "",
        validade: "",
        pessoaId: "",
        arquivoId: ""
      }
    };
  },
  mounted() {
    this.ObterTipoDocumento();
    this.ObterGrid(1);
  },
  watch: {
    pagina: function (val) {
      this.ObterGrid(val);
    }
  },
  methods: {
    NovoArquivo() {
      console.log("Arquivo: ", this.arquivo);

      if (!this.arquivo) this.Novo();
      else if (this.arquivo.size > 1024 * 1024 * 5) {
        this.$notify({
          data: [
            "O arquivo selecionado é maior que 5MB e não pode ser enviado."
          ],
          type: "warn",
          duration: 10000
        });
        return;
      }
      this.loading = true;
      ArquivoServico.Novo(this.arquivo)
        .then((resposta) => {
          this.loading = false;
          this.viewModel.arquivoId = resposta.data;
          this.Novo();
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
    ObterTipoDocumento() {
      this.loading = true;
      TipoDocumentoServico.ObterSelect()
        .then((resposta) => {
          this.loading = false;
          this.tipos = resposta.data;
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
    IsNovo() {
      return this.viewModel.id === this.$store.getters.emptyGuid;
    },
    ValidarFormDocumento(evt) {
      evt.preventDefault();
      if (this.viewModel.id !== this.$store.getters.emptyGuid) this.Editar();
      else this.NovoArquivo();
    },
    Obter(id) {
      this.loading = true;
      DocumentoServico.Obter(id)
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
            duration: 10000
          });
        });
    },
    ObterGrid(val) {
      this.loading = true;
      DocumentoServico.ObterGrid(val, this.itensPorPagina, this.pessoaId)
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
    Remover(id) {
      DocumentoServico.Remover(id)
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Documento removido com sucesso."],
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
    Novo() {
      this.loading = true;
      this.viewModel.pessoaId = this.pessoaId;
      DocumentoServico.Novo(this.viewModel)
        .then((resposta) => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Documento cadastrado com sucesso."],
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
      this.viewModel.pessoaId = this.pessoaId;
      DocumentoServico.Editar(this.viewModel)
        .then(() => {
          this.loading = false;
          this.Limpar();
          this.ObterGrid(1);
          this.$notify({
            data: ["Documento editado com sucesso."],
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
      this.viewModel.tipoDocumentoId = "";
      this.viewModel.numero = "";
      this.viewModel.observacao = "";
      this.viewModel.validade = "";
      this.viewModel.pessoaId = "";
    }
  }
};
</script>
