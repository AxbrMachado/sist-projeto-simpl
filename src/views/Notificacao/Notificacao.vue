<template>
  <a class="btn" @click="AbrirModal()" title="Visualizar notificações">
    <i class="fas fa-bell"></i>
    <b-modal
      v-model="abrir"
      title="Notificações"
      size="lg"
      scrollable
      hide-footer
    >
      <div v-if="loading" class="loading-container">
        <RotateSquare
          class="loading-position animated fadeIn"
          size="60px"
        ></RotateSquare>
      </div>
      <div v-else>
        <div v-if="viewModel">
          <div class="row">
            <div class="col-6">
              <label for=""
                >Data: {{ new Date(viewModel.data).toLocaleString() }}</label
              >
            </div>
            <div class="col-6" v-if="viewModel.url">
              <div class="form-group">
                <label class="mr-2" for>Link:</label>
                <a :href="viewModel.url" target="_blank">{{ viewModel.url }}</a>
              </div>
            </div>
          </div>
          <div class="row">
            <div class="col-6">
              <div class="form-group">
                <label for>Mensagem</label>
                <b-form-textarea
                  v-model="viewModel.mensagem"
                  rows="4"
                  max-rows="12"
                  readonly
                ></b-form-textarea>
              </div>
            </div>
            <div class="col-6 mt-4" v-if="viewModel.lido">
              <button class="btn btn-danger" @click="Lido()">
                Marcar não lido
              </button>
            </div>
            <div class="col-6 mt-4" v-else>
              <button class="btn btn-success" @click="Lido()">
                Marcar como lido
              </button>
            </div>
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
              empty-text="Nenhuma notificação."
            >
              <template v-slot:empty="scope">
                <h4>{{ scope.emptyText }}</h4>
              </template>
              <template v-slot:cell(lido)="data">
                <div class="center">
                  <span v-if="data.item.lido" class="badge badge-success">
                    Sim
                  </span>
                  <span v-else class="badge badge-secondary">Não</span>
                </div>
              </template>
              <template v-slot:cell(data)="data">
                <div class="center">
                  <span>
                    {{ new Date(data.item.data).toLocaleString() }}
                  </span>
                </div>
              </template>
              <template v-slot:cell(acoes)="data">
                <div class="btn-group-sm">
                  <b-button
                    variant="warning"
                    style="margin-right: 10px"
                    title="Visualizar notificação"
                    @click="Visualizar(data.item)"
                  >
                    <i class="fas fa-eye text-black"></i>
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
    </b-modal>
  </a>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import NotificacaoServico from "../../servico/NotificacaoServico";

export default {
  components: { RotateSquare },

  data() {
    return {
      loading: false,
      abrir: false,
      pagina: 1,
      itensPorPagina: 5,
      total: 0,
      itens: [],
      fields: [
        { key: "data", label: "Data", sortable: true },
        { key: "mensagem", label: "Mensagem", sortable: true },
        { key: "lido", label: "Lido", sortable: true },
        {
          key: "acoes",
          label: "Ações",
          sortable: false,
          thClass: "center, wd-120-px"
        }
      ],
      viewModel: null
    };
  },
  mounted() {},
  watch: {
    pagina: function (val) {
      this.ObterGrid(val);
    }
  },

  methods: {
    Visualizar(item) {
      this.viewModel = item;
    },
    AbrirModal() {
      this.abrir = true;
      this.viewModel = null;
      this.ObterGrid(this.pagina);
    },
    Lido() {
      this.loading = true;
      NotificacaoServico.Lido(this.viewModel.id)
        .then((response) => {
          this.viewModel = null;
          this.loading = false;
          this.ObterGrid(this.pagina);
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
    ObterGrid(pagina) {
      this.loading = true;
      NotificacaoServico.ObterGrid(pagina, this.itensPorPagina)
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
    }
  }
};
</script>
