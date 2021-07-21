

const app = Vue.createApp({
    mounted() {
        this.$store.dispatch("loadEncryptedMessage");
    },
    components: {
        'app': Vue.defineAsyncComponent(() => loadModule('./components/App.vue', options))
    }
});

store.$app = app.use(VueToast, {position: 'top'}).use(store).mount('#app');


