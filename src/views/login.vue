<template>
  <v-app>
    <v-toolbar light class="elevation-0 toolbar toolbarText" height="80px" color="#48649f">
      <v-flex md9>
        <v-toolbar-title style="color:white;font-size: 36px;">Spritle</v-toolbar-title>
      </v-flex>
      <v-flex md1.5 class="mr-2">
        <v-layout column>
          <p class="aboveTextField">Mobile number</p>
          <v-text-field
            v-model="loginInfo.mobileNumber"
            :error-messages="loginError.mobileNumberError"
            height="30px"
            solo
            flat
          ></v-text-field>
        </v-layout>
      </v-flex>
      <v-flex md1.5>
        <v-layout column>
          <p class="aboveTextField">Password</p>
          <v-text-field
            v-model="loginInfo.password"
            :error-messages="loginError.passwordError"
            solo
            flat
          ></v-text-field>
        </v-layout>
      </v-flex>
      <v-btn @click="login()" color="#4267b2" small style="margin-top: 20px;color: white;">Login</v-btn>
    </v-toolbar>
    <v-content style="background-color:#e9ebee;padding:6%">
      <v-flex md4>
        <v-card style="background-color:#e9ebee" class="elevation-0 card">
          <v-card-title class="cardtitle">Create a new account</v-card-title>
          <v-text-field
            @input="signupError.nameError=null"
            :error-messages="signupError.nameError"
            v-model="signupInfo.name"
            flat
            label="Solo"
            placeholder="Name"
            solo
          ></v-text-field>
          <v-text-field
            @input="signupError.mobileNumberError=null"
            :error-messages="signupError.mobileNumberError"
            v-model="signupInfo.mobileNumber"
            flat
            label="Solo"
            placeholder="Mobile Number"
            solo
          ></v-text-field>
          <v-text-field
            @input="signupError.passwordError=null"
            :error-messages="signupError.passwordError"
            v-model="signupInfo.password"
            flat
            label="Solo"
            placeholder="Password"
            solo
          ></v-text-field>
          <v-btn
            @click="signup()"
            color="#609d4d"
            large
            style="color: white;border-radius:6px"
          >Sign Up</v-btn>
        </v-card>
      </v-flex>
    </v-content>
  </v-app>
</template>
<style>
</style>

<script>
import Api from "../libs/Api";
import { userInfo } from "os";

export default {
  data() {
    return {
      loginInfo: {
        mobileNumber: null,
        password: null
      },
      loginError: {
        mobileNumberError: null,
        passwordError: null
      },
      signupInfo: {
        name: null,
        mobileNumber: null,
        password: null
      },
      signupError: {
        nameError: null,
        mobileNumberError: null,
        passwordError: null
      }
    };
  },
  methods: {
    login() {
      var me = this;
      if (
        !(this.loginInfo.mobileNumber && Number(this.loginInfo.mobileNumber)) ||
        !this.loginInfo.mobileNumber
      ) {
        alert("Please enter valid mobile number");
      } else if (!this.loginInfo.password) {
        alert("please enter password");
      } else {
        Api.login(me.loginInfo)
          .then(res => {
            me.$store.commit("saveUser", res.data.data);
            me.$router.push("/Home");
          })
          .catch(err => {
            console.log(err.response);
            alert(err.response.data.error);
          });
      }
    },
    signup() {
      var me = this;
      if (!this.signupInfo.name) {
        this.signupError.nameError = "Please enter name";
      } else if (
        !(
          this.signupInfo.mobileNumber && Number(this.signupInfo.mobileNumber)
        ) ||
        !this.signupInfo.mobileNumber
      ) {
        this.signupError.mobileNumberError = "Please enter valid mobile number";
      } else if (!this.signupInfo.password) {
        this.signupError.passwordError = "Please enter password";
      } else {
        this.signupInfo.mobileNumber = Number(this.signupInfo.mobileNumber);
        Api.signup(me.signupInfo)
          .then(res => {
            console.log(res);
            me.$store.commit("saveUser", res.data.data);
            me.$router.push("/Home");
          })
          .catch(err => {
            console.log(err.response);
            alert(err.response.data.error);
          });
      }
    }
  }
};
</script>

<style>

.toolbarText p {
  margin-bottom: 0px !important;
  color: white;
}
.cardtitle {
  font-size: 26px;
  font-weight: bold;
  text-align: left;
  padding-left: 0px;
}
.aboveTextField p {
  margin-bottom: 4px !important;
  color: white !important;
  font-size: 12px;
}
.toolbar .v-text-field.v-text-field--solo .v-input__control {
  min-height: 30px;
  padding: 0;
}
.card .v-text-field.v-text-field--solo .v-input__control {
  min-height: 40px;
  padding: 0;
}
.theme--light.v-text-field--outline > .v-input__control > .v-input__slot {
  border: 1px solid rgba(0, 0, 0, 0.54);
}
.v-text-field--outline > .v-input__control > .v-input__slot {
  background: white;
  border-radius: 1px;
}
</style>



