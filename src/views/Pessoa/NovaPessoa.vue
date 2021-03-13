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
            <header class="card-header">
              <strong class="align-self-center">Nova Pessoa</strong>
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
                      v-model="viewModel.tipoPessoa"
                      :options="tiposPessoas"
                    ></b-form-select>
                  </div>
                </div>

                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>* Nome</label>
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
                    <label for>Nome Completo</label>
                    <input
                      v-model="viewModel.nomeCompleto"
                      class="form-control"
                      type="text"
                      placeholder="Digite o nome completo"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
                  <div class="form-group">
                    <label for>* E-mail</label>
                    <input
                      v-model="viewModel.email"
                      class="form-control"
                      type="email"
                      placeholder="Digite o e-mail"
                      required
                    />
                  </div>
                </div>
              </div>
              <div class="row">
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>Nacionalidade</label>
                    <input
                      v-model="viewModel.nacionalidade"
                      class="form-control"
                      type="text"
                      placeholder="Digite a nacionalidade"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>Data Nascimento</label>
                    <input
                      v-model="viewModel.dataNascimento"
                      class="form-control"
                      type="date"
                      placeholder="Digite a data de nascimento"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>Estado Civil</label>
                    <input
                      v-model="viewModel.estadoCivil"
                      class="form-control"
                      type="text"
                      placeholder="Digite estado civil"
                      required
                    />
                  </div>
                </div>
                <div class="col-sm-12 col-md-3 col-lg-3 col-xl-3">
                  <div class="form-group">
                    <label for>Sexo</label>
                    <b-form-select
                      v-model="viewModel.tipoSexo"
                      :options="tiposSexo"
                    ></b-form-select>
                  </div>
                </div>
              </div>
            </div>
          </div>
          <button class="btn btn-success mr-2" type="submit">Salvar</button>
          <button
            class="btn btn-secondary"
            type="reset"
            @click="$router.push('/usuario')"
          >
            Voltar
          </button>
        </div>
      </div>
    </form>
  </div>
</template>

<script>
import TipoPessoa from "../../enums/TipoPessoa";
import TipoSexo from "../../enums/TipoSexo";
import RotateSquare from "../../components/RotateSquare";

export default {
  name: "NovaPessoa",
  components: { TipoPessoa, TipoSexo, RotateSquare },
  data() {
    return {
      loading: false,
      tiposPessoas: [
        { value: TipoPessoa.Funcionario, text: "Funcionário" },
        { value: TipoPessoa.Fornecedor, text: "Fornecedor" },
        { value: TipoPessoa.Cliente, text: "Cliente" }
      ],
      tiposSexo: [
        { value: TipoSexo.Masculino, text: "Masculino" },
        { value: TipoSexo.Feminino, text: "Feminino" },
        { value: TipoSexo.Indefinido, text: "Indefinido" }
      ],
      viewModel: {
        tipoPessoa: 0,
        nome: "",
        nomeCompleto: "",
        nacionalidade: "",
        dataNascimento: "",
        estadoCivil: "",
        telefone: "",
        telefone2: "",
        tipoSexo: 3,
        email: "",
        observacao: ""
      }
    };
  },
  mounted() {},
  methods: {
    ValidarForm() {}
  }
};
</script>
