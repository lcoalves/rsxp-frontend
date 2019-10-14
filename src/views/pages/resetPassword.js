import React, { Component } from "react";
import PropTypes from "prop-types";
import { withRouter } from "react-router-dom";

import { Formik, Field, Form } from "formik";
import * as Yup from "yup";
import {
  Row,
  Col,
  FormGroup,
  Label,
  Button,
  Card,
  CardBody,
  CardImg
} from "reactstrap";

import { css } from "@emotion/core";
import { BounceLoader } from "react-spinners";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Creators as ResetPasswordActions } from "../../store/ducks/resetPassword";

import logo from "../../assets/img/logo-big.png";

const formSchema = Yup.object().shape({
  password: Yup.string()
    .min(6, "Senha muito curta")
    .required("A senha é obrigatória")
});

class ResetPassword extends Component {
  static propTypes = {
    error: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    confirmResetPasswordRequest: PropTypes.func.isRequired
  };

  handleSubmit = async values => {
    const { password } = values;
    const { confirmResetPasswordRequest, match } = this.props;

    confirmResetPasswordRequest(match.params.token, password);
  };

  render() {
    const { loading } = this.props;

    return (
      <div className="container-fluid">
        <Row className="full-height-vh">
          <Col
            xs="12"
            className="d-flex align-items-center justify-content-center gradient-blue-grey-blue"
          >
            <Card className="width-400">
              <CardBody>
                <CardImg
                  center
                  alt="Logo UDF"
                  className="d-block mx-auto width-100 img-fluid"
                  src={logo}
                />
                <Formik
                  initialValues={{
                    password: ""
                  }}
                  validationSchema={formSchema}
                  onSubmit={values => this.handleSubmit(values)}
                >
                  {({ errors, touched }) => (
                    <Form className="mt-4">
                      <FormGroup>
                        <Label className="pl-2">Digite a nova senha</Label>
                        <Col md="12">
                          <Field
                            type="password"
                            name="password"
                            id="password"
                            placeholder="insira a nova senha aqui..."
                            className={`
                            form-control
                            ${errors.password &&
                              touched.password &&
                              "is-invalid"}
                          `}
                          />
                          {errors.password && touched.password ? (
                            <div className="invalid-feedback">
                              {errors.password}
                            </div>
                          ) : null}
                        </Col>
                      </FormGroup>
                      <FormGroup className="mt-2">
                        <Col md="12">
                          <div className="text-center">
                            <Button
                              type="submit"
                              color="default"
                              block
                              className="btn-default btn-raised"
                            >
                              {loading ? (
                                <BounceLoader
                                  size={23}
                                  color={"#fff"}
                                  css={css`
                                    display: block;
                                    margin: 0 auto;
                                  `}
                                />
                              ) : (
                                "Confirmar nova senha"
                              )}
                            </Button>
                          </div>
                        </Col>
                      </FormGroup>
                    </Form>
                  )}
                </Formik>
              </CardBody>
            </Card>
          </Col>
        </Row>
      </div>
    );
  }
}

const mapStateToProps = state => ({
  error: state.resetPassword.error,
  loading: state.resetPassword.loading
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(ResetPasswordActions, dispatch);

export default withRouter(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ResetPassword)
);
