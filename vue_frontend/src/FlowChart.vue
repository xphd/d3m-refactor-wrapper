<template>
<div>
    <h1>Flow Chart</h1>
    <VueFlowy :chart='chart'></VueFlowy>
    <!-- <button @click="requestFlowchart()">Get Flowchat</button> -->
</div>
</template>

<script>
import { VueFlowy, FlowChart } from "vue-flowy";
export default {
  name: "FlowChart",
  components: {
    VueFlowy
  },
  data: () => ({
    chart: new FlowChart(),
    steps: [],
    names: []
  }),
  sockets: {
    connect() {
      console.log("Client: Try to connect!");
      this.$socket.emit("requestFlowchart");
    },
    responseFlowchart: function(steps) {
      // console.log(data);
      this.steps = steps;
      this.steps.forEach(step => {
        let name = step["primitive"]["primitive"]["name"];
        this.names.push(name);
      });
      let names = this.names;
      let elements = [];
      for (var i = 0; i < names.length; i++) {
        let element = this.chart.addElement(i, { label: names[i] });
        elements.push(element);
      }
      // for (var i = 1; i < elements.length; i++) {
      //   elements[i - 1].leadsTo(elements[i]);
      // }
    }
  },
  mounted() {
    // const idea = this.chart.addElement("idea");
    // const A = this.chart.addElement("a", {
    //   label: "vscode"
    // });
    // const B = this.chart.addElement("b", {
    //   label: "github"
    // });
    // const C = this.chart.addElement("c", {
    //   label: "npm"
    // });
    // idea.leadsTo(A).leadsTo(B);
    // A.leadsTo(C);
  }
};
</script>

<style scoped>
</style>
