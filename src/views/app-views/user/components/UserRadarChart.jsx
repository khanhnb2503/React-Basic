import React from "react";
import { Radar } from "react-chartjs-2";
import { COLOR_1, COLOR_1_LIGHT, COLOR_AXES } from "constants/ChartConstant";
import PropTypes from "prop-types";
import { useTranslation } from "../../../../hooks/useTranslation";

export function UserRadarChart(props) {
  const { t } = useTranslation();
  const { dataset, className } = props;
  const data = {
    labels: dataset.map((i) => i.name),
    datasets: [
      {
        label: t("Review"),
        backgroundColor: COLOR_1_LIGHT,
        borderWidth: 2,
        borderColor: COLOR_1,
        data: dataset.map((i) =>
          ((i.correct_answer / i.number_question) * 100).toFixed(2)
        ),
      },
    ],
  };

  const option = {
    responsive: true,
    scale: {
      ticks: {
        beginAtZero: true,
        max: 100,
      },
      gridLines: {
        color: COLOR_AXES,
      },
      angleLines: {
        color: COLOR_AXES,
      },
    },
  };

  return (
    <div className={className}>
      <Radar data={data} options={option} />
    </div>
  );
}

UserRadarChart.propTypes = {
  dataset: PropTypes.array.isRequired,
  className: PropTypes.string,
};

export default UserRadarChart;
