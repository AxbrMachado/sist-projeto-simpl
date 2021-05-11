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
      <h2>Notificação</h2>
    </b-modal>
  </a>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";

export default {
  components: { RotateSquare },

  data() {
    return {
      abrir: false
    };
  },
  mounted() {},

  methods: {
    AbrirModal() {
      this.abrir = true;
    }
  }
};
</script>
