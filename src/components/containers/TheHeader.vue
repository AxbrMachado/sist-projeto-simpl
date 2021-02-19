<template>
  <CHeader class="no-print" fixed with-subheader light>
    <CToggler
      v-c-emit-root-event:toggle-sidebar-mobile
      in-header
      class="ml-3 d-lg-none"
    />
    <CToggler
      v-c-emit-root-event:toggle-sidebar
      in-header
      class="ml-3 d-md-down-none"
    />
    <CHeaderBrand
      class="mx-auto d-lg-none"
      src="img/coreui-vue-logo.svg"
      width="190"
      height="46"
      alt="CoreUI Logo"
    />
    <CHeaderNav class="d-md-down-none mr-auto">
      <!-- <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/dashboard">Dashboard</CHeaderNavLink>
      </CHeaderNavItem> -->
      <!-- <CHeaderNavItem class="px-3">
        <CHeaderNavLink to="/users" exact>Users</CHeaderNavLink>
      </CHeaderNavItem> -->
      <!-- <CHeaderNavItem class="px-3">
        <CHeaderNavLink>Settings</CHeaderNavLink>
      </CHeaderNavItem> -->
    </CHeaderNav>
    <CHeaderNav class="mr-4">
      <!-- <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-bell" />
        </CHeaderNavLink>
      </CHeaderNavItem> -->
      <!-- <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-list" />
        </CHeaderNavLink>
      </CHeaderNavItem> -->
      <!-- <CHeaderNavItem class="d-md-down-none mx-2">
        <CHeaderNavLink>
          <CIcon name="cil-envelope-open" />
        </CHeaderNavLink>
      </CHeaderNavItem> -->
      <CHeaderNavItem>
        <DropDownConta></DropDownConta>
      </CHeaderNavItem>
      <CHeaderNavItem>
        <label class="ml-2">{{ $store.getters.getAutenticacao.apelido }}</label>
      </CHeaderNavItem>
      <PerfilDropdown />
    </CHeaderNav>
    <!-- <CSubheader class="px-3">
      <CBreadcrumbRouter class="border-0" />
    </CSubheader> -->
  </CHeader>
</template>

<script>
import DropDownConta from "../dropdown/DropDownConta";
import PerfilDropdown from "./PerfilDropdown";

export default {
  name: "TheHeader",
  components: {
    PerfilDropdown,
    DropDownConta
  }
};
</script>
