<template>
  <div>
    <h1>Nova Pessoa</h1>
  </div>
</template>

<script>
import TipoPessoa from "../../enums/TipoPessoa";
import TipoSexo from "../../enums/TipoSexo";

export default {
  name: "NovaPessoa",
  components: {},
  data() {
    return {
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
    };
  },
  mounted() {},
  methods: {}
};
</script>
