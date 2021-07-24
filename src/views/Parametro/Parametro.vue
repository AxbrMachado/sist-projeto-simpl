<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <header class="card-header">
            <div class="d-flex">
              <strong class="align-self-center">Parâmetros do Sistema</strong>
            </div>
          </header>
          <div v-if="loading" class="loading-container">
            <RotateSquare
              class="loading-position animated fadeIn"
              size="60px"
            ></RotateSquare>
          </div>
          <div v-else class="card-body">
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

            <b-table
              :hover="true"
              responsive
              :items="itens"
              :fields="fields"
              striped
              :per-page="itensPorPagina"
              show-empty
              empty-text="Nenhum parâmetro encontrado."
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
                    @click="Editar(data.item)"
                  >
                    <i class="fa fa-edit"></i>
                  </b-button>
                </div>
              </template>
              <template v-slot:cell(dataCadastro)="data">
                <div class="left">
                  <span>{{ FormatarData(data.item) }}</span>
                </div>
              </template>
              <template v-slot:cell(usuarioCadastro)="data">
                <div class="left">
                  <span>{{ FormatarUsuario(data.item) }}</span>
                </div>
              </template>
              <template v-slot:cell(conteudo)="data">
                <div class="left">
                  <span>{{ FormatarConteudo(data.item) }}</span>
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
</template>
<script>
import RotateSquare from "../../components/RotateSquare";
import ParametroServico from "../../servico/ParametroServico";
import ParametroTipoEnum from "../../enums/ParametroTipoEnum";

export default {
  name: "Parametro",
  components: {
    RotateSquare
  },
  data() {
    return {
      loading: false,
      itens: [],
      pagina: 1,
      total: 0,
      itensPorPagina: 20,
      filtro: { descricao: "" },
      fields: [
        { key: "descricao", label: "Descrição", sortable: true },
        { key: "observacao", label: "Observação", sortable: true },
        { key: "conteudo", label: "Valor", sortable: true },
        { key: "usuarioCadastro", label: "Usuário", sortable: true },
        { key: "dataCadastro", label: "Data", sortable: true },
        {
          key: "acoes",
          label: "Ações",
          sortable: false,
          thClass: "center, wd-120-px"
        }
      ]
    };
  },
  watch: {
    pagina: function (val) {
      this.ObterGrid(val);
    }
  },
  mounted() {
    this.ObterGrid(1);
  },
  methods: {
    Limpar() {
      this.filtro.descricao = "";
      this.ObterGrid(1);
    },
    Editar(parametro) {
      this.$router.push("/parametro/editar/" + parametro.id);
    },
    ObterGrid(pagina) {
      this.loading = false;
      ParametroServico.ObterGrid(
        this.pagina,
        this.itensPorPagina,
        this.filtro.descricao
      )
        .then((response) => {
          this.loading = false;
          this.itens = response.data.itens;
          this.total = response.data.total;
          this.pagina = response.data.pagina;
          this.itensPorPagina = response.data.itensPorPagina;
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
    FormatarData(value) {
      if (value.dataAlteracao) {
        return new Date(value.dataAlteracao).toLocaleDateString();
      } else if (value.dataCadastro) {
        return new Date(value.dataCadastro).toLocaleDateString();
      } else {
        return "";
      }
    },
    FormatarUsuario(value) {
      if (value.usuarioAlteracao) {
        return value.usuarioAlteracao;
      } else if (value.usuarioCadastro) {
        return value.usuarioCadastro;
      } else {
        return "";
      }
    },
    FormatarConteudo(value) {
      switch (value.tipoParametro) {
        case ParametroTipoEnum.String:
          return value.conteudo;
        case ParametroTipoEnum.Inteiro:
          return parseInt(value.conteudo);
        case ParametroTipoEnum.Float:
          return parseFloat(value.conteudo);
        case ParametroTipoEnum.Decimal:
          return parseFloat(value.conteudo);
        case ParametroTipoEnum.Long:
          return Number(value.conteudo);
        case ParametroTipoEnum.Boolean:
          return value.conteudo == "1";
        case ParametroTipoEnum.Date:
          return FormatarData(value.conteudo);
        default:
          return "Inválido";
      }
    }
  }
};
</script>
