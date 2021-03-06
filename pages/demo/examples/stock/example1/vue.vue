<template>
  <div v-if="data.length">
    <v-chart :force-fit="true" :height="400" :animate="false" :padding="[ 10, 40, 40, 40 ]" :data="dv" :scale="scale1">
      <v-tooltip :show-title="tooltipOpts.showTitle" :item-tpl="tooltipOpts.itemTpl" />
      <v-axis />
      <v-legend :offset="20" />
      <v-view :data="dv" :end="{x: 1, y: 0.5}">
        <v-candle position="time*range" :color="candleOpts.color" :tooltip="candleOpts.tooltip" />
      </v-view>
      <v-view :data="dv" :scale="scale2" :start="{x: 0, y: 0.65}">
        <v-axis dataKey="time" :tick-line="null" :label="null" />
        <v-axis dataKey="volumn" :label="axis1Opts.label" />
        <v-bar position="time*volumn" :color="barOpts.color" :tooltip="barOpts.tooltip" />
      </v-view>
    </v-chart>
    <v-plugin>
      <v-slider width="auto" :height="26" :padding="[ 20, 40, 20, 40 ]"
        :start="start" :end="end"
        :data="data" xAxis="time" yAxis="volumn" :scales="{
          time: {
            type: 'timeCat',
            nice: false,
          }
        }" :on-change="slideChange" />
    </v-plugin>
  </div>
</template>

<script>
import * as $ from 'jquery';
const DataSet = require('@antv/data-set');

const scale1 = [{
  dataKey: 'time',
  type: 'timeCat',
  nice: false,
  range: [ 0, 1 ]
}, {
  dataKey: 'trend',
  values: [ '上涨', '下跌' ],
}, {
  dataKey: 'volumn',
  alias: '成交量'
}, {
  dataKey: 'start',
  alias: '开盘价'
}, {
  dataKey: 'end',
  alias: '收盘价'
}, {
  dataKey: 'max',
  alias: '最高价'
}, {
  dataKey: 'min',
  alias: '最低价'
}, {
  dataKey: 'range',
  alias: '股票价格'
}];

const scale2 = [{
  dataKey: 'volumn',
  tickCount: 2
}];

const tooltipOpts = {
  showTitle: false,
  itemTpl: '<li data-index={index}>'
  + '<span style="background-color:{color};" class="g2-tooltip-marker"></span>'
  + '{name}{value}</li>',
};

const candleOpts = {
  color: ['trend', val => {
    if (val === '上涨') {
      return '#f04864';
    }

    if (val === '下跌') {
      return '#2fc25b';
    }
  }],
  tooltip: ['time*start*end*max*min', (time, start, end, max, min) => {
    return {
      name: time,
      value: '<br><span style="padding-left: 16px">开盘价：' + start + '</span><br/>'
      + '<span style="padding-left: 16px">收盘价：' + end + '</span><br/>'
      + '<span style="padding-left: 16px">最高价：' + max + '</span><br/>'
      + '<span style="padding-left: 16px">最低价：' + min + '</span>'
    };
  }],
};

const axis1Opts = {
  label: {
    formatter: val => {
      return parseInt(String(val / 1000), 10) + 'k';
    }
  }
};

const barOpts = {
  color: ['trend',  val => {
    if (val === '上涨') {
      return '#f04864';
    }

    if (val === '下跌') {
      return '#2fc25b';
    }
  }],
  tooltip: ['time*volumn', (time, volumn) => {
    return {
      name: time,
      value: '<br/><span style="padding-left: 16px">成交量：' + volumn + '</span><br/>'
    };
  }]
};

export default {
  mounted() {
    $.getJSON('/assets/data/candle-sticks.json', (sourceData) => {
      this.$data.data = sourceData;
      this.$data.dv = this.getData();
    });
  },
  methods: {
    getData() {
      const { start,end, data } = this;
      const ds = new DataSet({
        state: {
          start,
          end,
        }
      });
      const dv = ds.createView();
      dv.source(data)
        .transform({
          type: 'filter',
          callback: obj => {
            const date = obj.time;
            return date <= end && date >= start;
          }
        })
        .transform({
          type: 'map',
          callback: obj => {
            obj.trend = (obj.start <= obj.end) ? '上涨' : '下跌';
            obj.range = [ obj.start, obj.end, obj.max, obj.min ];
            return obj;
          }
        });
      return dv;
    },
    slideChange (opts) {
      this.start = opts.startText;
      this.end = opts.endText;
      this.dv = this.getData();
    },
  },
  data() {
    return {
      data: [],
      scale1,
      scale2,
      dv: [],
      start: '2015-07-07',
      end: '2015-07-28',
      tooltipOpts,
      candleOpts,
      axis1Opts,
      barOpts,
    };
  },
};

</script>
