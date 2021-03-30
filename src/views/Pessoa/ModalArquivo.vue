<template>
  <b-button
    :disabled="TemArquivo() ? null : 'disabled'"
    class="btn btn-secondary mr-2"
    @click="AbrirModal()"
    :title="TemArquivo() ? 'Visualizar arquivos' : 'Nenhum arquivo'"
  >
    <i class="fas fa-download text-black"></i>
    <b-modal
      v-model="abrir"
      title="Arquivo(s)"
      size="sm"
      scrollable
      hide-footer
    >
      <div class="row" v-for="(item, index) in arquivos" :key="index">
        <div class="col-6">
          <a
            :href="$store.getters.baseURL + 'arquivo/obter/' + item"
            target="_blank"
            >Arquivo {{ index + 1 }}</a
          >
        </div>
      </div>
    </b-modal>
  </b-button>
</template>

<script>
import DocumentoServico from "../../servico/DocumentoServico";

export default {
  components: {},
  props: {
    arquivos: {
      type: Array,
      default: []
    }
  },
  data() {
    return {
      abrir: false
    };
  },
  mounted() {
    console.log(this.arquivos);
  },
  methods: {
    TemArquivo() {
      if (!this.arquivos || this.arquivos.length <= 0) return false;

      return true;
    },
    AbrirModal() {
      this.abrir = true;
    },
    Remover(id) {
      DocumentoServico.Remover(id)
        .then(() => {
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
    }
  }
};
</script>
