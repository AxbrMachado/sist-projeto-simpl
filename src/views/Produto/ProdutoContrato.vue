<template>
  <div class="animated fadeIn">
    <div v-if="loading" class="loading-container">
      <RotateSquare
        class="loading-position animated fadeIn"
        size="60px"
      ></RotateSquare>
    </div>
    <div v-else>
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
                      <label>Número</label>
                      <input
                        type="text"
                        v-model="filtro.numero"
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
                  empty-text="Nenhum contrato encontrado."
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
                  <template v-slot:cell(dataInicio)="data">
                    <div class="center">
                      <span>{{ data.item.dataInicio }}</span>
                    </div>
                  </template>
                  <template v-slot:cell(dataTermino)="data">
                    <div class="center">
                      <span>{{ data.item.dataTermino }}</span>
                    </div>
                  </template>
                  <template v-slot:cell(valor)="data">
                    <div class="left">
                      <span>{{ FormataValor(data.item.valor) }}</span>
                    </div>
                  </template>
                  <template v-slot:cell(quantidade)="data">
                    <div class="left">
                      <span>{{ FormataQuantidade(data.item.quantidade) }}</span>
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
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import ContratoProdutoServico from "../../servico/ContratoProdutoServico";
import DateTime from "../../util/DateTime";

export default {
  name: "ProdutoContrato",
  components: {
    RotateSquare,
    DateTime
  },
  props: {
    produtoId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      loading: false,
      abrir: false,
      itens: [],
      pagina: 1,
      total: 0,
      itensPorPagina: 20,
      filtro: { numero: "" },
      fields: [
        { key: "contrato", label: "Contrato", sortable: true },
        { key: "numero", label: "Número", sortable: true },
        { key: "valor", label: "Valor", sortable: true },
        { key: "quantidade", label: "Quantidade", sortable: true },
        { key: "dataInicio", label: "Data Início", sortable: true },
        { key: "dataTermino", label: "Data Término", sortable: true },
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
      this.filtro.numero = "";
      this.ObterGrid(1);
    },
    Editar(contrato) {
      this.$router.push("/contrato/editar/" + contrato.contratoId);
    },
    ObterGrid(pagina) {
      this.loading = false;

      ContratoProdutoServico.ObterGrid(
        pagina,
        this.filtro.numero,
        this.produtoId
      )
        .then((response) => {
          this.loading = false;
          response.data.itens.forEach((item) => {
            item.dataInicio = new Date(item.dataInicio).toLocaleDateString();
            item.dataTermino = new Date(item.dataTermino).toLocaleDateString();
          });

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
    IsNovo() {
      return this.produtoId === this.$store.getters.emptyGuid;
    },
    formatarData(value) {
      return new Date(value).toLocaleDateString();
    },
    FormataValor(value) {
      return (value ? value : 0.0).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    },
    FormataQuantidade(valor) {
      return valor ? valor : 0;
    }
  }
};
</script>
