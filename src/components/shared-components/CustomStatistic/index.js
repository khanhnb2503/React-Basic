import React from "react";
import PropTypes from "prop-types";
import { animated, useSpring } from "react-spring";

const Value = (props) => {
  const data = useSpring({ total: props.loading ? 0 : props.value });
  let value;
  switch (props.size) {
    case "lg":
      value = (
        <animated.h2 className="mb-0 font-weight-bold">
          {data.total.to((x) => x.toFixed(0))}
        </animated.h2>
      );
      break;
    case "md":
      value = (
        <animated.h2 className="mb-0 font-weight-bold">
          {data.total.to((x) => x.toFixed(0))}
        </animated.h2>
      );
      break;
    case "sm":
      value = (
        <animated.h2 className="mb-0 font-weight-bold">
          {data.total.to((x) => x.toFixed(0))}
        </animated.h2>
      );
      break;
    default:
      value = (
        <animated.h2 className="mb-0 font-weight-bold">
          {data.total.to((x) => x.toFixed(0))}
        </animated.h2>
      );
  }
  return value;
};

export const CustomStatistic = (props) => {
  const { size, value, title, loading } = props;
  return (
    <div>
      <Value value={value} size={size} loading={loading} />
      <p className="mb-0 text-muted">{title}</p>
    </div>
  );
};

CustomStatistic.propTypes = {
  title: PropTypes.string,
  size: PropTypes.string,
  value: PropTypes.oneOfType([PropTypes.string, PropTypes.number]),
};

CustomStatistic.defaultProps = {
  size: "md",
};

export default CustomStatistic;
