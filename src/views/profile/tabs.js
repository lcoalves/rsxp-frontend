/* eslint-disable array-callback-return */
import React, { useState } from 'react';

import AvatarImageCropper from 'react-avatar-image-cropper';

import { Formik, Field, Form } from 'formik';
import { Datepicker } from 'react-formik-ui';
import * as Yup from 'yup';

import { useSelector, useDispatch } from 'react-redux';

import { Creators as AvatarActions } from '~/store/ducks/avatar';
import { Creators as ProfileActions } from '~/store/ducks/profile';

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
} from 'react-feather';

import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';

import CustomTabs from '../../components/tabs/default';

import statesCities from '../../assets/data/statesCities';
import TableExtended from './table';

import classnames from 'classnames';

const formSchema = Yup.object().shape({
  firstname: Yup.string().required('O nome é obrigatório'),
  lastname: Yup.string().required('O sobrenome é obrigatório'),
  email: Yup.string()
    .email('O email inválido')
    .required('O email é obrigatório'),
  personalState: Yup.string().required('O estado civil é obrigatório'),
  cpf: Yup.string()
    .max(11, 'Um CPF válido contem 11 dígitos')
    .required('O CPF é obrigatório'),
  sex: Yup.string().required('O sexo é obrigatório'),
  phone: Yup.string().required('O celular é obrigatório'),
});

export default function TabsBorderBottom() {
  const [activeTab, setActiveTab] = useState('1');
  const [estado, setEstado] = useState('');
  const [src, setSrc] = useState(null);

  const dispatch = useDispatch();

  const loading = useSelector(state => state.profile.loading);
  const data = useSelector(state => state.profile.data);

  const DatepickerButton = ({ value, onClick }) => (
    <Button
      outline
      color="secondary"
      className="width-250 height-38"
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

  function stateChange(values) {
    setEstado(values);
  }

  function handleUpdateProfile(values) {
    const data = {
      name: values.name,
      email: values.email,
      personal_state_id: values.personalState,
      cpf: values.cpf,
      birthday: values.birthday,
      sex: values.sex,
      phone: values.phone,
      alt_phone: values.altPhone,
    };

    dispatch(ProfileActions.editProfileRequest(data));
  }

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
                      personalState: !!data.personal_state
                        ? data.personal_state
                        : '',
                      cpf: !!data.cpf ? data.cpf : '',
                      birthday: !!data.birthday ? data.birthday : new Date(),
                      sex: !!data.sex ? data.sex : '',
                      phone: !!data.phone ? data.phone : '',
                      altPhone: !!data.alt_phone ? data.alt_phone : '',
                    }}
                    validationSchema={formSchema}
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
                              <Label>CPF</Label>
                              <div className="position-relative has-icon-left">
                                <Field
                                  type="text"
                                  name="cpf"
                                  id="cpf"
                                  className={`
                                      form-control
                                      ${errors.cpf &&
                                        touched.cpf &&
                                        'is-invalid'}
                                    `}
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
                            </Col>
                            <Col sm="12" md="12" lg="3">
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
                            <Col sm="12" md="12" lg="4">
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
                                  type="text"
                                  name="phone"
                                  id="phone"
                                  className={`
                                      form-control
                                      ${errors.phone &&
                                        touched.phone &&
                                        'is-invalid'}
                                    `}
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
                                  type="text"
                                  name="altPhone"
                                  id="altPhone"
                                  className={`
                                      form-control
                                      ${errors.altPhone &&
                                        touched.altPhone &&
                                        'is-invalid'}
                                    `}
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
                              color="success"
                              block
                              className="btn-default btn-raised"
                              onClick={() => handleUpdateProfile(values)}
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
              <div className="px-3">
                <Form>
                  <h3>Endereço 1</h3>
                  <div className="form-body">
                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <Label for="cep">Tipo endereço</Label>
                          <div className="position-relative has-icon-left">
                            <Input
                              type="select"
                              id="state"
                              name="state"
                              onChange={e => {
                                stateChange(`${e.target.value}`);
                              }}
                            >
                              <option
                                value="none"
                                defaultValue="none"
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
                            </Input>
                            <div className="form-control-position">
                              <Map size={14} color="#212529" />
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col sm="3">
                        <FormGroup>
                          <Label for="cep">CEP</Label>
                          <div className="position-relative has-icon-left">
                            <Input type="text" id="cep" name="cep" />
                            <div className="form-control-position">
                              <MapPin size={14} color="#212529" />
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col sm="3">
                        <FormGroup>
                          <Label for="state">Estado</Label>
                          <Input
                            type="select"
                            id="state"
                            name="state"
                            onChange={e => {
                              stateChange(`${e.target.value}`);
                            }}
                          >
                            <option
                              value="none"
                              defaultValue="none"
                              disabled=""
                            >
                              Selecione uma opção
                            </option>

                            {statesCities.map(state => {
                              return (
                                <option key={state.sigla} value={state.sigla}>
                                  {state.nome}
                                </option>
                              );
                            })}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col sm="3">
                        <FormGroup>
                          <Label for="city">Cidade</Label>
                          <Input type="select" id="city" name="city">
                            <option
                              value="none"
                              defaultValue="none"
                              disabled=""
                            >
                              Selecione uma opção
                            </option>

                            {statesCities.map(element => {
                              if (estado === element.sigla) {
                                const teste = element.cidades.map(cidade => {
                                  return (
                                    <option key={cidade} value={cidade}>
                                      {cidade}
                                    </option>
                                  );
                                });
                                return teste;
                              }
                            })}
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        <FormGroup>
                          <Label for="street">Rua</Label>
                          <div className="position-relative has-icon-left">
                            <Input type="text" id="street" name="street" />
                            <div className="form-control-position">
                              <i className="fa fa-road" />
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col sm="2">
                        <FormGroup>
                          <Label for="streetNumber">Número</Label>
                          <div className="position-relative has-icon-left">
                            <Input
                              type="text"
                              id="streetNumber"
                              name="streetNumber"
                            />
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
                            <Input
                              type="text"
                              id="neighborhood"
                              name="neighborhood"
                            />
                            <div className="form-control-position">
                              <i className="fa fa-map-signs" />
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <FormGroup>
                      <Label for="complement">Complemento</Label>
                      <div className="position-relative has-icon-left">
                        <Input type="text" id="complement" name="complement" />
                        <div className="form-control-position">
                          <Edit size={14} color="#212529" />
                        </div>
                      </div>
                    </FormGroup>
                  </div>
                  <div className="form-actions right" />
                  <h3>Endereço 2</h3>
                  <div className="form-body">
                    <Row>
                      <Col sm="3">
                        <FormGroup>
                          <Label for="cep">Tipo endereço</Label>
                          <div className="position-relative has-icon-left">
                            <Input
                              type="select"
                              id="state"
                              name="state"
                              onChange={e => {
                                stateChange(`${e.target.value}`);
                              }}
                            >
                              <option
                                value="none"
                                defaultValue="none"
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
                            </Input>
                            <div className="form-control-position">
                              <Map size={14} color="#212529" />
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col sm="3">
                        <FormGroup>
                          <Label for="cep">CEP</Label>
                          <div className="position-relative has-icon-left">
                            <Input type="text" id="cep" name="cep" />
                            <div className="form-control-position">
                              <MapPin size={14} color="#212529" />
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col sm="3">
                        <FormGroup>
                          <Label for="state">Estado</Label>
                          <Input
                            type="select"
                            id="state"
                            name="state"
                            onChange={e => {
                              stateChange(`${e.target.value}`);
                            }}
                          >
                            <option
                              value="none"
                              defaultValue="none"
                              disabled=""
                            >
                              Selecione uma opção
                            </option>

                            {statesCities.map(state => {
                              return (
                                <option key={state.sigla} value={state.sigla}>
                                  {state.nome}
                                </option>
                              );
                            })}
                          </Input>
                        </FormGroup>
                      </Col>
                      <Col sm="3">
                        <FormGroup>
                          <Label for="city">Cidade</Label>
                          <Input type="select" id="city" name="city">
                            <option
                              value="none"
                              defaultValue="none"
                              disabled=""
                            >
                              Selecione uma opção
                            </option>

                            {statesCities.map(element => {
                              if (estado === element.sigla) {
                                const teste = element.cidades.map(cidade => {
                                  return (
                                    <option key={cidade} value={cidade}>
                                      {cidade}
                                    </option>
                                  );
                                });
                                return teste;
                              }
                            })}
                          </Input>
                        </FormGroup>
                      </Col>
                    </Row>
                    <Row>
                      <Col sm="6">
                        <FormGroup>
                          <Label for="street">Rua</Label>
                          <div className="position-relative has-icon-left">
                            <Input type="text" id="street" name="street" />
                            <div className="form-control-position">
                              <i className="fa fa-road" />
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
                      <Col sm="2">
                        <FormGroup>
                          <Label for="streetNumber">Número</Label>
                          <div className="position-relative has-icon-left">
                            <Input
                              type="text"
                              id="streetNumber"
                              name="streetNumber"
                            />
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
                            <Input
                              type="text"
                              id="neighborhood"
                              name="neighborhood"
                            />
                            <div className="form-control-position">
                              <i className="fa fa-map-signs" />
                            </div>
                          </div>
                        </FormGroup>
                      </Col>
                    </Row>
                    <FormGroup>
                      <Label for="complement">Complemento</Label>
                      <div className="position-relative has-icon-left">
                        <Input type="text" id="complement" name="complement" />
                        <div className="form-control-position">
                          <Edit size={14} color="#212529" />
                        </div>
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
                        Atualizar endereços
                      </Button>
                    )}
                  </div>
                </Form>
              </div>
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
