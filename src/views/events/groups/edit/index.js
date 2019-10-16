// --> TUDO DOS ASSISTENTES VAO SER MAIOR OU IGUAL...

import React, { useState, useEffect, Fragment } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import history from '../../../../app/history';

import { Link, Redirect, withRouter } from 'react-router-dom';
import { Formik, Field, Form, FieldArray } from 'formik';
import { Datepicker } from 'react-formik-ui';
import { subHours, parseISO, format } from 'date-fns';
import { pt } from 'date-fns/locale';
import { toastr } from 'react-redux-toastr';
import * as Yup from 'yup';
import randomstring from 'randomstring';

// import { toastr } from "react-redux-toastr";
import statesCities from '../../../../assets/data/statesCities';

import CustomTabs from '../../../../components/tabs/default';

import TableParticipants from './participantTable';
import TableInviteds from './invitedTable';

import {
  TabContent,
  TabPane,
  NavLink,
  Row,
  Col,
  Input,
  Button,
  FormGroup,
  Card,
  CardHeader,
  CardBody,
  Label,
  CardTitle,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Table,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Badge,
  CustomInput,
} from 'reactstrap';

import {
  ChevronDown,
  CheckSquare,
  Calendar,
  MapPin,
  Edit2,
  Edit,
  Navigation,
  Search,
  X,
  RefreshCw,
} from 'react-feather';

import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';

import classnames from 'classnames';

//import { Creators as OrganizatorActions } from '~/store/ducks/organizatorSearch';
import { Creators as EventActions } from '~/store/ducks/event';
import { Creators as CertificateActions } from '~/store/ducks/certificate';
import { Creators as OrganizatorActions } from '~/store/ducks/organizator';
import { Creators as ParticipantActions } from '~/store/ducks/participant';
// import { Creators as EventParticipantActions } from '~/store/ducks/'

import photo14 from '../../../../assets/img/photos/18.jpg';

const options = [
  {
    value: 'leader',
    label: 'Líder',
  },
  {
    value: 'training_leader',
    label: 'Líder em Treinamento',
  },
];

const formDetails = Yup.object().shape({
  church: Yup.string().required('O sobrenome é obrigatório'),
  cep: Yup.string().required('O cep é obrigatório'),
  uf: Yup.string().required('O estado é obrigatório'),
  city: Yup.string().required('A cidade é obrigatória'),
  street: Yup.string().required('A rua é obrigatória'),
  number: Yup.string().required('O número é obrigatório'),
  neighborhood: Yup.string().required('O bairro é obrigatório'),
  initialDate: Yup.string().required('A data inicial é obrigatória'),
});

const formOrganizator = Yup.object().shape({
  organizator_type: Yup.string().required('Tipo do organizador obrigatório'),
  cpf: Yup.string().required('CPF obrigatório'),
});

const formParticipant = Yup.object().shape({
  cpf: Yup.string().required('O CPF é obrigatório'),
});

const formAddParticipant = Yup.object().shape({
  name: Yup.string().required('O nome é obrigatório'),
  email: Yup.string()
    .email('Digite um email válido')
    .required('O email é obrigatório'),
  cpf: Yup.string().required('O CPF é obrigatório'),
  sex: Yup.string().required('O sexo do participante é obrigatório'),
});

const formParticipantInvite = Yup.object().shape({
  invite_name: Yup.string().required('Nome é obrigatório'),
  invite_email: Yup.string()
    .email('Digite um email válido')
    .required('O email é obrigatório'),
});

const formCertificate = Yup.object().shape({
  certificateDate: Yup.string().required('Data da formatura obrigatória'),
});

export default function UserProfile({ match, className }) {
  const [activeTab, setActiveTab] = useState('1');
  const [modalOrganizator, setModalOrganizator] = useState(false);
  const [modalChangeOrganizator, setModalChangeOrganizator] = useState(false);
  const [modalParticipant, setModalParticipant] = useState(false);
  const [modalAddParticipant, setModalAddParticipant] = useState(false);
  const [modalInvite, setModalInvite] = useState(false);
  const [modalCertificate, setModalCertificate] = useState(false);
  const [invites, setInvites] = useState([]);
  const [certificateParticipants, setCertificateParticipants] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [organizatorType, setOrganizatorType] = useState(null);
  const [leaderData, setLeaderData] = useState(null);
  const [participantData, setParticipantData] = useState(false);
  const [participantError, setParticipantError] = useState(null);

  const loading = useSelector(state => state.organizator.loadingSearch);
  const participant_loading = useSelector(
    state => state.participant.loadingSearch
  );
  const organizator_data = useSelector(state => state.organizator.data);
  const participant_data = useSelector(state => state.participant.data);
  const participant_error = useSelector(state => state.participant.error);
  const event_loading = useSelector(state => state.event.loading);
  const event_data = useSelector(state => state.event.data);

  const InputFeedback = ({ error }) =>
    error ? <div className={classnames('input-feedback')}>{error}</div> : null;

  const RadioButton = ({
    field: { name, value, onChange, onBlur },
    id,
    label,
    className,
    ...props
  }) => {
    return (
      <div>
        <input
          name={name}
          id={id}
          type="radio"
          value={id} // could be something else for output?
          checked={id === value}
          onChange={onChange}
          onBlur={onBlur}
          className={`${classnames('radio-button')} mr-1`}
          {...props}
        />
        <label htmlFor={id}>{label}</label>
      </div>
    );
  };

  // Radio group
  const RadioButtonGroup = ({
    value,
    error,
    touched,
    id,
    label,
    className,
    children,
  }) => {
    const classes = classnames(
      'input-field',
      {
        'is-success': value || (!error && touched), // handle prefilled or user-filled
        'is-error': !!error && touched,
      },
      className
    );

    return (
      <div className={classes}>
        <fieldset>
          <legend>{label}</legend>
          {children}
          {touched && <InputFeedback error={error} />}
        </fieldset>
      </div>
    );
  };

  useEffect(() => {
    if (organizator_data !== null && !!organizator_data.cpf) {
      setLeaderData(organizator_data);
    }
  }, [organizator_data]);

  useEffect(() => {
    if (participant_data !== null && !!participant_data.cpf) {
      setParticipantData(participant_data);
    }
  }, [participant_data]);

  useEffect(() => {
    setParticipantError(participant_error);
  }, [participant_error]);

  const dispatch = useDispatch();

  function toogleModalOrganizator() {
    setLeaderData(null);
    setModalOrganizator(!modalOrganizator);
  }

  function toogleModalParticipant() {
    setParticipantData(null);
    setParticipantError(false);
    setModalParticipant(!modalParticipant);
  }

  function toogleModalAddParticipant() {
    setModalParticipant(false);
    setModalAddParticipant(!modalAddParticipant);
  }

  function toogleModalChangeOrganizator() {
    setLeaderData(null);
    setModalChangeOrganizator(!modalChangeOrganizator);
  }

  function toogleModalInvite() {
    setModalParticipant(false);
    setModalInvite(!modalInvite);
  }

  function toogleModalCertificate() {
    setModalCertificate(!modalCertificate);
  }

  function confirmModalOrganizator() {
    if (organizatorType === 'leader') {
      dispatch(
        OrganizatorActions.addOrganizatorRequest(
          parseInt(match.params.event_id),
          leaderData.id
        )
      );
    } else {
      dispatch(
        ParticipantActions.addParticipantRequest(
          leaderData.id,
          parseInt(match.params.event_id),
          true
        )
      );
    }

    setModalOrganizator(false);
    setLeaderData(null);
  }

  function confirmModalChangeOrganizator() {
    const userId = localStorage.getItem('@dashboard/user');

    if (event_data.organizators[0].id === parseInt(userId)) {
      toastr.confirm(
        'Ao substituir-se, você não terá mais acesso a esse grupo',
        {
          onOk: () =>
            dispatch(
              OrganizatorActions.changeOrganizatorRequest(
                event_data.organizators[0].id,
                parseInt(match.params.event_id),
                leaderData.id,
                true
              )
            ),
          onCancel: () => {},
        }
      );
    } else {
      dispatch(
        OrganizatorActions.changeOrganizatorRequest(
          event_data.organizators[0].id,
          parseInt(match.params.event_id),
          leaderData.id,
          false
        )
      );
    }

    setModalOrganizator(false);
    setLeaderData(null);
  }

  function confirmModalParticipant() {
    dispatch(
      ParticipantActions.addParticipantRequest(
        participantData.id,
        parseInt(match.params.event_id),
        false
      )
    );

    setModalParticipant(false);
  }

  function confirmModalAddParticipant(values) {
    const { name, cpf, email, sex } = values;
    const password = randomstring.generate(6);

    dispatch(
      ParticipantActions.createParticipantRequest(
        name,
        cpf,
        email,
        sex,
        password,
        parseInt(match.params.event_id)
      )
    );

    setModalAddParticipant(false);
  }

  // onChange = e => {
  //   this.setState({ [e.target.name]: e.target.value });
  // };

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

  function handleSearchOrganizator(values) {
    const { organizator_type, cpf } = values;
    const default_event_id = event_data.default_event_id;

    dispatch(
      OrganizatorActions.searchOrganizatorRequest(
        organizator_type,
        cpf,
        default_event_id
      )
    );

    setOrganizatorType(organizator_type);
  }

  function handleSearchParticipant(values) {
    setParticipantData(null);
    const { cpf } = values;
    const default_event_id = event_data.default_event_id;

    dispatch(
      ParticipantActions.searchParticipantRequest(cpf, default_event_id)
    );
  }

  function handleDeleteOrganizator(entity_id) {
    toastr.confirm('Deseja deletar o líder', {
      onOk: () =>
        dispatch(
          OrganizatorActions.deleteOrganizatorRequest(
            parseInt(match.params.event_id),
            entity_id
          )
        ),
      onCancel: () => {},
    });
  }

  function handleDeleteParticipant(entity_id) {
    toastr.confirm('Deseja deletar o líder em treinamento?', {
      onOk: () =>
        dispatch(
          ParticipantActions.deleteParticipantRequest(
            parseInt(match.params.event_id),
            entity_id
          )
        ),
      onCancel: () => {},
    });
  }

  function handleChangeOrganizator(entity_id) {
    setLeaderData(null);
  }

  function toggle(tab) {
    if (activeTab !== tab) {
      setActiveTab(tab);
      localStorage.setItem('@dashboard/editGroupActiveTab', tab);
    }
  }

  function sendMailParticipant(values) {
    const { invite_name, invite_email } = values;
    const invite = {
      event_id: match.params.event_id,
      name: invite_name,
      email: invite_email,
    };

    dispatch(
      EventActions.confirmInviteRequest(
        match.params.event_id,
        invite_name,
        invite_email
      )
    );

    setInvites([...invites, invite]);

    setModalParticipant(false);
    setModalInvite(false);
  }

  function handleCheck(setFieldValue) {
    const participants = document.getElementsByClassName('childCheck').length;

    if (document.getElementById('checkAll').checked === true) {
      for (let index = 0; index < participants; index++) {
        document.getElementsByClassName('childCheck')[index].checked = true;
        setFieldValue(`selected.${index}.checked`, true);
      }
    } else {
      for (let index = 0; index < participants; index++) {
        document.getElementsByClassName('childCheck')[index].checked = false;
        setFieldValue(`selected.${index}.checked`, false);
      }
    }
  }

  function handleCheckChild(e, setFieldValue, id) {
    setFieldValue(`selected.${id}.checked`, e.target.checked);
  }

  function handleChangeName(e, setFieldValue, id) {
    setFieldValue(`selected.${id}.name`, e.target.value);
  }

  function handleCertificate(values) {
    let data_certificate = {};

    const dateValues = subHours(values.certificateDate, 1);

    const toSend = {
      event_id: event_data.id,
      date: format(dateValues, "dd 'de' MMMM 'de' yyyy", { locale: pt }),
      city: 'Pompeia',
      uf: 'SP',
      layout_certificado: event_data.certificateLayout,
      checkBackground: values.checkBackground,
    };

    const participants = [];
    values.selected.map(participant => {
      if (participant.checked === true && !!participant.name) {
        participants.push(participant.name);
      }
      return;
    });

    if (participants.length === 0) {
      toastr.warning('Aviso!', 'Mínimo de um nome para impressão');
    } else {
      toSend.participants = participants;
      localStorage.setItem(
        '@dashboard/groupCertificate',
        JSON.stringify(toSend)
      );
      history.push(`/eventos/grupo/${event_data.id}/certificados`);
    }
  }

  function handlePrintMobile() {
    if (window.confirm('Tente imprimir em um computador!')) {
    } else {
      // They clicked no
    }
  }

  useEffect(() => {
    const storageTab = localStorage.getItem('@dashboard/editGroupActiveTab');

    dispatch(EventActions.eventRequest(match.params.event_id));

    if (storageTab) {
      setActiveTab(storageTab);
    }
  }, []);

  useEffect(() => {
    const participants = [];
    const assistantsData = [];

    if (!!event_data) {
      if (event_data.participants && event_data.participants.length > 0) {
        event_data.participants.map(participant => {
          participants.push({
            id: participant.id,
            name: participant.name,
            isChecked: false,
          });
          if (participant.pivot.assistant) {
            assistantsData.push(participant);
          }
        });

        setCertificateParticipants(participants);
        setAssistants(assistantsData);
      } else {
      }
      setInvites(event_data.invites);
    }
  }, [event_data]);

  return (
    event_data !== null && (
      <Fragment>
        <Row>
          <Col xs="12" id="user-profile">
            <Card className="profile-with-cover">
              <div
                className="d-flex flex-column flex-sm-row flex-md-column flex-lg-row justify-content-between card-img-top img-fluid bg-cover height-300"
                style={{ background: `url("${photo14}") 50%` }}
              >
                <div className="mt-2 mr-2 align-self-end">
                  <UncontrolledDropdown className="pr-1 d-lg-none">
                    <DropdownToggle color="success">
                      <ChevronDown size={24} />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <Link
                        to="/eventos/grupo/editar/enviar?id=1"
                        className="p-0"
                      >
                        <DropdownItem>
                          <i className="fa fa-plus mr-2" /> Enviar material
                        </DropdownItem>
                      </Link>
                      {/* <DropdownItem onClick={handlePrintMobile}>
                        <i className="fa fa-address-card mr-2" /> Emitir crachás
                      </DropdownItem>
                      <Link to="/evento?id=1" className="p-0">
                        <DropdownItem>
                          <i className="fa fa-globe mr-2" /> Site do evento
                        </DropdownItem>
                      </Link> */}
                      {/* <DropdownItem onClick={handlePrintMobile}>
                        <i className="fa fa-user mr-2" /> Cartão de nomes
                      </DropdownItem> */}
                      <DropdownItem onClick={handlePrintMobile}>
                        <i className="fa fa-graduation-cap mr-2" /> Emitir
                        certificados
                      </DropdownItem>
                    </DropdownMenu>
                  </UncontrolledDropdown>
                </div>
                <div className="align-self-start col-md-1 d-none d-sm-none d-md-none d-lg-block" />
                <div className="align-self-center col-md-7 font-large-1 font-weight-bold text-white text-uppercase text-wrap">
                  {event_data.defaultEvent.name}
                </div>
                <div className="align-self-start mr-2">
                  <Row className="master">
                    <div className="profile-cover-buttons">
                      <div className="media-body halfway-fab align-self-end">
                        <div className="d-none d-sm-none d-md-none d-lg-block mt-3 ml-4">
                          <div className="d-flex flex-column">
                            {/* 3 situacoes para esse mesmo botao sendo,
                              tem pedido = sim, entao relatorio semanal;
                              tem pedido = sim, relatorios semanais = sim, então emitir certificado;
                              tem pedido = nao, entao enviar material
                            */}
                            <Button color="success" className="btn-raised mr-3">
                              <i className="fa fa-plus" /> Enviar material
                            </Button>
                            {/* <Button
                              href={`/eventos/grupo/${match.params.event_id}/crachas`}
                              color="info"
                              className="btn-raised mr-3"
                            >
                              <i className="fa fa-address-card" /> Emitir
                              crachás
                            </Button>
                            <Button
                              href="http://localhost:3000/evento/1"
                              target="_blank"
                              color="info"
                              className="btn-raised mr-3"
                            >
                              <i className="fa fa-globe" /> Site do evento
                            </Button> */}
                            {/* Esse botão aparece somente para eventos do FFI */}
                            {/* <Button
                              href={`/eventos/grupo/${match.params.event_id}/cartoes`}
                              color="info"
                              className="btn-raised mr-3"
                            >
                              <i className="fa fa-user" /> Cartão de nomes
                            </Button> */}
                            <Button
                              color="success"
                              className="btn-raised mr-3"
                              onClick={toogleModalCertificate}
                            >
                              <i className="fa fa-graduation-cap" /> Emitir
                              certificados
                            </Button>
                          </div>
                        </div>
                      </div>
                    </div>
                  </Row>
                </div>
              </div>

              <div className="profile-section">
                <Row>
                  <Col lg="6" md="6" sm="6">
                    <ul className="profile-menu no-list-style top-0 mb-0">
                      <li className="text-center">
                        <NavLink
                          className={classnames(
                            'font-medium-2 font-weight-600',
                            {
                              active: activeTab === '1',
                            }
                          )}
                          onClick={() => toggle('1')}
                        >
                          Detalhes
                        </NavLink>
                      </li>
                      <li className="text-center">
                        <NavLink
                          className={classnames(
                            'font-medium-2 font-weight-600',
                            {
                              active: activeTab === '2',
                            }
                          )}
                          onClick={() => toggle('2')}
                        >
                          Organizadores
                        </NavLink>
                      </li>
                    </ul>
                  </Col>
                  <Col lg="6" md="6" sm="6">
                    <ul className="profile-menu no-list-style top-0 mb-0 pr-2">
                      <li className="text-center">
                        <NavLink
                          className={classnames(
                            'font-medium-2 font-weight-600',
                            {
                              active: activeTab === '3',
                            }
                          )}
                          onClick={() => toggle('3')}
                        >
                          Participantes
                        </NavLink>
                      </li>
                      <li className="text-center">
                        <NavLink
                          className={classnames(
                            'font-medium-2 font-weight-600',
                            {
                              active: activeTab === '4',
                            }
                          )}
                          onClick={() => toggle('4')}
                        >
                          Aulas
                        </NavLink>
                      </li>
                    </ul>
                  </Col>
                </Row>
              </div>
            </Card>
          </Col>
        </Row>

        <TabContent activeTab={activeTab}>
          {/* Dados do Grupo */}
          <TabPane tabId="1">
            <Card>
              <CardBody>
                <div className="px-3">
                  <Formik
                    enableReinitialize
                    initialValues={{
                      id: !!event_data.id ? event_data.id : '',
                      church: !!event_data.organization.fantasy_name
                        ? event_data.organization.fantasy_name
                        : '',
                      cep: !!event_data.cep ? event_data.cep : '',
                      uf: !!event_data.uf ? event_data.uf : '',
                      city: !!event_data.city ? event_data.city : '',
                      street: !!event_data.street ? event_data.street : '',
                      number: !!event_data.street_number
                        ? event_data.street_number
                        : '',
                      neighborhood: !!event_data.neighborhood
                        ? event_data.neighborhood
                        : '',
                      complement: !!event_data.complement
                        ? event_data.complement
                        : '',
                      initialDate: !!event_data.start_date
                        ? event_data.start_date
                        : '',
                      endDate: '',
                    }}
                    validationSchema={formDetails}
                    // CRIAR FUNÇÃO PARA SALVAR DADOS DA EDIÇÃO DO GRUPO
                    onSubmit={() => {}}
                  >
                    {({ errors, touched, handleChange, values }) => (
                      <Form>
                        <div className="form-body">
                          <Row>
                            <Col sm="2">
                              <FormGroup>
                                <Label for="id">Id do evento</Label>
                                <div className="position-relative">
                                  <Field
                                    type="text"
                                    id="id"
                                    name="id"
                                    className="form-control"
                                    readOnly
                                  />
                                </div>
                              </FormGroup>
                            </Col>
                            <Col sm="10">
                              <FormGroup>
                                <Label for="church">Igreja</Label>
                                <div className="position-relative has-icon-left">
                                  <Field
                                    type="text"
                                    id="church"
                                    name="church"
                                    className="form-control"
                                    readOnly
                                  />
                                  <div className="form-control-position">
                                    <Edit2 size={14} color="#212529" />
                                  </div>
                                </div>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm="4">
                              <FormGroup>
                                <Label for="cep">CEP</Label>
                                <div className="position-relative has-icon-left">
                                  <Field
                                    type="text"
                                    placeholder="CEP"
                                    name="cep"
                                    id="cep"
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
                            <Col sm="3">
                              <FormGroup>
                                <Label for="uf">Estado</Label>
                                <Field
                                  type="select"
                                  component="select"
                                  id="uf"
                                  name="uf"
                                  onChange={handleChange}
                                  className={`
                                  form-control
                                  ${errors.uf && touched.uf && 'is-invalid'}
                                `}
                                >
                                  <option value="" disabled="">
                                    Selecione uma opção
                                  </option>

                                  {statesCities.map(state => (
                                    <option value={state.sigla}>
                                      {state.nome}
                                    </option>
                                  ))}
                                </Field>
                                {errors.uf && touched.uf ? (
                                  <div className="invalid-feedback">
                                    {errors.uf}
                                  </div>
                                ) : null}
                              </FormGroup>
                            </Col>
                            <Col sm="5">
                              <FormGroup>
                                <Label for="city">Cidade</Label>
                                <Field
                                  type="select"
                                  component="select"
                                  id="city"
                                  name="city"
                                  className={`
                                  form-control
                                  ${errors.city && touched.city && 'is-invalid'}
                                `}
                                >
                                  <option value="" disabled="">
                                    Selecione uma opção
                                  </option>

                                  {statesCities.map(element => {
                                    if (values.uf === element.sigla) {
                                      const cidades = element.cidades.map(
                                        cidade => {
                                          return (
                                            <option value={cidade}>
                                              {cidade}
                                            </option>
                                          );
                                        }
                                      );
                                      return cidades;
                                    }
                                  })}
                                </Field>
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
                                    placeholder="Rua"
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
                            <Col sm="2">
                              <FormGroup>
                                <Label for="streetNumber">Número</Label>
                                <div className="position-relative has-icon-left">
                                  <Field
                                    type="text"
                                    placeholder="Número"
                                    name="number"
                                    id="number"
                                    className={`
                                  form-control
                                  ${errors.number &&
                                    touched.number &&
                                    'is-invalid'}
                                `}
                                  />
                                  {errors.number && touched.number ? (
                                    <div className="invalid-feedback">
                                      {errors.number}
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
                                    placeholder="Bairro"
                                    name="neighborhood"
                                    id="neighborhood"
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
                          <Row>
                            <Col sm="8">
                              <FormGroup>
                                <Label for="complement">Complemento</Label>
                                <div className="position-relative has-icon-left">
                                  <Field
                                    type="text"
                                    id="complement"
                                    name="complement"
                                    placeholder="Ex: Apartamento 1"
                                    className="form-control"
                                  />
                                  <div className="form-control-position">
                                    <Edit size={14} color="#212529" />
                                  </div>
                                </div>
                              </FormGroup>
                            </Col>
                            <Col sm="2">
                              <FormGroup>
                                <Label for="initialDate">Data Inicial</Label>
                                <div className="position-relative has-icon-left">
                                  <Datepicker
                                    name="initialDate"
                                    id="initialDate"
                                    className={`
                                      form-control
                                      ${errors.initialDate &&
                                        touched.initialDate &&
                                        'is-invalid'}
                                    `}
                                  />
                                  {errors.initialDate && touched.initialDate ? (
                                    <div className="invalid-feedback">
                                      {errors.initialDate}
                                    </div>
                                  ) : null}
                                  <div className="form-control-position">
                                    <Calendar size={14} color="#212529" />
                                  </div>
                                </div>
                              </FormGroup>
                            </Col>
                            <Col sm="2">
                              <FormGroup>
                                <Label for="endDate">Data Formatura</Label>
                                <div className="position-relative has-icon-left">
                                  <Datepicker
                                    name="birthday"
                                    id="birthday"
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
                          </Row>
                        </div>
                        <div className="form-actions right">
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
                                Atualizar dados do grupo
                              </Button>
                            )}
                          </FormGroup>
                        </div>
                      </Form>
                    )}
                  </Formik>
                </div>
              </CardBody>
            </Card>
          </TabPane>

          {/* Organizadores */}
          <TabPane tabId="2">
            <Row>
              <Col xs="12">
                <div className="content-header" />
              </Col>
            </Row>
            <Row>
              {/* BOTAO PARA ADICIONAR ORGANIZADOR */}
              {event_data.defaultEvent.max_organizators >
                event_data.organizators.length ||
              event_data.defaultEvent.max_assistants > assistants.length ? (
                <Col xs="12" md="6" lg="4">
                  <Card className="min-vh-50">
                    <div className="d-flex justify-content-center align-items-center height-425">
                      <Button
                        className="rounded-circle width-150 height-150"
                        outline
                        color="success"
                        onClick={toogleModalOrganizator}
                      >
                        <i className="fa fa-plus" />
                      </Button>
                    </div>
                  </Card>
                </Col>
              ) : (
                <Col xs="12" md="6" lg="4">
                  <Card className="min-vh-50">
                    <div className="d-flex flex-column justify-content-center align-items-center height-400">
                      <Button
                        className="rounded-circle width-150 height-150"
                        outline
                        color="secondary"
                        disabled
                      >
                        <i className="fa fa-plus" />
                      </Button>
                      <h6 className="p-2 text-danger text-center">
                        Quantidade máxima de líderes e líderes em treinamento
                        atingida
                      </h6>
                    </div>
                  </Card>
                </Col>
              )}
              {/* fim do botao */}

              {/* ORGANIZADORES */}
              {event_data.organizators.map(organizator => {
                return (
                  <Col xs="12" md="6" lg="4">
                    <Card className="min-vh-50">
                      <CardHeader className="text-center">
                        <img
                          src={
                            !!organizator.file
                              ? organizator.file.url
                              : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                          }
                          width="150"
                          height="150"
                          className="rounded-circle gradient-mint"
                        />
                        {event_data.organizators.length > 1 ? (
                          <div
                            style={{
                              position: 'absolute',
                              right: '0',
                              top: '0',
                            }}
                            className="fonticon-container"
                            onClick={() =>
                              handleDeleteOrganizator(organizator.id)
                            }
                          >
                            <X
                              color="#ff3232"
                              className="fonticon-wrap height-25 width-25"
                            />
                          </div>
                        ) : (
                          <div
                            style={{
                              position: 'absolute',
                              right: '0',
                              top: '0',
                            }}
                            className="fonticon-container"
                            onClick={toogleModalChangeOrganizator}
                          >
                            <RefreshCw
                              color="#FC0"
                              className="fonticon-wrap height-25 width-25"
                            />
                          </div>
                        )}
                      </CardHeader>
                      <CardBody>
                        <p className="card-title text-center">Líder</p>
                        <h4 className="card-title text-center">
                          {organizator.name}
                        </h4>
                        <p className="category text-gray font-small-4">
                          {organizator.ministery_status}
                        </p>
                        <hr className="grey" />
                        <Row>
                          <Col xs="6">
                            <i className="fa fa-star fa-lg pr-2" />
                            <span>{organizator.birthday}</span>
                          </Col>
                          <Col xs="6">
                            <i className="fa fa-globe fa-lg pr-2" />
                            {organizator.addresses &&
                            organizator.addresses.length > 0 ? (
                              <span>{organizator.address[0].country}</span>
                            ) : (
                              <span>N/A</span>
                            )}
                          </Col>
                        </Row>
                      </CardBody>
                    </Card>
                  </Col>
                );
              })}

              {/* ASSISTENTES */}
              {event_data.participants.map(participant => {
                if (participant.pivot.assistant) {
                  return (
                    <Col xs="12" md="6" lg="4">
                      <Card className="min-vh-50">
                        <CardHeader className="text-center">
                          <img
                            src={
                              !!participant.file
                                ? participant.file.url
                                : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                            }
                            width="150"
                            height="150"
                            className="rounded-circle gradient-mint"
                          />
                          <div
                            style={{
                              position: 'absolute',
                              right: '0',
                              top: '0',
                            }}
                            className="fonticon-container"
                            onClick={() =>
                              handleDeleteParticipant(participant.id)
                            }
                          >
                            <X
                              color="#ff3232"
                              className="fonticon-wrap height-25 width-25"
                            />
                          </div>
                        </CardHeader>
                        <CardBody>
                          <p className="card-title text-center">
                            Líder em treinamento
                          </p>
                          <h4 className="card-title text-center">
                            {participant.name}
                          </h4>
                          <p className="category text-gray font-small-4">
                            {participant.ministery_status}
                          </p>
                          <hr className="grey" />
                          <Row>
                            <Col xs="6">
                              <i className="fa fa-star fa-lg pr-2" />
                              <span>{participant.birthday}</span>
                            </Col>
                            <Col xs="6">
                              <i className="fa fa-globe fa-lg pr-2" />
                              {participant.addresses &&
                              participant.addresses.length > 0 ? (
                                <span>{participant.address[0].country}</span>
                              ) : (
                                <span>N/A</span>
                              )}
                            </Col>
                          </Row>
                        </CardBody>
                      </Card>
                    </Col>
                  );
                } else {
                  return null;
                }
              })}
            </Row>
          </TabPane>

          {/* Participantes */}
          <TabPane tabId="3">
            <Fragment>
              <Row className="row-eq-height">
                <Col sm="12">
                  <Card>
                    <CardBody>
                      <div className="d-flex justify-content-between">
                        <Badge color="success" className="align-self-center">
                          Participantes inscritos
                        </Badge>
                        <Row className="master">
                          <div className="profile-cover-buttons">
                            <div className="media-body halfway-fab">
                              <div className="d-none d-sm-none d-md-none d-lg-block ml-auto">
                                <Button
                                  color="success"
                                  className="btn-raised mr-2 mb-0 font-small-3"
                                  onClick={toogleModalParticipant}
                                >
                                  <i className="fa fa-user fa-xs" /> Inserir
                                  participante
                                </Button>
                                <Button
                                  color="warning"
                                  className="btn-raised mr-2 mb-0 font-small-3"
                                  onClick={toogleModalInvite}
                                >
                                  <i className="fa fa-paper-plane fa-xs" />{' '}
                                  Convidar por email
                                </Button>
                                {/* Esse botão aparece quando o evento for um seminário */}
                                {/* <Button
                                  href={`/eventos/grupo/${match.params.event_id}/organizacao-grupos`}
                                  color="info"
                                  className="btn-raised mr-2 mb-0 font-small-3"
                                >
                                  <i className="fa fa-users" /> Separação de
                                  grupos
                                </Button> */}
                              </div>
                              <div className="ml-2">
                                <Button
                                  color="success"
                                  className="btn-raised mr-3 d-lg-none"
                                  onClick={toogleModalParticipant}
                                >
                                  <i className="fa fa-plus" />
                                </Button>
                              </div>
                            </div>
                          </div>
                        </Row>
                      </div>
                      <CustomTabs
                        TabContent={
                          <TableParticipants
                            data={event_data.participants.filter(
                              participant => {
                                return participant.pivot.assistant === false;
                              }
                            )}
                          />
                        }
                      />
                    </CardBody>
                  </Card>
                  <Card>
                    <CardBody>
                      <div className="d-flex justify-content-between">
                        <Badge color="warning" className="align-self-center">
                          Convites pendentes
                        </Badge>
                      </div>
                      <CustomTabs
                        TabContent={<TableInviteds data={invites} />}
                      />
                    </CardBody>
                  </Card>
                </Col>
              </Row>
            </Fragment>
          </TabPane>

          {/* AULAS */}
          <TabPane tabId="4">
            <Row>
              <Col xs="12">
                <Card>
                  <CardBody>
                    <div className={`grid-hover p-0 py-4`}>
                      <Row className="justify-content-around align-items-center">
                        {event_data.lessonReports.map(lessonReport => {
                          return (
                            <div className="lesson-container">
                              <figure
                                className={`${
                                  lessonReport.is_finished
                                    ? 'effect-finished'
                                    : 'effect-chico'
                                }`}
                              >
                                <img
                                  src={lessonReport.lesson.img_url}
                                  alt="img1"
                                />
                                <figcaption>
                                  <div>
                                    <h2>
                                      <span>{lessonReport.lesson.title}</span>
                                    </h2>
                                    {lessonReport.is_finished && (
                                      <h6 className="font-weight-bold">
                                        <em>(Aula concluida)</em>
                                      </h6>
                                    )}
                                    <p className="white">
                                      {lessonReport.lesson.description}
                                    </p>
                                  </div>
                                  <Link
                                    to={`/eventos/grupo/1/editar/aula/${lessonReport.lesson.id}`}
                                  />
                                </figcaption>
                              </figure>
                            </div>
                          );
                        })}
                      </Row>
                    </div>
                  </CardBody>
                </Card>
              </Col>
            </Row>
          </TabPane>
        </TabContent>

        {/* MODAL PARA ADICIONAR ORGANIZADOR */}
        <Modal
          isOpen={modalOrganizator}
          toggle={toogleModalOrganizator}
          className={className}
        >
          <ModalHeader toggle={toogleModalOrganizator}>
            Pesquisar Líder ou Líder em Treinamento
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                organizator_type: '',
                cpf: '',
              }}
              validationSchema={formOrganizator}
              onSubmit={values => handleSearchOrganizator(values)}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="form-body">
                    <Row className="d-flex flex-row f">
                      <Col sm="12" md="12" lg="4" className="mb-2">
                        <Field
                          type="select"
                          component="select"
                          id="organizator_type"
                          name="organizator_type"
                          className={`
                                    form-control
                                    ${errors.organizator_type &&
                                      touched.organizator_type &&
                                      'is-invalid'}
                                  `}
                        >
                          <option value="" disabled="">
                            Selecione uma opção
                          </option>
                          {event_data.defaultEvent.max_organizators >
                            event_data.organizators.length && (
                            <option value={options[0].value}>
                              {options[0].label}
                            </option>
                          )}

                          {event_data.defaultEvent.max_assistants >
                            assistants.length && (
                            <option value={options[1].value}>
                              {options[1].label}
                            </option>
                          )}
                        </Field>
                        {errors.organizator_type && touched.organizator_type ? (
                          <div className="invalid-feedback">
                            {errors.organizator_type}
                          </div>
                        ) : null}
                      </Col>
                      <Col sm="12" md="12" lg="6" className="mb-2">
                        <Field
                          type="text"
                          placeholder="Digite o CPF do líder"
                          name="cpf"
                          id="cpf"
                          className={`
                                    form-control
                                    ${errors.cpf && touched.cpf && 'is-invalid'}
                                  `}
                          validate={validateCPF}
                        />
                        {errors.cpf && touched.cpf ? (
                          <div className="invalid-feedback">{errors.cpf}</div>
                        ) : null}
                      </Col>
                      <Col sm="12" md="12" lg="2">
                        <Button
                          className="rounded-right width-100-per"
                          type="submit"
                          color="success"
                        >
                          <Search size={22} color="#fff" />
                        </Button>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    {leaderData !== null && !!leaderData.cpf && (
                      <Col>
                        <Card>
                          <CardHeader className="text-center">
                            <img
                              src={
                                !!leaderData.file
                                  ? leaderData.file.url
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
                              {leaderData.name}
                            </h4>
                            <p className="category text-gray text-center font-small-4">
                              {leaderData.cpf}
                            </p>
                            <hr className="grey" />
                            <Row>
                              <Col xs="6">
                                <i className="fa fa-star fa-lg pr-2" />
                                <span>{leaderData.birthday}</span>
                              </Col>
                              <Col xs="6">
                                <i className="fa fa-globe fa-lg pr-2" />
                                {leaderData.addresses &&
                                leaderData.addresses.length > 0 ? (
                                  <span>{leaderData.address[0].country}</span>
                                ) : (
                                  <span>N/A</span>
                                )}
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </ModalBody>
          <ModalFooter>
            <Form>
              <Button
                className="ml-1 my-1"
                color="danger"
                onClick={toogleModalOrganizator}
              >
                Cancelar
              </Button>{' '}
              <Button
                className={`${
                  leaderData !== null
                    ? 'ml-1 my-1 btn-success'
                    : 'btn-secundary ml-1 my-1'
                }`}
                // color="success"
                onClick={confirmModalOrganizator}
                disabled={leaderData !== null ? false : true}
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
                  'Adicionar Organizador'
                )}
              </Button>
            </Form>
          </ModalFooter>
        </Modal>

        {/* MODAL PARA TROCAR ORGANIZADOR */}
        <Modal
          isOpen={modalChangeOrganizator}
          toggle={toogleModalChangeOrganizator}
          className={className}
        >
          <ModalHeader toggle={toogleModalChangeOrganizator}>
            Pesquisar Líder
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                organizator_type: 'leader',
                cpf: '',
              }}
              validationSchema={formOrganizator}
              onSubmit={values => handleSearchOrganizator(values)}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="form-body">
                    <Row className="d-flex flex-row f">
                      <Col sm="12" md="12" lg="10" className="mb-2">
                        <Field
                          type="text"
                          placeholder="Digite o CPF do líder"
                          name="cpf"
                          id="cpf"
                          className={`
                                    form-control
                                    ${errors.cpf && touched.cpf && 'is-invalid'}
                                  `}
                          validate={validateCPF}
                        />
                        {errors.cpf && touched.cpf ? (
                          <div className="invalid-feedback">{errors.cpf}</div>
                        ) : null}
                      </Col>
                      <Col sm="12" md="12" lg="2">
                        <Button
                          className="rounded-right width-100-per"
                          type="submit"
                          color="success"
                        >
                          <Search size={22} color="#fff" />
                        </Button>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    {leaderData !== null && !!leaderData.cpf && (
                      <Col>
                        <Card>
                          <CardHeader className="text-center">
                            <img
                              src={
                                !!leaderData.file
                                  ? leaderData.file.url
                                  : 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                              }
                              alt="Brek"
                              width="150"
                              height="150"
                              className="rounded-circle gradient-mint"
                            />
                          </CardHeader>
                          <CardBody>
                            <h4 className="card-title">{leaderData.name}</h4>
                            <p className="category text-gray font-small-4">
                              {leaderData.cpf}
                            </p>
                            <p className="category text-gray font-small-4">
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
                                  <span>USA</span>
                                </Link>
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
          </ModalBody>
          <ModalFooter>
            <Form>
              <Button
                className="ml-1 my-1"
                color="danger"
                onClick={toogleModalChangeOrganizator}
              >
                Cancelar
              </Button>{' '}
              <Button
                className={`${
                  leaderData !== null
                    ? 'ml-1 my-1 btn-success'
                    : 'btn-secundary ml-1 my-1'
                }`}
                // color="success"
                onClick={confirmModalChangeOrganizator}
                disabled={leaderData !== null ? false : true}
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
                  'Trocar organizador'
                )}
              </Button>
            </Form>
          </ModalFooter>
        </Modal>

        {/* MODAL PARA PESQUISAR PARTICIPANTE */}
        <Modal
          isOpen={modalParticipant}
          toggle={toogleModalParticipant}
          className={className}
        >
          <ModalHeader toggle={toogleModalParticipant}>
            Pesquisar participante por CPF
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                cpf: '',
              }}
              validationSchema={formParticipant}
              onSubmit={values => handleSearchParticipant(values)}
            >
              {({ errors, touched }) => (
                <Form>
                  <div className="form-body">
                    <Row className="d-flex flex-row">
                      <Col sm="12" md="12" lg="8" className="mb-2">
                        <Field
                          type="text"
                          placeholder="Digite o CPF do participante"
                          name="cpf"
                          id="cpf"
                          className={`
                                    form-control
                                    ${errors.cpf && touched.cpf && 'is-invalid'}
                                  `}
                          validate={validateCPF}
                        />
                        {errors.cpf && touched.cpf ? (
                          <div className="invalid-feedback">{errors.cpf}</div>
                        ) : null}
                      </Col>
                      <Col sm="12" md="12" lg="4">
                        <Button
                          className="rounded-right width-100-per"
                          type="submit"
                          color="success"
                        >
                          <Search size={22} color="#fff" />
                        </Button>
                      </Col>
                    </Row>
                  </div>

                  <div>
                    {participantData !== null && !!participantData.cpf && (
                      <Col>
                        <Card>
                          <CardHeader className="text-center">
                            <img
                              src={
                                !!participantData.file
                                  ? participantData.file.url
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
                              {participantData.name}
                            </h4>
                            <p className="category text-gray text-center font-small-4">
                              {participantData.cpf}
                            </p>
                            <hr className="grey" />
                            <Row>
                              <Col xs="6">
                                <i className="fa fa-star fa-lg pr-2" />
                                <span>{participantData.birthday}</span>
                              </Col>
                              <Col xs="6">
                                <i className="fa fa-globe fa-lg pr-2" />
                                {participantData.addresses &&
                                participantData.addresses.length > 0 ? (
                                  <span>
                                    {participantData.address[0].country}
                                  </span>
                                ) : (
                                  <span>N/A</span>
                                )}
                              </Col>
                            </Row>
                          </CardBody>
                        </Card>
                      </Col>
                    )}
                  </div>
                </Form>
              )}
            </Formik>
            {participantError && (
              <>
                <p className="text-danger p-3">
                  Nenhum participante encontrado com esse cpf na nossa base de
                  dados
                </p>
                <Row className="justify-content-between p-3">
                  <Button color="success" onClick={toogleModalAddParticipant}>
                    <i className="fa fa-plus" /> Cadastrar novo participante
                  </Button>
                  <Button
                    color="warning"
                    className="text-white"
                    onClick={toogleModalInvite}
                  >
                    <i className="fa fa-paper-plane fa-xs" /> Convidar por email
                  </Button>
                </Row>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Form>
              <Button
                className="ml-1 my-1"
                color="danger"
                onClick={toogleModalParticipant}
              >
                Cancelar
              </Button>{' '}
              <Button
                className={`${
                  participantData !== null
                    ? 'ml-1 my-1 btn-success'
                    : 'btn-secundary ml-1 my-1'
                }`}
                onClick={confirmModalParticipant}
                disabled={participantData !== null ? false : true}
              >
                {participant_loading ? (
                  <BounceLoader
                    size={23}
                    color={'#fff'}
                    css={css`
                      display: block;
                      margin: 0 auto;
                    `}
                  />
                ) : (
                  'Adicionar participante'
                )}
              </Button>
            </Form>
          </ModalFooter>
        </Modal>

        {/* MODAL PARA CADASTRAR PARTICIPANTE MANUALMENTE */}
        <Modal
          isOpen={modalAddParticipant}
          toggle={toogleModalAddParticipant}
          className={className}
        >
          <Formik
            initialValues={{
              name: '',
              email: '',
              cpf: '',
              sex: '',
            }}
            validationSchema={formAddParticipant}
            onSubmit={values => confirmModalAddParticipant(values)}
          >
            {({ errors, touched, values }) => (
              <Form>
                <ModalHeader toggle={toogleModalAddParticipant}>
                  Cadastrar participante
                </ModalHeader>
                <ModalBody>
                  <div className="form-body">
                    <Row className="d-flex flex-row">
                      <Col sm="12" md="12" lg="12" className="mb-2">
                        <Field
                          type="text"
                          placeholder="Digite o nome do participante"
                          name="name"
                          id="name"
                          className={`
                                    form-control
                                    ${errors.name &&
                                      touched.name &&
                                      'is-invalid'}
                                  `}
                        />
                        {errors.name && touched.name ? (
                          <div className="invalid-feedback">{errors.name}</div>
                        ) : null}
                      </Col>
                      <Col sm="12" md="12" lg="12" className="mb-2">
                        <Field
                          type="text"
                          placeholder="Digite o cpf do participante"
                          name="cpf"
                          id="cpf"
                          className={`
                                    form-control
                                    ${errors.cpf && touched.cpf && 'is-invalid'}
                                  `}
                          validate={validateCPF}
                        />
                        {errors.cpf && touched.cpf ? (
                          <div className="invalid-feedback">{errors.cpf}</div>
                        ) : null}
                      </Col>
                      <Col sm="12" md="12" lg="12" className="mb-2">
                        <Field
                          type="text"
                          placeholder="Digite o email"
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
                          <div className="invalid-feedback">{errors.email}</div>
                        ) : null}
                      </Col>
                      <Col sm="12" md="12" lg="12" className="mb-2">
                        <RadioButtonGroup
                          id="radioGroup"
                          value={values.radioGroup}
                          error={errors.radioGroup}
                          touched={touched.radioGroup}
                          className={`
                                    new-form-padding
                                    form-control
                                    border-0
                                    ${errors.sex && touched.sex && 'is-invalid'}
                                  `}
                        >
                          <Row className="d-flex justify-content-around">
                            {event_data.defaultEvent.sex_type === 'M' && (
                              <Field
                                component={RadioButton}
                                name="sex"
                                id="M"
                                label="Masculino"
                              />
                            )}
                            {event_data.defaultEvent.sex_type === 'F' && (
                              <Field
                                component={RadioButton}
                                name="sex"
                                id="F"
                                label="Feminino"
                              />
                            )}
                            {event_data.defaultEvent.sex_type === 'A' && (
                              <>
                                <Field
                                  component={RadioButton}
                                  name="sex"
                                  id="M"
                                  label="Masculino"
                                />
                                <Field
                                  component={RadioButton}
                                  name="sex"
                                  id="F"
                                  label="Feminino"
                                />
                              </>
                            )}
                          </Row>
                        </RadioButtonGroup>
                        {errors.sex && touched.sex ? (
                          <div className="text-center invalid-feedback">
                            {errors.sex}
                          </div>
                        ) : null}
                      </Col>
                    </Row>
                  </div>
                </ModalBody>
                <ModalFooter>
                  <Form>
                    <Button
                      className="ml-1 my-1"
                      color="danger"
                      onClick={toogleModalAddParticipant}
                    >
                      Cancelar
                    </Button>{' '}
                    <Button
                      className="ml-1 my-1 btn-success"
                      type="submit"
                      //onClick={() => confirmModalAddParticipant(values)}
                    >
                      {participant_loading ? (
                        <BounceLoader
                          size={23}
                          color={'#fff'}
                          css={css`
                            display: block;
                            margin: 0 auto;
                          `}
                        />
                      ) : (
                        'Cadastrar participante'
                      )}
                    </Button>
                  </Form>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </Modal>

        {/* MODAL PARA CONVIDAR PARTICIPANTE */}
        <Formik
          initialValues={{
            invite_name: '',
            invite_email: '',
          }}
          validationSchema={formParticipantInvite}
          onSubmit={(values, { resetForm }) => {
            sendMailParticipant(values);
            resetForm();
          }}
        >
          {({ errors, touched, values }) => (
            <Modal
              isOpen={modalInvite}
              toggle={toogleModalInvite}
              className={className}
              size="lg"
            >
              <ModalHeader toggle={toogleModalInvite}>
                Convidar participante por email
              </ModalHeader>
              <ModalBody>
                <Form>
                  <div className="form-body">
                    <Row className="d-flex flex-row f">
                      <Col lg="6" md="6" sm="12">
                        <FormGroup>
                          <Label for="invite_name">Nome</Label>
                          <Field
                            type="text"
                            placeholder="Digite o nome do participante"
                            name="invite_name"
                            id="invite_name"
                            className={`
                                    form-control
                                    ${errors.invite_name &&
                                      touched.invite_name &&
                                      'is-invalid'}
                                  `}
                          />
                          {errors.invite_name && touched.invite_name ? (
                            <div className="invalid-feedback">
                              {errors.invite_name}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col lg="6" md="6" sm="12">
                        <FormGroup>
                          <Label for="invite_email">Email</Label>
                          <Field
                            type="text"
                            placeholder="Digite o email do pariticpante"
                            name="invite_email"
                            id="invite_email"
                            className={`
                                    form-control
                                    ${errors.invite_email &&
                                      touched.invite_email &&
                                      'is-invalid'}
                                  `}
                          />
                          {errors.invite_email && touched.invite_email ? (
                            <div className="invalid-feedback">
                              {errors.invite_email}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                    </Row>
                  </div>
                </Form>
              </ModalBody>
              <ModalFooter>
                <Form>
                  <Button
                    className="ml-1 my-1"
                    color="danger"
                    onClick={toogleModalInvite}
                  >
                    Cancelar
                  </Button>{' '}
                  <Button
                    className={`${
                      values.invite_name !== '' && values.invite_email !== ''
                        ? 'ml-1 my-1 btn-success'
                        : 'btn-secundary ml-1 my-1'
                    }`}
                    type="submit"
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
                      'Enviar convite'
                    )}
                  </Button>
                </Form>
              </ModalFooter>
            </Modal>
          )}
        </Formik>

        {/* MODAL PARA IMPRIMIR CERTIFICADOS */}
        <Modal
          isOpen={modalCertificate}
          toggle={toogleModalCertificate}
          className={className}
          size="md"
        >
          <ModalHeader toggle={toogleModalCertificate}>
            Emitir certificados
          </ModalHeader>
          <ModalBody>
            <Formik
              enableReinitialize
              initialValues={{
                checkBackground: false,
                selected: certificateParticipants,
                certificateDate: new Date(),
                // DATA FICTICIA DO FINAL DO EVENTO !!MUDAR QUANDO OS EVENTOS ESTIVEREM CRIADOS
              }}
              onSubmit={values => handleCertificate(values)}
            >
              {({ errors, touched, handleChange, values, setFieldValue }) => (
                <Form>
                  <Row className="mb-2">
                    <Col className="align-self-center">
                      <Label className="mb-0">Data da formatura</Label>
                    </Col>
                    <Col>
                      <Datepicker
                        name="certificateDate"
                        id="certificateDate"
                        dateFormat="dd/MM/yyyy"
                        showMonthDropdown
                        showYearDropdown
                        className={`
                      form-control
                      ${errors.certificateDate &&
                        touched.certificateDate &&
                        'is-invalid'}
                    `}
                      />
                    </Col>
                  </Row>
                  <Row>
                    <Col>
                      <Field
                        type="checkbox"
                        className="ml-0"
                        id="checkBackground"
                        name="checkBackground"
                        onClick={() => {}}
                      />
                      <Label for="checkBackground" className="pl-3">
                        Certificado com imagem de fundo
                      </Label>
                    </Col>
                  </Row>
                  <Table>
                    <thead>
                      <tr>
                        <th>
                          <Field
                            type="checkbox"
                            className="ml-0"
                            id="checkAll"
                            onClick={() => handleCheck(setFieldValue)}
                          />
                          <Label for="checkAll" className="pl-3">
                            Todos
                          </Label>
                        </th>
                        <th>Nome para impressão</th>
                      </tr>
                    </thead>
                    <tbody>
                      <FieldArray
                        name="selected"
                        render={arrayHelpers => (
                          <>
                            {values.selected.map((selected, index) => (
                              <tr>
                                <td>
                                  <Field
                                    type="checkbox"
                                    className="ml-0 childCheck"
                                    id={`selected.${index}.checked`}
                                    name={`selected.${index}.checked`}
                                    onClick={e =>
                                      handleCheckChild(e, setFieldValue, index)
                                    }
                                  />
                                </td>
                                <td>
                                  <Field
                                    type="text"
                                    id={`selected.${index}.name`}
                                    name={`selected.${index}.name`}
                                    className="form-control"
                                    onChange={e =>
                                      handleChangeName(e, setFieldValue, index)
                                    }
                                  />
                                </td>
                              </tr>
                            ))}
                          </>
                        )}
                      />
                    </tbody>
                  </Table>
                  {loading ? (
                    <Button color="primary">carregando</Button>
                  ) : (
                    <Button type="submit" color="primary">
                      Gerar certificados
                    </Button>
                  )}
                </Form>
              )}
            </Formik>
          </ModalBody>
        </Modal>
      </Fragment>
    )
  );

  // input campo de data de formatura
  //
}
