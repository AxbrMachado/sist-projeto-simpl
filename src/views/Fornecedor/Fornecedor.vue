<template>
  <div class="animated fadeIn">
    <div class="row">
      <div class="col-sm-12">
        <div class="card">
          <header class="card-header">
            <div class="d-flex">
              <strong class="align-self-center">Fornecedores</strong>
              <a
                v-permission="'Fornececdor.Adicionar'"
                class="ml-auto btn btn-primary"
                href="/#/fornecedor/novo"
                title="Adicionar novo fornecedor"
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
                  <label>Nome</label>
                  <input
                    type="text"
                    v-model="filtro.nome"
                    class="form-control"
                  />
                </div>
              </div>
              <div
                class="col-sm-6 col-md-2 col-lg-2 col-xl-2"
                title="Presente em pedido."
              >
                <label for>Presente em pedido</label>
                <b-form-checkbox
                  v-model="filtro.presenteEmPedido"
                  name="check-button"
                  switch
                >
                </b-form-checkbox>
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
              empty-text="Nenhum fornecedor encontrado."
            >
              <template v-slot:empty="scope">
                <h4>{{ scope.emptyText }}</h4>
              </template>
              <template v-slot:cell(ativo)="data">
                <div class="center">
                  <span v-if="data.item.ativo" class="badge badge-success">
                    Sim
                  </span>
                  <span v-else class="badge badge-secondary">Não</span>
                </div>
              </template>
              <template v-slot:cell(tipoFornecedor)="data">
                <div class="center">
                  <span>{{
                    ObterNomeTipoFornecedor(data.item.tipoFornecedor)
                  }}</span>
                </div>
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
                  <ModalArquivoGrid :referenciaId="data.item.id" />
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
import TipoFornecedorEnum from "../../enums/TipoFornecedorEnum";
import ModalArquivoGrid from "../../components/ModalArquivoGrid";
import FornecedorServico from "../../servico/FornecedorServico";

export default {
  name: "Fornecedor",
  components: {
    RotateSquare,
    ModalArquivoGrid
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
      filtro: {
        nome: "",
        presenteEmPedido: false
      },
      fields: [
        { key: "nome", label: "Nome", sortable: true },
        { key: "tipoFornecedor", label: "Tipo", sortable: true },
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
      this.filtro.nome = "";
      this.filtro.presenteEmPedido = false;
    },
    Editar(fornecedor) {
      this.$router.push("/fornecedor/editar/" + fornecedor.pessoaId);
    },
    ModalCancel(evento) {
      evento.preventDefault();
      this.itemRemover = null;
    },
    ModalOk(evento) {
      evento.preventDefault();
      this.modalRemover = false;
      if (!this.itemRemover) return;

      FornecedorServico.Remover(this.itemRemover.id)
        .then(() => {
          this.ObterGrid(1);
          this.$notify({
            data: ["Fornecedor removida com sucesso."],
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

      FornecedorServico.ObterGrid(
        pagina,
        this.filtro.nome,
        this.filtro.presenteEmPedido
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
    },
    ObterNomeTipoFornecedor(item) {
      switch (item) {
        case TipoFornecedorEnum.Cooperado:
          return "Cooperado";
        case TipoFornecedorEnum.Avulso:
          return "Avulso";
        default:
          return "Inválido";
      }
    }
  }
};
</script>
