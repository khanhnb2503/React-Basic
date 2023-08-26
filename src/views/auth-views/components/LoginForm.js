import React, { useEffect, useCallback, useState } from "react";
import { connect } from "react-redux";
import { Button, Form, Input } from "antd";
import { MailOutlined, LockOutlined } from "@ant-design/icons";
import PropTypes from "prop-types";
import JwtAuthService from "services/JwtAuthService";
import { useHistory } from "react-router-dom";
import { USER, AUTH_TOKEN } from "constants/consts";
import { useTranslation } from "../../../hooks/useTranslation";
import { REGEX } from "../../../constants/patterns";
export const LoginForm = (props) => {
  const { t } = useTranslation();
  let history = useHistory();
  const [error, setError] = useState("");

  const {
    showForgetPassword,
    onForgetPasswordClick,
    extra,
    token,
    redirect,
    allowRedirect,
  } = props;

  const handleLogin = useCallback(
    (values, actions) => {
      JwtAuthService.login(values)
        .then((response) => {
          localStorage.setItem(USER, JSON.stringify(response.data.infor));
          localStorage.setItem(AUTH_TOKEN, response.data.accessToken);
          window.location.reload();
        })
        .catch((err) => {
          console.log("err", err);
          setError(
            err.data?.message ? err.data.message : t("Something when wrong")
          );
        });
    },
    // eslint-disable-next-line
    [setError]
  );

  useEffect(() => {
    if (token !== null && allowRedirect) {
      history.push(redirect);
    }
    if (error) {
      setTimeout(() => {
        setError("");
      }, 3000);
    }
    // eslint-disable-next-line
  }, [token, allowRedirect, error]);
  return (
    <>
      <Form layout="vertical" name="login-form" onFinish={handleLogin}>
        <Form.Item
          name="email"
          label="Email"
          rules={[
            {
              required: true,
              message: t("Please input your {name}", { name: t("email") }),
            },
            {
              type: "email",
              message: t("Please enter a validate {name}", {
                name: t("email"),
              }),
            },
          ]}
        >
          <Input prefix={<MailOutlined className="text-primary" />} />
        </Form.Item>
        <Form.Item
          name="password"
          label={
            <div
              className={`${
                showForgetPassword
                  ? "d-flex justify-content-between w-100 align-items-center"
                  : ""
              }`}
            >
              <span>Password</span>
              {showForgetPassword && (
                <span
                  onClick={() => onForgetPasswordClick}
                  className="cursor-pointer font-size-sm font-weight-normal text-muted"
                >
                  {t("Forget Password?")}
                </span>
              )}
            </div>
          }
          rules={[
            {
              required: true,
              message: t("Please input your {name}", { name: t("password") }),
            },
            {
              pattern: REGEX.PASSWORD,
              message: t("Please enter a validate {name}", {
                name: t("password"),
              }),
            },
          ]}
        >
          <Input.Password prefix={<LockOutlined className="text-primary" />} />
        </Form.Item>
        <Form.Item>
          <Button type="primary" htmlType="submit" block>
            {t("Sign In")}
          </Button>
        </Form.Item>
        {extra}
      </Form>
    </>
  );
};

LoginForm.propTypes = {
  otherSignIn: PropTypes.bool,
  showForgetPassword: PropTypes.bool,
  extra: PropTypes.oneOfType([PropTypes.string, PropTypes.element]),
};

LoginForm.defaultProps = {
  otherSignIn: true,
  showForgetPassword: false,
};

const mapStateToProps = ({ auth }) => {
  const { token, redirect } = auth;
  return { token, redirect };
};

const mapDispatchToProps = {};

export default connect(mapStateToProps, mapDispatchToProps)(LoginForm);
