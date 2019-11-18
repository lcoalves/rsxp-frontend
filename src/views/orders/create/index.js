import React, {
  useState,
  useEffect,
  useMemo,
  Fragment,
  Component,
} from 'react';
import { useDispatch, useSelector, us } from 'react-redux';
import { Formik, Field, Form, FieldArray, useFormik } from 'formik';
import NumberFormat from 'react-number-format';
import { Datepicker } from 'react-formik-ui';

import classNames from 'classnames';

import {
  Map,
  MapPin,
  RefreshCw,
  Edit,
  Navigation,
  Plus,
  X,
  Check,
  Box,
  Truck,
  DollarSign,
  List,
  Star,
  CreditCard,
  FileText,
  User,
  Calendar,
  Lock,
} from 'react-feather';

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
  ButtonGroup,
  UncontrolledTooltip,
} from 'reactstrap';

import ReactCard from 'react-credit-cards';
import 'react-credit-cards/lib/styles.scss';
import {
  formatCreditCardNumber,
  formatCreditCardName,
  formatExpirationDate,
  formatCVC,
  // formatFormData,
} from './utils';

import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';

import { Creators as ShippingActions } from '~/store/ducks/shipping';
import { Creators as CepActions } from '~/store/ducks/cep';
import { Creators as DefaultEventActions } from '~/store/ducks/defaultEvent';
import { Creators as OrderActions } from '~/store/ducks/order';

const formOrder = Yup.object().shape({
  type: Yup.string().required('O tipo é obrigatório'),
  cep: Yup.string().required('O CEP é obrigatório'),
  uf: Yup.string().required('O estado é obrigatório'),
  city: Yup.string().required('A cidade é obrigatória'),
  street: Yup.string().required('A rua é obrigatória'),
  street_number: Yup.string().required('O número da rua é obrigatório'),
  neighborhood: Yup.string().required('O bairro é obrigatório'),
  receiver: Yup.string().required('O recebedor é obrigatório'),
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
  const user_id = localStorage.getItem('@dashboard/user');

  const [shippingSelected, setShippingSelected] = useState(null);
  const [paymentSelected, setPaymentSelected] = useState(null);
  const [shippingOptions, setShippingOptions] = useState(null);
  const [dataProducts, setDataProducts] = useState([]);
  const [kit, setKit] = useState({
    default_event_id: '',
    products: [],
  });
  const [modalAddMaterial, setModalAddMaterial] = useState(false);
  const [initialState, setInitialState] = useState({
    type: '',
    cep: '',
    uf: '',
    city: '',
    street: '',
    street_number: '',
    neighborhood: '',
    complement: '',
    receiver: '',
  });
  const [defaultSelected, setDefaultSelected] = useState(null);
  const [cepState, setCepState] = useState('');
  const [addresses, setAddresses] = useState([
    {
      id: null,
      entity_id: parseInt(user_id),
      type: '',
      other_type_name: '',
      cep: '',
      country: 'Brasil',
      uf: '',
      city: '',
      street: '',
      street_number: '',
      neighborhood: '',
      complement: '',
      receiver: '',
    },
  ]);

  const [loadingCard, setLoadingCard] = useState(false);
  const [card, setCard] = useState({
    name: '',
    number: '',
    expiry: '',
    cvc: '',
    id: '',
    issuer: '',
    focused: '',
  });

  const data = useSelector(state => state.profile.data);
  const defaultData = useSelector(state => state.defaultEvent.data);
  const loading = useSelector(state => state.order.loading);
  const cepData = useSelector(state => state.cep.data);
  const cepLoading = useSelector(state => state.cep.loading);
  const shippingOptionsData = useSelector(state => state.shipping.data);

  const dispatch = useDispatch();

  function handleCallback({ issuer }, isValid) {
    if (isValid) {
      setCard({ ...card, issuer: issuer.toUpperCase() });
    }
  }

  function handleInputFocus(event) {
    const { target } = event;

    setCard({ ...card, focused: target.name, id: '' });
  }

  function handleInputChange(event) {
    const { target } = event;

    if (target.name === 'number') {
      target.value = formatCreditCardNumber(target.value);
    } else if (target.name === 'name') {
      target.value = formatCreditCardName(target.value);
    } else if (target.name === 'expiry') {
      target.value = formatExpirationDate(target.value);
    } else if (target.name === 'cvc') {
      target.value = formatCVC(target.value);
    }

    setCard({ ...card, [target.name]: target.value, id: '' });
  }

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
            cost_of_goods: product.unit_price,
            quantity: '',
            weight: product.weight,
            width: product.width,
            height: product.height,
            length: product.length,
            sku_id: 1,
            product_category: 'Geral',
          };
        }),
      });
    }
  }

  function handleAddMaterial(values) {
    const products = values.products.filter(product => product.quantity > 0);
    let auxDataProducts = dataProducts;
    let verify = false;

    if (auxDataProducts.length > 0) {
      products.map(product => {
        auxDataProducts.forEach((dataProduct, index) => {
          if (product.id === dataProduct.id) {
            verify = true;
            auxDataProducts[index] = product;
          }
        });

        if (!verify) {
          auxDataProducts.push(product);
        }

        verify = false;
      });

      setDataProducts(auxDataProducts);

      if (cepState.length === 8) {
        dispatch(
          ShippingActions.shippingOptionsRequest(cepState, auxDataProducts)
        );
      }
    } else {
      setDataProducts([...dataProducts, ...products]);

      if (cepState.length === 8) {
        dispatch(ShippingActions.shippingOptionsRequest(cepState, products));
      }
    }

    setModalAddMaterial(false);
    setKit({
      default_event_id: '',
      products: [],
    });
  }

  function handleRemoveMaterial(id) {
    const auxDataProducts = dataProducts.filter(product => product.id !== id);

    setDataProducts(auxDataProducts);

    if (cepState.length === 8) {
      dispatch(
        ShippingActions.shippingOptionsRequest(cepState, auxDataProducts)
      );
    }
  }

  function handleCep(cep, setFieldValue, values) {
    const formattedCep = cep.replace('-', '');
    setCepState(formattedCep);
    setFieldValue('cep', formattedCep);

    if (values.type === 'other') {
      if (cep.length === 8) {
        dispatch(CepActions.cepRequest(cep, 0));
      }
    }
  }

  function handleChangeAddressType(event, setFieldValue) {
    const { name, value } = event.target;

    setFieldValue(name, value);

    if (value !== 'other' && value !== '') {
      const address = addresses.find(address => address.id === parseInt(value));

      setCepState(address.cep);
      setFieldValue('cep', address.cep);
      setFieldValue('uf', address.uf);
      setFieldValue('city', address.city);
      setFieldValue('street', address.street);
      setFieldValue('street_number', address.street_number);
      setFieldValue('neighborhood', address.neighborhood);
      setFieldValue('complement', address.complement);
      setFieldValue('receiver', address.receiver);

      if (dataProducts.length > 0) {
        dispatch(
          ShippingActions.shippingOptionsRequest(address.cep, dataProducts)
        );
      }
    } else {
      setFieldValue('cep', '');
      setFieldValue('uf', '');
      setFieldValue('city', '');
      setFieldValue('street', '');
      setFieldValue('street_number', '');
      setFieldValue('neighborhood', '');
      setFieldValue('complement', '');
      setFieldValue('receiver', '');
    }
  }

  function handleShipppingSelected(selected) {
    setShippingSelected(selected);
  }

  function handlePaymentSelected(selected) {
    setPaymentSelected(selected);
  }

  function handleAddOrder(values) {
    const toSend = {
      user: data,
      card,
      products: dataProducts,
      shipping_address: values,
      shipping_option: shippingSelected,
      order_details: {
        subtotal: subTotalPrice,
        shipping_amount: shippingSelected.free_shipping
          ? 0
          : shippingSelected.final_shipping_cost,
        amount: totalPrice,
      },
    };

    dispatch(OrderActions.addOrderRequest(toSend));
  }

  useEffect(() => {
    if (!!cepData.cep) {
      const copyAddress = initialState.shipping_address;
      copyAddress.type = 'other';
      copyAddress.cep = cepData.cep.replace('-', '');
      copyAddress.uf = cepData.uf;
      copyAddress.city = cepData.localidade;
      copyAddress.street =
        cepData.logradouro !== '' ? cepData.logradouro : copyAddress.street;
      copyAddress.neighborhood =
        cepData.bairro !== '' ? cepData.bairro : copyAddress.neighborhood;
      copyAddress.complement =
        cepData.complemento !== ''
          ? cepData.complemento
          : copyAddress.complement;

      setInitialState({ ...initialState, shipping_address: copyAddress });
      // setShippingAddress(...shippingAddress);

      if (dataProducts.length > 0) {
        dispatch(
          ShippingActions.shippingOptionsRequest(cepState, dataProducts)
        );
      }
    }
  }, [cepData]);

  useEffect(() => {
    if (data.addresses && data.addresses.length > 0) {
      setAddresses(data.addresses);
    }
  }, [data]);

  const subTotalPrice = useMemo(() => {
    let total = 0;
    if (dataProducts.length > 0) {
      dataProducts.map(product => {
        total = total + product.cost_of_goods * product.quantity;
      });
    }
    return total;
  }, [dataProducts.length, dataProducts.map(product => product.quantity)]);

  const totalPrice = useMemo(() => {
    let total = 0;
    if (shippingSelected !== null && shippingSelected.free_shipping) {
      total = subTotalPrice;
    }

    if (shippingSelected !== null && !shippingSelected.free_shipping) {
      total = subTotalPrice + shippingSelected.final_shipping_cost;
    }

    return total;
  }, [subTotalPrice, shippingSelected]);

  // useEffect(() => {
  //   if (cepState.length === 8 && dataProducts.length > 0) {
  //     dispatch(ShippingActions.shippingOptionsRequest(cepState, dataProducts));
  //   }
  // }, [
  //   cepState.length,
  //   dataProducts.length,
  //   //dataProducts.map(product => product.quantity),
  // ]);

  useEffect(() => {
    if (shippingOptionsData && shippingOptionsData.length > 0) {
      const shippingsLowestToBiggestPrice = shippingOptionsData.sort((a, b) => {
        if (a.final_shipping_cost > b.final_shipping_cost) {
          return 1;
        }
        if (a.final_shipping_cost < b.final_shipping_cost) {
          return -1;
        }

        return 0;
      });

      if (
        shippingsLowestToBiggestPrice[0].delivery_method_name !== 'Correios PAC'
      ) {
        shippingsLowestToBiggestPrice[0].free_shipping = true;
      } else {
        shippingsLowestToBiggestPrice[1].free_shipping = true;
      }

      setShippingOptions(shippingsLowestToBiggestPrice);
    }
  }, [shippingOptionsData]);

  useEffect(() => {
    if (!!data.email && !!data.cpf) {
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
    }

    return () => {
      setDataProducts(null);
      setShippingSelected(null);
      setShippingOptions(null);
      setInitialState({
        card: {
          number: '',
          name: '',
          expiry: '',
          cvc: '',
        },
        shipping_address: {
          type: '',
          cep: '',
          uf: '',
          city: '',
          street: '',
          street_number: '',
          neighborhood: '',
          complement: '',
          receiver: '',
        },
      });
    };
  }, []);

  return (
    defaultData !== null && (
      <Fragment>
        <ContentHeader>Solicitação de materiais</ContentHeader>
        <Card>
          <CardBody className="d-flex flex-column justify-content-center">
            <Formik
              enableReinitialize
              initialValues={initialState}
              validationSchema={formOrder}
              onSubmit={values => handleAddOrder(values)}
            >
              {({ errors, touched, values, setFieldValue }) => (
                <Form>
                  <h4 className="form-section">
                    <Box size={20} color="#212529" /> Materiais
                  </h4>
                  <Button
                    className="mb-2"
                    color="success"
                    onClick={toggleModalAddMaterial}
                  >
                    Adicionar material
                  </Button>

                  <Table striped responsive>
                    <thead>
                      <tr>
                        <th>ID</th>
                        <th>Nome produto</th>
                        <th>Valor unitário</th>
                        <th>Quantidade</th>
                        <th>Total</th>
                        <th>Remover</th>
                      </tr>
                    </thead>
                    <tbody>
                      {dataProducts.map(product => (
                        <tr>
                          <th scope="row">{product.id}</th>
                          <td>{product.name}</td>
                          <td>
                            R$ {product.cost_of_goods.toLocaleString('pt-BR')}
                          </td>
                          <td>{product.quantity}</td>
                          <td>R$ {product.quantity * product.cost_of_goods}</td>
                          <td>
                            <div
                              onClick={() => handleRemoveMaterial(product.id)}
                            >
                              <X
                                color="#ff3232"
                                className="fonticon-wrap height-25 width-25"
                              />
                            </div>
                          </td>
                        </tr>
                      ))}
                      {dataProducts.length > 0 && (
                        <tr>
                          <th></th>
                          <td></td>
                          <td></td>
                          <th scope="row">Subtotal</th>
                          <th>R$ {subTotalPrice.toLocaleString('pt-BR')}</th>
                          <th></th>
                        </tr>
                      )}
                    </tbody>
                  </Table>

                  <h4 className="form-section mt-3">
                    <MapPin size={20} color="#212529" /> Endereço de entrega
                  </h4>
                  <Row>
                    <Col sm="6">
                      <FormGroup>
                        <Label for="type">Tipo endereço</Label>
                        <div className="position-relative has-icon-left">
                          <Field
                            type="select"
                            component="select"
                            id="type"
                            name="type"
                            className={`
                              form-control
                              ${errors.shipping_address &&
                                errors.type &&
                                touched.shipping_address &&
                                touched.type &&
                                'is-invalid'}
                            `}
                            onChange={event =>
                              handleChangeAddressType(event, setFieldValue)
                            }
                          >
                            <option value="" defaultValue="" disabled="">
                              Selecione uma opção
                            </option>
                            {addresses.length > 0 &&
                              addresses[0].id !== null &&
                              addresses.map((address, index) => (
                                <option key={index} value={address.id}>
                                  {address.type === 'home' && 'Casa'}
                                  {address.type === 'work' && 'Trabalho'}
                                  {address.type === 'other' &&
                                    address.other_type_name}
                                  {`: ${address.cep}, ${address.street}, ${address.street_number}`}
                                </option>
                              ))}
                            <option key="other" value="other">
                              Novo endereço
                            </option>
                          </Field>
                          {errors.shipping_address &&
                          errors.type &&
                          touched.shipping_address &&
                          touched.type ? (
                            <div className="invalid-feedback">
                              {errors.type}
                            </div>
                          ) : null}
                          <div className="form-control-position">
                            <Map size={14} color="#212529" />
                          </div>
                        </div>
                      </FormGroup>
                    </Col>
                  </Row>

                  {!!values.type && (
                    <>
                      <Row>
                        <Col sm="12" md="3" lg="3" xl="3">
                          <FormGroup>
                            <Label for="cep">CEP</Label>
                            <div className="position-relative has-icon-right">
                              <CepFormat
                                autoComplete="cep"
                                id="cep"
                                name="cep"
                                placeholder="Ex: 17580-000"
                                value={values.cep}
                                disabled={
                                  values.type !== 'other' ? true : false
                                }
                                className={`
                                  form-control
                                  ${errors.shipping_address &&
                                    errors.cep &&
                                    touched.shipping_address &&
                                    touched.cep &&
                                    'is-invalid'}
                                `}
                                onValueChange={val =>
                                  handleCep(val.value, setFieldValue, values)
                                }
                              />
                              {errors.shipping_address &&
                              errors.cep &&
                              touched.shipping_address &&
                              touched.cep ? (
                                <div className="invalid-feedback">
                                  {errors.cep}
                                </div>
                              ) : null}
                              {cepLoading && (
                                <div className="form-control-position">
                                  <RefreshCw
                                    size={14}
                                    color="#212529"
                                    className="spinner"
                                  />
                                </div>
                              )}
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="12" md="3" lg="3" xl="3">
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
                        <Col sm="12" md="12" lg="6" xl="6">
                          <FormGroup>
                            <Label for="city">Cidade</Label>
                            <Field
                              type="text"
                              disabled={cepLoading}
                              id="city"
                              name="city"
                              disabled={values.type !== 'other' ? true : false}
                              className={`
                                form-control
                                ${errors.shipping_address &&
                                  errors.city &&
                                  touched.shipping_address &&
                                  touched.city &&
                                  'is-invalid'}
                              `}
                            />
                            {errors.shipping_address &&
                            errors.city &&
                            touched.shipping_address &&
                            touched.city ? (
                              <div className="invalid-feedback">
                                {errors.city}
                              </div>
                            ) : null}
                          </FormGroup>
                        </Col>
                      </Row>
                      <Row>
                        <Col sm="12" md="12" lg="8" xl="6">
                          <FormGroup>
                            <Label for="street">Rua</Label>
                            <div className="position-relative has-icon-left">
                              <Field
                                type="text"
                                id="street"
                                name="street"
                                disabled={
                                  values.type !== 'other' ? true : false
                                }
                                className={`
                                  form-control
                                  ${errors.shipping_address &&
                                    errors.street &&
                                    touched.shipping_address &&
                                    touched.street &&
                                    'is-invalid'}
                                `}
                              />
                              {errors.shipping_address &&
                              errors.street &&
                              touched.shipping_address &&
                              touched.street ? (
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
                        <Col sm="12" md="12" lg="4" xl="2">
                          <FormGroup>
                            <Label for="street_number">Número</Label>
                            <div className="position-relative has-icon-left">
                              <Field
                                type="text"
                                id="street_number"
                                name="street_number"
                                disabled={
                                  values.type !== 'other' ? true : false
                                }
                                className={`
                                  form-control
                                  ${errors.shipping_address &&
                                    errors.street_number &&
                                    touched.shipping_address &&
                                    touched.street_number &&
                                    'is-invalid'}
                                `}
                              />
                              {errors.shipping_address &&
                              errors.street_number &&
                              touched.shipping_address &&
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
                        <Col sm="12" md="12" lg="12" xl="4">
                          <FormGroup>
                            <Label for="neighborhood">Bairro</Label>
                            <div className="position-relative has-icon-left">
                              <Field
                                type="text"
                                id="neighborhood"
                                name="neighborhood"
                                disabled={
                                  values.type !== 'other' ? true : false
                                }
                                className={`
                                  form-control
                                  ${errors.shipping_address &&
                                    errors.neighborhood &&
                                    touched.shipping_address &&
                                    touched.neighborhood &&
                                    'is-invalid'}
                                `}
                              />
                              {errors.shipping_address &&
                              errors.neighborhood &&
                              touched.shipping_address &&
                              touched.neighborhood ? (
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
                        <Col sm="12" md="6" lg="6" xl="6">
                          <FormGroup>
                            <Label for="complement">Complemento</Label>
                            <div className="position-relative has-icon-left">
                              <Field
                                type="text"
                                id="complement"
                                name="complement"
                                disabled={
                                  values.type !== 'other' ? true : false
                                }
                                className="form-control"
                              />
                              <div className="form-control-position">
                                <Edit size={14} color="#212529" />
                              </div>
                            </div>
                          </FormGroup>
                        </Col>
                        <Col sm="12" md="6" lg="6" xl="6">
                          <FormGroup>
                            <Label for="receiver">Recebedor</Label>
                            <div className="position-relative has-icon-left">
                              <Field
                                type="text"
                                id="receiver"
                                name="receiver"
                                disabled={
                                  values.type !== 'other' ? true : false
                                }
                                className={`
                                  form-control
                                  ${errors.shipping_address &&
                                    errors.receiver &&
                                    touched.shipping_address &&
                                    touched.receiver &&
                                    'is-invalid'}
                                `}
                              />
                              {errors.shipping_address &&
                              errors.receiver &&
                              touched.shipping_address &&
                              touched.receiver ? (
                                <div className="invalid-feedback">
                                  {errors.receiver}
                                </div>
                              ) : null}
                              <div className="form-control-position">
                                <Edit size={14} color="#212529" />
                              </div>
                            </div>
                          </FormGroup>
                        </Col>
                      </Row>
                    </>
                  )}

                  {dataProducts.length > 0 &&
                    shippingOptions !== null &&
                    !!values.type && (
                      <>
                        <h4 className="form-section mt-3">
                          <Truck size={20} color="#212529" /> Opções de envio
                          (escolha uma das opções abaixo):
                        </h4>
                        <FormGroup className="mb-0">
                          <ButtonGroup className="d-flex flex-column">
                            {shippingOptions.map(shippingOption => (
                              <Button
                                key={shippingOption.delivery_method_id}
                                outline
                                className={`shipping-selected ${shippingSelected !==
                                  null &&
                                  shippingSelected.delivery_method_id ===
                                    shippingOption.delivery_method_id &&
                                  'shipping-selected-active'}`}
                                onClick={() =>
                                  handleShipppingSelected(shippingOption)
                                }
                                active={
                                  shippingSelected !== null &&
                                  shippingSelected.delivery_method_id ===
                                    shippingOption.delivery_method_id
                                }
                              >
                                <Row>
                                  <Col className="text-left pl-5">
                                    <Label className="mb-0 black font-medium-2">
                                      {shippingSelected !== null &&
                                        shippingSelected.delivery_method_id ===
                                          shippingOption.delivery_method_id && (
                                          <Check size={24} color="#0cc27e" />
                                        )}
                                      {shippingOption.description}
                                      {shippingOption.free_shipping && (
                                        <>
                                          <Star
                                            id="bestchoice"
                                            size={24}
                                            color="#fc0"
                                            fill="#fc0"
                                            className="ml-2"
                                          />
                                          <UncontrolledTooltip
                                            placement="right"
                                            target="bestchoice"
                                          >
                                            frete sugerido
                                          </UncontrolledTooltip>
                                        </>
                                      )}
                                    </Label>
                                  </Col>
                                  <Col>
                                    <Label className="mb-0 black">
                                      {shippingOption.delivery_estimate_business_days <=
                                      1
                                        ? `até ${shippingOption.delivery_estimate_business_days} dia útil`
                                        : `até ${shippingOption.delivery_estimate_business_days} dias úteis`}
                                    </Label>
                                  </Col>
                                  <Col className="text-right pr-5">
                                    {shippingOption.free_shipping ? (
                                      <Label className="mb-0 text-success font-medium-2">
                                        FRETE GRÁTIS
                                      </Label>
                                    ) : (
                                      <Label className="mb-0 black font-medium-2">
                                        R${' '}
                                        {shippingOption.final_shipping_cost.toLocaleString(
                                          'pt-BR'
                                        )}
                                      </Label>
                                    )}
                                  </Col>
                                </Row>
                              </Button>
                            ))}
                          </ButtonGroup>
                        </FormGroup>
                      </>
                    )}

                  {shippingSelected !== null && (
                    <>
                      <h4 className="form-section mt-3">
                        <List size={20} color="#212529" /> Resumo do pedido
                      </h4>
                      {dataProducts.map(product => (
                        <p className="font-medium-2">
                          <span className="black font-weight-bold">
                            {product.quantity} x{' '}
                          </span>
                          <span className="black">{product.name} por </span>
                          <span className="black font-weight-bold">
                            R$ {product.cost_of_goods.toLocaleString('pt-BR')}
                            /unidade
                          </span>
                        </p>
                      ))}
                      {shippingSelected.free_shipping ? (
                        <p className="font-medium-2">
                          <span className="black font-weight-bold">
                            Envio:{' '}
                          </span>
                          <span className="black">
                            {shippingSelected.description} com o{' '}
                          </span>
                          <span className="text-success font-weight-bold">
                            FRETE GRÁTIS
                          </span>{' '}
                          <span className="black font-weight-bold">
                            {shippingSelected.delivery_estimate_transit_time_business_days <=
                            1
                              ? `(prazo de
                                ${shippingSelected.delivery_estimate_transit_time_business_days}
                              dia útil)`
                              : `(prazo de 
                                  ${shippingSelected.delivery_estimate_transit_time_business_days} 
                                dias úteis)`}
                          </span>
                        </p>
                      ) : (
                        <p className="font-medium-2">
                          <span className="black font-weight-bold">
                            Envio:{' '}
                          </span>
                          <span className="black">
                            {shippingSelected.description} por{' '}
                          </span>
                          <span className="text-success font-weight-bold">
                            R${' '}
                            {shippingSelected.final_shipping_cost.toLocaleString(
                              'pt-BR'
                            )}
                          </span>{' '}
                          <span className="black font-weight-bold">
                            {shippingSelected.delivery_estimate_transit_time_business_days <=
                            1
                              ? `(prazo de
                                ${shippingSelected.delivery_estimate_transit_time_business_days}
                              dia útil)`
                              : `(prazo de 
                                  ${shippingSelected.delivery_estimate_transit_time_business_days} 
                                dias úteis)`}
                          </span>
                        </p>
                      )}
                      <Label className="mt-3 mb-0 black font-medium-5">
                        Total: R$ {totalPrice.toLocaleString('pt-BR')}
                      </Label>

                      <h4 className="form-section mt-3">
                        <DollarSign size={20} color="#212529" /> Pagamento
                        (selecione uma opção):
                      </h4>
                      <FormGroup className="mb-0">
                        <ButtonGroup className="d-flex flex-column">
                          <Button
                            key={1}
                            outline
                            className={`shipping-selected ${paymentSelected !==
                              null &&
                              paymentSelected === 1 &&
                              'shipping-selected-active'}`}
                            onClick={() => handlePaymentSelected(1)}
                            active={
                              paymentSelected !== null && paymentSelected === 1
                            }
                          >
                            <Label className="mb-0 black font-medium-2">
                              {paymentSelected !== null &&
                                paymentSelected === 1 && (
                                  <Check size={24} color="#0cc27e" />
                                )}
                              Cartão de crédito
                              <CreditCard
                                size={24}
                                color="#000"
                                className="ml-2"
                              />
                            </Label>
                          </Button>

                          <Button
                            key={2}
                            outline
                            className={`shipping-selected ${paymentSelected !==
                              null &&
                              paymentSelected === 2 &&
                              'shipping-selected-active'}`}
                            onClick={() => handlePaymentSelected(2)}
                            active={
                              paymentSelected !== null && paymentSelected === 2
                            }
                          >
                            <Label className="mb-0 black font-medium-2">
                              {paymentSelected !== null &&
                                paymentSelected === 2 && (
                                  <Check size={24} color="#0cc27e" />
                                )}
                              Boleto
                              <FileText
                                size={24}
                                color="#000"
                                className="ml-2"
                              />
                            </Label>
                          </Button>
                        </ButtonGroup>
                      </FormGroup>
                    </>
                  )}

                  {paymentSelected === 1 && (
                    <Row className="mt-3">
                      <Col sm="12" md="12" lg="4" xl="4">
                        <ReactCard
                          number={card.number}
                          name={card.name}
                          expiry={card.expiry}
                          cvc={card.cvc}
                          focused={card.focused}
                          callback={handleCallback}
                          locale={{
                            valid: 'Valido até',
                          }}
                          placeholders={{
                            name: 'Seu nome aqui',
                          }}
                        />
                      </Col>
                      <Col sm="12" md="12" lg="8" xl="8">
                        <FormGroup>
                          <Row>
                            <Col sm="12" md="12" lg="6" xl="6">
                              <Label className="pl-2">Número do cartão</Label>
                              <Col
                                sm="12"
                                md="12"
                                lg="12"
                                xl="12"
                                className="has-icon-left"
                              >
                                <Field
                                  type="tel"
                                  name="number"
                                  className="form-control new-form-padding"
                                  placeholder="insira aqui o número do cartão"
                                  pattern="[\d| ]{16,22}"
                                  required
                                  onChange={handleInputChange}
                                  onFocus={handleInputFocus}
                                />
                                <div className="new-form-control-position">
                                  <CreditCard size={14} color="#212529" />
                                </div>
                              </Col>
                            </Col>
                            <Col sm="12" md="12" lg="6" xl="6">
                              <Label className="pl-2">Nome no cartão</Label>
                              <Col
                                sm="12"
                                md="12"
                                lg="12"
                                xl="12"
                                className="has-icon-left"
                              >
                                <Field
                                  type="text"
                                  name="name"
                                  className="form-control new-form-padding"
                                  placeholder="insira aqui o nome do proprietário"
                                  required
                                  onChange={handleInputChange}
                                  onFocus={handleInputFocus}
                                />
                                <div className="new-form-control-position">
                                  <User size={14} color="#212529" />
                                </div>
                              </Col>
                            </Col>
                          </Row>
                        </FormGroup>
                        <FormGroup>
                          <Row>
                            <Col sm="12" md="12" lg="6" xl="6">
                              <Label className="pl-2">Validade do cartão</Label>
                              <Col md="12" className="has-icon-left">
                                <Field
                                  type="tel"
                                  name="expiry"
                                  className="form-control new-form-padding mb-2"
                                  placeholder="ex: 04/21"
                                  pattern="\d\d/\d\d"
                                  required
                                  onChange={handleInputChange}
                                  onFocus={handleInputFocus}
                                />
                                <div className="new-form-control-position">
                                  <Calendar size={14} color="#212529" />
                                </div>
                              </Col>
                            </Col>
                            <Col sm="12" md="12" lg="6" xl="6">
                              <Label className="pl-2">Digite o CVV</Label>
                              <Col md="12" className="has-icon-left">
                                <Field
                                  type="tel"
                                  name="cvc"
                                  className="form-control new-form-padding"
                                  placeholder="ex: 311"
                                  pattern="\d{3,4}"
                                  required
                                  onChange={handleInputChange}
                                  onFocus={handleInputFocus}
                                />
                                <div className="new-form-control-position">
                                  <Lock size={14} color="#212529" />
                                </div>
                              </Col>
                            </Col>
                          </Row>
                        </FormGroup>
                      </Col>
                    </Row>
                  )}

                  <ModalFooter>
                    {loading ? (
                      <Button disabled className="ml-1 my-1 btn-secondary">
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
                      <Button type="submit" className="ml-1 my-1 btn-success">
                        Criar solicitação de materiais
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
            onSubmit={(values, { resetForm }) => {
              handleAddMaterial(values);
              resetForm();
            }}
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
                      <Row key={index} className="justify-content-between pt-2">
                        <Col sm="6" md="6" lg="6">
                          <Label>{product.name}</Label>
                        </Col>
                        <Col sm="6" md="6" lg="4">
                          <Label>R$ {product.cost_of_goods}</Label>
                        </Col>
                        <Col sm="12" md="12" lg="2">
                          <Field
                            type="number"
                            placeholder="0"
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
