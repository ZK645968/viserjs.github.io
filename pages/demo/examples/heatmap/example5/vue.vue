<template>
  <div>
    <v-chart :forceFit="true" :height="height" :data="data">
      <v-legend :offset="40" />
      <v-axis />
      <v-tooltip :showTitle="false" />
      <v-polygon :position="seriesOpts.position" :color="seriesOpts.color" />
    </v-chart>
  </div>
</template>

<script>
import * as $ from 'jquery';
const DataSet = require('@antv/data-set');

const seriesOpts = {
  quickType: 'polygon',
  color: ['count', [ '#BAE7FF', '#1890FF', '#0050B3' ]],
  position: 'x*y',
};

export default {
  mounted() {
    $.getJSON('/assets/data/heatmap-5.json', (sourceData) => {
      const dv = new DataSet.View().source(sourceData);
      dv.transform({
        type: 'bin.rectangle',
        fields: ['carat', 'price'],
      });
      this.$data.data = dv.rows;
    });
  },
  data() {
    return {
      data: [],
      height: 400,
      seriesOpts,
    };
  },
};
</script>
