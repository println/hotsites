<template src="./login.html"></template>

<script>
export default {
  props: ['subscribers'],
  emits: ["selectedSubscriber", "newSubscriber"],
  data() {
    return {
      user: '123456',
      pass: 'xpto123',
      passwordFieldType: "password"
    }
  },
  methods: {
    formSubmit() {
      let sub = findSubscriber(this.subscribers, this.user)

      if (sub) {
        this.$emit('selectedSubscriber', {id: sub.id})
      } else {
        this.$emit('newSubscriber', {registrationId: this.user, password: this.pass})
      }
    },
    switchVisibility() {
      this.passwordFieldType = this.passwordFieldType === "password" ? "text" : "password";
    }
  },
}

function findSubscriber(subscribers, login) {
  return subscribers.filter(s => s.registrationId == login)[0]
}


</script>
