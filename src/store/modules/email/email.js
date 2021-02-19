export default {
  namespaced: true,
  state: {
    controllerStatus: 0, //estado de edição/visualização do email
    configuracaoEmail: { id: "", label: "" },
    sideBarFolderSelected: { id: "", nome: "" },
    actionFolderSelected: { id: "", nome: "" },
    customFolders: [],
    mainCheckBoxSelected: false,
    emailListAction: false
  },
  mutations: {
    setControllerStatus(state, status) {
      state.controllerStatus = status;
    },
    setConfiguracaoEmail(state, email) {
      state.configuracaoEmail = { id: email.id, label: email.label };
      console.log("[setConfiguracaoEmail] ", state.configuracaoEmail);
    },
    setCustomFolders(state, customFolders) {
      state.customFolders = customFolders;
    },
    setSideBarFolderSelected(state, folder) {
      state.sideBarFolderSelected = folder;
    },
    setActionFolderSelected(state, folder) {
      state.actionFolderSelected = folder;
      console.log("[setActionFolderSelected]", state.actionFolderSelected);
    },
    setEmailListAction(state, status) {
      state.emailListAction = status;
    },
    setMainCheckBoxSelected(state, status) {
      state.mainCheckBoxSelected = status;
      console.log("setMainCheckBoxSelected State: ", status);
    },
    clearActionFolderSelected(state) {
      state.actionFolderSelected = { id: "", nome: "" };
      console.log("[clearActionFolderSelected]", state);
    },
    clearConfiguracaoEmail(state) {
      state.configuracaoEmail.id = "";
      state.configuracaoEmail.label = "";
      console.log("[clearConfiguracaoEmail]", state);
    }
  },
  actions: {
    clearActionFolderSelected({ commit }) {
      commit("clearActionFolderSelected");
    },
    clearConfiguracaoEmail({ commit }) {
      commit("clearConfiguracaoEmail");
    }
  },
  getters: {
    getControllerStatus: (state) => state.controllerStatus,
    getConfiguracaoEmail: (state) => state.configuracaoEmail, //porcaria escrevi o nome errado
    getCustomFolders: (state) => state.customFolders,
    getSideBarFolderSelected: (state) => state.sideBarFolderSelected,
    getActionFolderSelected: (state) => state.actionFolderSelected,
    getEmailListAction: (state) => state.emailListAction,
    getMainCheckBoxSelected: (state) => state.mainCheckBoxSelected
  }
};
