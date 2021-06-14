<template src="./logout.html"></template>

<script>
export default {
  props: ['subscriber'],
  emits: ["logout"],
  methods: {
    formSubmit() {
      this.$emit('logout', this.subscriber);
    },
  },
}
</script>
