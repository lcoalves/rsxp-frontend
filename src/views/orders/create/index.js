import React, { useState, useEffect, Fragment, Component } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Formik, Field, Form, FieldArray, useFormik } from 'formik';
import NumberFormat from 'react-number-format';
import { Datepicker } from 'react-formik-ui';

import { Map, RefreshCw, Edit, Navigation, Plus, X } from 'react-feather';

import { validateCPF } from '~/services/validateCPF';
import { validateCNPJ } from '~/services/validateCNPJ';

import * as Yup from 'yup';
import 'react-table/react-table.css';

import { subMonths } from 'date-fns';

import ContentHeader from '~/components/contentHead/contentHeader';

import {
  Row,
  Col,
  Button,
  FormGroup,
  Card,
  CardBody,
  Label,
  ModalFooter,
  Modal,
  ModalHeader,
  ModalBody,
  Table,
} from 'reactstrap';

import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';

import { Creators as OrganizationActions } from '~/store/ducks/organization';
import { Creators as OrganizatorActions } from '~/store/ducks/organizator';
import { Creators as CepActions } from '~/store/ducks/cep';
import { Creators as DefaultEventActions } from '~/store/ducks/defaultEvent';
import { Creators as EventActions } from '~/store/ducks/event';

const formDetails = Yup.object().shape({
  organizator_name: Yup.string().required('O líder é obrigatório'),
  organization_name: Yup.string().required('A Igreja é obrigatória'),
  initial_date: Yup.string().required('A data inicial é obrigatória'),
  default_event_id: Yup.string().required('Tipo do grupo é obrigatório'),
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

class CnpjFormat extends Component {
  state = {
    value: '',
  };

  render() {
    return (
      <NumberFormat
        inputMode="decimal"
        displayType="input"
        format="##.###.###/####-##"
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

class CepFormat extends Component {
  state = {
    value: '',
  };

  render() {
    return (
      <NumberFormat
        inputMode="decimal"
        displayType="input"
        format="#####-###"
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

export default function GroupCreate({ match, className }) {
  const [dataProducts, setDataProducts] = useState([]);
  const [kit, setKit] = useState({
    default_event_id: '',
    products: [],
  });

  const [modalAddMaterial, setModalAddMaterial] = useState(false);
  const [orders, setOrders] = useState([
    {
      default_event_id: '',
      products: [
        {
          id: null,
          quantity: 0,
        },
      ],
    },
  ]);
  const [defaultSelected, setDefaultSelected] = useState(null);

  const data = useSelector(state => state.profile.data);
  const defaultData = useSelector(state => state.defaultEvent.data);
  const loading = useSelector(state => state.order.loading);
  const cepLoading = useSelector(state => state.cep.loading);

  const dispatch = useDispatch();

  function toggleModalAddMaterial() {
    setModalAddMaterial(!modalAddMaterial);
  }

  function toggleModalAddMaterialClose() {
    setModalAddMaterial(false);
  }

  function handleSelectedDefaultEvent(event, setFieldValue) {
    const { name, value } = event.target;

    if (value === '') {
      setKit({ default_event_id: value, products: [] });
    } else {
      const eventData = defaultData.find(event => event.id === parseInt(value));

      setKit({
        default_event_id: value,
        products: eventData.kit.products.map(product => {
          return {
            id: product.id,
            name: product.name,
            unit_price: product.unit_price,
            quantity: 0,
          };
        }),
      });
    }
  }

  function handleAddMaterial(values) {
    const products = values.products.filter(product => product.quantity > 0);
    const auxDataProducts = dataProducts;

    console.tron.log(auxDataProducts);

    if (auxDataProducts.length > 0) {
      products.map(product => {
        auxDataProducts.forEach((dataProduct, index) => {
          if (product.id === auxDataProducts.id) {
            auxDataProducts[index] = product;
            console.tron.log(auxDataProducts);
          } else {
            setDataProducts([...dataProducts, product]);
          }
        });
      });
    } else {
      setDataProducts([...dataProducts, ...products]);
    }

    setModalAddMaterial(false);
  }

  function handleAddOrder() {}

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
  }, []);

  return (
    defaultData !== null && (
      <Fragment>
        <ContentHeader>Criar pedido</ContentHeader>
        <Card>
          <CardBody className="d-flex flex-column justify-content-center">
            <Formik
              enableReinitialize
              initialValues={{
                orders,
              }}
              onSubmit={values => handleAddOrder(values)}
            >
              {({ errors, touched, values, handleChange, setFieldValue }) => (
                <Form>
                  <h4 className="form-section">Adicionar material</h4>
                  <Button
                    className="mb-2"
                    color="success"
                    onClick={toggleModalAddMaterial}
                  >
                    Adicionar material
                  </Button>

                  <Table striped>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nome produto</th>
                        <th>Preço</th>
                        <th>Quantidade</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataProducts.map(product => (
                        <tr>
                          <th scope="row">{product.id}</th>
                          <td>{product.name}</td>
                          <td>{product.unit_price}</td>
                          <td>{product.quantity}</td>
                        </tr>
                      ))}
                    </tbody>
                  </Table>

                  <h4 className="form-section">Endereço</h4>
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
                            ${errors.city && touched.city && 'is-invalid'}
                          `}
                        />
                        {errors.city && touched.city ? (
                          <div className="invalid-feedback">{errors.city}</div>
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
                              ${errors.street && touched.street && 'is-invalid'}
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
                          {errors.street_number && touched.street_number ? (
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
                  <ModalFooter>
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
        </Card>

        <Modal
          isOpen={modalAddMaterial}
          toggle={toggleModalAddMaterialClose}
          className={className}
          size="lg"
        >
          <ModalHeader toggle={toggleModalAddMaterialClose}>
            Adicionar item ao kit
          </ModalHeader>
          <Formik
            enableReinitialize
            initialValues={kit}
            // validationSchema={formItemSchema}
            onSubmit={values => handleAddMaterial(values)}
          >
            {({ errors, touched, handleChange, values, setFieldValue }) => (
              <Form className="pt-2">
                <ModalBody>
                  <Row>
                    <Col>
                      <FormGroup>
                        <Field
                          type="select"
                          component="select"
                          id="default_event_id"
                          name="default_event_id"
                          onChange={event =>
                            handleSelectedDefaultEvent(event, setFieldValue)
                          }
                          className={`
                            form-control
                            ${errors.default_event_id &&
                              touched.default_event_id &&
                              'is-invalid'}
                          `}
                        >
                          <option value="" disabled="">
                            Selecione uma opção
                          </option>

                          {!!defaultData &&
                            defaultData.map(eventData => (
                              <option key={eventData.id} value={eventData.id}>
                                {eventData.name}
                              </option>
                            ))}
                        </Field>
                      </FormGroup>
                    </Col>
                  </Row>

                  {values.products &&
                    values.products.length > 0 &&
                    values.products.map((product, index) => (
                      <Row key={index} className="justify-content-between">
                        <Col sm="6" md="6" lg="6">
                          <Label>{product.name}</Label>
                        </Col>
                        <Col sm="6" md="6" lg="4">
                          <Label>R$ {product.unit_price}</Label>
                        </Col>
                        <Col sm="12" md="12" lg="2">
                          <Field
                            type="number"
                            name={`products[${index}].quantity`}
                            className="form-control"
                          ></Field>
                        </Col>
                      </Row>
                    ))}
                </ModalBody>
                <ModalFooter>
                  <Button color="primary" type="submit">
                    Adicionar Item
                  </Button>{' '}
                  <Button color="danger" onClick={toggleModalAddMaterialClose}>
                    Cancelar
                  </Button>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </Modal>
      </Fragment>
    )
  );
}
