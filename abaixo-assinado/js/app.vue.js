const options = {

    moduleCache: {
        vue: Vue,
    },

    getFile(url) {
        return fetch(url).then(response => response.ok ? response.text() : Promise.reject(response));
    },

    addStyle(styleStr) {
        const style = document.createElement('style');
        style.textContent = styleStr;
        const ref = document.head.getElementsByTagName('style')[0] || null;
        document.head.insertBefore(style, ref);
    },

    log(type, ...args) {
        console.log(type, ...args);
    }
}

const {loadModule, version} = window["vue3-sfc-loader"];

const app = Vue.createApp({
    data() {
        return {
            citation: {},
            subscribers: []
        }
    },
    mounted() {
        axios
            .get('json/citation.json')
            .then(response => (this.citation = response.data))
        axios
            .get('json/subscribers.json')
            .then(response => (this.subscribers = response.data))
    },
    components: {
        'info': Vue.defineAsyncComponent(() => loadModule('./components/information/info.vue', options)),
        'subscribers-manifest': Vue.defineAsyncComponent(() => loadModule('./components/subscribers/manifest-board.vue', options)),
        'subscription-wizard': Vue.defineAsyncComponent(() => loadModule('./components/subscription/wizard.vue', options)),
    }
});

app.mount('#app');
