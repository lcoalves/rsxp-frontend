// --> TUDO DOS ASSISTENTES VAO SER MAIOR OU IGUAL...

import React, { useState, useEffect, Fragment, Component } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import NumberFormat from 'react-number-format';

import { Link, Redirect, withRouter } from 'react-router-dom';
import { Formik, Field, Form, FieldArray } from 'formik';
import { Datepicker } from 'react-formik-ui';
import { subHours, parseISO, format, subMonths } from 'date-fns';
import pt from 'date-fns/locale/pt';
import { toastr } from 'react-redux-toastr';
import * as Yup from 'yup';
import randomstring from 'randomstring';
import { PDFDownloadLink } from '@react-pdf/renderer';

import { validateCPF } from '~/services/validateCPF';

import Certificate from '~/views/certificate/index';

import statesCities from '../../../../assets/data/statesCities';

import CustomTabs from '../../../../components/tabs/default';

import TableParticipants from './participantTable';
import TableQuitters from './quitterTable';
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
  Mail,
  Phone,
  ArrowRightCircle,
  UserPlus,
} from 'react-feather';

import { css } from '@emotion/core';
import { BounceLoader } from 'react-spinners';

import classnames from 'classnames';

//import { Creators as OrganizatorActions } from '~/store/ducks/organizatorSearch';
import { Creators as EventActions } from '~/store/ducks/event';
import { Creators as InviteActions } from '~/store/ducks/invite';
import { Creators as CertificateActions } from '~/store/ducks/certificate';
import { Creators as OrganizatorActions } from '~/store/ducks/organizator';
import { Creators as ParticipantActions } from '~/store/ducks/participant';

// import { Creators as EventParticipantActions } from '~/store/ducks/'

import photo14 from '../../../../assets/img/photos/18.jpg';

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
        allowLeadingZeros
        value={this.state.value}
        onValueChange={vals => {
          this.setState({ value: vals.value });
        }}
        {...this.props}
      />
    );
  }
}

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
  cpf: Yup.string().required('O CPF é obrigatório'),
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
  const [modalSearchParticipant, setModalSearchParticipant] = useState(false);
  const [modalAddParticipant, setModalAddParticipant] = useState(false);
  const [modalInvite, setModalInvite] = useState(false);
  const [modalCertificate, setModalCertificate] = useState(false);
  const [invites, setInvites] = useState([]);
  const [certificateParticipants, setCertificateParticipants] = useState([]);
  const [productsKit, setProductsKit] = useState([]);
  const [assistants, setAssistants] = useState([]);
  const [organizatorType, setOrganizatorType] = useState(null);
  const [leaderData, setLeaderData] = useState(null);
  const [participantData, setParticipantData] = useState(false);
  const [participantError, setParticipantError] = useState(null);
  const [pdfButton, setPdfButton] = useState(null);
  const [downloadDisable, setDownloadDisable] = useState(true);

  const loading = useSelector(state => state.organizator.loadingSearch);
  const participant_loading = useSelector(
    state => state.participant.loadingSearch
  );
  const organizator_data = useSelector(state => state.organizator.data);
  const loadingOrganizator = useSelector(
    state => state.organizator.loadingSearch
  );
  const participant_data = useSelector(state => state.participant.data);
  const participant_error = useSelector(state => state.participant.error);
  const event_loading = useSelector(state => state.event.loading);
  const event_data = useSelector(state => state.event.data);

  const DatepickerButton = ({ value, onClick }) => (
    <Button
      outline
      color="secondary"
      className="form-control height-38"
      onClick={onClick}
    >
      {value}
    </Button>
  );

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

  function toggleModalOrganizator() {
    setLeaderData(null);
    setModalOrganizator(!modalOrganizator);
  }

  function toggleModalParticipant() {
    setParticipantData(null);
    setParticipantError(false);
    setModalParticipant(!modalParticipant);
  }

  function toggleModalSearchParticipant() {
    setModalParticipant(false);
    setModalSearchParticipant(!modalSearchParticipant);
  }

  function toggleModalAddParticipant() {
    setModalParticipant(false);
    setModalAddParticipant(!modalAddParticipant);
  }

  function toggleModalInvite() {
    setModalParticipant(false);
    setModalInvite(!modalInvite);
  }

  function toggleModalChangeOrganizator() {
    setLeaderData(null);
    setModalChangeOrganizator(!modalChangeOrganizator);
  }

  function toggleModalCertificate() {
    setPdfButton(null);
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

  function confirmModalSearchParticipant() {
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

    const formattedCpf = cpf
      .replace('.', '')
      .replace('.', '')
      .replace('-', '');

    dispatch(
      ParticipantActions.createParticipantRequest(
        name,
        formattedCpf,
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

  function handleSearchOrganizator(cpf, setFieldValue, values) {
    const { organizator_type } = values;
    const default_event_id = event_data.default_event_id;
    const formattedCpf = cpf
      .replace('.', '')
      .replace('.', '')
      .replace('-', '');

    setFieldValue('cpf', formattedCpf);

    if (formattedCpf.length === 11) {
      dispatch(
        OrganizatorActions.searchOrganizatorRequest(
          organizator_type,
          cpf,
          default_event_id
        )
      );
    }
  }

  function handleOrganizatorType(event, setFieldValue) {
    setFieldValue('organizator_type', event.target.value);
    setFieldValue('cpf', '');

    setOrganizatorType(event.target.value);
    setLeaderData(null);
  }

  function handleSearchParticipant(cpf, setFieldValue, values) {
    setParticipantData(null);
    const formattedCpf = cpf
      .replace('.', '')
      .replace('.', '')
      .replace('-', '');

    const default_event_id = event_data.default_event_id;

    if (formattedCpf.length === 11) {
      dispatch(
        ParticipantActions.searchParticipantRequest(
          formattedCpf,
          default_event_id
        )
      );
    }
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
        dispatch(ParticipantActions.deleteParticipantRequest(entity_id)),
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
      InviteActions.confirmInviteRequest(
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
    setPdfButton(null);

    const dateValues = subHours(values.certificateDate, 1);

    const toSend = {
      event_id: event_data.id,
      date: format(dateValues, "dd 'de' MMMM 'de' yyyy", { locale: pt }),
      city: event_data.city,
      uf: event_data.uf,
      layout_certificado: event_data.defaultEvent.layoutCertificate,
      checkBackground: values.checkBackground,
      imgBackground: event_data.defaultEvent.img_certificate_url,
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

      setPdfButton(toSend);
    }
  }

  function amountCalc(event, setFieldValue) {
    const { name, value } = event.target;

    const valorTeste = parseInt(value, 10);

    setFieldValue(name, valorTeste.toString());
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
    const products = [];

    if (!!event_data) {
      // CRIAR LISTA DE PARTICIPANTES PARA MOSTRAR NO MODAL DO CERTIFICADO
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
      }

      // CRIAR LISTA DE PRODUTO PARA MOSTRAR NO MODAL DO SOLICITAR MATERIAL
      if (
        event_data.defaultEvent.kit.products &&
        event_data.defaultEvent.kit.products.length > 0
      ) {
        event_data.defaultEvent.kit.products.map(product => {
          products.push({
            id: product.netsuite_id,
            name: product.name,
            unit_price: product.unit_price,
            quantity: 0,
          });
        });

        setProductsKit(products);
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
                style={{
                  background: `url("${event_data.defaultEvent.img_banner_dash_url}") 50%`,
                }}
              >
                <div className="mt-2 mr-2 align-self-end">
                  <UncontrolledDropdown className="pr-1 d-lg-none">
                    <DropdownToggle color="success">
                      <ChevronDown size={24} />
                    </DropdownToggle>
                    <DropdownMenu right>
                      <DropdownItem
                        disabled={
                          event_data.status !== 'Finalizado' ? true : false
                        }
                        // onClick={}
                      >
                        <i className="fa fa-plus mr-2" /> Solicitar material
                      </DropdownItem>
                      )
                      {/* <DropdownItem>
                        <i className="fa fa-address-card mr-2" /> Emitir crachás
                      </DropdownItem>
                      <Link to="/evento?id=1" className="p-0">
                        <DropdownItem>
                          <i className="fa fa-globe mr-2" /> Site do evento
                        </DropdownItem>
                      </Link> */}
                      {/* <DropdownItem>
                        <i className="fa fa-user mr-2" /> Cartão de nomes
                      </DropdownItem> */}
                      <DropdownItem onClick={toggleModalCertificate}>
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
                              tem pedido = nao, entao solicitar material
                            */}
                            <Button
                              color="success"
                              className="btn-raised mr-3"
                              disabled={
                                event_data.status !== 'Finalizado'
                                  ? false
                                  : true
                              }
                              // onClick={}
                            >
                              <i className="fa fa-plus" /> Solicitar material
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
                              onClick={toggleModalCertificate}
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
                          Líderes
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

        <TabContent className="px-0" activeTab={activeTab}>
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
                      endDate: !!event_data.end_date ? event_data.end_date : '',
                    }}
                    validationSchema={formDetails}
                    // CRIAR FUNÇÃO PARA SALVAR DADOS DA EDIÇÃO DO GRUPO
                    onSubmit={() => {}}
                  >
                    {({
                      errors,
                      touched,
                      handleChange,
                      values,
                      setFieldValue,
                    }) => (
                      <Form>
                        {/* <input type="hidden" value="something" /> */}
                        <div className="form-body">
                          <Row>
                            <Col sm="12" md="4" lg="4" xl="2">
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
                            <Col sm="12" md="8" lg="8" xl="10">
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
                          {/* <Row>
                            <Col sm="4">
                              <FormGroup>
                                <Label for="cep">CEP</Label>
                                <div className="position-relative has-icon-left">
                                  <Field
                                    type="text"
                                    placeholder="CEP"
                                    autoComplete="cep"
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
                                  type="text"
                                  readOnly
                                  id="uf"
                                  name="uf"
                                  onChange={handleChange}
                                  className={`
                                  form-control
                                  ${errors.uf && touched.uf && 'is-invalid'}
                                `}
                                ></Field>
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
                                  type="text"
                                  autoComplete="city"
                                  id="city"
                                  name="city"
                                  className={`
                                  form-control
                                  ${errors.city && touched.city && 'is-invalid'}
                                `}
                                ></Field>
                              </FormGroup>
                            </Col>
                          </Row>
                          <Row>
                            <Col sm="12" md="8" lg="8">
                              <FormGroup>
                                <Label for="street">Rua</Label>
                                <div className="position-relative has-icon-left">
                                  <Field
                                    type="text"
                                    placeholder="Rua"
                                    autoComplete="street"
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
                            <Col sm="12" md="4" lg="4">
                              <FormGroup>
                                <Label for="streetNumber">Número</Label>
                                <div className="position-relative has-icon-left">
                                  <Field
                                    type="text"
                                    placeholder="Número"
                                    autoComplete="number"
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
                          </Row>
                          <Row>
                            <Col sm="12" md="6" lg="4">
                              <FormGroup>
                                <Label for="neighborhood">Bairro</Label>
                                <div className="position-relative has-icon-left">
                                  <Field
                                    type="text"
                                    placeholder="Bairro"
                                    autoComplete="neighborhood"
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
                            <Col sm="12" md="6" lg="8">
                              <FormGroup>
                                <Label for="complement">Complemento</Label>
                                <div className="position-relative has-icon-left">
                                  <Field
                                    type="text"
                                    autoComplete="complement"
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
                          </Row>
                          <Row>
                            <Col xl="3" lg="4" md="5" sm="12">
                              <FormGroup>
                                <Label for="initialDate">Inicio</Label>
                                <div className="position-relative has-icon-left">
                                  <Datepicker
                                    name="initialDate"
                                    id="initialDate"
                                    locale={pt}
                                    selected={event_data.start_date}
                                    onChange={date =>
                                      setFieldValue('initialDate', date)
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
                            <Col xl="3" lg="3" md="5" sm="12">
                              <FormGroup>
                                <Label for="endDate">Formatura</Label>
                                <div className="position-relative has-icon-left">
                                  <Datepicker
                                    name="endDate"
                                    id="endDate"
                                    locale={pt}
                                    selected={values.endDate}
                                    onChange={date =>
                                      setFieldValue('endDate', date)
                                    }
                                    customInput={<DatepickerButton />}
                                    minDate={values.initialDate}
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
                          </Row> */}
                        </div>
                        {/* <div className="form-actions right">
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
                        </div> */}
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
              {/* BOTAO PARA ADICIONAR ORGANIZADOR */}
              {event_data.defaultEvent.max_organizators >
                event_data.organizators.length ||
              event_data.defaultEvent.max_assistants > assistants.length ? (
                <Col xs="12" md="6" lg="4">
                  <Card className="height-350 justify-content-center">
                    <div className="d-flex justify-content-center align-items-center">
                      <Button
                        className="rounded-circle width-150 height-150"
                        outline
                        color="success"
                        onClick={toggleModalOrganizator}
                      >
                        <i className="fa fa-plus" />
                      </Button>
                    </div>
                  </Card>
                </Col>
              ) : (
                <Col xs="12" md="6" lg="4">
                  <Card className="height-350 justify-content-center">
                    <div className="d-flex flex-column justify-content-center align-items-center">
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
                  <Col xs="12" md="6" lg="4" key={organizator.id}>
                    <Card className="height-350 justify-content-center">
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
                            onClick={toggleModalChangeOrganizator}
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
                        <Row className="mb-1">
                          <Col xs="6" className="text-center text-truncate">
                            <Phone size={18} color="#212529" />
                            {!!organizator.phone ? (
                              <span className="ml-2">{organizator.phone}</span>
                            ) : (
                              <span className="ml-2">Sem telefone</span>
                            )}
                          </Col>
                          <Col xs="6" className="text-center text-truncate">
                            <Mail size={18} color="#212529" />
                            {!!organizator.email ? (
                              <span className="ml-2">{organizator.email}</span>
                            ) : (
                              <span className="ml-2">Sem email</span>
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
                    <Col xs="12" md="6" lg="4" key={participant.id}>
                      <Card className="height-350 justify-content-center">
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
                              handleDeleteParticipant(participant.pivot.id)
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
                          <Row className="mb-1">
                            <Col xs="6" className="text-center text-truncate">
                              <Phone size={18} color="#212529" />
                              {!!participant.phone ? (
                                <span className="ml-2">
                                  {participant.phone}
                                </span>
                              ) : (
                                <span className="ml-2">Sem telefone</span>
                              )}
                            </Col>
                            <Col xs="6" className="text-center text-truncate">
                              <Mail size={18} color="#212529" />
                              {!!participant.email ? (
                                <span className="ml-2">
                                  {participant.email}
                                </span>
                              ) : (
                                <span className="ml-2">Sem email</span>
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
                                  onClick={toggleModalParticipant}
                                >
                                  <i className="fa fa-user fa-xs" /> Inserir
                                  participante
                                </Button>
                                {/* <Button
                                  color="warning"
                                  className="btn-raised mr-2 mb-0 font-small-3"
                                  onClick={toggleModalInvite}
                                >
                                  <i className="fa fa-paper-plane fa-xs" />{' '}
                                  Convidar por email
                                </Button> */}
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
                                  onClick={toggleModalParticipant}
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
                                return (
                                  participant.pivot.assistant === false &&
                                  participant.pivot.is_quitter === false
                                );
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
                        <Badge color="danger" className="align-self-center">
                          Participantes desistentes
                        </Badge>
                      </div>
                      <CustomTabs
                        TabContent={
                          <TableQuitters
                            data={event_data.participants.filter(
                              participant => {
                                return (
                                  participant.pivot.assistant === false &&
                                  participant.pivot.is_quitter === true
                                );
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
                            <div
                              className="lesson-container"
                              key={lessonReport.id}
                            >
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
                                    to={`/eventos/grupo/${event_data.id}/editar/aula/${lessonReport.id}`}
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
          toggle={toggleModalOrganizator}
          className={className}
        >
          <ModalHeader toggle={toggleModalOrganizator}>
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
              {({ errors, touched, values, setFieldValue }) => (
                <Form>
                  <div className="form-body">
                    <Row className="d-flex flex-row f">
                      <Col sm="12" md="12" lg="5" className="mb-2">
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
                          onChange={event =>
                            handleOrganizatorType(event, setFieldValue)
                          }
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
                      {!!values.organizator_type && (
                        <Col lg="7" md="12" sm="12">
                          <FormGroup>
                            <div className="position-relative has-icon-right">
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
                                    placeholder="digite aqui o CPF"
                                    className={`
                                      form-control
                                      ${errors.cpf &&
                                        touched.cpf &&
                                        'is-invalid'}
                                    `}
                                    value={values.cpf}
                                    onValueChange={val =>
                                      handleSearchOrganizator(
                                        val.value,
                                        setFieldValue,
                                        values
                                      )
                                    }
                                  />
                                )}
                              />
                              {errors.cpf && touched.cpf ? (
                                <div className="invalid-feedback">
                                  {errors.cpf}
                                </div>
                              ) : null}
                              {loadingOrganizator && (
                                <div className="form-control-position">
                                  <RefreshCw size={16} className="spinner" />
                                </div>
                              )}
                            </div>
                          </FormGroup>
                        </Col>
                      )}
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
                            <Row className="mb-1">
                              <Col xs="6" className="text-center text-truncate">
                                <Phone size={18} color="#212529" />
                                {!!leaderData.phone ? (
                                  <span className="ml-2">
                                    {leaderData.phone}
                                  </span>
                                ) : (
                                  <span className="ml-2">Sem telefone</span>
                                )}
                              </Col>
                              <Col xs="6" className="text-center text-truncate">
                                <Mail size={18} color="#212529" />
                                {!!leaderData.email ? (
                                  <span className="ml-2">
                                    {leaderData.email}
                                  </span>
                                ) : (
                                  <span className="ml-2">Sem email</span>
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
            <Button
              className="ml-1 my-1"
              color="danger"
              onClick={toggleModalOrganizator}
            >
              Cancelar
            </Button>{' '}
            <Button
              className={`${
                leaderData !== null
                  ? 'ml-1 my-1 btn-success'
                  : 'ml-1 my-1 btn-secondary'
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
                'Adicionar organizador'
              )}
            </Button>
          </ModalFooter>
        </Modal>

        {/* MODAL PARA TROCAR ORGANIZADOR */}
        <Modal
          isOpen={modalChangeOrganizator}
          toggle={toggleModalChangeOrganizator}
          className={className}
        >
          <ModalHeader toggle={toggleModalChangeOrganizator}>
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
                onClick={toggleModalChangeOrganizator}
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

        {/* MODAL PARA LISTA DE ADD PARTICIPANTE */}
        <Modal
          isOpen={modalParticipant}
          toggle={toggleModalParticipant}
          className={className}
        >
          <ModalHeader toggle={toggleModalParticipant}>
            Inserir participante
          </ModalHeader>
          <ModalBody>
            <CardBody className="d-flex flex-column justify-content-center">
              <Button
                outline
                type="submit"
                color="default"
                className="btn-default height-100 icon-light-hover font-medium-2"
                onClick={toggleModalSearchParticipant}
              >
                <div className="d-flex justify-content-around align-items-center">
                  <Search size={24} color="#000" className="mr-2" />
                  <div>
                    <h5 className="mb-0">Pesquisar participante existente</h5>
                  </div>
                  <ArrowRightCircle size={24} color="#000" className="mr-2" />
                </div>
              </Button>

              <Button
                outline
                type="submit"
                color="default"
                className="btn-default height-100 icon-light-hover font-medium-2"
                onClick={toggleModalAddParticipant}
              >
                <div className="d-flex justify-content-around align-items-center">
                  <UserPlus size={24} color="#000" className="mr-2" />
                  <div>
                    <h5 className="mb-0">Cadastrar participante manualmente</h5>
                  </div>
                  <ArrowRightCircle size={24} color="#000" className="mr-2" />
                </div>
              </Button>

              <Button
                outline
                type="submit"
                color="default"
                className="btn-default height-100 icon-light-hover font-medium-2"
                onClick={toggleModalInvite}
              >
                <div className="d-flex justify-content-around align-items-center">
                  <Mail size={24} color="#000" className="mr-2" />
                  <div>
                    <h5 className="mb-0">Convidar participante por email</h5>
                  </div>
                  <ArrowRightCircle size={24} color="#000" className="mr-2" />
                </div>
              </Button>
            </CardBody>
          </ModalBody>
        </Modal>

        {/* MODAL PARA PESQUISAR PARTICIPANTE */}
        <Modal
          isOpen={modalSearchParticipant}
          toggle={toggleModalSearchParticipant}
          className={className}
        >
          <ModalHeader toggle={toggleModalSearchParticipant}>
            Pesquisar participante por CPF
          </ModalHeader>
          <ModalBody>
            <Formik
              initialValues={{
                cpf: '',
              }}
              validationSchema={formParticipant}
            >
              {({ errors, touched, values, setFieldValue }) => (
                <Form>
                  <div className="form-body">
                    <Row className="d-flex flex-row">
                      <Col lg="12" md="12" sm="12">
                        <FormGroup>
                          <div className="position-relative has-icon-right">
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
                                  placeholder="digite aqui o CPF"
                                  className={`
                                      form-control
                                      ${errors.cpf &&
                                        touched.cpf &&
                                        'is-invalid'}
                                    `}
                                  value={values.cpf}
                                  onValueChange={val =>
                                    handleSearchParticipant(
                                      val.value,
                                      setFieldValue,
                                      values
                                    )
                                  }
                                />
                              )}
                            />
                            {errors.cpf && touched.cpf ? (
                              <div className="invalid-feedback">
                                {errors.cpf}
                              </div>
                            ) : null}
                            {loadingOrganizator && (
                              <div className="form-control-position">
                                <RefreshCw size={16} className="spinner" />
                              </div>
                            )}
                          </div>
                        </FormGroup>
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
                            <Row className="mb-1">
                              <Col xs="6" className="text-center text-truncate">
                                <Phone size={18} color="#212529" />
                                {!!participantData.phone ? (
                                  <span className="ml-2">
                                    {participantData.phone}
                                  </span>
                                ) : (
                                  <span className="ml-2">Sem telefone</span>
                                )}
                              </Col>
                              <Col xs="6" className="text-center text-truncate">
                                <Mail size={18} color="#212529" />
                                {!!participantData.email ? (
                                  <span className="ml-2">
                                    {participantData.email}
                                  </span>
                                ) : (
                                  <span className="ml-2">Sem email</span>
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
                  <Button color="success" onClick={toggleModalAddParticipant}>
                    <i className="fa fa-plus" /> Cadastrar novo participante
                  </Button>
                  <Button
                    color="warning"
                    className="text-white"
                    onClick={toggleModalInvite}
                  >
                    <i className="fa fa-paper-plane fa-xs" /> Convidar por email
                  </Button>
                </Row>
              </>
            )}
          </ModalBody>
          <ModalFooter>
            <Button
              className="ml-1 my-1"
              color="danger"
              onClick={toggleModalSearchParticipant}
            >
              Cancelar
            </Button>{' '}
            <Button
              className={`${
                participantData !== null
                  ? 'ml-1 my-1 btn-success'
                  : 'btn-secundary ml-1 my-1'
              }`}
              onClick={confirmModalSearchParticipant}
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
          </ModalFooter>
        </Modal>

        {/* MODAL PARA CADASTRAR PARTICIPANTE MANUALMENTE */}
        <Modal
          isOpen={modalAddParticipant}
          toggle={toggleModalAddParticipant}
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
                <ModalHeader toggle={toggleModalAddParticipant}>
                  Cadastrar participante
                </ModalHeader>
                <ModalBody>
                  <div className="form-body">
                    <Row className="d-flex flex-row">
                      <Col sm="12" md="12" lg="12">
                        <FormGroup>
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
                            <div className="invalid-feedback">
                              {errors.name}
                            </div>
                          ) : null}
                        </FormGroup>
                      </Col>
                      <Col lg="12" md="12" sm="12">
                        <FormGroup>
                          <div className="position-relative has-icon-right">
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
                                  placeholder="digite aqui o CPF"
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
                            {loadingOrganizator && (
                              <div className="form-control-position">
                                <RefreshCw size={16} className="spinner" />
                              </div>
                            )}
                          </div>
                        </FormGroup>
                      </Col>
                      <Col sm="12" md="12" lg="12">
                        <FormGroup>
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
                            <div className="invalid-feedback">
                              {errors.email}
                            </div>
                          ) : null}
                        </FormGroup>
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
                  <Button
                    className="ml-1 my-1"
                    color="danger"
                    onClick={toggleModalAddParticipant}
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
              toggle={toggleModalInvite}
              className={className}
              size="lg"
            >
              <ModalHeader toggle={toggleModalInvite}>
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
                    onClick={toggleModalInvite}
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
          toggle={toggleModalCertificate}
          className={className}
          size="md"
        >
          <Formik
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
                <ModalHeader toggle={toggleModalCertificate}>
                  Emitir certificados
                  <Certificate />
                </ModalHeader>

                <ModalBody>
                  <Row>
                    <Col>
                      <Label className="mb-0">Data da formatura</Label>
                    </Col>
                    <Col>
                      <FormGroup>
                        <div className="position-relative has-icon-left">
                          <Datepicker
                            name="certificateDate"
                            id="certificateDate"
                            locale={pt}
                            selected={values.certificateDate}
                            onChange={date =>
                              setFieldValue('certificateDate', date)
                            }
                            customInput={<DatepickerButton />}
                            minDate={subMonths(new Date(), 12)}
                            showMonthDropdown
                            showYearDropdown
                            dropdownMode="select"
                            className={`
                              form-control
                              ${errors.certificateDate &&
                                touched.certificateDate &&
                                'is-invalid'}
                            `}
                          />
                          {errors.certificateDate && touched.certificateDate ? (
                            <div className="invalid-feedback">
                              {errors.certificateDate}
                            </div>
                          ) : null}
                          <div className="form-control-position">
                            <Calendar size={14} color="#212529" />
                          </div>
                        </div>
                      </FormGroup>
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
                              <tr key={selected.id}>
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
                </ModalBody>
                <ModalFooter>
                  <Row>
                    {pdfButton !== null && (
                      <Button
                        onClick={
                          downloadDisable ? toggleModalCertificate : () => {}
                        }
                        color="success"
                        disabled={downloadDisable}
                      >
                        <PDFDownloadLink
                          className="text-white"
                          document={
                            <Certificate
                              certificates={pdfButton}
                              fileName="certificado.pdf"
                            />
                          }
                        >
                          {({ blob, url, loading, error }) => {
                            if (loading) {
                              setDownloadDisable(true);
                              return 'Carregando documento';
                            } else {
                              setDownloadDisable(false);
                              return 'Baixe agora!';
                            }
                            // loading ?
                            //   (setDownloadDisable(true) 'Carregando documento')
                            // : (setDownloadDisable(false) 'Baixe agora!')
                          }}
                        </PDFDownloadLink>
                      </Button>
                    )}

                    <Button type="submit" color="primary" className="mr-2">
                      Gerar certificados
                    </Button>
                  </Row>
                </ModalFooter>
              </Form>
            )}
          </Formik>
        </Modal>
      </Fragment>
    )
  );
}
