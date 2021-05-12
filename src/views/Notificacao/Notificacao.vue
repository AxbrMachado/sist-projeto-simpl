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
      <div class="row">
        <div class="col-6">
          <label for="">{{ viewModel.data.toLocaleString() }}</label>
        </div>
        <div class="col-6" v-if="viewModel.url">
          <div class="form-group">
            <label for>Acessar</label>
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
        <div class="col-6" v-if="viewModel.lido">
          <button class="btn btn-danger">Marcar não lido</button>
        </div>
        <div class="col-6" v-else>
          <button class="btn btn-success">Marcar como lido</button>
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
      viewModel: {
        mensagem: "",
        lido: "",
        data: "",
        url: ""
      }
    };
  },
  mounted() {},
  watch: {
    pagina: function (val) {
      this.ObterGrid(val);
    }
  },

  methods: {
    AbrirModal() {
      this.abrir = true;
      this.ObterGrid();
    },
    ObterGrid(pagina) {
      this.loading = true;
      NotificacaoServico.ObterGrid(pagina, itensPorPagina)
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
