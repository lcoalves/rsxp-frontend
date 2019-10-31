import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Formik, Field, Form, FieldArray } from 'formik';

import CustomTabs from '~/components/tabs/default';
import ContentHeader from '~/components/contentHead/contentHeader';
import ContentSubHeader from '~/components/contentHead/contentSubHeader';
import {
  Card,
  CardBody,
  Row,
  Col,
  Button,
  Badge,
  Modal,
  ModalHeader,
  ModalBody,
  FormGroup,
  Label,
  ModalFooter,
} from 'reactstrap';

import { Map, RefreshCw, Edit, Navigation, Plus, X } from 'react-feather';

import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';

import OrderTable from './table';

import { Creators as DefaultEventActions } from '~/store/ducks/defaultEvent';

// Table example pages
export default function Groups({ className }) {
  const [modalAddOrder, setModalAddOrder] = useState(false);
  const [orders, setOrders] = useState([{}]);

  const data = useSelector(state => state.profile.data);
  const defaultData = useSelector(state => state.defaultEvent.data);
  const loading = useSelector(state => state.order.loading);
  const cepLoading = useSelector(state => state.cep.loading);

  const dispatch = useDispatch();

  function toggleModalAddOrder() {
    setModalAddOrder(!modalAddOrder);
  }

  function handleAddOrder(values) {
    console.tron.log(values);
  }

  useEffect(() => {
    const userData = {
      cmn_hierarchy_id: data.cmn_hierarchy_id,
      mu_hierarchy_id: data.mu_hierarchy_id,
      crown_hierarchy_id: data.crown_hierarchy_id,
      mp_hierarchy_id: data.mp_hierarchy_id,
      ffi_hierarchy_id: data.ffi_hierarchy_id,
      gfi_hierarchy_id: data.gfi_hierarchy_id,
      pg_hierarchy_id: data.pg_hierarchy_id,
    };

    dispatch(DefaultEventActions.organizatorEventRequest(userData));
  }, [data]);

  return (
    <>
      <ContentHeader>Pedidos</ContentHeader>
      <ContentSubHeader>Aqui você visualiza os seus pedidos.</ContentSubHeader>
      <Row className="row-eq-height">
        <Col sm="12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between">
                <Badge color="info" className="align-self-center">
                  Meus pedidos
                </Badge>
                <div>
                  <div className="d-none d-sm-none d-md-none d-lg-block">
                    <Button
                      color="success"
                      className="btn-raised mb-0 font-small-3"
                      onClick={toggleModalAddOrder}
                    >
                      <i className="fa fa-plus" /> Criar novo pedido
                    </Button>{' '}
                  </div>
                  <div>
                    <Link to="/eventos/grupo/criar">
                      <Button
                        color="success"
                        className="btn-raised mb-0 d-lg-none"
                      >
                        <i className="fa fa-plus" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <CustomTabs TabContent={<OrderTable data={data.orders} />} />
            </CardBody>
          </Card>
        </Col>
      </Row>

      <Modal
        isOpen={modalAddOrder}
        toggle={toggleModalAddOrder}
        className={className}
        size="lg"
      >
        <ModalHeader toggle={toggleModalAddOrder}>
          Inserir participante
        </ModalHeader>
        <ModalBody>
          <CardBody className="d-flex flex-column justify-content-center">
            <Formik
              enableReinitialize
              initialValues={{
                orders,
              }}
              onSubmit={values => handleAddOrder(values)}
            >
              {({ errors, touched, setFieldValue, values, handleChange }) => (
                <Form>
                  <FieldArray
                    name="orders"
                    render={({ remove, push }) => (
                      <>
                        {orders.length > 0 &&
                          orders.map((Order, index) => (
                            <div key={index}>
                              <Row className="justify-content-between">
                                <h3>Material {index + 1}</h3>
                                {orders.length > 1 && (
                                  <Button
                                    color="danger"
                                    onClick={() => remove(index)}
                                  >
                                    <X size={18} color="#fff" />
                                  </Button>
                                )}
                              </Row>
                              <Row>
                                <Col sm="4">
                                  <FormGroup>
                                    <Label for="default_event_id">Evento</Label>
                                    <div className="position-relative">
                                      <Field
                                        type="select"
                                        component="select"
                                        id="default_event_id"
                                        name="default_event_id"
                                        className={`
                                          form-control
                                          ${errors.type &&
                                            touched.type &&
                                            'is-invalid'}
                                        `}
                                        onChange={handleChange}
                                      >
                                        <option
                                          value=""
                                          defaultValue=""
                                          disabled=""
                                        >
                                          Selecione uma opção
                                        </option>
                                        {defaultData.map(event => (
                                          <option value={event.id}>
                                            {event.name}
                                          </option>
                                        ))}
                                      </Field>
                                    </div>
                                  </FormGroup>
                                </Col>
                              </Row>
                              {!!values.default_event_id && (
                                <Row className="align-items-center">
                                  <Col sm="12" md="12" lg="6" className="mb-2">
                                    {/* <FormGroup>
                                      <Label for="">
                                        Nome do líder assistente (opcional)
                                      </Label>
                                      <Field
                                        readOnly
                                        type="text"
                                        placeholder="Pesquise o líder assistente"
                                        name="aux_organizator_name"
                                        id="aux_organizator_name"
                                        onClick={toggleModalOrganizator}
                                        className="form-control"
                                      />
                                    </FormGroup> */}
                                    {console.tron.log(defaultData)}
                                  </Col>
                                </Row>
                              )}
                              <div className="form-actions right" />
                            </div>
                          ))}
                        <Button color="success" onClick={() => {}}>
                          <Plus size={16} color="#fff" /> Adicionar outro
                          mateiral
                        </Button>
                        <Row>
                          <Col sm="3">
                            <FormGroup>
                              <Label for="uf">Estado</Label>
                              <Field
                                readOnly
                                type="text"
                                id="uf"
                                name="uf"
                                className="form-control"
                              />
                            </FormGroup>
                          </Col>
                          <Col sm="6">
                            <FormGroup>
                              <Label for="city">Cidade</Label>
                              <Field
                                type="text"
                                disabled={cepLoading}
                                id="city"
                                name="city"
                                className={`
                                        form-control
                                        ${errors.city &&
                                          touched.city &&
                                          'is-invalid'}
                                      `}
                              />
                              {errors.city && touched.city ? (
                                <div className="invalid-feedback">
                                  {errors.city}
                                </div>
                              ) : null}
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm="6">
                            <FormGroup>
                              <Label for="street">Rua</Label>
                              <div className="position-relative has-icon-left">
                                <Field
                                  type="text"
                                  disabled={cepLoading}
                                  id="street"
                                  name="street"
                                  className={`
                                        form-control
                                        ${errors.street &&
                                          touched.street &&
                                          'is-invalid'}
                                      `}
                                />
                                {errors.street && touched.street ? (
                                  <div className="invalid-feedback">
                                    {errors.street}
                                  </div>
                                ) : null}
                                <div className="form-control-position">
                                  <i className="fa fa-road" />
                                </div>
                              </div>
                            </FormGroup>
                          </Col>
                          <Col sm="2">
                            <FormGroup>
                              <Label for="street_number">Número</Label>
                              <div className="position-relative has-icon-left">
                                <Field
                                  type="text"
                                  id="street_number"
                                  name="street_number"
                                  className={`
                                        form-control
                                        ${errors.street_number &&
                                          touched.street_number &&
                                          'is-invalid'}
                                      `}
                                />
                                {errors.street_number &&
                                touched.street_number ? (
                                  <div className="invalid-feedback">
                                    {errors.street_number}
                                  </div>
                                ) : null}
                                <div className="form-control-position">
                                  <Navigation size={14} color="#212529" />
                                </div>
                              </div>
                            </FormGroup>
                          </Col>
                          <Col sm="4">
                            <FormGroup>
                              <Label for="neighborhood">Bairro</Label>
                              <div className="position-relative has-icon-left">
                                <Field
                                  type="text"
                                  disabled={cepLoading}
                                  id="neighborhood"
                                  name="neighborhood"
                                  className={`
                                        form-control
                                        ${errors.neighborhood &&
                                          touched.neighborhood &&
                                          'is-invalid'}
                                      `}
                                />
                                {errors.neighborhood && touched.neighborhood ? (
                                  <div className="invalid-feedback">
                                    {errors.neighborhood}
                                  </div>
                                ) : null}
                                <div className="form-control-position">
                                  <i className="fa fa-map-signs" />
                                </div>
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                        <Row>
                          <Col sm="12" md="6" lg="6">
                            <FormGroup>
                              <Label for="complement">Complemento</Label>
                              <div className="position-relative has-icon-left">
                                <Field
                                  type="text"
                                  id="complement"
                                  name="complement"
                                  className="form-control"
                                />
                                <div className="form-control-position">
                                  <Edit size={14} color="#212529" />
                                </div>
                              </div>
                            </FormGroup>
                          </Col>
                          <Col sm="12" md="6" lg="6">
                            <FormGroup>
                              <Label for="receiver">Recebedor</Label>
                              <div className="position-relative has-icon-left">
                                <Field
                                  type="text"
                                  id="receiver"
                                  name="receiver"
                                  className="form-control"
                                />
                                <div className="form-control-position">
                                  <Edit size={14} color="#212529" />
                                </div>
                              </div>
                            </FormGroup>
                          </Col>
                        </Row>
                      </>
                    )}
                  />
                  <ModalFooter>
                    <Button
                      className="ml-1 my-1"
                      color="danger"
                      onClick={toggleModalAddOrder}
                    >
                      Cancelar
                    </Button>{' '}
                    {loading ? (
                      <Button
                        disabled
                        block
                        className="ml-1 my-1 btn-secondary"
                      >
                        <BounceLoader
                          size={23}
                          color={'#fff'}
                          css={css`
                            display: block;
                            margin: 0 auto;
                          `}
                        />
                      </Button>
                    ) : (
                      <Button
                        type="submit"
                        block
                        className="ml-1 my-1 btn-success"
                      >
                        Criar novo pedido
                      </Button>
                    )}
                  </ModalFooter>
                </Form>
              )}
            </Formik>
          </CardBody>
        </ModalBody>
      </Modal>
    </>
  );
}
