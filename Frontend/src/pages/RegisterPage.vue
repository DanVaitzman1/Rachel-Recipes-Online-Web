<template>
  <div class="container">
    <!-- Registration form header -->
    <h1 class="title">Register</h1>
    <b-form @submit.prevent="onRegister" @reset.prevent="onReset">
      <!-- Username input group -->
      <b-form-group
        id="input-group-username"
        label-cols-sm="3"
        label="Username:"
        label-for="username"
      >
        <b-input-group>
          <b-input-group-prepend is-text>
            <span class="input-group-text"
              ><i class="fa fa-user" aria-hidden="true"></i
            ></span>
          </b-input-group-prepend>
          <b-form-input
            id="username"
            v-model="$v.form.username.$model"
            type="text"
            :state="validateState('username')"
          ></b-form-input>
        </b-input-group>
        <!-- Username validation feedback -->
        <b-form-invalid-feedback v-if="!$v.form.username.required">
          Username is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else-if="!$v.form.username.minLength || !$v.form.username.maxLength"
        >
          Username length should be between 3-8 characters long
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-if="$v.form.username.$dirty &&!$v.form.username.alpha">
          Username must only contain alphabetic characters
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- First Name input group -->
      <b-form-group
        id="input-group-firstname"
        label-cols-sm="3"
        label="First Name:"
        label-for="firstName"
      >
        <b-input-group>
          <b-input-group-prepend is-text>
            <span class="input-group-text"
              ><i class="fa fa-user" aria-hidden="true"></i
            ></span>
          </b-input-group-prepend>
          <b-form-input
            id="firstName"
            v-model="$v.form.firstName.$model"
            type="text"
            :state="validateState('firstName')"
          ></b-form-input>
        </b-input-group>
        <!-- First Name validation feedback -->
        <b-form-invalid-feedback v-if="!$v.form.firstName.required">
          First Name is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.form.firstName.alpha">
          First Name must only contain alphabetic characters
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Last Name input group -->
      <b-form-group
        id="input-group-lastname"
        label-cols-sm="3"
        label="Last Name:"
        label-for="lastName"
      >
        <b-input-group>
          <b-input-group-prepend is-text>
            <span class="input-group-text"
              ><i class="fa fa-user" aria-hidden="true"></i
            ></span>
          </b-input-group-prepend>
          <b-form-input
            id="lastName"
            v-model="$v.form.lastName.$model"
            type="text"
            :state="validateState('lastName')"
          ></b-form-input>
        </b-input-group>
        <!-- Last Name validation feedback -->
        <b-form-invalid-feedback v-if="!$v.form.lastName.required">
          Last Name is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.form.lastName.alpha">
          Last Name must only contain alphabetic characters
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Email input group -->
      <b-form-group
        id="input-group-email"
        label-cols-sm="3"
        label="Email:"
        label-for="email"
      >
        <b-input-group>
          <b-input-group-prepend is-text>
            <span class="input-group-text"
              ><i class="fa fa-envelope" aria-hidden="true"></i
            ></span>
          </b-input-group-prepend>
          <b-form-input
            id="email"
            v-model="$v.form.email.$model"
            type="email"
            :state="validateState('email')"
          ></b-form-input>
        </b-input-group>
        <!-- Email validation feedback -->
        <b-form-invalid-feedback v-if="!$v.form.email.required">
          Email is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback v-else-if="!$v.form.email.email">
          Email must be valid
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Country selection group -->
      <b-form-group
        id="input-group-country"
        label-cols-sm="3"
        label="Country:"
        label-for="country"
      >
        <b-input-group>
          <b-input-group-prepend is-text>
            <span class="input-group-text"
              ><i class="fa fa-flag" aria-hidden="true"></i
            ></span>
          </b-input-group-prepend>
          <b-form-select
            id="country"
            v-model="$v.form.country.$model"
            :options="countries"
            :state="validateState('country')"
            class="select-input"
          ></b-form-select>
        </b-input-group>
        <b-form-invalid-feedback> Country is required </b-form-invalid-feedback>
      </b-form-group>

      <!-- Password input group -->
      <b-form-group
        id="input-group-password"
        label-cols-sm="3"
        label="Password:"
        label-for="password"
      >
        <b-input-group>
          <b-input-group-prepend is-text>
            <span class="input-group-text"
              ><i class="fa fa-lock" aria-hidden="true"></i
            ></span>
          </b-input-group-prepend>
          <b-form-input
            id="password"
            type="password"
            v-model="$v.form.password.$model"
            :state="validateState('password')"
          ></b-form-input>
        </b-input-group>
        <!-- Password validation feedback -->
        <b-form-invalid-feedback v-if="!$v.form.password.required">
          Password is required
        </b-form-invalid-feedback>
        <b-form-text v-else-if="$v.form.password.$error" text-variant="info">
          Your password should be <strong>strong</strong>. <br />
        </b-form-text>
        <b-form-invalid-feedback
          v-if="$v.form.password.required && !$v.form.password.minLength"
        >
          Password must have length between 5-10 characters long
        </b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-if="$v.form.password.required && !$v.form.password.containsNumber"
        >
          Password must contain at least one number
        </b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-if="
            $v.form.password.required && !$v.form.password.containsSpecialChar
          "
        >
          Password must contain at least one special character
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Password confirmation input group -->
      <b-form-group
        id="input-group-confirmedPassword"
        label-cols-sm="3"
        label="Confirm Password:"
        label-for="confirmedPassword"
      >
        <b-input-group>
          <b-input-group-prepend is-text>
            <span class="input-group-text"
              ><i class="fa fa-lock" aria-hidden="true"></i
            ></span>
          </b-input-group-prepend>
          <b-form-input
            id="confirmedPassword"
            type="password"
            v-model="$v.form.confirmedPassword.$model"
            :state="validateState('confirmedPassword')"
          ></b-form-input>
        </b-input-group>
        <!-- Password confirmation validation feedback -->
        <b-form-invalid-feedback v-if="!$v.form.confirmedPassword.required">
          Password confirmation is required
        </b-form-invalid-feedback>
        <b-form-invalid-feedback
          v-else-if="!$v.form.confirmedPassword.sameAsPassword"
        >
          The confirmed password is not equal to the original password
        </b-form-invalid-feedback>
      </b-form-group>

      <!-- Form action buttons -->
      <b-button type="reset" variant="danger">Reset</b-button>
      <b-button type="submit" variant="primary">Register</b-button>
      <!-- Link to log in page -->
      <div class="mt-2">
        You have an account already?
        <router-link to="login"> Log in here</router-link>
      </div>
    </b-form>
    <!-- Error alert for failed registration attempts -->
    <b-alert
      class="mt-2"
      v-if="form.submitError"
      variant="warning"
      dismissible
      show
    >
      Register failed: {{ form.submitError }}
    </b-alert>
  </div>
</template>

<script>
import countries from "../assets/countries";
import {
  required,
  minLength,
  maxLength,
  alpha,
  sameAs,
  email,
} from "vuelidate/lib/validators";
import { registerServer } from "@/services/auth";

export default {
  name: "Register",
  data() {
    return {
      form: {
        username: "",
        firstName: "",
        lastName: "",
        country: null,
        password: "",
        confirmedPassword: "",
        email: "",
        submitError: undefined,
      },
      countries: [{ value: null, text: "", disabled: true }].concat(countries),
      validated: false,
    };
  },
  validations: {
    form: {
      username: {
        required,
        minLength: minLength(3),
        maxLength: maxLength(8),
        alpha,
      },
      firstName: {
        required,
        alpha,
      },
      lastName: {
        required,
        alpha,
      },
      email: {
        required,
        email,
      },
      country: {
        required,
      },
      password: {
        required,
        minLength: minLength(5),
        maxLength: maxLength(10),
        containsNumber: (value) => /\d/.test(value),
        containsSpecialChar: (value) => /[!@#$%^&*(),.?":{}|<>]/.test(value),
      },
      confirmedPassword: {
        required,
        sameAsPassword: sameAs("password"),
      },
    },
  },
  methods: {
    validateState(param) {
      const { $dirty, $error } = this.$v.form[param];
      return $dirty ? !$error : null;
    },
    async onRegister() {
      this.$v.form.$touch();
      if (!this.$v.form.$anyError) {
        try {
          const response = await registerServer(this.form);
          this.$router.push("/login");
        } catch (err) {
          this.form.submitError = err.response.data.message;
        }
      }
    },
    onReset() {
      if(confirm("Are tou sure you want to clear all fields ? "))
      {
        this.form = {
        username: "",
        firstName: "",
        lastName: "",
        country: null,
        password: "",
        confirmedPassword: "",
        email: "",
        submitError: undefined,
      };
      this.$nextTick(() => {
        this.$v.$reset();
      });
      }
    },
  },
};
</script>

<style lang="scss" scoped>
.container {
  max-width: 620px;
  padding: 20px;
  border-radius: 8px;
  border: 1px solid #ccc;
  background-color: #f9f9f9;
  box-shadow: 0px 0px 10px rgba(0, 0, 0, 0.1);
}
.title {
  margin-bottom: 20px;
  font-weight: bold;
  font-size: 2.8rem;
  display: inline-block;
  border-bottom: 2px solid #42b983;
}
.input-group-text {
  display: flex;
  align-items: center;
  padding: 0.25rem 0.5rem;
  font-weight: 400;
  line-height: 3.5;
  color: #495057;
  background-color: #e9ecef;
  border: none;
  border-radius: 0.25rem;
}
.select-input{
  width: 91%;
  background-color: #e9ecef;
}
.b-form-invalid-feedback{
  display:block !important;
  color: red !important;
  
}
.btn-danger,
.btn-primary {
  border-radius: 8px;
  font-size: 1.2rem;
  margin-top: 30px;
  margin-left:30px;
}
.btn-danger {
  background-color: gray;
  border-color: gray;
}
.btn-danger:hover {
  background-color: rgb(96, 96, 96);
  border-color: rgb(96, 96, 96);
}
.btn-primary {
  background-color: green;
  border-color: green;
  width: 350px;
}
.btn-primary:hover {
  background-color: rgb(2, 85, 2);
  border-color: rgb(2, 85, 2);
}

</style>
