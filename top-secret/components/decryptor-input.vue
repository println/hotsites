<template>
  <aside class="card" :class="{ 'disabled': isDisabled }">
    <div class="card-body">
      <h5 class="card-title">Decifrar mensagem</h5>
      <section>
        <div class="mb-3">
          <label class="form-label" for="compoundName">Seu nome composto</label>
          <div class="input-group">
            <input class="form-control" :class="{ 'is-valid': isCompoundNameValid }" type="text" id="compoundName"
                   ref="compoundName" :value="compoundName" name="compoundName" :maxlength="compoundNameMaxLength"
                   autofocus placeholder="Ex: Ana Júlia" @input="onInputCompoundName" pattern="[\w\s]+"
                   required autocomplete="off" :disabled="isDisabled"/>
            <span class="input-group-text">{{
                (compoundNameMaxLength - compoundName.length).toLocaleString('en-US', {
                  minimumIntegerDigits: 2,
                  useGrouping: false
                })
              }}</span>
          </div>
        </div>

        <div class="mb-3">
          <label class="form-label" for="birth">Dia e mês do seu aniversário</label>
          <div class="input-group">
            <input class="form-control" :class="{ 'is-valid': isBirthValid }" type="text" id="birth" ref="birth"
                   :value="birth" name="birth" :maxlength="birthMaxLength" @input="onInputBirth"
                   v-cleave="{date: true, datePattern: ['d', 'm'], delimiter: '/'}" placeholder="Ex: 07/05"
                   pattern="^([0-2][0-9]|(3)[0-1])(\/)(((0)[0-9])|((1)[0-2]))$" required autocomplete="off"
                   :disabled="isDisabled">
            <span class="input-group-text">{{
                (birthMaxLength - birth.length).toLocaleString('en-US', {
                  minimumIntegerDigits: 2,
                  useGrouping: false
                })
              }}</span>
          </div>
        </div>
        <div class="d-grid gap-2">
          <button class="btn btn-outline-primary" type="submit" ref="decode" @click="tryDecode"
                  :disabled="!canTryDecode">
            Decifrar
          </button>
        </div>
      </section>
    </div>
  </aside>
</template>

<script>
export default {
  name: "decryptor-input",
  computed: {
    canTryDecode() {
      return this.isCompoundNameValid && this.isBirthValid;
    },
    isCompoundNameValid() {
      return (this.compoundNameMaxLength - this.compoundName.length) == 0 &&
          this.$refs.compoundName.validity.valid;
    },
    isBirthValid() {
      return (this.birthMaxLength - this.birth.length) == 0 &&
          this.$refs.birth.validity.valid;
      ;
    },
    secretMessage() {
      return this.$store.state.secretMessage;
    },
    isDisabled() {
      return this.secretMessage;
    }
  },
  data() {
    return {
      compoundName: '',
      compoundNameMaxLength: 12,
      birth: '',
      birthMaxLength: 5
    };
  },
  mounted() {
    this.$nextTick(() => {
      this.$refs.compoundName.focus();
    });
  },
  methods: {
    onInputCompoundName(e) {
      this.compoundName = e.target.value;
      if (this.isCompoundNameValid) {
        this.$nextTick(() => {
          this.$refs.birth.focus();
        });
      }
    },
    onInputBirth(e) {
      this.birth = e.target.value;
      if (this.isBirthValid) {
        this.$nextTick(() => {
          this.$refs.decode.focus();
        });
      }
    },
    tryDecode() {
      this.$store.dispatch("decryptMessage", {name: this.compoundName, birth: this.birth}).then(() => {
        this.compoundName = '';
        this.birth = '';
        document.getElementById("birth").cleave.setRawValue('');
        document.getElementById("compoundName").value = '';
        this.$refs.decode.blur();
        this.$toast.success("A mensagem foi decifrada! 🙌");
      }, () => {
        this.$toast.error("Dados incorretos! 😞");
      });
    }
  },
  directives: {
    cleave: {
      mounted: (el, binding) => {
        el.cleave = new Cleave(el, binding.value || {})
      },
      updated: (el) => {
        const event = new Event('input', {bubbles: true});
        setTimeout(function () {
          el.value = el.cleave.properties.result
          el.dispatchEvent(event)
        }, 100);
      }
    }
  }
}
</script>

<style scoped type="scss">
.card {
  height: min-content;
  width: 18rem;
}

.card.disabled {
  opacity: 0.5;
}

input[type=text] {
  text-transform: capitalize;
}
</style>
