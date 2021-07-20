const crypto = {
    aes: {
        encrypt: (message, password) => {
            var ciphertext = CryptoJS.AES.encrypt(message, password).toString();
            var originalText = crypto.aes.decrypt(ciphertext, password);
            console.log(originalText)
            console.log(ciphertext)
            return ciphertext;
        },
        decrypt: (ciphertext, password) => {
            var originalText = '';
            try {
                var bytes = CryptoJS.AES.decrypt(ciphertext, password);
                originalText = bytes.toString(CryptoJS.enc.Utf8);
            } catch (e) {
                console.log(e)
            }
            return originalText;
        }
    }
};
