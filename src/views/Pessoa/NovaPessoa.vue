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
              <strong class="align-self-center">Pessoa</strong>
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
                    <b-form-select
                      v-model="viewModelPessoa.tipoPessoa"
                      :options="tiposPessoas"
                    ></b-form-select>
                  </div>
                </div>

                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>{{
                      isPessoaJuridica() ? "* Fantasia" : "* Nome"
                    }}</label>
                    <input
                      v-model="viewModelPessoa.nome"
                      class="form-control"
                      type="text"
                      placeholder="Digite o nome"
                      required
                    />
                  </div>
                </div>

                <div
                  class="col-sm-12 col-md-4 col-lg-4 col-xl-4"
                  v-if="isPessoaJuridica()"
                >
                  <div class="form-group">
                    <label for>* Razão Social</label>
                    <input
                      v-model="viewModelPessoa.nomeCompleto"
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
                      v-model="viewModelPessoa.email"
                      class="form-control"
                      type="email"
                      placeholder="Digite o e-mail"
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>Nacionalidade</label>
                    <input
                      v-model="viewModelPessoa.nacionalidade"
                      class="form-control"
                      type="text"
                      placeholder="Digite a nacionalidade"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>{{
                      isFuncionario() ? "Data Nascimento" : "Data Fundação"
                    }}</label>
                    <input
                      v-model="viewModelPessoa.dataNascimento"
                      class="form-control"
                      type="date"
                      placeholder="Digite a data de nascimento"
                      required
                    />
                  </div>
                </div>
                <div
                  class="col-sm-12 col-md-3 col-lg-3 col-xl-3"
                  v-if="isFuncionario()"
                >
                  <div class="form-group">
                    <label for>Estado Civil</label>
                    <b-form-select
                      v-model="viewModelPessoa.estadoCivil"
                      :options="tiposEstadoCivil"
                    ></b-form-select>
                  </div>
                </div>
                <div
                  class="col-sm-12 col-md-3 col-lg-3 col-xl-3"
                  v-if="isFuncionario()"
                >
                  <div class="form-group">
                    <label for>Sexo</label>
                    <b-form-select
                      v-model="viewModelPessoa.tipoSexo"
                      :options="tiposSexo"
                    ></b-form-select>
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>Telefone</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="viewModelPessoa.telefone"
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>Telefone</label>
                    <input
                      type="text"
                      class="form-control"
                      v-model="viewModelPessoa.telefone2"
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-6 col-lg-6 col-xl-6">
                  <div class="form-group">
                    <label for>Observação</label>
                    <b-form-textarea
                      v-model="viewModelPessoa.observacao"
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
                  @click="$router.push('/pessoa')"
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
      <NovoDocumento> :pessoaId="viewModelPessoa.id" </NovoDocumento>
    </div>
  </div>
</template>

<script>
import TipoPessoaEnum from "../../enums/TipoPessoaEnum";
import TipoSexoEnum from "../../enums/TipoSexoEnum";
import RotateSquare from "../../components/RotateSquare";
import TipoEstadoCivilEnum from "../../enums/TipoEstadoCivilEnum";
import NovoDocumento from "./NovoDocumento";

export default {
  name: "NovaPessoa",
  components: { TipoPessoaEnum, TipoSexoEnum, RotateSquare, NovoDocumento },
  data() {
    return {
      loadingPessoa: false,
      tiposEstadoCivil: [
        { value: TipoEstadoCivilEnum.Solteiro, text: "Solteiro" },
        { value: TipoEstadoCivilEnum.Casado, text: "Casado" },
        { value: TipoEstadoCivilEnum.Viuvo, text: "Viúvo" },
        { value: TipoEstadoCivilEnum.Divorciado, text: "Divorciado" }
      ],
      tiposPessoas: [
        { value: TipoPessoaEnum.Funcionario, text: "Funcionário" },
        { value: TipoPessoaEnum.Fornecedor, text: "Fornecedor" },
        { value: TipoPessoaEnum.Cliente, text: "Cliente" },
        { value: TipoPessoaEnum.Instituicao, text: "Instituição" }
      ],
      tiposSexo: [
        { value: TipoSexoEnum.Masculino, text: "Masculino" },
        { value: TipoSexoEnum.Feminino, text: "Feminino" },
        { value: TipoSexoEnum.Indefinido, text: "Indefinido" }
      ],
      viewModelPessoa: {
        id: this.$store.getters.emptyGuid,
        tipoPessoa: 0,
        nome: "",
        nomeCompleto: "",
        nacionalidade: "",
        dataNascimento: "",
        estadoCivil: null,
        telefone: "",
        telefone2: "",
        tipoSexo: 3,
        email: "",
        observacao: ""
      }
    };
  },
  created() {
    let id = this.$route.params.id;
    if (id) this.Obter(id);
  },
  methods: {
    isPessoaJuridica() {
      return (
        this.viewModelPessoa.tipoPessoa == TipoPessoaEnum.Fornecedor ||
        this.viewModelPessoa.tipoPessoa == TipoPessoaEnum.Cliente ||
        this.viewModelPessoa.tipoPessoa == TipoPessoaEnum.Instituicao
      );
    },
    isFuncionario() {
      return this.viewModelPessoa.tipoPessoa == TipoPessoaEnum.Funcionario;
    },
    ValidarForm(evt) {
      evt.preventDefault();
      if (this.viewModelPessoa.id !== this.$store.getters.emptyGuid)
        this.Editar();
      else this.Novo();
    },
    ValidarFormDocumento(evt) {
      evt.preventDefault();
    },
    Obter(id) {
      this.loadingPessoa = true;
      this.$http({
        url: "pessoa/obter/" + id,
        method: "GET"
      })
        .then((resposta) => {
          this.loadingPessoa = false;
          this.viewModelPessoa = resposta.data;
        })
        .catch((erro) => {
          this.loadingPessoa = false;
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 10000
          });
        });
    },
    Novo() {
      this.loadingPessoa = true;
      this.$http({
        url: "pessoa/novo",
        data: this.viewModelPessoa,
        method: "POST"
      })
        .then((resposta) => {
          this.viewModelPessoa.id = resposta.data.id;
          this.loadingPessoa = false;
          this.$notify({
            data: ["Pessoa cadastrado com sucesso."],
            type: "success",
            duration: 10000
          });
        })
        .catch((erro) => {
          this.loadingPessoa = false;
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 10000
          });
        });
    },
    Editar() {
      this.loadingPessoa = true;
      this.$http({
        url: "pessoa/editar",
        data: this.viewModelPessoa,
        method: "PUT"
      })
        .then(() => {
          this.loadingPessoa = false;
          this.$router.push("/pessoa");
          this.$notify({
            data: ["Pessoa editado com sucesso."],
            type: "success",
            duration: 10000
          });
        })
        .catch((erro) => {
          this.loadingPessoa = false;
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 10000
          });
        });
    },
    IsEdicao() {
      return this.viewModelPessoa.id !== this.$store.getters.emptyGuid;
    }
  }
};
</script>
