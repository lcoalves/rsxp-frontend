import React, { useState, useEffect, Fragment, Component } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { Link } from 'react-router-dom';
import { Formik, Field, Form } from 'formik';
import NumberFormat from 'react-number-format';
import { Datepicker } from 'react-formik-ui';

import { validateCPF } from '~/services/validateCPF';
import { validateCNPJ } from '~/services/validateCNPJ';

import * as Yup from 'yup';
import 'react-table/react-table.css';

import { subMonths } from 'date-fns';
import pt from 'date-fns/locale/pt';

import ContentHeader from '../../../../components/contentHead/contentHeader';

import {
  Row,
  Col,
  Button,
  FormGroup,
  Card,
  CardBody,
  Label,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  CardHeader,
} from 'reactstrap';

import {
  User,
  Search,
  MapPin,
  Navigation,
  Edit,
  Calendar,
  CreditCard,
  Flag,
  Compass,
  RefreshCw,
  Mail,
  Phone,
} from 'react-feather';

import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';

import { Creators as OrganizationActions } from '~/store/ducks/organization';
import { Creators as CepActions } from '~/store/ducks/cep';
import { Creators as DefaultEventActions } from '~/store/ducks/defaultEvent';
import { Creators as EventActions } from '~/store/ducks/event';

const formDetails = Yup.object().shape({
  organizator_name: Yup.string().required('O líder é obrigatório'),
  organization_name: Yup.string().required('A Igreja é obrigatória'),
  // is_public: Yup.string().required('Esse campo é obrigatório'),
  // is_online_payment: Yup.string().required(
  // 'O método de pagamento é obrigatório'
  // ),
  initial_date: Yup.string().required('A data inicial é obrigatória'),
  default_event_id: Yup.string().required('Tipo do grupo é obrigatório'),
  // cep: Yup.string()
  //   .min(8, 'O CEP deve conter 8 dígitos')
  //   .max(8, 'O CEP deve conter 8 dígitos no máximo')
  //   .required('O cep é obrigatório'),
  // uf: Yup.string().required('O estado é obrigatório'),
  // city: Yup.string().required('A cidade é obrigatória'),
  // street: Yup.string().required('A rua é obrigatória'),
  // street_number: Yup.string().required('O número é obrigatório'),
  // neighborhood: Yup.string().required('O bairro é obrigatório'),
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
  const [modalChurch, setModalChurch] = useState(false);
  const [modalOrganizator, setModalOrganizator] = useState(false);
  const [defaultEvents, setDefaultEvents] = useState([]);
  const [initialState, setInitialState] = useState({
    cnpj: '',
    cpf: '',
    organization_id: null,
    organization_name: '',
    organizator_id: null,
    organizator_name: '',
    aux_organizator_id: '',
    aux_organizator_name: '',
    //
    is_public: '',
    is_online_payment: '',
    initial_date: '',
    end_date: '',
    default_event_id: '',
    ministery: '',
    address: '',
    cep: '',
    uf: '',
    city: '',
    street: '',
    street_number: '',
    neighborhood: '',
    address_name: '',
    complement: '',
  });

  const userData = useSelector(state => state.profile.data);
  const cepData = useSelector(state => state.cep.data);
  const defaultData = useSelector(state => state.defaultEvent.data);
  const organization = useSelector(state => state.organization.data);
  const loadingOrganization = useSelector(state => state.organization.loading);
  const organizator = useSelector(state => state.organizator.data);
  const loading = useSelector(state => state.organization.loading);
  const event_loading = useSelector(state => state.event.loading);

  const dispatch = useDispatch();

  const DatepickerButton = ({ value, onClick }) => (
    <Button
      outline
      block
      color="secondary"
      className="form-control height-38"
      onClick={onClick}
    >
      {value}
    </Button>
  );

  function toggleModalChurch() {
    setModalChurch(!modalChurch);
  }

  function handleSubmit(values) {
    const data = {
      is_public: values.is_public === 'true' ? true : false,
      is_online_payment: values.is_online_payment === 'true' ? true : false,
      default_event_id: parseInt(values.default_event_id),
      responsible_organization_id: values.organization_id,
      organizator_id: values.organizator_id,
      start_date: values.initial_date,
      end_date: values.end_date,
      // address_name: values.address_name,
      // cep: values.cep,
      // city: values.city,
      // uf: values.uf,
      // country: 'Brasil',
      // street: values.street,
      // street_number: values.street_number,
      // neighborhood: values.neighborhood,
      // complement: values.complement,
      img_address_url:
        'https://arcowebarquivos-us.s3.amazonaws.com/imagens/52/21/arq_85221.jpg',
      is_finished: false,
    };

    dispatch(EventActions.addEventRequest(data));
  }

  function handleSearchChurch(cnpj, setFieldValue) {
    const formattedCnpj = cnpj
      .replace('.', '')
      .replace('.', '')
      .replace('.', '')
      .replace('/', '')
      .replace('-', '');

    setFieldValue('cnpj', formattedCnpj);

    if (formattedCnpj.length === 14) {
      dispatch(OrganizationActions.searchOrganizationRequest(cnpj));
    }
  }

  function confirmModalChurch(event, setFieldValue) {
    setFieldValue('organization_id', organization.id);
    setFieldValue('organization_name', organization.corporate_name);

    setModalChurch(false);
  }

  function handleCep(cep, setFieldValue, values) {
    setFieldValue('cep', cep);

    if (cep.length === 8) {
      setInitialState({
        ...initialState,
        ['organization_id']: values.organization_id,
        ['organization_name']: values.organization_name,
        ['organizator_id']: values.organizator_id,
        ['organizator_name']: values.organizator_name,
        ['is_public']: values.is_public,
        ['is_online_payment']: values.is_online_payment,
        ['initial_date']: values.initial_date,
        ['end_date']: values.end_date,
        ['cep']: values.cep,
        ['default_event_id']: values.default_event_id,
        ['ministery']: values.ministery,
      });

      dispatch(CepActions.cepRequest(cep));
    }
  }

  function handleEvent(event, setFieldValue) {
    const value = event.target.value;
    setFieldValue('default_event_id', value);

    defaultData.map(default_event => {
      if (default_event.id === parseInt(value)) {
        setFieldValue('ministery', default_event.ministery.name);
      }
    });
  }

  function handleMinistery(event, setFieldValue) {
    const { value } = event.target;
    setFieldValue('ministery', value);

    const defaults = defaultData.filter(default_event => {
      return default_event.ministery.id === parseInt(value) && default_event;
    });

    setDefaultEvents(defaults);
  }

  useEffect(() => {
    if (!!userData.email) {
      setInitialState({
        ...initialState,
        ['organizator_id']: userData.id,
        ['organizator_name']: `${userData.name} (você)`,
      });

      const data = {
        cmn_hierarchy_id: userData.cmn_hierarchy_id,
        mu_hierarchy_id: userData.mu_hierarchy_id,
        crown_hierarchy_id: userData.crown_hierarchy_id,
        mp_hierarchy_id: userData.mp_hierarchy_id,
        ffi_hierarchy_id: userData.ffi_hierarchy_id,
        gfi_hierarchy_id: userData.gfi_hierarchy_id,
        pg_hierarchy_id: userData.pg_hierarchy_id,
      };

      dispatch(DefaultEventActions.organizatorEventRequest(data));
    }
  }, [userData]);

  useEffect(() => {
    if (!!cepData.cep) {
      setInitialState({
        ...initialState,
        ['cep']: cepData.cep.replace('-', ''),
        ['uf']: cepData.uf,
        ['city']: cepData.localidade,
        ['street']: cepData.logradouro !== '' ? cepData.logradouro : '',
        ['neighborhood']: cepData.bairro !== '' ? cepData.bairro : '',
        ['complement']: cepData.complemento !== '' ? cepData.complemento : '',
      });
    }
  }, [cepData]);

  return (
    defaultData !== null && (
      <Fragment>
        <ContentHeader>Criar Grupo</ContentHeader>
        <Card>
          <CardBody>
            {/* DADOS DA IGREJA */}
            <Formik
              enableReinitialize
              initialValues={initialState}
              validationSchema={formDetails}
              onSubmit={values => handleSubmit(values)}
            >
              {({ errors, touched, handleChange, values, setFieldValue }) => (
                <Form>
                  {/* DADOS DO GRUPO */}
                  <div className="form-body">
                    <h4 className="form-section">
                      <User size={20} color="#212529" /> Dados do Grupo
                    </h4>
                    {/* <Row>
                      <Col lg="4" md="6" sm="12">
                        <FormGroup>
                          <Label for="is_public">É público?</Label>
                          <HelpCircle
                            id="is_public"
                            className="ml-1 bg-white text-muted cursor-pointer"
                          />
                          <UncontrolledPopover
                            trigger="legacy"
                            placement="right"
                            target="is_public"
                          >
                            <PopoverHeader className="cz-bg-color">
                              Evento público
                            </PopoverHeader>
                            <PopoverBody>
                              Esse campo indica se o grupo será público. Se
                              "Sim" o grupo aparecerá para qualquer pessoa se
                              inscrever online e você também podera compartilhar
                              um link, se "Não" você deverá inscrever os
                              participantes manualmente.
                            </PopoverBody>
                          </UncontrolledPopover>
                          <Field
                            type="select"
                            component="select"
                            id="is_public"
                            name="is_public"
                            value={values.is_public || ''}
                            onChange={handleChange}
                            className={`
                                  form-control
                                  ${errors.is_public &&
                                    touched.is_public &&
                                    'is-invalid'}
                                `}
                          >
                            <option value="" disabled="">
                              Selecione uma opção
                            </option>
                            <option value="true">Sim</option>
                            <option value="false">Não</option>
                          </Field>
                          {errors.is_public && touched.is_public ? (
                            <div className="invalid-feedback">
                              {errors.is_public}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col lg="5" md="6" sm="12">
                        <FormGroup>
                          <Label for="is_online_payment">
                            Pagamento online
                          </Label>
                          <HelpCircle
                            id="is_online_payment"
                            className="ml-1 bg-white text-muted cursor-pointer"
                          />
                          <UncontrolledPopover
                            trigger="legacy"
                            placement="right"
                            target="is_online_payment"
                          >
                            <PopoverHeader className="cz-bg-color">
                              Pagamento
                            </PopoverHeader>
                            <PopoverBody>
                              Esse campo indica o responsável pelo pagamento. Se
                              "Participante" cada participante fará seu
                              pagamento no momento da inscrição, se
                              "Organizador" você realizará o pagamento.
                            </PopoverBody>
                          </UncontrolledPopover>
                          <Field
                            type="select"
                            component="select"
                            id="is_online_payment"
                            name="is_online_payment"
                            onChange={handleChange}
                            className={`
                                  form-control
                                  ${errors.is_online_payment &&
                                    touched.is_online_payment &&
                                    'is-invalid'}
                                `}
                          >
                            <option value={null} disabled="">
                              Selecione uma opção
                            </option>
                            <option value="true">Sim</option>
                            <option value="false">Não</option>
                          </Field>
                          {errors.is_online_payment &&
                          touched.is_online_payment ? (
                            <div className="invalid-feedback">
                              {errors.is_online_payment}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row> */}
                    <Row>
                      <Col xl="3" lg="4" md="4" sm="12">
                        <FormGroup>
                          <Label for="initial_date">Data Inicial</Label>
                          <div className="position-relative has-icon-left">
                            <Datepicker
                              name="initial_date"
                              id="initial_date"
                              locale={pt}
                              selected={values.initial_date}
                              onChange={date =>
                                setFieldValue('initial_date', date)
                              }
                              customInput={<DatepickerButton />}
                              minDate={subMonths(new Date(), 12)}
                              calendarClassName="width-328"
                              dateFormat="dd/MM/yyyy hh:mm aa"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={5}
                              timeCaption="Horário"
                              className={`
                                form-control
                                ${errors.initial_date &&
                                  touched.initial_date &&
                                  'is-invalid'}
                              `}
                            />
                            {errors.initial_date && touched.initial_date ? (
                              <div className="invalid-feedback">
                                {errors.initial_date}
                              </div>
                            ) : null}
                            <div className="form-control-position">
                              <Calendar size={14} color="#212529" />
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
                      {!!values.initial_date && (
                        <Col xl="3" lg="4" md="4" sm="12">
                          <FormGroup>
                            <Label for="end_date">Formatura (opcional)</Label>
                            <div className="position-relative has-icon-left">
                              <Datepicker
                                name="end_date"
                                id="end_date"
                                locale={pt}
                                selected={values.end_date}
                                onChange={date =>
                                  setFieldValue('end_date', date)
                                }
                                customInput={<DatepickerButton />}
                                minDate={values.initial_date}
                                calendarClassName="width-328"
                                dateFormat="dd/MM/yyyy hh:mm aa"
                                showMonthDropdown
                                showYearDropdown
                                dropdownMode="select"
                                showTimeSelect
                                timeFormat="HH:mm"
                                timeIntervals={5}
                                timeCaption="Horário"
                                className="form-control"
                              />
                              <div className="form-control-position">
                                <Calendar size={14} color="#212529" />
                              </div>
                            </div>
                          </FormGroup>
                        </Col>
                      )}
                    </Row>
                    <Row>
                      <Col lg="8" md="12" sm="12">
                        <FormGroup>
                          <Label for="default_event_id">Tipo de grupo</Label>
                          <Field
                            type="select"
                            component="select"
                            id="default_event_id"
                            name="default_event_id"
                            onChange={e => handleEvent(e, setFieldValue)}
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

                            {defaultData.map(event => (
                              <option value={event.id}>{event.name}</option>
                            ))}
                          </Field>
                          {errors.default_event_id &&
                          touched.default_event_id ? (
                            <div className="invalid-feedback">
                              {errors.default_event_id}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>

                      <Col lg="4" md="12" sm="12">
                        <FormGroup>
                          <Label for="ministery">Ministério</Label>
                          <div className="position-relative has-icon-left">
                            <Field
                              readOnly
                              type="text"
                              name="ministery"
                              id="ministery"
                              className="form-control"
                              value={values.ministery}
                            />
                            <div className="form-control-position">
                              <Flag size={14} color="#212529" />
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>

                    <h4 className="form-section">
                      <i className="fa fa-user" size={20} color="#212529" />{' '}
                      Líder responsável
                    </h4>
                    <Row className="align-items-center">
                      <Col sm="12" md="12" lg="6" className="mb-2">
                        <FormGroup>
                          <Label for="organizator_name">Nome do líder</Label>
                          <Field
                            readOnly
                            type="text"
                            name="organizator_name"
                            id="organizator_name"
                            className={`
                              form-control
                              ${errors.organizator_name &&
                                touched.organizator_name &&
                                'is-invalid'}
                            `}
                          />
                          {errors.organizator_name &&
                          touched.organizator_name ? (
                            <div className="invalid-feedback">
                              {errors.organizator_name}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>

                    <h4 className="form-section">
                      <i className="fa fa-home" size={20} color="#212529" />{' '}
                      Igreja responsável
                    </h4>
                    <Row className="align-items-center">
                      <Col sm="12" md="6" lg="6" className="mb-2">
                        <FormGroup>
                          <Label className="ml-2" for="church">
                            Nome da Igreja
                          </Label>
                          <Field
                            readOnly
                            type="text"
                            placeholder="Pesquise a igreja"
                            name="organization_name"
                            id="organization_name"
                            onClick={toggleModalChurch}
                            className={`
                              form-control
                              ${errors.organization_name &&
                                touched.organization_name &&
                                'is-invalid'}
                            `}
                          />
                          {errors.organization_name &&
                          touched.organization_name ? (
                            <div className="invalid-feedback">
                              {errors.organization_name}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col sm="12" md="6" lg="6">
                        <Button
                          className="mb-2"
                          block
                          color="success"
                          onClick={toggleModalChurch}
                        >
                          Pesquisar igreja
                        </Button>
                      </Col>
                    </Row>

                    {/* {!!values.organization_name && (
                      <>
                        <h4 className="form-section">
                          <MapPin size={20} color="#212529" /> Localização do
                          grupo
                        </h4>
                        <Row>
                          <Col lg="6">
                            <FormGroup>
                              <Label for="cep">Endereço</Label>
                              <Field
                                type="select"
                                component="select"
                                id="address"
                                name="address"
                                onChange={event =>
                                  handleAddress(event, setFieldValue)
                                }
                                className={`
                              form-control
                              ${errors.address &&
                                touched.address &&
                                'is-invalid'}
                            `}
                              >
                                <option value="" disabled="">
                                  Selecione uma opção
                                </option>

                                <option value={1}>Endereço 1</option>
                                <option value={2}>Endereço 2</option>
                              </Field>
                              {errors.address && touched.address ? (
                                <div className="invalid-feedback">
                                  {errors.address}
                                </div>
                              ) : null}
                            </FormGroup>
                          </Col>
                        </Row>
                      </>
                    )}

                    {!!values.address && (
                      <>
                        <Row>
                          <Col lg="4" md="6" sm="12">
                            <FormGroup>
                              <Label for="cep">CEP</Label>
                              <div className="position-relative has-icon-left">
                                <CepFormat
                                  autoComplete="cep"
                                  name="cep"
                                  id="cep"
                                  placeholder="Ex: 17580-000"
                                  className={`
                                form-control
                                ${errors.cep && touched.cep && 'is-invalid'}
                              `}
                                  value={values.cep}
                                  onValueChange={val =>
                                    handleCep(val.value, setFieldValue, values)
                                  }
                                />
                                {errors.cep && touched.cep ? (
                                  <div className="invalid-feedback">
                                    {errors.cep}
                                  </div>
                                ) : null}
                                <div className="form-control-position">
                                  <MapPin size={14} color="#212529" />
                                </div>
                              </div>
                            </FormGroup>
                          </Col>
                          <Col lg="4" md="6" sm="12">
                            <FormGroup>
                              <Label for="uf">Estado</Label>
                              <Field
                                disabled
                                type="text"
                                id="uf"
                                name="uf"
                                onChange={handleChange}
                                className={`
                                  form-control
                                  ${errors.uf && touched.uf && 'is-invalid'}
                                `}
                              />
                              {errors.uf && touched.uf ? (
                                <div className="invalid-feedback">
                                  {errors.uf}
                                </div>
                              ) : null}
                            </FormGroup>
                          </Col>
                          <Col lg="4" md="6" sm="12">
                            <FormGroup>
                              <Label for="city">Cidade</Label>
                              <Field
                                autoComplete="city"
                                type="text"
                                id="city"
                                name="city"
                                className={`
                                  form-control
                                  ${errors.city && touched.city && 'is-invalid'}
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
                          <Col lg="8" md="8" sm="12">
                            <FormGroup>
                              <Label for="street">Rua</Label>
                              <div className="position-relative has-icon-left">
                                <Field
                                  autoComplete="street"
                                  type="text"
                                  placeholder="Ex: Jose Cândido Prisão"
                                  name="street"
                                  id="street"
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
                          <Col lg="4" md="4" sm="12">
                            <FormGroup>
                              <Label for="street_number">Número</Label>
                              <div className="position-relative has-icon-left">
                                <Field
                                  autoComplete="street_number"
                                  type="text"
                                  placeholder="Ex: 543"
                                  name="street_number"
                                  id="street_number"
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
                        </Row>
                        <Row>
                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label for="neighborhood">Bairro</Label>
                              <div className="position-relative has-icon-left">
                                <Field
                                  type="text"
                                  placeholder="Ex: Vila Paulinia"
                                  name="neighborhood"
                                  id="neighborhood"
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
                          <Col lg="6" md="6" sm="12">
                            <FormGroup>
                              <Label for="complement">Complemento</Label>
                              <div className="position-relative has-icon-left">
                                <Field
                                  type="text"
                                  placeholder="Complemento"
                                  name="complement"
                                  id="complement"
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
                    )} */}

                    <div className="form-actions right">
                      <FormGroup>
                        {event_loading ? (
                          <Button disabled color="secondary">
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
                            color="success"
                            className="btn-default btn-raised"
                          >
                            Criar grupo
                          </Button>
                        )}
                      </FormGroup>
                    </div>

                    {/* MODAL PARA PESQUISA IGREJA */}
                    <Modal
                      isOpen={modalChurch}
                      toggle={toggleModalChurch}
                      className={className}
                      size="md"
                    >
                      <ModalHeader toggle={toggleModalChurch}>
                        Pesquisar por igreja responsável
                      </ModalHeader>
                      <ModalBody>
                        <Form>
                          <div className="form-body">
                            <Row className="d-flex flex-row f">
                              <Col lg="12" md="12" sm="12">
                                <FormGroup>
                                  <Label for="cnpj">
                                    Digite o CNPJ da Igreja
                                  </Label>
                                  <div className="position-relative has-icon-right">
                                    <Field
                                      name="cnpj"
                                      id="cnpj"
                                      className={`
                                          form-control
                                          ${errors.cnpj &&
                                            touched.cnpj &&
                                            'is-invalid'}
                                        `}
                                      validate={validateCNPJ}
                                      render={({ field }) => (
                                        <CnpjFormat
                                          {...field}
                                          id="cnpj"
                                          name="cnpj"
                                          className={`
                                                form-control
                                                ${errors.cnpj &&
                                                  touched.cnpj &&
                                                  'is-invalid'}
                                              `}
                                          value={values.cnpj}
                                          onValueChange={val =>
                                            handleSearchChurch(
                                              val.value,
                                              setFieldValue
                                            )
                                          }
                                        />
                                      )}
                                    />
                                    {errors.cnpj && touched.cnpj ? (
                                      <div className="invalid-feedback">
                                        {errors.cnpj}
                                      </div>
                                    ) : null}
                                    {loadingOrganization && (
                                      <div className="form-control-position">
                                        <RefreshCw
                                          size={16}
                                          className="spinner"
                                        />
                                      </div>
                                    )}
                                  </div>
                                </FormGroup>
                              </Col>
                            </Row>
                          </div>
                          <div>
                            {organization !== null && (
                              <>
                                <Col>
                                  <Card>
                                    <CardHeader className="text-center">
                                      <img
                                        src={
                                          !!organization.file
                                            ? organization.file.url
                                            : 'https://i.imgur.com/KQZkd2u.png'
                                        }
                                        alt="Brek"
                                        width="150"
                                        height="150"
                                        className="rounded-circle gradient-mint"
                                      />
                                    </CardHeader>
                                    <CardBody>
                                      <h4 className="card-title text-center">
                                        {organization.corporate_name}
                                      </h4>
                                      <p className="category text-gray font-small-4 text-center">
                                        {organization.cnpj}
                                      </p>
                                      <p className="category text-gray font-small-4 text-center">
                                        Igreja
                                      </p>
                                      <hr className="grey" />
                                      <Row className="mb-1">
                                        <Col
                                          xs="6"
                                          className="text-center text-truncate"
                                        >
                                          <Phone size={18} color="#212529" />
                                          {!!organization.phone ? (
                                            <span className="ml-2">
                                              {organization.phone}
                                            </span>
                                          ) : (
                                            <span className="ml-2">
                                              Sem telefone
                                            </span>
                                          )}
                                        </Col>
                                        <Col
                                          xs="6"
                                          className="text-center text-truncate"
                                        >
                                          <Mail size={18} color="#212529" />
                                          {!!organization.email ? (
                                            <span className="ml-2">
                                              {organization.email}
                                            </span>
                                          ) : (
                                            <span className="ml-2">
                                              Sem email
                                            </span>
                                          )}
                                        </Col>
                                      </Row>
                                    </CardBody>
                                  </Card>
                                </Col>
                              </>
                            )}
                          </div>
                        </Form>
                      </ModalBody>
                      <ModalFooter>
                        <Button
                          className="ml-1 my-1"
                          color="danger"
                          onClick={toggleModalChurch}
                        >
                          Cancelar
                        </Button>{' '}
                        <Button
                          disabled={organization !== null ? false : true}
                          className={`${
                            organization !== null
                              ? 'ml-1 my-1 btn-success'
                              : 'btn-secundary ml-1 my-1'
                          }`}
                          onClick={event =>
                            confirmModalChurch(event, setFieldValue)
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
                            'Adicionar organização'
                          )}
                        </Button>
                      </ModalFooter>
                    </Modal>
                  </div>
                </Form>
              )}
            </Formik>
          </CardBody>
        </Card>
      </Fragment>
    )
  );
}
