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
        setSecretMessage(state, secretMessage) {
            state.secretMessage = secretMessage;
        }
    },
    actions: {
        async loadEncryptedMessage(context) {
            const res = await axios.get('json/secret-message.json');
            const encryptedMessage = await res.data['secret-message'];
            context.commit("setEncryptedMessage", encryptedMessage);
        },
        decryptMessage({commit, state}, {name, birth}) {
            const password = name.toLocaleLowerCase() + birth.replace('/', '');

            return new Promise((resolve, reject) => {
                const secretMessage = crypto.aes.decrypt(state.encryptedMessage, password);
                if (secretMessage) {
                    commit("setSecretMessage", secretMessage);
                    resolve();
                } else {
                    this.$app.$toast.error(
                        `${capitalize(name)} faz aniversário em ${birth}?<br>Se sim, a mensagem não é para você!`);

                    reject();
                }
            });
        }
    }
})

const capitalize = (str) => str.replace(/(^\w|\s\w)/g, m => m.toUpperCase());
