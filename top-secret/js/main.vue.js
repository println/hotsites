const app = Vue.createApp({
    mounted() {
        this.$store.dispatch("loadEncryptedMessage");
    },
    components: {
        'app': Vue.defineAsyncComponent(() => loadModule('./components/App.vue', options))
    }
});

app.use(store).mount('#app');
