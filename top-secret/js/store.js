const store = Vuex.createStore({
    state() {
        return {
            encryptedMessage: '',
            secretMessage: null,
        }
    },
    mutations: {
        setEncryptedMessage(state, encryptedMessage) {
            state.encryptedMessage = encryptedMessage;
        },
        setSecretMessage(state, password) {
            const secretMessage = crypto.aes.decrypt(state.encryptedMessage, password);
            state.secretMessage = secretMessage;
        }
    },
    actions: {
        async loadEncryptedMessage(context) {
            const res = await axios.get('json/secret-message.json');
            const encryptedMessage = await res.data['secret-message'];
            context.commit("setEncryptedMessage", encryptedMessage);
        },
        decryptMessage(context, password) {
            context.commit("setSecretMessage", password);
        }
    }
})
