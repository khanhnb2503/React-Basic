import React, { useEffect, useMemo, useState } from "react";
import Chart from "react-apexcharts";
import {
  COLOR_1,
  COLOR_2,
  COLOR_3,
  COLOR_4,
  COLOR_5,
} from "constants/ChartConstant";
import moment from "moment";
import { useTranslation } from "../../../../hooks/useTranslation";

function RankingStatistic({ rankData, units, type, loading }) {
  const { t } = useTranslation();
  const unitsData = useMemo(
    () => units.map((unit) => ({ name: unit.label, data: [] })),
    [units]
  );
  const [series, setSeries] = useState(unitsData);
  const options = {
    chart: {
      toolbar: {
        show: false,
      },
    },
    plotOptions: {
      bar: {
        horizontal: false,
        columnWidth: "55%",
        endingShape: "rounded",
      },
    },
    colors: [COLOR_1, COLOR_2, COLOR_3, COLOR_4, COLOR_5, "#979797"].splice(
      0,
      units.length
    ),
    dataLabels: {
      enabled: false,
    },
    stroke: {
      show: true,
      width: 2,
      colors: ["transparent"],
    },
    xaxis: {
      categories: Array.from(new Array(12)).map((_, index) =>
        moment(`2022-${index + 1}-01`).format("MMM")
      ),
    },
    fill: {
      opacity: 1,
    },
    tooltip: {
      y: {
        formatter: (val) => (type === t("Rank") ? `${val} 人` : `${val}h`),
      },
    },
    noData: {
      text: loading ? "Loading ..." : undefined,
      align: "center",
      verticalAlign: "middle",
      offsetX: 0,
      offsetY: 0,
      style: {
        color: undefined,
        fontSize: "14px",
        fontFamily: undefined,
      },
    },
    labels: units.map((i) => i.label),
  };

  useEffect(() => {
    if (rankData) {
      let convertData = [];
      if (type === t("Rank")) {
        convertData = units.map((rankType) => {
          const data = rankData.map((item) => item.rank[rankType.key]);
          return {
            rank: rankType.label,
            data,
          };
        });
      }
      if (type === t("Usage time")) {
        convertData = units.map((rankType) => {
          const data = rankData.map(
            (item) => (item[rankType.key] / 3600).toFixed(2) || 0
          );
          return {
            rank: rankType.label,
            data,
          };
        });
      }
      setSeries(convertData);
    }
  }, [rankData, type, units, loading]);
  return <Chart options={options} series={series} height={300} type="bar" />;
}

export default RankingStatistic;
