<template>
  <div class="login-container">
    <!-- Main container for the login form -->
    <h1 class="title">Login</h1>
    <!-- Title for the login form -->
    <b-form @submit.prevent="onLogin">
      <!-- Username Input Field -->
      <b-form-group
        id="input-group-Username"
        label-cols-sm="3"
        label="Username:"
        label-for="Username"
      >
        <b-input-group>
          <b-input-group-prepend is-text>
            <!-- Username icon -->
            <span class="input-group-text"
              ><i class="fa fa-user" aria-hidden="true"></i
            ></span>
          </b-input-group-prepend>
          <b-form-input
            id="Username"
            v-model="$v.form.username.$model"
            type="text"
            placeholder="Enter your username"
            :state="validateState('username')"
          >
          </b-form-input>
        </b-input-group>
        <!-- Error message for username input -->
        <b-form-invalid-feedback v-if="$v.form.username.$error"
          >Username is required.</b-form-invalid-feedback
        >
      </b-form-group>

      <!-- Password Input Field -->
      <b-form-group
        id="input-group-Password"
        label-cols-sm="3"
        label="Password:"
        label-for="Password"
      >
        <b-input-group>
          <b-input-group-prepend is-text>
            <!-- Password icon -->
            <span class="input-group-text"
              ><i class="fa-solid fa-lock" aria-hidden="true"></i
            ></span>
          </b-input-group-prepend>
          <b-form-input
            id="Password"
            type="password"
            v-model="$v.form.password.$model"
            placeholder="Enter your password"
            :state="validateState('password')"
          >
          </b-form-input>
        </b-input-group>
        <!-- Error message for password input -->
        <b-form-invalid-feedback v-if="$v.form.password.$error"
          >Password is required.</b-form-invalid-feedback
        >
      </b-form-group>

      <!-- Submit Button for the form -->
      <b-button type="submit" variant="primary" class="login-button">
        <i class="bi bi-box-arrow-in-right"></i> Login
      </b-button>
    </b-form>

    <!-- Link to registration page -->
    <div class="mt-2">
      Don't have an account yet?
      <router-link to="register"> Register here.</router-link>
    </div>

    <!-- Error and Success Alerts for login attempts -->
    <b-alert v-if="form.submitError" variant="danger" dismissible show>
      Login failed: {{ form.submitError }}
    </b-alert>
    <b-alert v-if="form.submitSuccess" variant="success" dismissible show>
      Login succeeded!
    </b-alert>
  </div>
</template>

<script>
import { required } from "vuelidate/lib/validators";
import { logInServer } from "../services/auth.js";

export default {
  name: "Login",
  data() {
    return {
      form: {
        username: "",
        password: "",
        submitError: undefined,
        submitSuccess: undefined,
      },
      success: true,
    };
  },
  validations: {
    form: {
      username: { required },
      password: { required },
    },
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null; // Return validation state
    },
    async login() {
      try {
        const credentials = {
          username: this.form.username,
          password: this.form.password,
        };
        const response = await logInServer(credentials); // Call to server for authentication
        if (response.success) {
          this.form.submitSuccess = true; // Set success state
          this.$root.store.login(this.form.username); // Perform login action
          this.$router.push("/").catch(() => {
            this.$forceUpdate(); // Force component to update in case of navigation failure
          });
        } else {
          this.form.submitError = response.message; // Display error message
        }
      } catch (err) {
        this.form.submitError = err.response.data.message; // Handle error response
      }
    },
    onLogin() {
      this.form.submitError = undefined;
      this.form.submitSuccess = undefined;
      this.$v.form.$touch(); // Trigger validation
      if (this.$v.form.$anyError) return; // Abort if any errors
      this.login(); // Proceed with login
    },
  },
};
</script>

<style lang="scss" scoped>
/* Styling for the login container, buttons, and text */
.login-container {
  max-width: 500px;
  min-height: 450px;
  margin: auto;
  padding: 40px;
  border: 1px solid #ccc;
  border-radius: 8px;
  background-color: #fff;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}

.title {
  font-size: 2rem;
  text-align: center;
  margin-bottom: 50px;
}

.login-button {
  width: 100%;
  margin-top: 30px;
  font-size: 25px;
  background-color: green;
  border-color: green;
  border-radius: 8px;
}
.login-button:hover {
  background-color: rgb(2, 85, 2);
  border-color: rgb(2, 85, 2);
}

.register-link {
  text-align: center;
  margin-top: 20px;
  font-size: 1.2rem;
}

.input-group-text {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  color: #495057;
  background-color: #e9ecef;
  border-radius: 0.25rem;
}

.mt-2[data-v-16d8eba4] {
  font-size: 20px;
}
.mt-2,
.my-2 {
  margin-top: 1.5rem !important;
}
</style>
