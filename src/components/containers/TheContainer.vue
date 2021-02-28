<template>
  <div class="c-app">
    <TheSidebar />
    <div class="c-wrapper">
      <TheHeader />
      <div class="c-body">
        <main class="c-main">
          <CContainer fluid>
            <transition name="fade">
              <router-view />
            </transition>
          </CContainer>
        </main>
      </div>
      <!-- <SignalR
        ref="loginSignalR"
        :url="$store.getters.baseURL"
        :parametro="ObterParametroSignalR()"
        nomeEventoReceber="ReceberLogin"
        nomeHub="loginhub"
        nomeEventoRegistro="Registrar"
        nomeEventoEmit="on-login-received"
        @on-login-received="OnLoginReceived"
      /> -->
      <TheFooter />
    </div>
  </div>
</template>

<script>
import TheSidebar from "./TheSidebar";
import TheHeader from "./TheHeader";
import TheFooter from "./TheFooter";
// import SignalR from "../../components/signalr/SignalR";
// import TipoPerfil from "../../enums/TipoPerfil";

export default {
  name: "TheContainer",
  components: {
    TheSidebar,
    TheHeader,
    TheFooter
    // SignalR
  },
  beforeDestroy() {
    // this.$refs.loginSignalR.Fechar();
  },
  beforeMount() {
    // this.ValidarToken();
  },
  mounted() {
    // this.$refs.loginSignalR.Iniciar();
  },
  methods: {
    // ValidarToken() {
    //   if (!this.$store.getters.getAutenticacao) this.$router.go(0);
    //   if (this.$store.getters.getAutenticacao.perfil === TipoPerfil.Sistema)
    //     return;
    //   this.$http({
    //     url: "login/validar-token",
    //     data: this.$store.getters.getAutenticacao,
    //     method: "POST"
    //   })
    //     .then(() => {})
    //     .catch(() => {
    //       localStorage.removeItem("user-token");
    //       this.$router.go(0);
    //     });
    // },
    // ObterParametroSignalR() {
    //   return {
    //     UsuarioId: this.$store.getters.getAutenticacao.usuarioId,
    //     SessaoId: this.$store.getters.getAutenticacao.sessaoId
    //   };
    // },
    // OnLoginReceived(e) {
    //   if (
    //     this.$store.getters.getAutenticacao.usuarioId == e.usuarioId &&
    //     this.$store.getters.getAutenticacao.sessaoId !== e.sessaoId
    //   ) {
    //     this.$notify({
    //       data: [
    //         "Você efetuou o login em outro navegador.",
    //         "Este navegador será desconectado."
    //       ],
    //       type: "warn",
    //       duration: 90000
    //     });
    //     this.$store.dispatch("logout").then(() => {
    //       this.$router.push("/login");
    //     });
    //   }
    // }
  }
};
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s;
}
.fade-enter,
.fade-leave-to {
  opacity: 0;
}
</style>
