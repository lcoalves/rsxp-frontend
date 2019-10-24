/* eslint-disable array-callback-return */
import React, { useState, useEffect, Component } from 'react';

import NumberFormat from 'react-number-format';
import AvatarImageCropper from 'react-avatar-image-cropper';

import { Formik, Field, Form, FieldArray } from 'formik';
import { Datepicker } from 'react-formik-ui';
import * as Yup from 'yup';

import { useSelector, useDispatch } from 'react-redux';

import { Creators as AvatarActions } from '~/store/ducks/avatar';
import { Creators as ProfileActions } from '~/store/ducks/profile';
import { Creators as CepActions } from '~/store/ducks/cep';

import {
  TabContent,
  TabPane,
  Nav,
  NavItem,
  NavLink,
  Card,
  Button,
  Row,
  Col,
  Label,
  FormGroup,
  Input,
  CardBody,
} from 'reactstrap';

import {
  Map,
  CheckSquare,
  User,
  AtSign,
  CreditCard,
  Calendar,
  Smartphone,
  Phone,
  MapPin,
  Facebook,
  Instagram,
  Linkedin,
  Edit,
  Navigation,
  Plus,
  X,
} from 'react-feather';

import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';

import { validateCPF } from '~/services/validateCPF';

import CustomTabs from '../../components/tabs/default';

import statesCities from '../../assets/data/statesCities';
import TableExtended from './table';

import classnames from 'classnames';
import { push } from 'connected-react-router';

const formSchema = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  email: Yup.string()
    .email('O email inválido')
    .required('O email é obrigatório'),
  personalState: Yup.string().required('O estado civil é obrigatório'),
  sex: Yup.string().required('O sexo é obrigatório'),
  phone: Yup.string().required('O celular é obrigatório'),
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

class AltPhoneFormat extends Component {
  state = {
    value: '',
  };

  render() {
    return (
      <NumberFormat
        inputMode="decimal"
        displayType="input"
        format="(##)####-####"
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

export default function TabsBorderBottom() {
  const [activeTab, setActiveTab] = useState('1');
  const [estado, setEstado] = useState('');
  const [src, setSrc] = useState(null);
  const [addresses, setAddresses] = useState([
    {
      type: '',
      other_type_name: '',
      cep: '',
      uf: '',
      city: '',
      street: '',
      street_number: '',
      neighborhood: '',
      complement: '',
    },
  ]);

  const dispatch = useDispatch();

  const loading = useSelector(state => state.profile.loading);
  const data = useSelector(state => state.profile.data);
  const cepData = useSelector(state => state.cep.data);

  const DatepickerButton = ({ value, onClick }) => (
    <Button
      outline
      color="secondary"
      className="width-225 height-38"
      onClick={onClick}
    >
      {value}
    </Button>
  );

  function toggle(tab) {
    if (activeTab !== tab) {
      setActiveTab(tab);
    }
  }

  function apply(file) {
    setSrc(URL.createObjectURL(file));

    dispatch(
      AvatarActions.avatarRequest(file, file.name, file.size, file.type)
    );
  }

  function handleCep(cep, setFieldValue, values, index) {
    setFieldValue(`addresses.${index}.cep`, cep);
    console.tron.log(addresses);
    console.tron.log(cep);
    console.tron.log(values);

    if (cep.length === 8) {
      setAddresses(values.addresses);

      dispatch(CepActions.cepRequest(cep, index));
    }
  }

  function handleUpdateProfile(values) {
    const formattedCpf = values.cpf
      .replace('.', '')
      .replace('.', '')
      .replace('-', '');
    const formattedPhone = values.phone
      .replace('(', '')
      .replace(')', '')
      .replace('-', '');
    const formattedAltPhone = values.altPhone
      .replace('(', '')
      .replace(')', '')
      .replace('-', '');

    const toSend = {
      name: values.name,
      email: values.email !== data.email && values.email,
      personal_state_id: values.personalState,
      cpf: formattedCpf !== data.cpf && formattedCpf,
      birthday: values.birthday,
      sex: values.sex,
      phone: formattedPhone,
      alt_phone: formattedAltPhone,
    };

    !toSend.cpf && delete toSend.cpf;
    !toSend.email && delete toSend.email;

    dispatch(ProfileActions.editProfileRequest(toSend));
  }

  function handleUpdateAddress(values) {
    console.tron.log(values);
  }

  useEffect(() => {
    if (!!cepData.cep) {
      const copy = addresses;

      copy[cepData.index].cep = cepData.cep.replace('-', '');
      copy[cepData.index].uf = cepData.uf !== '' ? cepData.uf : '';
      copy[cepData.index].city =
        cepData.localidade !== '' ? cepData.localidade : '';
      copy[cepData.index].street =
        cepData.logradouro !== '' ? cepData.logradouro : '';
      copy[cepData.index].neighborhood =
        cepData.bairro !== '' ? cepData.bairro : '';

      setAddresses(copy);
      setAddresses([...addresses]);
    }
  }, [cepData]);

  return (
    <div>
      <Nav tabs>
        <NavItem>
          <NavLink
            className={classnames({
              active: activeTab === '1',
            })}
            onClick={() => {
              toggle('1');
            }}
          >
            Meus Dados
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({
              active: activeTab === '2',
            })}
            onClick={() => {
              toggle('2');
            }}
          >
            Endereços
          </NavLink>
        </NavItem>
        <NavItem>
          <NavLink
            className={classnames({
              active: activeTab === '3',
            })}
            onClick={() => {
              toggle('3');
            }}
          >
            Redes Sociais
          </NavLink>
        </NavItem>
        {/* <NavItem>
          <NavLink
            className={classnames({
              active: activeTab === '4',
            })}
            onClick={() => {
              toggle('4');
            }}
          >
            Histórico de atividades
          </NavLink>
        </NavItem> */}
        {/* <NavItem>
            <NavLink
              className={classnames({
                active: activeTab === "5"
              })}
              onClick={() => {
                toggle("5");
              }}
            >
              Configurações
            </NavLink>
          </NavItem> */}
      </Nav>
      <TabContent activeTab={activeTab}>
        <TabPane tabId="1">
          <Row>
            <Col sm="3">
              <CardBody>
                <Row className="py-2">
                  {!!data.file ? (
                    <div
                      style={{
                        backgroundImage: `url('${
                          src !== null ? src : data.file.url
                        }')`,
                        backgroundSize: 'cover',
                        width: '100%',
                        height: '350px',
                        margin: 'auto',
                      }}
                    >
                      <AvatarImageCropper
                        apply={file => apply(file)}
                        isBack={true}
                        text="Atualizar foto"
                      />
                    </div>
                  ) : (
                    <div
                      style={{
                        backgroundImage: `url('${
                          src !== null
                            ? src
                            : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                        }')`,
                        backgroundSize: 'cover',
                        width: '100%',
                        height: '350px',
                        margin: 'auto',
                      }}
                    >
                      <AvatarImageCropper
                        apply={file => apply(file)}
                        isBack={true}
                        text="Atualizar foto"
                      />
                    </div>
                  )}
                </Row>
              </CardBody>
            </Col>
            <Col sm="9">
              <Card>
                <CardBody>
                  <Formik
                    enableReinitialize
                    initialValues={{
                      name: !!data.name ? data.name : '',
                      email: !!data.email ? data.email : '',
                      personalState: !!data.personal_state_id
                        ? data.personal_state_id
                        : '',
                      cpf: !!data.cpf ? data.cpf : '',
                      birthday: !!data.birthday ? data.birthday : new Date(),
                      sex: !!data.sex ? data.sex : '',
                      phone: !!data.phone ? data.phone : '',
                      altPhone: !!data.alt_phone ? data.alt_phone : '',
                    }}
                    validationSchema={formSchema}
                    onSubmit={values => handleUpdateProfile(values)}
                  >
                    {({ errors, touched, setFieldValue, values }) => (
                      <Form>
                        <FormGroup>
                          {/* Nome e sobrenome */}
                          <Row>
                            <Col
                              sm="12"
                              md="12"
                              lg="12"
                              className="has-icon-left"
                            >
                              <Label>Nome</Label>
                              <div className="position-relative has-icon-left">
                                <Field
                                  type="text"
                                  name="name"
                                  id="name"
                                  className={`
                                      form-control
                                      ${errors.name &&
                                        touched.name &&
                                        'is-invalid'}
                                    `}
                                  autoComplete="off"
                                />
                                {errors.name && touched.name ? (
                                  <div className="invalid-feedback">
                                    {errors.name}
                                  </div>
                                ) : null}
                                <div className="form-control-position">
                                  <User size={14} color="#212529" />
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </FormGroup>
                        <FormGroup>
                          {/* Email e estado civil */}
                          <Row>
                            <Col
                              sm="12"
                              md="6"
                              lg="8"
                              className="has-icon-left"
                            >
                              <Label>Email</Label>
                              <div className="position-relative has-icon-left">
                                <Field
                                  type="text"
                                  name="email"
                                  id="email"
                                  className={`
                                      form-control
                                      ${errors.email &&
                                        touched.email &&
                                        'is-invalid'}
                                    `}
                                />
                                {errors.email && touched.email ? (
                                  <div className="invalid-feedback">
                                    {errors.email}
                                  </div>
                                ) : null}
                                <div className="form-control-position">
                                  <AtSign size={14} color="#212529" />
                                </div>
                              </div>
                            </Col>
                            <Col sm="12" md="6" lg="4">
                              <Label>Estado civil</Label>
                              <Field
                                type="select"
                                component="select"
                                name="personalState"
                                id="personalState"
                                className={`
                                    form-control
                                    ${errors.personalState &&
                                      touched.personalState &&
                                      'is-invalid'}
                                  `}
                              >
                                <option value="" disabled="">
                                  Selecione uma opção
                                </option>
                                <option value="3">Solteiro(a)</option>
                                <option value="1">Casado(a)</option>
                                <option value="5">Viúvo(a)</option>
                                <option value="2">Divorciado(a)</option>
                                <option value="4">Segundo casamento</option>
                              </Field>
                              {errors.personalState && touched.personalState ? (
                                <div className="invalid-feedback">
                                  {errors.personalState}
                                </div>
                              ) : null}
                            </Col>
                          </Row>
                        </FormGroup>
                        <FormGroup>
                          {/* CPF e Nascimento e genero */}
                          <Row>
                            <Col
                              sm="12"
                              md="12"
                              lg="5"
                              className="has-icon-left"
                            >
                              <FormGroup>
                                <Label for="cpf">CPF</Label>
                                <div className="position-relative has-icon-left">
                                  <Field
                                    name="cpf"
                                    id="cpf"
                                    className={`
                                    form-control
                                    ${errors.cpf && touched.cpf && 'is-invalid'}
                                  `}
                                    validate={validateCPF}
                                    render={({ field }) => (
                                      <CpfFormat
                                        {...field}
                                        id="cpf"
                                        name="cpf"
                                        className={`
                                      form-control
                                      ${errors.cpf &&
                                        touched.cpf &&
                                        'is-invalid'}
                                    `}
                                        value={values.cpf}
                                      />
                                    )}
                                  />
                                  {errors.cpf && touched.cpf ? (
                                    <div className="invalid-feedback">
                                      {errors.cpf}
                                    </div>
                                  ) : null}
                                  <div className="form-control-position">
                                    <CreditCard size={14} color="#212529" />
                                  </div>
                                </div>
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="12" lg="4">
                              <FormGroup>
                                <Label for="birthday">Nascimento</Label>
                                <div className="position-relative has-icon-left">
                                  <Datepicker
                                    name="birthday"
                                    id="birthday"
                                    selected={values.birthday}
                                    onChange={date =>
                                      setFieldValue('birthday', date)
                                    }
                                    customInput={<DatepickerButton />}
                                    showMonthDropdown
                                    showYearDropdown
                                    dropdownMode="select"
                                    className={`
                                  form-control
                                  ${errors.birthday &&
                                    touched.birthday &&
                                    'is-invalid'}
                                `}
                                  />
                                  {errors.birthday && touched.birthday ? (
                                    <div className="invalid-feedback">
                                      {errors.birthday}
                                    </div>
                                  ) : null}
                                  <div className="form-control-position">
                                    <Calendar size={14} color="#212529" />
                                  </div>
                                </div>
                              </FormGroup>
                            </Col>
                            <Col sm="12" md="12" lg="3">
                              <Label>Sexo</Label>
                              <Field
                                type="select"
                                component="select"
                                name="sex"
                                id="sex"
                                className={`
                                      form-control
                                      ${errors.sex &&
                                        touched.sex &&
                                        'is-invalid'}
                                    `}
                              >
                                <option value="" disabled="">
                                  Selecione uma opção
                                </option>
                                <option value="M">Masculino</option>
                                <option value="F">Feminino</option>
                              </Field>
                              {errors.sex && touched.sex ? (
                                <div className="invalid-feedback">
                                  {errors.sex}
                                </div>
                              ) : null}
                            </Col>
                          </Row>
                        </FormGroup>
                        <FormGroup>
                          {/* Celular e telefone */}
                          <Row>
                            <Col
                              sm="12"
                              md="6"
                              lg="6"
                              className="has-icon-left"
                            >
                              <Label>Celular</Label>
                              <div className="position-relative has-icon-left">
                                <Field
                                  name="phone"
                                  id="phone"
                                  className={`
                                    form-control
                                    ${errors.phone &&
                                      touched.phone &&
                                      'is-invalid'}
                                  `}
                                  render={({ field }) => (
                                    <PhoneFormat
                                      {...field}
                                      id="phone"
                                      name="phone"
                                      className={`
                                        form-control
                                        ${errors.phone &&
                                          touched.phone &&
                                          'is-invalid'}
                                      `}
                                      value={values.phone}
                                    />
                                  )}
                                />
                                {errors.phone && touched.phone ? (
                                  <div className="invalid-feedback">
                                    {errors.phone}
                                  </div>
                                ) : null}
                                <div className="form-control-position">
                                  <Smartphone size={14} color="#212529" />
                                </div>
                              </div>
                            </Col>
                            <Col sm="12" md="6" lg="6">
                              <Label>Telefone</Label>
                              <div className="position-relative has-icon-left">
                                <Field
                                  name="altPhone"
                                  id="altPhone"
                                  className={`
                                    form-control
                                    ${errors.altPhone &&
                                      touched.altPhone &&
                                      'is-invalid'}
                                  `}
                                  render={({ field }) => (
                                    <AltPhoneFormat
                                      {...field}
                                      id="altPhone"
                                      name="altPhone"
                                      className={`
                                        form-control
                                        ${errors.altPhone &&
                                          touched.altPhone &&
                                          'is-invalid'}
                                      `}
                                      value={values.altPhone}
                                    />
                                  )}
                                />
                                {errors.altPhone && touched.altPhone ? (
                                  <div className="invalid-feedback">
                                    {errors.altPhone}
                                  </div>
                                ) : null}
                                <div className="form-control-position">
                                  <Phone size={14} color="#212529" />
                                </div>
                              </div>
                            </Col>
                          </Row>
                        </FormGroup>
                        <FormGroup>
                          {loading ? (
                            <Button
                              disabled
                              color="success"
                              block
                              className="btn-default btn-raised"
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
                              block
                              className="btn-default btn-raised"
                            >
                              Atualizar perfil
                            </Button>
                          )}
                        </FormGroup>
                      </Form>
                    )}
                  </Formik>
                </CardBody>
              </Card>
            </Col>
          </Row>
        </TabPane>

        {/* --------------------ABA DE ENDEREÇO-------------------- */}
        <TabPane tabId="2">
          <Card>
            <CardBody>
              <Formik
                enableReinitialize
                initialValues={{
                  addresses,
                }}
                onSubmit={values => handleUpdateAddress(values)}
              >
                {({ errors, touched, setFieldValue, values, handleChange }) => (
                  <Form>
                    <FieldArray
                      name="addresses"
                      render={({ remove, push }) => (
                        <>
                          {values.addresses.length > 0 &&
                            values.addresses.map((address, index) => (
                              <div key={index}>
                                <Row className="justify-content-between">
                                  <h3>Endereço {index + 1}</h3>
                                  {values.addresses.length > 1 && (
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
                                      <Label for={`addresses.${index}.type`}>
                                        Tipo endereço
                                      </Label>
                                      <div className="position-relative has-icon-left">
                                        <Field
                                          type="select"
                                          component="select"
                                          id={`addresses.${index}.type`}
                                          name={`addresses.${index}.type`}
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
                                          <option key="home" value="home">
                                            Casa
                                          </option>
                                          <option key="work" value="work">
                                            Trabalho
                                          </option>
                                          <option key="other" value="other">
                                            Outro
                                          </option>
                                        </Field>
                                        <div className="form-control-position">
                                          <Map size={14} color="#212529" />
                                        </div>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  {address.type === 'other' && (
                                    <Col sm="8">
                                      <FormGroup>
                                        <Label
                                          for={`addresses.${index}.other_type_name`}
                                        >
                                          Apelido do endereço
                                        </Label>
                                        <Field
                                          type="text"
                                          id={`addresses.${index}.other_type_name`}
                                          name={`addresses.${index}.other_type_name`}
                                          placeholder="Ex: Casa da minha mãe"
                                          className={`
                                        form-control
                                        ${errors.other_type_name &&
                                          touched.other_type_name &&
                                          'is-invalid'}
                                      `}
                                        />
                                        {errors.other_type_name &&
                                        touched.other_type_name ? (
                                          <div className="invalid-feedback">
                                            {errors.other_type_name}
                                          </div>
                                        ) : null}
                                      </FormGroup>
                                    </Col>
                                  )}
                                </Row>
                                <Row>
                                  <Col sm="3">
                                    <FormGroup>
                                      <Label for={`addresses.${index}.cep`}>
                                        CEP
                                      </Label>
                                      <div className="position-relative has-icon-left">
                                        <CepFormat
                                          autoComplete="cep"
                                          name={`addresses.${index}.cep`}
                                          id={`addresses.${index}.cep`}
                                          placeholder="Ex: 17580-000"
                                          className={`
                                            form-control
                                            ${errors.cep &&
                                              touched.cep &&
                                              'is-invalid'}
                                          `}
                                          value={values.cep}
                                          onValueChange={val =>
                                            handleCep(
                                              val.value,
                                              setFieldValue,
                                              values,
                                              index
                                            )
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
                                  <Col sm="3">
                                    <FormGroup>
                                      <Label for={`addresses.${index}.uf`}>
                                        Estado
                                      </Label>
                                      <Field
                                        readOnly
                                        type="text"
                                        id={`addresses.${index}.uf`}
                                        name={`addresses.${index}.uf`}
                                        className="form-control"
                                      />
                                    </FormGroup>
                                  </Col>
                                  <Col sm="6">
                                    <FormGroup>
                                      <Label for={`addresses.${index}.city`}>
                                        Cidade
                                      </Label>
                                      <Field
                                        type="text"
                                        id={`addresses.${index}.city`}
                                        name={`addresses.${index}.city`}
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
                                      <Label for={`addresses.${index}.street`}>
                                        Rua
                                      </Label>
                                      <div className="position-relative has-icon-left">
                                        <Field
                                          type="text"
                                          id={`addresses.${index}.street`}
                                          name={`addresses.${index}.street`}
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
                                      <Label
                                        for={`addresses.${index}.street_number`}
                                      >
                                        Número
                                      </Label>
                                      <div className="position-relative has-icon-left">
                                        <Field
                                          type="text"
                                          id={`addresses.${index}.street_number`}
                                          name={`addresses.${index}.street_number`}
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
                                          <Navigation
                                            size={14}
                                            color="#212529"
                                          />
                                        </div>
                                      </div>
                                    </FormGroup>
                                  </Col>
                                  <Col sm="4">
                                    <FormGroup>
                                      <Label
                                        for={`addresses.${index}.neighborhood`}
                                      >
                                        Bairro
                                      </Label>
                                      <div className="position-relative has-icon-left">
                                        <Field
                                          type="text"
                                          id={`addresses.${index}.neighborhood`}
                                          name={`addresses.${index}.neighborhood`}
                                          className={`
                                        form-control
                                        ${errors.neighborhood &&
                                          touched.neighborhood &&
                                          'is-invalid'}
                                      `}
                                        />
                                        {errors.neighborhood &&
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
                                <FormGroup>
                                  <Label for={`addresses.${index}.complement`}>
                                    Complemento
                                  </Label>
                                  <div className="position-relative has-icon-left">
                                    <Field
                                      type="text"
                                      id={`addresses.${index}.complement`}
                                      name={`addresses.${index}.complement`}
                                      className="form-control"
                                    />
                                    <div className="form-control-position">
                                      <Edit size={14} color="#212529" />
                                    </div>
                                  </div>
                                </FormGroup>
                                <div className="form-actions right" />
                              </div>
                            ))}

                          <Button
                            color="success"
                            onClick={() =>
                              push({
                                type: '',
                                other_type_name: '',
                                cep: '',
                                uf: '',
                                city: '',
                                street: '',
                                street_number: '',
                                neighborhood: '',
                                complement: '',
                              })
                            }
                          >
                            <Plus size={16} color="#fff" /> Adicionar outro
                            endereço
                          </Button>
                        </>
                      )}
                    />

                    <div className="form-actions right" />

                    {loading ? (
                      <Button
                        disabled
                        color="secondary"
                        block
                        className="btn-default btn-raised"
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
                        block
                        className="btn-default btn-raised"
                      >
                        Atualizar endereços
                      </Button>
                    )}
                  </Form>
                )}
              </Formik>
            </CardBody>
          </Card>
        </TabPane>
        {/* ---------------------ABA DE REDES SOCIAIS ------------------------ */}
        <TabPane tabId="3">
          <Card>
            <CardBody>
              <div className="px-3">
                <Form>
                  <div className="form-body">
                    <FormGroup>
                      <Label for="facebook">Facebook</Label>
                      <div className="input-group">
                        <div className="has-icon-left input-group-prepend">
                          <span className="pl-4 input-group-text">
                            https://www.facebook.com/
                          </span>
                          <div className="form-control-position">
                            <Facebook size={14} color="#212529" />
                          </div>
                        </div>
                        <Input type="text" id="facebook" name="facebook" />
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label for="instagram">Instagram</Label>
                      <div className="input-group">
                        <div className="has-icon-left input-group-prepend">
                          <span className="pl-4 input-group-text">
                            https://www.instagram.com/
                          </span>
                          <div className="form-control-position">
                            <Instagram size={14} color="#212529" />
                          </div>
                        </div>
                        <Input type="text" id="instagram" name="instagram" />
                      </div>
                    </FormGroup>
                    <FormGroup>
                      <Label for="linkedin">Linkedin</Label>
                      <div className="input-group">
                        <div className="has-icon-left input-group-prepend">
                          <span className="pl-4 input-group-text">
                            https://www.linkedin.com/in/
                          </span>
                          <div className="form-control-position">
                            <Linkedin size={14} color="#212529" />
                          </div>
                        </div>
                        <Input type="text" id="linkedin" name="linkedin" />
                      </div>
                    </FormGroup>
                  </div>
                  <div className="form-actions right">
                    {loading ? (
                      <Button
                        disabled
                        color="success"
                        block
                        className="btn-default btn-raised"
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
                        color="success"
                        block
                        className="btn-default btn-raised"
                      >
                        Atualizar redes sociais
                      </Button>
                    )}
                  </div>
                </Form>
              </div>
            </CardBody>
          </Card>
        </TabPane>

        {/* ---------------- ABA DE HISTORICO ------------------ */}
        <TabPane tabId="4">
          <Card>
            <CardBody>
              <CustomTabs TabContent={<TableExtended />} />
            </CardBody>
          </Card>
        </TabPane>
        <TabPane tabId="5">
          <Card>
            <CardBody />
          </Card>
        </TabPane>
      </TabContent>
    </div>
  );
}
