<template>
  <v-app>
    <v-toolbar fixed dark class="elevation-0 toolbar" height="45px" color="#48649f">
      <v-layout
        class="hometoolbar mr-3"
        row
        style="justify-content: flex-end;padding: 16px 12px 0px 0px;"
      >
        <v-avatar class="mr-3" size="25px">
          <img src="https://cdn.vuetifyjs.com/images/john.jpg" alt="John">
        </v-avatar>
        <p class="mr-3">{{userInfo.name}}</p>
        <hr class="mr-3">
        <p @click="$router.push('/home')" class="mr-3">Home</p>
        <hr class="mr-3">
        <p @click="$router.push('/myposts')" class="mr-3">My Posts</p>
        <hr class="mr-3">
        <img src="../assets/notification_unselect.svg" width="20px" height="20px">
        <hr class="mr-3">
        <p @click="logout()" class="mr-3">Log out</p>
      </v-layout>
    </v-toolbar>
    <v-content style="background-color:#e9ebee">
      <router-view></router-view>
    </v-content>
  </v-app>
</template>

<script>
export default {
  data() {
    return {
      userInfo: this.$store.state.user
    };
  },
  methods: {
    logout() {
      this.$store.commit("logout");
      this.$router.push("/");
    }
  }
};
</script>

<style>

</style>


