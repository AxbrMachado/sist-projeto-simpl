<template>
  <div>
    <b-card-group deck>
      <b-card
        bg-variant="primary"
        text-variant="white"
        header="Vendas da semana"
        class="text-center"
      >
        <b-card-text>
          <span style="font-size: 20px"> R$ 75.830,00 </span>
        </b-card-text>
      </b-card>

      <b-card
        bg-variant="info"
        text-variant="white"
        header="Vendas do mês"
        class="text-center"
      >
        <b-card-text>
          <span style="font-size: 20px"> R$ 197.125,00 </span>
        </b-card-text>
      </b-card>

      <b-card
        bg-variant="success"
        text-variant="white"
        header="Pedidos"
        class="text-center"
      >
        <b-card-text
          ><span style="font-size: 20px"> Orçamento(s): 780 </span>
          <span style="font-size: 20px"> Concluído(s): 1352 </span>
        </b-card-text>
      </b-card>

      <b-card
        bg-variant="warning"
        text-variant="white"
        header="Despesas"
        class="text-center"
      >
        <b-card-text>
          <span style="font-size: 20px"> R$ 23.452,00 </span>
        </b-card-text>
      </b-card>
    </b-card-group>
  </div>
</template>

<script>
import { Highcharts } from "highcharts-vue";
export default {
  name: "Dashboard",
  components: {
    highcharts
  },
  data() {
    return {};
  },
  mounted() {},
  methods: {}
};
</script>
