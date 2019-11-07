// import external modules
import React, { Component, useState, useEffect } from 'react';
import { Formik, Field, Form } from 'formik';
import * as Yup from 'yup';
import { NavLink } from 'react-router-dom';
import { Motion, spring } from 'react-motion';
import NumberFormat from 'react-number-format';
import { Card, CardBody, Row, Col, FormGroup, Button, Label } from 'reactstrap';
import { RefreshCw, User } from 'react-feather';

import { format } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';

import { validateCPF } from '~/services/validateCPF';

import { useSelector, useDispatch } from 'react-redux';
import { Creators as EventActions } from '~/store/ducks/event';
import { Creators as ParticipantActions } from '~/store/ducks/participant';
import { Creators as InviteActions } from '~/store/ducks/invite';

import logo from '~/assets/img/logo-big.png';

const formSchema = Yup.object().shape({
  cpf: Yup.string().required('O CPF é obrigatório'),
});

class CpfFormat extends Component {
  state = {
    value: '',
  };

  render() {
    return (
      <NumberFormat
        inputMode="decimal"
        displayType="input"
        format="###.###.###-##"
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

export default function Login({ match }) {
  const [invite, setInvite] = useState(null);
  const [participant, setParticipant] = useState(null);

  const event = useSelector(state => state.event.data);
  const participantData = useSelector(state => state.participant.data);
  const loading = useSelector(state => state.participant.loading);

  const dispatch = useDispatch();

  function handleSearchCpf(cpf) {
    setParticipant(null);

    const formattedCpf = cpf
      .replace('.', '')
      .replace('.', '')
      .replace('-', '');

    if (formattedCpf.length === 11) {
      dispatch(
        ParticipantActions.searchParticipantRequest(
          formattedCpf,
          event.defaultEvent.id
        )
      );
    }
  }

  function handleManyOrganizators() {
    const last = event.organizators.length - 1;
    const antLast = event.organizators.length - 2;

    const organizators = event.organizators.map((organizator, index) => {
      if (last === index) {
        return organizator.name;
      } else if (antLast === index) {
        return `${organizator.name} e `;
      } else {
        return `${organizator.name}, `;
      }
    });

    return `pelos líderes ${organizators.join('')} `;
  }

  function handleSubmit() {
    const data = {
      invite_id: parseInt(match.params.id),
      entity_id: participant.id,
      event_id: parseInt(match.params.event_id),
      assistant: false,
    };

    console.tron.log(data);
    dispatch(InviteActions.confirmInviteRequest(data));
  }

  useEffect(() => {
    if (event !== null) {
      const invite = event.invites.find(
        invite => invite.id === parseInt(match.params.id)
      );

      setInvite(invite);
    }
  }, [event]);

  useEffect(() => {
    if (participantData !== null) {
      setParticipant(participantData);
    }
  }, [participantData]);

  useEffect(() => {
    dispatch(EventActions.eventRequest(match.params.event_id));
  }, []);

  return (
    <div className="bg-static-pages-image d-flex flex-column flex-1 p-0 flex-lg-row">
      <div className="fit min-full-height-vh color-overlay" />
      {event !== null && invite !== null && (
        <>
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
              {event.defaultEvent.name}
            </Label>
            <Label className="d-none d-lg-block fit width-700 font-medium-1">
              Olá {invite.name}, você foi convidado{' '}
              {event.organizators.length === 1 &&
                `pelo líder ${event.organizators[0].name}`}
              {event.organizators.length > 1 && handleManyOrganizators()}
              para participar do {event.defaultEvent.name}. O início do curso
              será dia{' '}
              <u>
                {format(
                  new Date(event.start_date),
                  "d 'de' MMMM 'de' y',' iiii 'às' p BBBB",
                  {
                    locale: ptBR,
                  }
                )}
              </u>
              .
            </Label>
            <Label className="d-none d-lg-block fit width-700 font-medium-1">
              {event.defaultEvent.description}
            </Label>
            <Label className="d-none d-lg-block fit width-700 font-medium-1">
              Confirme sua inscrição ao lado!
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
                    Confirmação de convite
                  </Label>

                  <Formik
                    initialValues={{
                      cpf: '',
                    }}
                    validationSchema={formSchema}
                    onSubmit={() => handleSubmit()}
                  >
                    {({ errors, touched, values }) => (
                      <Form className="pt-2">
                        <FormGroup>
                          <Row>
                            <Col sm="12">
                              <Label className="pl-2" for="cpf">
                                Digite seu CPF
                              </Label>
                              <div className="position-relative has-icon-right">
                                <Field
                                  name="cpf"
                                  id="cpf"
                                  className={`
                                    new-form-padding
                                    form-control
                                    ${errors.cpf && touched.cpf && 'is-invalid'}
                                  `}
                                  validate={validateCPF}
                                  render={({ field }) => (
                                    <CpfFormat
                                      {...field}
                                      id="cpf"
                                      name="cpf"
                                      placeholder="Ex: 423.123.321-12"
                                      className={`
                                        new-form-padding
                                        form-control
                                        ${errors.cpf &&
                                          touched.cpf &&
                                          'is-invalid'}
                                      `}
                                      value={values.cpf}
                                      onValueChange={val =>
                                        handleSearchCpf(val.value)
                                      }
                                    />
                                  )}
                                />
                                {errors.cpf && touched.cpf ? (
                                  <div className="invalid-feedback">
                                    {errors.cpf}
                                  </div>
                                ) : null}
                                {loading && (
                                  <div className="new-form-control-position">
                                    <RefreshCw size={16} className="spinner" />
                                  </div>
                                )}
                              </div>
                            </Col>

                            {!!values.cpf && participant !== null && (
                              <Col sm="12" className="mt-2">
                                <Label>Nome</Label>
                                <div className="position-relative has-icon-left">
                                  <Field
                                    readOnly
                                    type="text"
                                    name="name"
                                    id="name"
                                    value={participant.name}
                                    className="new-form-padding form-control"
                                    autoComplete="off"
                                  />
                                  <div className="new-form-control-position">
                                    <User size={14} color="#212529" />
                                  </div>
                                </div>
                              </Col>
                            )}
                          </Row>
                        </FormGroup>
                        <FormGroup>
                          <Row>
                            <Col md="12">
                              <Button
                                disabled={!!values.cpf ? false : true}
                                type="submit"
                                block
                                className={
                                  !!values.cpf
                                    ? 'btn-default btn-raised'
                                    : 'btn-secondary btn-raised'
                                }
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
                                  'Quero participar!'
                                )}
                              </Button>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Form>
                    )}
                  </Formik>
                </CardBody>
              </Card>
            )}
          </Motion>
        </>
      )}
    </div>
  );
}
