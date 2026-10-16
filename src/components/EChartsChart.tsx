"use client";

import dynamic from "next/dynamic";
import type { EChartsOption } from "echarts";

const ReactECharts = dynamic(() => import("echarts-for-react"), {
  ssr: false,
});

type EChartsChartProps = {
  option: EChartsOption;
  height?: number;
};

export default function EChartsChart({
  option,
  height = 400,
}: EChartsChartProps) {
  return (
    <ReactECharts
      option={option}
      style={{ height: `${height}px`, width: "100%" }}
      notMerge={true}
      lazyUpdate={true}
    />
  );
}
