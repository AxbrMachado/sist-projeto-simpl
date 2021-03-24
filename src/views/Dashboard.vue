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

    <highcharts :options="chartOptions" />
  </div>
</template>

<script>
import { Chart } from "highcharts-vue";

export default {
  name: "Dashboard",
  components: {
    highcharts: Chart
  },
  data() {
    return {
      chartOptions: {
        chart: {
          type: "pie"
        },
        title: {
          text: "Vendas de Produtos no mês"
        },
        tooltip: {
          headerFormat: "",
        },
        series: [
          {
            minPointSize: 10,
            innerSize: "30%",
            zMin: 0,
            name: "R$",
            data: [
              {
                name: "Batata",
                y: 12352.55,
              },
              {
                name: "Cenoura",
                y: 19550.00,
              },
              {
                name: "Beterraba",
                y: 6788.99,
              },
              {
                name: "Alface",
                y: 5400.00,
              },
              {
                name: "Couve",
                y: 22960.05,
              },
              {
                name: "Banana",
                y: 21880.78,
              },
              {
                name: "Maçã",
                y: 14741.00,
              }
            ]
          }
        ]
      }
    };
  },
  mounted() {},
  methods: {}
};
</script>
