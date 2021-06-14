<template src="./info.html"></template>
<script>
export default {
  data() {
    return {
      fragment: 'privacidade'
    }
  },
  methods: {
    show(fragmentId) {
      this.fragment = fragmentId
    },
    isFragment(fragmentId) {
      return this.fragment == fragmentId
    }
  }
}
</script>
