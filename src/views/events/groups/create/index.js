import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { Link } from 'react-router-dom';

import { Formik, Field, Form } from 'formik';
import { Datepicker } from 'react-formik-ui';

import * as Yup from 'yup';
import 'react-table/react-table.css';

import { subMonths } from 'date-fns';

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
  HelpCircle,
  Flag,
  Compass,
} from 'react-feather';

import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';

import { Creators as OrganizationActions } from '~/store/ducks/organization';
import { Creators as OrganizatorActions } from '~/store/ducks/organizator';
import { Creators as CepActions } from '~/store/ducks/cep';
import { Creators as DefaultEventActions } from '~/store/ducks/defaultEvent';
import { Creators as EventActions } from '~/store/ducks/event';

const formDetails = Yup.object().shape({
  cpf: Yup.string()
    .min(11, 'O CPF deve conter 11 digitos')
    .max(11, 'O CPF deve conter 11 dígitos')
    .required('Campo obrigatório'),
  cnpj: Yup.string()
    .min(14, 'O CPF deve conter 14 digitos')
    .max(14, 'O CPF deve conter 14 dígitos')
    .required('Campo obrigatório'),
  organization_name: Yup.string().required('Campo obrigatório'),
  organization_id: Yup.string().required('Campo obrigatório'),
  organizator_name: Yup.string().required('Campo obrigatório'),
  organizator_id: Yup.string().required('Campo obrigatório'),
  publicEvent: Yup.string().required('Esse campo é obrigatório'),
  is_public: Yup.string().required('Esse campo é obrigatório'),
  is_online_payment: Yup.string().required(
    'O método de pagamento é obrigatório'
  ),
  initial_date: Yup.string().required('A data inicial é obrigatória'),
  default_event_id: Yup.number().required('Tipo do grupo é obrigatório'),
  cep: Yup.string()
    .min(8, 'O CEP deve conter 8 dígitos')
    .max(8, 'O CEP deve conter 8 dígitos no máximo')
    .required('O cep é obrigatório'),
  uf: Yup.string().required('O estado é obrigatório'),
  city: Yup.string().required('A cidade é obrigatória'),
  street: Yup.string().required('A rua é obrigatória'),
  street_number: Yup.string().required('O número é obrigatório'),
  neighborhood: Yup.string().required('O bairro é obrigatório'),
  address_name: Yup.string().required('O nome do local é obrigatório'),
});

export default function GroupCreate({ match, className }) {
  const [modalChurch, setModalChurch] = useState(false);
  const [modalOrganizator, setModalOrganizator] = useState(false);
  const [initialState, setInitialState] = useState({
    cnpj: '',
    cpf: '',
    organization_id: null,
    organization_name: '',
    organizator_id: null,
    organizator_name: '',
    //
    is_public: '',
    is_online_payment: '',
    initial_date: '',
    end_date: '',
    default_event_id: '',
    ministery: '',
    cep: '',
    uf: '',
    city: '',
    street: '',
    street_number: '',
    neighborhood: '',
    address_name: '',
    complement: '',
  });

  const user_type = localStorage.getItem('@dashboard/user_type');

  const userData = useSelector(state => state.profile.data);
  const cepData = useSelector(state => state.cep.data);
  const defaultData = useSelector(state => state.defaultEvent.data);
  const organization = useSelector(state => state.organization.data);
  const organizator = useSelector(state => state.organizator.data);
  const profile = useSelector(state => state.profile.data);
  const loading = useSelector(state => state.organization.loading);
  const event_loading = useSelector(state => state.event.loading);

  const dispatch = useDispatch();

  const DatepickerButton = ({ value, onClick }) => (
    <Button
      outline
      block
      color="secondary"
      className="width-225 height-38"
      onClick={onClick}
    >
      {value}
    </Button>
  );

  function validateCPF(cpf) {
    let error;
    let sum = 0;
    let rest = 0;

    if (
      cpf.toString() === '00000000000' ||
      cpf.toString() === '11111111111' ||
      cpf.toString() === '99999999999'
    )
      error = 'O CPF é inválido';

    for (let index = 1; index <= 9; index++) {
      sum =
        sum +
        parseInt(cpf.toString().substring(index - 1, index)) * (11 - index);
    }

    rest = (sum * 10) % 11;

    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf.toString().substring(9, 10)))
      error = 'O CPF é inválido';

    sum = 0;

    for (let index = 1; index <= 10; index++) {
      sum =
        sum +
        parseInt(cpf.toString().substring(index - 1, index)) * (12 - index);
    }

    rest = (sum * 10) % 11;

    if (rest === 10 || rest === 11) rest = 0;
    if (rest !== parseInt(cpf.toString().substring(10, 11)))
      error = 'O CPF é inválido';

    return error;
  }

  function toggleModalChurch() {
    setModalChurch(!modalChurch);
  }

  function toggleModalOrganizator() {
    setModalOrganizator(!modalOrganizator);
  }

  function handleSubmit(values) {
    console.tron.log('teste');
    const data = {
      is_public: values.is_public === 'true' ? true : false,
      is_online_payment: values.is_online_payment === 'true' ? true : false,
      default_event_id: parseInt(values.default_event_id),
      responsible_organization_id: values.organization_id,
      organizator_id: values.organizator_id,
      address_name: values.address_name,
      start_date: values.initial_date,
      end_date: values.end_date,
      cep: values.cep,
      city: values.city,
      uf: values.uf,
      country: 'Brasil',
      street: values.street,
      street_number: values.street_number,
      neighborhood: values.neighborhood,
      complement: values.complement,
      img_address_url:
        'https://arcowebarquivos-us.s3.amazonaws.com/imagens/52/21/arq_85221.jpg',
      is_finished: false,
    };

    dispatch(EventActions.addEventRequest(data));
  }

  function handleSearchChurch(values) {
    const { cnpj } = values;

    dispatch(OrganizationActions.searchOrganizationRequest(cnpj));
  }

  function handleSearchOrganizator(values) {
    const { cpf } = values;

    dispatch(
      OrganizatorActions.searchOrganizatorRequest(
        'leader',
        cpf,
        values.default_event_id
      )
    );
  }

  function confirmModalChurch(event, setFieldValue) {
    setFieldValue('organization_id', organization.id);
    setFieldValue('organization_name', organization.corporate_name);

    setModalChurch(false);
  }

  function confirmModalOrganizator(event, setFieldValue) {
    setFieldValue('organizator_id', organizator.id);
    setFieldValue('organizator_name', organizator.name);

    setModalOrganizator(false);
  }

  function handleSelfOrganizator(setFieldValue) {
    setFieldValue('organizator_id', profile.id);
    setFieldValue('organizator_name', `${profile.name} (você)`);
  }

  function handleCep(event, setFieldValue, values) {
    setFieldValue('cep', event.target.value);

    if (event.target.value.length === 8) {
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

      dispatch(CepActions.cepRequest(event.target.value));
    }
  }

  function handleEvent(e, setFieldValue) {
    const value = e.target.value;
    setFieldValue('default_event_id', value);

    defaultData.map(event => {
      if (event.id === parseInt(value)) {
        setFieldValue('ministery', event.ministery.name);
      }
    });
  }

  useEffect(() => {
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
  }, [userData]);

  useEffect(() => {
    if (!!cepData.cep) {
      setInitialState({
        ...initialState,
        ['cep']: cepData.cep.replace('-', ''),
        ['uf']: cepData.uf,
        ['city']: cepData.localidade,
        ['street']: cepData.logradouro,
        ['neighborhood']: cepData.bairro,
        ['complement']: cepData.complemento,
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
                              selected={values.initial_date}
                              onChange={date =>
                                setFieldValue('initial_date', date)
                              }
                              customInput={<DatepickerButton />}
                              minDate={subMonths(new Date(), 12)}
                              calendarClassName="width-350"
                              dateFormat="dd/MM/yyyy hh:mm aa"
                              showMonthDropdown
                              showYearDropdown
                              dropdownMode="select"
                              showTimeSelect
                              timeFormat="HH:mm"
                              timeIntervals={5}
                              timeCaption="Horário"
                              className={`
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
                        <Col lg="2" md="6" sm="12">
                          <FormGroup>
                            <Label for="end_date">Formatura</Label>
                            <div className="position-relative has-icon-left">
                              <Datepicker
                                name="end_date"
                                id="end_date"
                                selected={values.end_date}
                                onChange={date =>
                                  setFieldValue('end_date', date)
                                }
                                customInput={<DatepickerButton />}
                                minDate={values.initial_date}
                                calendarClassName="width-350"
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

                    {values.default_event_id !== '' && (
                      <>
                        <h4 className="form-section">
                          <i className="fa fa-user" size={20} color="#212529" />{' '}
                          Dados do líder responsável
                        </h4>
                        <Row className="align-items-center">
                          <Col sm="12" md="12" lg="6" className="mb-2">
                            <FormGroup>
                              <Label className="ml-2" for="organizator">
                                Nome do líder
                              </Label>
                              <Field
                                readOnly
                                type="text"
                                placeholder="Pesquise o líder"
                                name="organizator_name"
                                id="organizator_name"
                                onClick={toggleModalOrganizator}
                                className={`
                                  form-control
                                  ${errors.organizator_name &&
                                    touched.organizator_name &&
                                    'is-invalid'}
                                `}
                              />
                            </FormGroup>
                          </Col>
                          <Col sm="6" md="6" lg="3">
                            {user_type === 'entity' && (
                              <Button
                                className="mb-2 mr-2"
                                block
                                color="success"
                                onClick={() =>
                                  handleSelfOrganizator(setFieldValue)
                                }
                              >
                                Eu serei o líder
                              </Button>
                            )}
                          </Col>
                          <Col sm="6" md="6" lg="3">
                            <Button
                              className="mb-2"
                              block
                              color="success"
                              onClick={toggleModalOrganizator}
                            >
                              Pesquisar líder
                            </Button>
                          </Col>
                        </Row>
                      </>
                    )}

                    <h4 className="form-section">
                      <i className="fa fa-home" size={20} color="#212529" />{' '}
                      Dados da Igreja responsável
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
                      <Col sm="12" md="6" lg="4">
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

                    <h4 className="form-section">
                      <MapPin size={20} color="#212529" /> Localização do grupo
                    </h4>
                    <Row>
                      <Col lg="4" md="6" sm="12">
                        <FormGroup>
                          <Label for="cep">CEP</Label>
                          <div className="position-relative has-icon-left">
                            <Field
                              type="number"
                              placeholder="Ex: 17580000"
                              name="cep"
                              id="cep"
                              onChange={event =>
                                handleCep(event, setFieldValue, values)
                              }
                              className={`
                                  form-control
                                  ${errors.cep && touched.cep && 'is-invalid'}
                                `}
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
                            <div className="invalid-feedback">{errors.uf}</div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col lg="4" md="6" sm="12">
                        <FormGroup>
                          <Label for="city">Cidade</Label>
                          <Field
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
                      <Col lg="4" md="6" sm="12">
                        <FormGroup>
                          <Label for="street">Rua</Label>
                          <div className="position-relative has-icon-left">
                            <Field
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
                      <Col lg="4" md="6" sm="12">
                        <FormGroup>
                          <Label for="street_number">Número</Label>
                          <div className="position-relative has-icon-left">
                            <Field
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
                      <Col lg="4" md="6" sm="12">
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
                    </Row>
                    <Row>
                      <Col lg="6" md="12" sm="12">
                        <FormGroup>
                          <Label for="address_name">Nome do local</Label>
                          <div className="position-relative has-icon-left">
                            <Field
                              type="text"
                              placeholder="Ex: Igreja Evangêlica Holiness"
                              name="address_name"
                              id="address_name"
                              className={`
                                  form-control
                                  ${errors.address_name &&
                                    touched.address_name &&
                                    'is-invalid'}
                                `}
                            />
                            {errors.address_name && touched.address_name ? (
                              <div className="invalid-feedback">
                                {errors.address_name}
                              </div>
                            ) : null}
                            <div className="form-control-position">
                              <Compass size={14} color="#212529" />
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col lg="6" md="12" sm="12">
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

                    <div className="form-actions right">
                      <FormGroup>
                        {event_loading ? (
                          <Button
                            disabled
                            color="secondary"
                            // block
                            // className="btn-default btn-raised"
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
                            color="success"
                            // onClick={() => handleSubmit(values)}
                            block
                            // className="btn-default btn-raised"
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
                      <Form>
                        <ModalHeader toggle={toggleModalChurch}>
                          Pesquisar por igreja responsável
                        </ModalHeader>
                        <ModalBody>
                          <div className="form-body">
                            <Row className="d-flex flex-row f">
                              <Col lg="12" md="12" sm="12">
                                <FormGroup>
                                  <Label for="cnpj">CNPJ</Label>
                                  <Row className="d-flex flex-row f">
                                    <Col
                                      lg="8"
                                      md="12"
                                      sm="12"
                                      className="mb-2"
                                    >
                                      <div className="position-relative">
                                        <Field
                                          type="text"
                                          placeholder="Pesquise o cnpj"
                                          name="cnpj"
                                          id="cnpj"
                                          className={`
                                          form-control
                                          ${errors.cnpj &&
                                            touched.cnpj &&
                                            'is-invalid'}
                                        `}
                                        />
                                        {errors.cnpj && touched.cnpj ? (
                                          <div className="invalid-feedback">
                                            {errors.cnpj}
                                          </div>
                                        ) : null}
                                      </div>
                                    </Col>
                                    <Col lg="4" md="12" sm="12">
                                      <Button
                                        className="rounded-right width-100-per"
                                        onClick={() =>
                                          handleSearchChurch(values)
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
                                          <Search size={22} color="#fff" />
                                        )}
                                      </Button>
                                    </Col>
                                  </Row>
                                </FormGroup>
                              </Col>
                              <Col sm="12" md="12" lg="2" />
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
                                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
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
                                      <Row className="grey">
                                        <Col xs="4">
                                          <Link to="/user-profile">
                                            <i className="fa fa-star fa-lg pr-2" />
                                            <span>3.6</span>
                                          </Link>
                                        </Col>
                                        <Col xs="8">
                                          <Link to="/user-profile">
                                            <i className="fa fa-globe fa-lg pr-2" />
                                            {organization.addresses &&
                                            organization.addresses.length >
                                              0 ? (
                                              <span>
                                                {
                                                  organization.addresses[0]
                                                    .country
                                                }
                                              </span>
                                            ) : (
                                              <span>N/A</span>
                                            )}
                                          </Link>
                                        </Col>
                                      </Row>
                                    </CardBody>
                                  </Card>
                                </Col>
                              </>
                            )}
                          </div>
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
                      </Form>
                    </Modal>

                    {/* MODAL PARA PESQUISA ORGANIZADOR */}
                    <Modal
                      isOpen={modalOrganizator}
                      toggle={toggleModalOrganizator}
                      className={className}
                      size="md"
                    >
                      <Form>
                        <ModalHeader toggle={toggleModalOrganizator}>
                          Pesquisar por líder responsável
                        </ModalHeader>
                        <ModalBody>
                          <div className="form-body">
                            <Row className="d-flex flex-row f">
                              <Col lg="12" md="12" sm="12">
                                <FormGroup>
                                  <Label for="cpf">CPF</Label>
                                  <Row className="d-flex flex-row f">
                                    <Col
                                      lg="8"
                                      md="12"
                                      sm="12"
                                      className="mb-2"
                                    >
                                      <div className="position-relative">
                                        <Field
                                          type="text"
                                          placeholder="Pesquise o CPF"
                                          name="cpf"
                                          id="cpf"
                                          className={`
                                          form-control
                                          ${errors.cpf &&
                                            touched.cpf &&
                                            'is-invalid'}
                                        `}
                                          validate={validateCPF}
                                        />
                                        {errors.cpf && touched.cpf ? (
                                          <div className="invalid-feedback">
                                            {errors.cpf}
                                          </div>
                                        ) : null}
                                      </div>
                                    </Col>
                                    <Col lg="4" md="12" sm="12">
                                      <Button
                                        className="rounded-right width-100-per"
                                        onClick={() =>
                                          handleSearchOrganizator(values)
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
                                          <Search size={22} color="#fff" />
                                        )}
                                      </Button>
                                    </Col>
                                  </Row>
                                </FormGroup>
                              </Col>
                              <Col sm="12" md="12" lg="2" />
                            </Row>
                          </div>
                          <div>
                            {organizator !== null && !!organizator.cpf && (
                              <>
                                <Col>
                                  <Card>
                                    <CardHeader className="text-center">
                                      <img
                                        src={
                                          !!organizator.file
                                            ? organizator.file.url
                                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                                        }
                                        alt="Brek"
                                        width="150"
                                        height="150"
                                        className="rounded-circle gradient-mint"
                                      />
                                    </CardHeader>
                                    <CardBody>
                                      <h4 className="card-title text-center">
                                        {organizator.name}
                                      </h4>
                                      <p className="category text-gray font-small-4 text-center">
                                        {organizator.cpf}
                                      </p>
                                      <p className="category text-gray font-small-4 text-center">
                                        Líder
                                      </p>
                                      <hr className="grey" />
                                      <Row className="grey">
                                        <Col xs="4">
                                          <Link to="/user-profile">
                                            <i className="fa fa-star fa-lg pr-2" />
                                            <span>3.6</span>
                                          </Link>
                                        </Col>
                                        <Col xs="8">
                                          <Link to="/user-profile">
                                            <i className="fa fa-globe fa-lg pr-2" />
                                            {organizator.addresses &&
                                            organizator.addresses.length > 0 ? (
                                              <span>
                                                {
                                                  organizator.addresses[0]
                                                    .country
                                                }
                                              </span>
                                            ) : (
                                              <span>N/A</span>
                                            )}
                                          </Link>
                                        </Col>
                                      </Row>
                                    </CardBody>
                                  </Card>
                                </Col>
                              </>
                            )}
                          </div>
                        </ModalBody>
                        <ModalFooter>
                          <Button
                            className="ml-1 my-1"
                            color="danger"
                            onClick={toggleModalOrganizator}
                          >
                            Cancelar
                          </Button>{' '}
                          <Button
                            disabled={organizator !== null ? false : true}
                            className={`${
                              organizator !== null
                                ? 'ml-1 my-1 btn-success'
                                : 'btn-secundary ml-1 my-1'
                            }`}
                            onClick={event =>
                              confirmModalOrganizator(event, setFieldValue)
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
                              'Adicionar líder'
                            )}
                          </Button>
                        </ModalFooter>
                      </Form>
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
