<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <header class="card-header">
            <div class="d-flex">
              <strong class="align-self-center"
                >Conversão unidade medida</strong
              >
              <a
                v-permission="'UnidadeMedida.Adicionar'"
                class="ml-auto btn btn-primary"
                href="/#/unidade-medida/novo"
                title="Adicionar nova conversão unidade medida"
              >
                Adicionar
              </a>
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
              empty-text="Nenhuma conversão unidade medida encontrada."
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
                  <b-button
                    variant="danger"
                    title="Remover"
                    @click="Remover(data.item)"
                    v-permission="'UnidadeMedida.Remover'"
                  >
                    <i class="fas fa-trash-alt"></i>
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
            <b-modal
              v-model="modalRemover"
              title="Confirmar exclusão"
              class="modal-danger"
              ok-variant="danger"
              @ok="ModalOk"
              @hidden="ModalCancel"
            >
              Você confirma a exclusão desse registro?
            </b-modal>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>
<script>
import RotateSquare from "../../components/RotateSquare";
import UnidadeMedidaServico from "../../servico/UnidadeMedidaServico";

export default {
  name: "UnidadeMedida",
  components: {
    RotateSquare
  },
  data() {
    return {
      modalRemover: false,
      itemRemover: null,
      loading: false,
      itens: [],
      pagina: 1,
      total: 0,
      itensPorPagina: 20,
      filtro: { descricao: "" },
      fields: [
        { key: "descricao", label: "Nome", sortable: true },
        {
          key: "tipoUnidadeMedida",
          label: "Unidade",
          sortable: true
        },
        { key: "valor", label: "Quantidade", sortable: true },
        {
          key: "tipoUnidadeMedidaBase",
          label: "Unidade",
          sortable: true
        },
        { key: "observacao", label: "Observação", sortable: true },

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
    Editar(unidadeMedida) {
      this.$router.push("/unidade-medida/editar/" + unidadeMedida.id);
    },
    ModalCancel(evento) {
      evento.preventDefault();
      this.itemRemover = null;
    },
    ModalOk(evento) {
      evento.preventDefault();
      this.modalRemover = false;
      if (!this.itemRemover) return;

      UnidadeMedidaServico.Remover(this.itemRemover.id)
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Conversão unidade medida removida com sucesso."],
            type: "success",
            duration: 5000
          });
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 5000
          });
        });
    },
    Remover(item) {
      this.modalRemover = true;
      this.itemRemover = item;
    },
    ObterGrid(pagina) {
      this.loading = false;

      UnidadeMedidaServico.ObterGrid(
        pagina,
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
    }
  }
};
</script>
