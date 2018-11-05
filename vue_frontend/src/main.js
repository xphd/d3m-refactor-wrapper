import Vue from "vue";
import App from "./App.vue";
import VueSocketio from "vue-socket.io";

Vue.use(VueSocketio, "http://localhost:9090");

new Vue({
  el: "#app",
  render: h => h(App)
});
