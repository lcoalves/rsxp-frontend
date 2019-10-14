import React, { Component } from "react";
import PropTypes from "prop-types";
import { NavLink, withRouter } from "react-router-dom";
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
  CardFooter,
  CardImg
} from "reactstrap";

import { css } from "@emotion/core";
import { BounceLoader } from "react-spinners";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Creators as ResetPasswordActions } from "../../store/ducks/resetPassword";

import logo from "../../assets/img/logo-big.png";

const formSchema = Yup.object().shape({
  email_cpf_cnpj: Yup.string().required("O usuário é obrigatório")
});

class ExpiredPassword extends Component {
  static propTypes = {
    error: PropTypes.bool.isRequired,
    loading: PropTypes.bool.isRequired,
    resetPasswordRequest: PropTypes.func.isRequired
  };

  handleSubmit = async values => {
    const { email_cpf_cnpj } = values;
    const { resetPasswordRequest } = this.props;

    resetPasswordRequest(email_cpf_cnpj);
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
                    email_cpf_cnpj: ""
                  }}
                  validationSchema={formSchema}
                  onSubmit={values => this.handleSubmit(values)}
                >
                  {({ errors, touched }) => (
                    <Form className="mt-4">
                      <FormGroup>
                        <Label className="pl-2">Digite seu usuário</Label>
                        <Col md="12">
                          <Field
                            type="text"
                            name="email_cpf_cnpj"
                            id="email_cpf_cnpj"
                            placeholder="pode ser e-mail, CPF ou CNPJ"
                            className={`
                            form-control
                            ${errors.email_cpf_cnpj &&
                              touched.email_cpf_cnpj &&
                              "is-invalid"}
                          `}
                          />
                          {errors.email_cpf_cnpj && touched.email_cpf_cnpj ? (
                            <div className="invalid-feedback">
                              {errors.email_cpf_cnpj}
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
                                "Solicitar nova senha"
                              )}
                            </Button>
                          </div>
                        </Col>
                      </FormGroup>
                    </Form>
                  )}
                </Formik>
              </CardBody>
              <CardFooter>
                <div className="float-left black">
                  <NavLink exact className="text-dark" to="/">
                    Login
                  </NavLink>
                </div>
                <div className="float-right black">
                  <NavLink exact className="text-dark" to="/cadastro">
                    Cadastrar-se
                  </NavLink>
                </div>
              </CardFooter>
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
  )(ExpiredPassword)
);
