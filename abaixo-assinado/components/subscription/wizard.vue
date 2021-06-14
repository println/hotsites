<template src="./wizard.html"></template>

<script>
export default {
  props: ['subscribers'],
  data() {
    return {
      subscriber: {},
      state: {
        stage: ''
      }
    }
  },
  methods: {
    start() {
      this.state.stage = 'start'
    },
    create() {
      this.state.stage = 'create'
    },
    edit() {
      this.state.stage = 'edit'
    },
    terminate() {
      this.state.stage = 'terminate'
    },
    abort() {
      this.state.stage = ''
      this.subscriber = {}
    },
    isActive() {
      return this.state.stage != ''
    },
    isStarted() {
      return this.state.stage == 'start'
    },
    isUpdating() {
      return this.state.stage == 'edit'
    },
    isCreating() {
      return this.state.stage == 'create'
    },
    isFinished(){
      return this.state.stage == 'terminate'
    },
    onEdit(value){
      this.subscriber = Object.assign({},findSubscriberById(this.subscribers, value.id))
      this.edit()
    },
    onNew(value){
      this.subscriber = value
      this.create()
    },
    onCreate(subscriber){
      let newSubscriber = {}

      newSubscriber.id = this.subscribers[0].id + 1
      newSubscriber.name = subscriber.name
      newSubscriber.nick = subscriber.nick
      newSubscriber.message = subscriber.message
      newSubscriber.from = subscriber.from
      newSubscriber.course = subscriber.course
      newSubscriber.admissionDate = subscriber.admissionDate
      newSubscriber.registrationId = subscriber.registrationId
      newSubscriber.password = subscriber.password
      newSubscriber.createdAt = new Date().toISOString()
      newSubscriber.lastUpdated = newSubscriber.createdAt
      newSubscriber.updateCredits = 5

      this.subscribers.unshift(newSubscriber)
      this.subscriber = this.subscribers[0]
      this.terminate()
    },
    onUpdate(subscriber){
      let index = findIndexById(this.subscribers, subscriber.id)

      if(!this.subscribers[index].updateCredits){
        this.subscriber = this.subscribers[index]
        this.terminate()
        return
      }

      this.subscribers[index].name = subscriber.name
      this.subscribers[index].nick = subscriber.nick
      this.subscribers[index].message = subscriber.message
      this.subscribers[index].from = subscriber.from
      this.subscribers[index].course = subscriber.course
      this.subscribers[index].admissionDate = subscriber.admissionDate
      this.subscribers[index].registrationId = subscriber.registrationId
      this.subscribers[index].password = subscriber.password
      this.subscribers[index].lastUpdated = new Date().toISOString()
      this.subscribers[index].updateCredits--


      this.subscriber = this.subscribers[index]
      this.terminate()
    }
  },
  components: {
    'step-login': Vue.defineAsyncComponent(() => loadModule('./components/subscription/wizard-steps/login.vue', options)),
    'step-incluir': Vue.defineAsyncComponent(() => loadModule('./components/subscription/wizard-steps/incluir.vue', options)),
    'step-editar': Vue.defineAsyncComponent(() => loadModule('./components/subscription/wizard-steps/editar.vue', options)),
    'step-logout': Vue.defineAsyncComponent(() => loadModule('./components/subscription/wizard-steps/logout.vue', options))
  }
}

function findSubscriberById(subscribers, id) {
  return subscribers.filter(s => s.id == id)[0]
}

function findIndexById(subscribers, id) {
  return subscribers.findIndex(s => s.id == id)
}

</script>
