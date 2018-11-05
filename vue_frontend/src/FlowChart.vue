<template>
<div>
    <h1>Flow Chart</h1>
    <VueFlowy :chart='chart'></VueFlowy>
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
    chart: new FlowChart()
  }),
  mounted() {
    const idea = this.chart.addElement("idea");
    const A = this.chart.addElement("a", {
      label: "vscode"
    });
    const B = this.chart.addElement("b", {
      label: "github"
    });
    const C = this.chart.addElement("c", {
      label: "npm"
    });
    idea.leadsTo(A).leadsTo(B);
    A.leadsTo(C);
  }
};
</script>

<style scoped>
</style>
