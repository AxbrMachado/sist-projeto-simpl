<template>
  <div class="animated fadeIn">
    <div v-if="loadingPessoa" class="loadingPessoa-container">
      <RotateSquare
        class="loadingPessoa-position animated fadeIn"
        size="60px"
      ></RotateSquare>
    </div>
    <form v-else @submit="ValidarForm">
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div class="card">
            <header class="card-header">
              <strong class="align-self-center"
                >{{
                  viewModel.id == this.$store.getters.emptyGuid
                    ? "Novo Fornecedor"
                    : "Editar Fornecedor"
                }}
              </strong>
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
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>* Tipo</label>
                    <!-- TO-DO rever este ponto aqui..  -->
                    <b-form-select
                      v-model="viewModel.tipoPessoa"
                      :options="tiposPessoas"
                    ></b-form-select>
                  </div>
                </div>

                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>* Tipo Fornecedor</label>
                    <b-form-select
                      v-model="viewModel.tipoFornecedor"
                      :options="tiposFornecedor"
                    ></b-form-select>
                  </div>
                </div>

                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>* Fantasia</label>
                    <input
                      v-model="viewModel.nome"
                      class="form-control"
                      type="text"
                      placeholder="Digite o nome"
                      required
                    />
                  </div>
                </div>

                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>* Razão Social</label>
                    <input
                      v-model="viewModel.nomeCompleto"
                      class="form-control"
                      type="text"
                      placeholder="Digite a razão social"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>E-mail</label>
                    <input
                      v-model="viewModel.email"
                      class="form-control"
                      type="email"
                      placeholder="Digite o e-mail"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>Código</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="viewModel.codigo"
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
                  @click="$router.push('/fornecedor')"
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
      <FornecedorContrato :pessoaId="viewModel.id"> </FornecedorContrato>
      <FornecedorProdutoSelect :fornecedorId="viewModel.fornecedorId" />
      <!-- <FornecedorProduto :fornecedorId="viewModel.fornecedorId" /> -->
      <Contato :referenciaId="viewModel.id"> </Contato>
    </div>
  </div>
</template>

<script>
import TipoPessoaEnum from "../../enums/TipoPessoaEnum";
import TipoFornecedorEnum from "../../enums/TipoFornecedorEnum";
import RotateSquare from "../../components/RotateSquare";
import FornecedorContrato from "./FornecedorContrato";
import FornecedorProduto from "./FornecedorProduto";
import FornecedorProdutoSelect from "./FornecedorProdutoSelect";
import DateTime from "../../util/DateTime";
import Contato from "../../components/Contato";

export default {
  name: "NovoFornecedor",
  components: {
    TipoPessoaEnum,
    TipoFornecedorEnum,
    RotateSquare,
    FornecedorContrato,
    FornecedorProduto,
    FornecedorProdutoSelect,
    DateTime,
    Contato
  },
  data() {
    return {
      loadingPessoa: false,
      tiposPessoas: [{ value: TipoPessoaEnum.Fornecedor, text: "Fornecedor" }],
      tiposFornecedor: [
        { value: TipoFornecedorEnum.Cooperado, text: "Cooperado" },
        { value: TipoFornecedorEnum.Avulso, text: "Avulso" }
      ],
      viewModel: {
        id: this.$store.getters.emptyGuid,
        fornecedorId: "",
        tipoPessoa: 0,
        nome: "",
        nomeCompleto: "",
        dataNascimento: "",
        estadoCivil: null,
        tipoSexo: 3,
        email: "",
        observacao: "",
        codigo: ""
      }
    };
  },
  created() {
    let id = this.$route.params.id;
    if (id) this.Obter(id);
  },
  methods: {
    ValidarForm(evt) {
      evt.preventDefault();
      this.Editar();
    },
    // ValidarFormDocumento(evt) {
    //   evt.preventDefault();
    // },
    Obter(id) {
      this.loadingPessoa = true;
      this.$http({
        url: "pessoa/obter/" + id,
        method: "GET"
      })
        .then((resposta) => {
          this.loadingPessoa = false;
          resposta.data.dataNascimento = DateTime.formatar(
            resposta.data.dataNascimento
          );
          this.viewModel = resposta.data;
        })
        .catch((erro) => {
          this.loadingPessoa = false;
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },

    Editar() {
      this.loadingPessoa = true;
      this.$http({
        url: "pessoa/editar",
        data: this.viewModel,
        method: "PUT"
      })
        .then(() => {
          this.loadingPessoa = false;
          this.$router.push("/fornecedor");
          this.$notify({
            data: ["Pessoa editado com sucesso."],
            type: "success",
            duration: 5000
          });
        })
        .catch((erro) => {
          this.loadingPessoa = false;
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    IsEdicao() {
      return this.viewModel.id !== this.$store.getters.emptyGuid;
    }
  }
};
</script>
