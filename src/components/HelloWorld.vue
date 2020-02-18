<template>
  <div class="hello">
    <h1>{{ msg }}</h1>

    <p v-if="!$store.getters.isAuthenticated">
      <a v-bind:href="loginUrl" rel="noopener">Login HELIX</a>
    </p>

    <p
      v-if="$store.getters.isAuthenticated"
    >{{ $store.state.account.username }} - {{ $store.state.account.roles }}</p>

    <p>{{ $store.state.auth }}</p>
    <p>{{ $store.state.csrf }}</p>
  </div>
</template>

<script lang="ts">
import { Component, Prop, Vue } from 'vue-property-decorator';

@Component
export default class HelloWorld extends Vue {
  @Prop() private msg!: string;

  loginUrl = `${process.env.VUE_APP_API_GATEWAY_URL}/login/opertus-mundi`;
}
</script>

<!-- Add "scoped" attribute to limit CSS to this component only -->
<style scoped lang="scss">
h3 {
  margin: 40px 0 0;
}
ul {
  list-style-type: none;
  padding: 0;
}
li {
  display: inline-block;
  margin: 0 10px;
}
a {
  color: #42b983;
}
</style>
