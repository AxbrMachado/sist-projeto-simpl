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

    <highcharts :options="graficoVendaMeta" />
    <highcharts :options="graficoProduto" />
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
      graficoVendaMeta: {
        chart: {
          zoomType: "xy"
        },
        title: {
          text: "Faturameto mês por meta"
        },
        xAxis: [
          {
            categories: [
              "Jan",
              "Fev",
              "Mar",
              "Abr",
              "Mai",
              "Jun",
              "Jul",
              "Ago",
              "Set",
              "Out",
              "Nov",
              "Dez"
            ],
            crosshair: true
          }
        ],
        yAxis: [
          {
            // Primary yAxis
            labels: {
              format: "R$"
            },
            title: {
              text: "Valor"
            }
          },
          {
            // Secondary yAxis
            title: {
              text: "Valor",
              style: {
                color: "rgba(0,0,0)"
              }
            },
            labels: {
              format: "{value} mil"
            },
            opposite: true
          }
        ],
        tooltip: {
          shared: true
        },
        legend: {
          layout: "vertical",
          align: "left",
          x: 120,
          verticalAlign: "top",
          y: 100,
          floating: true
        },
        series: [
          {
            name: "Venda",

            type: "column",
            yAxis: 1,
            data: [
              49.9,
              71.5,
              106.4,
              129.2,
              144.0,
              176.0,
              135.6,
              148.5,
              216.4,
              194.1,
              95.6,
              54.4
            ],
            tooltip: {
              valueSuffix: " mil"
            }
          },
          {
            name: "Meta",
            type: "spline",
            data: [
              7.0,
              6.9,
              9.5,
              14.5,
              18.2,
              21.5,
              25.2,
              26.5,
              23.3,
              18.3,
              13.9,
              9.6
            ],
            tooltip: {
              valueSuffix: " mil"
            }
          }
        ]
      },
      graficoProduto: {
        chart: {
          type: "pie"
        },
        title: {
          text: "Faturamento de Produtos no mês"
        },
        tooltip: {
          headerFormat: ""
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
                y: 12352.55
              },
              {
                name: "Cenoura",
                y: 19550.0
              },
              {
                name: "Beterraba",
                y: 6788.99
              },
              {
                name: "Alface",
                y: 5400.0
              },
              {
                name: "Couve",
                y: 22960.05
              },
              {
                name: "Banana",
                y: 21880.78
              },
              {
                name: "Maçã",
                y: 14741.0
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
