<template>
  <div class="animated fadeIn">
    <div v-if="loading" class="loading-container">
      <RotateSquare
        class="loading-position animated fadeIn"
        size="60px"
      ></RotateSquare>
    </div>
    <form v-else>
      <div class="row">
        <div class="col-sm-12 col-md-12 col-lg-12 col-xl-12">
          <div class="card">
            <header class="card-header" @click="abrir = !abrir">
              <div class="d-flex">
                <strong class="align-self-center">Cliente(s)</strong>
                <small class="ml-2 mt-1">Clique para abrir/esconder</small>

                <i
                  :class="
                    abrir
                      ? 'ml-auto mt-1 fas fa-chevron-up'
                      : 'ml-auto mt-1 fas fa-chevron-down'
                  "
                ></i>
              </div>
            </header>
            <div :class="abrir ? 'collapse-show' : 'collapse'">
              <div class="card-body">
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
                    title="Apenas clientes vinculados ao contrato."
                  >
                    <label for>Vinculado ao contrato</label>
                    <b-form-checkbox
                      v-model="filtro.vinculadoAoContrato"
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
                      empty-text="Nenhum cliente encontrado."
                    >
                      <template v-slot:empty="scope">
                        <h4>{{ scope.emptyText }}</h4>
                      </template>

                      <template v-slot:cell(acoes)="data">
                        <div class="btn-group-sm">
                          <b-button
                            v-if="isClienteVinculado(data.item)"
                            variant="danger"
                            style="margin-right: 10px"
                            title="Cliente não vinculado ao contrato"
                            @click="AdicionarClienteContrato(data.item)"
                          >
                            <i class="fas fa-times"></i>
                          </b-button>
                          <b-button
                            v-if="!isClienteVinculado(data.item)"
                            variant="success"
                            style="margin-right: 10px"
                            title="Cliente vinculado ao contrato"
                            @click="RemoverClienteContrato(data.item)"
                          >
                            <i class="fas fa-check"></i>
                          </b-button>
                          <b-button
                            v-if="!isClienteVinculado(data.item)"
                            variant="info"
                            style="margin-right: 10px"
                            title="Editar cliente do contrato"
                            @click="Edicao(data.item)"
                          >
                            <i class="fa fa-edit"></i>
                          </b-button>
                        </div>
                      </template>
                      <template v-slot:cell(valor)="data">
                        <div class="left">
                          <span>{{ FormataValor(data.item.valor) }}</span>
                        </div>
                      </template>
                      <template v-slot:cell(tipoPessoa)="data">
                        <div class="center">
                          <span>{{
                            ObterTipoPessoa(data.item.tipoPessoa)
                          }}</span>
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
            </div>
          </div>
        </div>
      </div>
    </form>
    <b-modal
      v-model="modalEditarInfoCliente"
      title="Editar rota do cliente junto a este contrato"
      class="modal-danger"
      ok-variant="info"
      @ok="EditarCliente"
      @hidden="CancelEdicao"
    >
      <div class="row">
        <div class="col-sm-12 col-md-4 col-lg-4 col-xl-4">
          <div class="form-group">
            <label for>* Rota</label>
            <input
              v-model="valorRota"
              class="form-control"
              type="text"
              placeholder="Digite a rota"
              required
            />
          </div>
        </div>
      </div>
    </b-modal>
  </div>
</template>

<script>
import RotateSquare from "../../components/RotateSquare";
import ContratoClienteServico from "../../servico/ContratoClienteServico";
import TipoPessoaContratoEnum from "../../enums/TipoPessoaContratoEnum";
import TipoPessoaEnum from "../../enums/TipoPessoaEnum";

export default {
  name: "ContratoClienteSelect",
  components: {
    RotateSquare,
    TipoPessoaContratoEnum,
    TipoPessoaEnum
  },
  props: {
    contratoId: {
      type: String,
      default: ""
    }
  },
  data() {
    return {
      modalEditarInfoCliente: false,
      valorRota: 0,
      pessoaId: this.$store.getters.emptyGuid,
      contratoClienteId: this.$store.getters.emptyGuid,
      loading: false,
      pagina: 1,
      total: 0,
      itensPorPagina: 15,
      itens: [],
      abrir: false,
      filtro: {
        nome: "",
        vinculadoAoContrato: false
      },
      fields: [
        { key: "pessoa", label: "Cliente", sortable: true },
        { key: "tipoPessoa", label: "Tipo Pessoa", sortable: true },
        { key: "rota", label: "Rota", sortable: true },
        {
          key: "acoes",
          label: "Ações",
          sortable: false,
          thClass: "center, wd-120-px"
        }
      ]
    };
  },
  mounted() {
    this.ObterGrid(1);
  },
  watch: {
    pagina: function (pagina) {
      this.ObterGrid(pagina);
    }
  },
  created() {},
  methods: {
    IsNovo() {
      return this.contratoId === this.$store.getters.emptyGuid;
    },
    ValidarForm(evt) {},
    ObterGrid(pagina) {
      this.loading = false;
      ContratoClienteServico.ObterGridContrato(
        pagina,
        this.itensPorPagina,
        this.contratoId,
        this.filtro.vinculadoAoContrato,
        this.filtro.nome,
        TipoPessoaContratoEnum.Cliente
      )
        .then((resposta) => {
          this.loading = false;
          this.itens = resposta.data.itens;
          this.total = resposta.data.total;
          this.itensPorPagina = resposta.data.itensPorPagina;
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
    RemoverClienteContrato(item) {
      ContratoClienteServico.Remover(item.id)
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Cliente removido com sucesso."],
            type: "success",
            duration: 1000
          });
        })
        .catch((erro) => {
          this.$notify({
            data: erro.response.data.erros,
            type: "warn",
            duration: 1000
          });
        });
    },
    AdicionarClienteContrato(item) {
      ContratoClienteServico.Adicionar(
        this.contratoId,
        item.pessoaId,
        TipoPessoaContratoEnum.Cliente
      )
        .then(() => {
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Cliente vinculado com sucesso."],
            type: "success",
            duration: 1000
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
    Limpar() {
      this.filtro.nome = "";
      this.filtro.vinculadoAoContrato = false;
    },
    FormataValor(value) {
      return (value ? value : 0.0).toLocaleString("pt-br", {
        style: "currency",
        currency: "BRL"
      });
    },
    isClienteVinculado(item) {
      return item.id === this.$store.getters.emptyGuid;
    },
    EditarCliente(evento) {
      evento.preventDefault();

      if (!this.valorRota) {
        this.$notify({
          data: ["Informe uma rota válida."],
          type: "warn",
          duration: 3000
        });
        return;
      }

      this.modalEditarInfoCliente = false;

      ContratoClienteServico.EditarCliente(
        this.contratoClienteId,
        this.valorRota,
        TipoPessoaContratoEnum.Cliente,
        this.contratoId
      )
        .then((resposta) => {
          this.loading = false;
          this.ObterGrid(this.pagina);
          this.$notify({
            data: ["Cliente alterado com sucesso."],
            type: "success",
            duration: 5000
          });
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
    CancelEdicao(evento) {
      evento.preventDefault();
      this.modalEditarInfoCliente = false;
    },
    Edicao(item) {
      this.modalEditarInfoCliente = true;
      this.pessoaId = item.pessoaId;
      this.contratoClienteId = item.id;
      this.valorRota = item.rota;
    },
    ObterTipoPessoa(item) {
      switch (item) {
        case TipoPessoaEnum.Funcionario:
          return "Funcionário";
        case TipoPessoaEnum.Fornecedor:
          return "Fornecedor";
        case TipoPessoaEnum.Cliente:
          return "Cliente";
        case TipoPessoaEnum.Instituicao:
          return "Instituição";
        default:
          return "Inválido";
      }
    }
  }
};
</script>
