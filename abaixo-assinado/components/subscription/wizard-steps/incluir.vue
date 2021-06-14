<template src="./incluir.html"></template>

<script>
export default {
  props: ['subscriber'],
  emits: ["createSubscriber"],
  data() {
    return {
      centers: [],
      courses: [],
      admissionDates: []
    }
  },
  methods: {
    formSubmit() {
      this.$emit('createSubscriber', this.subscriber);
    },
    fillDefaults() {
      this.subscriber.name = 'Fulano de tal'
      this.subscriber.nick = 'tal'
      this.subscriber.message = 'Isabel é muito amorosa e dedicada'
      this.subscriber.from = 'Duque de Caxias'
      this.subscriber.course = 'Tecnologia em Sistemas de Computação'
      this.subscriber.admissionDate = this.admissionDates[0]
      this.subscriber.createdAt = ''
      this.subscriber.lastUpdated = ''
    }
  },
  mounted() {
    axios
        .get('json/centers.json')
        .then(response => (this.centers = response.data))
    axios
        .get('json/courses.json')
        .then(response => (this.courses = response.data))

    let currentYear = new Date().getFullYear();
    let currentMonth = new Date().getMonth();
    for (let i = 2000; i <= currentYear; i++) {
      this.admissionDates.unshift(i + '/1')

      if (i < currentYear || currentMonth > 5) {
        this.admissionDates.unshift(i + '/2')
      }
    }
    this.fillDefaults()
  },
}
</script>
