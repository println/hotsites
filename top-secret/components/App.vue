<template>
  <div class="content">
    <div class="jumbotron p-5 rounded-3">
      <div class="container-fluid">
        <paper></paper>
      </div>
    </div>
    <decryptor-input></decryptor-input>
  </div>
</template>

<script>
export default {
  name: "App.vue",
  components: {
    'paper': Vue.defineAsyncComponent(() => loadModule('./components/paper.vue', options)),
    'decryptor-input': Vue.defineAsyncComponent(() => loadModule('./components/decryptor-input.vue', options))
  }
}
</script>

<style scoped>
.content {
  display: flex;
  flex: 1;
  flex-direction: row;
}

.jumbotron {
  margin-right: 10px;
  margin-bottom: 10px;
  flex: 1;
}

@media all and (orientation: portrait) {
  .content {
    flex-direction: column-reverse;
  }

  .jumbotron {
    margin-right: 0;
  }
}
</style>
