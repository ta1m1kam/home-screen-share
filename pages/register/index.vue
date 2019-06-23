<template>
  <div class="md-layout md-alignment-center-center" style="height: 100vh;">
    <md-card class="md-layout-item md-size-50">
      <md-card-header>
        <div class="md-title">
          Register
        </div>
      </md-card-header>

      <!-- Register Form -->
      <form @submit.prevent="validateForm">
        <md-card-content>
          <md-field md-clearable :class="getValidationClass('email')">
            <label for="email">Email</label>
            <md-input
              id="email"
              v-model="form.email"
              :disabled="loading"
              type="email"
              name="email"
              autocomplete="email"
            />
            <span v-if="!$v.form.email.required" class="md-error">The email is required</span>
            <span v-else-if="!$v.form.email.email" class="md-error">Invalid email</span>
          </md-field>

          <md-field :class="getValidationClass('password')">
            <label for="password">Password</label>
            <md-input
              id="password"
              v-model="form.password"
              :disabled="loading"
              type="password"
              name="password"
              autocomplete="password"
            />
            <span v-if="!$v.form.password.required" class="md-error">The password is required</span>
            <span v-else-if="!$v.form.password.minLength" class="md-error">Password too short</span>
            <span v-else-if="!$v.form.password.maxLength" class="md-error">Password too long</span>
          </md-field>
        </md-card-content>

        <md-card-actions>
          <md-button class="md-icon-button md-raised twitter-btn" style="font-size: 20px;" @click="twitterLoginUser">
            <font-awesome-icon :icon="['fab', 'twitter']" />
          </md-button>

          <md-button to="/login">
            Go to Login
          </md-button>

          <md-button class="md-primary md-raised" type="submit" :disabled="loading">
            Submit
          </md-button>
        </md-card-actions>
      </form>

      <md-snackbar :md-active.sync="isAuthenticated">
        {{ form.email }} was successfully registered!
      </md-snackbar>
    </md-card>
  </div>
</template>

<script>
import { validationMixin } from 'vuelidate'

import {
  required,
  email,
  minLength,
  maxLength
} from 'vuelidate/lib/validators'

export default {
  middleware: 'auth',
  mixins: [validationMixin],
  data: () => ({
    form: {
      email: '',
      password: ''
    }
  }),
  validations: {
    form: {
      email: {
        required,
        email
      },
      password: {
        required,
        minLength: minLength(6),
        maxLength: maxLength(20)
      }
    }
  },
  computed: {
    loading() {
      return this.$store.getters.loading
    },
    isAuthenticated() {
      return this.$store.getters.isAuthenticated
    }
  },
  watch: {
    isAuthenticated(value) {
      if (value) {
        setTimeout(() => this.$router.push('/'), 2000)
      }
    }
  },
  methods: {
    validateForm() {
      this.$v.$touch()
      if (!this.$v.$invalid) {
        this.registerUser()
      }
    },
    async registerUser() {
      await this.$store.dispatch('authenticateUser', {
        action: 'register',
        email: this.form.email,
        password: this.form.password,
        returnSecureToken: true
      })
    },
    async twitterLoginUser() {
      await this.$store.dispatch('authenticateUser', {
        action: 'twitter'
      })
    },
    getValidationClass(fieldName) {
      const field = this.$v.form[fieldName]
      if (field) {
        return {
          'md-invalid': field.$invalid && field.$dirty
        }
      }
    }
  }
}
</script>

<style scoped>
.twitter-btn {
  background-color: dodgerblue !important;
}
</style>
