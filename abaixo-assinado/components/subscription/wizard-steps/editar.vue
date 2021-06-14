<template src="./editar.html"></template>

<script>
export default {
  props: ['subscriber'],
  emits: ["updatedSubscriber"],
  methods: {
    formSubmit() {
      this.$emit('updatedSubscriber', this.subscriber);
    },
  },
}
</script>
