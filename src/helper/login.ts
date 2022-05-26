const navigateToKeycloakLogin = (path: string): void => {
  sessionStorage.setItem('routeToNavigateAfterLogin', path);
  window.location.href = `/oauth2/authorization/${process.env.VUE_APP_KEYCLOAK_CLIENT}`;
};

// eslint-disable-next-line
export { navigateToKeycloakLogin };
