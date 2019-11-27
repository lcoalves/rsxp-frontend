// import external modules
import React, { Component } from 'react';
import NumberFormat from 'react-number-format';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { NavLink } from 'react-router-dom';
import { Motion, spring } from 'react-motion';
import { Card, CardBody, Row, Col, FormGroup, Button, Label } from 'reactstrap';
import { User, AtSign, Phone, Lock } from 'react-feather';

import classNames from 'classnames';

import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';

import { useSelector, useDispatch } from 'react-redux';
import { Creators as SignupActions } from '~/store/ducks/signup';

import logo from '~/assets/img/logo.png';

const formSchema = Yup.object().shape({
  username: Yup.string().required('O nome é obrigatório'),
  email: Yup.string()
    .email('Email inválido')
    .required('O email é obrigatório'),
  phone: Yup.string().required('O Celular é obrigatório'),
  password: Yup.string()
    .min(6, 'Senha muito curta')
    .required('A senha é obrigatória'),
});

class PhoneFormat extends Component {
  state = {
    value: '',
  };

  render() {
    return (
      <NumberFormat
        inputMode="decimal"
        displayType="input"
        format="(##)#####-####"
        allowNegative={false}
        value={this.state.value}
        onValueChange={vals => {
          this.setState({ value: vals.value });
        }}
        {...this.props}
      />
    );
  }
}

export default function Register() {
  const loading = useSelector(state => state.signup.loading);

  const dispatch = useDispatch();

  function handleSubmit(values) {
    const { username, email, phone, password } = values;

    dispatch(SignupActions.signupRequest(username, email, phone, password));
  }

  return (
    <div className="gradient-ibiza-sunset d-flex flex-column flex-1 p-0 flex-lg-row">
      <div className="fit min-full-height-vh color-overlay" />
      <div
        className="d-none d-lg-flex flex-column flex-grow-0 text-white width-70-per p-2 p-lg-5"
        style={{ zIndex: 1 }}
      >
        <img
          className="d-none d-lg-block fit width-125 mb-3"
          src={logo}
          alt="Logo UDF"
        />
        <Label className="d-none d-lg-block fit width-800 font-large-3 mb-3 line-height-1">
          Parabéns!
        </Label>
        <Label className="d-none d-lg-block fit width-700 font-medium-1">
          Lorem Ipsum has been the industry's standard dummy text ever since the
          1500s, when an unknown printer took a galley of type and scrambled it
          to make a type specimen book. It has survived not only five centuries,
          but also the leap into electronic typesetting, remaining essentially
          unchanged. It was popularised in the 1960s with the release of
          Letraset sheets containing Lorem Ipsum passages, and more recently
          with desktop publishing software like Aldus PageMaker including
          versions of Lorem Ipsum.
        </Label>
      </div>

      <Motion
        defaultStyle={{ x: +200, opacity: 0 }}
        style={{ x: spring(0), opacity: spring(1) }}
      >
        {style => (
          <Card
            style={{
              transform: `translateX(${style.x}px)`,
              opacity: style.opacity,
            }}
            className="fit min-full-height-vh m-2 m-lg-0 min-width-30-per rounded-0"
          >
            <CardBody className="d-flex flex-column justify-content-center">
              <Label className="font-medium-3 text-dark text-bold-400 text-center text-uppercase">
                Faça seu cadastro
              </Label>

              <Formik
                initialValues={{
                  entity_company: 'pf',
                  username: '',
                  email: '',
                  phone: '',
                  password: '',
                }}
                validationSchema={formSchema}
                onSubmit={values => handleSubmit(values)}
              >
                {({ errors, touched, handleChange, values }) => (
                  <Form className="pt-2">
                    <FormGroup>
                      <Label className="pl-2">Nome</Label>
                      <Col md="12" className="has-icon-left">
                        <Field
                          type="text"
                          placeholder="Enzo Oliveira"
                          name="username"
                          id="username"
                          className={`
                              form-control
                              new-form-padding
                              ${errors.username &&
                                touched.username &&
                                'is-invalid'}
                            `}
                        />
                        {errors.username && touched.username ? (
                          <div className="invalid-feedback">
                            {errors.username}
                          </div>
                        ) : null}
                        <div className="new-form-control-position">
                          <User size={14} color="#212529" />
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label className="pl-2">Email</Label>
                      <Col md="12" className="has-icon-left">
                        <Field
                          type="text"
                          placeholder="enzo@email.com"
                          name="email"
                          id="email"
                          className={`
                              form-control
                              new-form-padding
                              ${errors.email && touched.email && 'is-invalid'}
                            `}
                        />
                        {errors.email && touched.email ? (
                          <div className="invalid-feedback">{errors.email}</div>
                        ) : null}
                        <div className="new-form-control-position">
                          <AtSign size={14} color="#212529" />
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label className="pl-2">Celular</Label>
                      <Col md="12" className="has-icon-left">
                        <Field
                          name="phone"
                          id="phone"
                          className={`
                                    form-control
                                    new-form-padding
                                    ${errors.phone &&
                                      touched.phone &&
                                      'is-invalid'}
                                  `}
                          render={({ field }) => (
                            <PhoneFormat
                              {...field}
                              id="phone"
                              name="phone"
                              placeholder="(11) 98110-7819"
                              className={`
                                        form-control
                                        new-form-padding
                                        ${errors.phone &&
                                          touched.phone &&
                                          'is-invalid'}
                                      `}
                              value={values.phone}
                            />
                          )}
                        />
                        {errors.phone && touched.phone ? (
                          <div className="invalid-feedback">{errors.phone}</div>
                        ) : null}
                        <div className="new-form-control-position">
                          <Phone size={14} color="#212529" />
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Label className="pl-2">Senha</Label>
                      <Col md="12" className="has-icon-left">
                        <Field
                          type="password"
                          placeholder="mínimo de 6 caracteres"
                          name="password"
                          id="password"
                          className={`
                              form-control
                              new-form-padding
                              ${errors.password &&
                                touched.password &&
                                'is-invalid'}
                            `}
                        />
                        {errors.password && touched.password ? (
                          <div className="invalid-feedback">
                            {errors.password}
                          </div>
                        ) : null}
                        <div className="new-form-control-position">
                          <Lock size={14} color="#212529" />
                        </div>
                      </Col>
                    </FormGroup>
                    <FormGroup>
                      <Col md="12">
                        <Button
                          type="submit"
                          block
                          className="btn-default btn-raised"
                        >
                          {loading ? (
                            <BounceLoader
                              size={23}
                              color={'#fff'}
                              css={css`
                                display: block;
                                margin: 0 auto;
                              `}
                            />
                          ) : (
                            'Criar conta'
                          )}
                        </Button>
                      </Col>
                    </FormGroup>
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        )}
      </Motion>
    </div>
  );
}
