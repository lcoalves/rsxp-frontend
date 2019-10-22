import React, { useState } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import { BounceLoader } from 'react-spinners';
import { css } from '@emotion/core';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  FormGroup,
  Col,
  Label,
  Button,
} from 'reactstrap';
import { Formik, Field, Form } from 'formik';

import * as Yup from 'yup';

import { toastr } from 'react-redux-toastr';
import { List, Mail } from 'react-feather';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

// import { validateCPF } from '~/services/validateCPF';
import { Creators as ParticipantActions } from '~/store/ducks/participant';

const formEditParticipant = Yup.object().shape({
  email: Yup.string().email('Digite um email válido'),
});

export default function ParticipantTable({ data, className }) {
  const dispatch = useDispatch();
  const [modalEditParticipant, setModalEditParticipant] = useState(false);
  const [participantData, setParticipantData] = useState(null);

  const loading = useSelector(state => state.participant.loading);

  function deleteParticipant(instance) {
    const participant_id = instance.original.pivot.id;

    toastr.confirm(
      `Tem certeza de que quer remover ${instance.original.name} do evento?`,
      {
        onOk: () =>
          dispatch(ParticipantActions.deleteParticipantRequest(participant_id)),
        onCancel: () => {},
      }
    );
  }

  function setQuitter(instance) {
    const participant_id = instance.original.pivot.id;

    toastr.confirm(
      `Tem certeza de que quer tornar ${instance.original.name} em desistente?`,
      {
        onOk: () =>
          dispatch(
            ParticipantActions.setQuitterParticipantRequest(
              participant_id,
              true
            )
          ),
        onCancel: () => {},
      }
    );
  }

  function toggleOpenModalEditParticipant(participant, column) {
    if (column === 'Ações' || participant === undefined) {
      return;
    }
    console.tron.log(participant);
    setModalEditParticipant(!modalEditParticipant);
    setParticipantData(participant.original);
  }

  function toggleCloseModalEditParticipant() {
    setModalEditParticipant(false);
    setParticipantData(null);
  }

  function handleEditParticipant(values) {
    const data = {
      id: !!participantData ? participantData.id : '',
      name: !!values.name ? values.name : '',
      cpf: !!values.cpf ? values.cpf : '',
      email: !!values.email ? values.email : '',
      phone: !!values.phone ? values.phone : '',
      alt_phone: !!values.altPhone ? values.altPhone : '',
    };

    dispatch(ParticipantActions.editParticipantRequest(data));
  }

  return (
    <>
      <ReactTable
        data={data}
        previousText="Anterior"
        nextText="Próximo"
        loadingText="Carregando..."
        noDataText="Não há dados"
        pageText="Página"
        ofText="de"
        rowsText="linhas"
        pageJumpText="pular para a página"
        rowsSelectorText="linhas por página"
        defaultFilterMethod={(filter, row) =>
          String(row[filter.id]) === filter.value
        }
        columns={[
          {
            Header: 'Matrícula',
            id: 'pivot.id',
            accessor: d => d.pivot.id,
            width: 90,
          },
          {
            Header: 'Cod. Usuário',
            id: 'id',
            accessor: d => d.id,
            width: 110,
          },
          {
            Header: 'Participante',
            id: 'name',
            accessor: d => d.name,
          },
          {
            Header: 'CPF',
            id: 'cpf',
            accessor: d => d.cpf,
            maxWidth: 150,
          },
          {
            Header: 'Idade',
            id: 'age',
            accessor: d => d.age,
            maxWidth: 150,
          },
          {
            Header: 'Celular',
            id: 'phone',
            accessor: d => d.phone,
            maxWidth: 150,
          },
          {
            Header: 'Email',
            id: 'email',
            accessor: d => d.email,
          },
          {
            Header: 'Status',
            accessor: 'status',
            id: 'status',
            width: 90,
            filterable: false,
            Cell: instance => {
              return (
                <div className="d-flex align-content-center justify-content-center p-1 line-height-1">
                  <Mail
                    size={14}
                    color={'#fc0'}
                    className="m-auto"
                    id={`status`}
                  />
                  <UncontrolledTooltip placement="left" target="status">
                    Convite enviado por email
                  </UncontrolledTooltip>
                </div>
              );
            },
          },
          {
            Header: 'Ações',
            accessor: 'actions',
            id: 'actions',
            width: 80,
            filterable: false,
            sortable: false,
            Cell: instance => {
              return (
                <UncontrolledDropdown className="d-flex align-content-center justify-content-center">
                  <DropdownToggle className="bg-transparent mb-0 p-1 line-height-1">
                    <List size={14} color={'#000'} />
                  </DropdownToggle>
                  <DropdownMenu className="overflow-visible">
                    <DropdownItem onClick={() => deleteParticipant(instance)}>
                      Remover
                    </DropdownItem>
                    <DropdownItem onClick={() => setQuitter(instance)}>
                      Tornar desistente
                    </DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              );
            },
          },
        ]}
        defaultPageSize={5}
        showPageSizeOptions={false}
        getTdProps={(state, rowInfo, column, instance) => {
          return {
            style: {
              cursor: 'pointer',
              overflow: column.id === 'actions' ? 'visible' : 'hidden',
            },

            onClick: () =>
              toggleOpenModalEditParticipant(rowInfo, column.Header),
          };
        }}
        className="-striped -highlight"
      />

      {/* MODAL EDITAR PARTICIPANTE */}
      <Modal
        isOpen={modalEditParticipant}
        toggle={toggleCloseModalEditParticipant}
        className={className}
      >
        <Formik
          initialValues={{
            name: !!participantData ? participantData.name : '',
            cpf: !!participantData ? participantData.cpf : '',
            email: !!participantData ? participantData.email : '',
            phone: !!participantData ? participantData.phone : '',
            altPhone: !!participantData ? participantData.alt_phone : '',
          }}
          validationSchema={formEditParticipant}
          onSubmit={values => handleEditParticipant(values)}
        >
          {({ errors, touched, values }) => (
            <Form>
              <ModalHeader toggle={toggleCloseModalEditParticipant}>
                Editar participante
              </ModalHeader>
              <ModalBody>
                <Col sm="12" md="12" lg="12" className="mb-2">
                  <FormGroup>
                    <Label for="name">Nome</Label>
                    <Field
                      type="text"
                      placeholder="Nome do participante"
                      name="name"
                      id="name"
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
                <Col sm="12" md="12" lg="12" className="mb-2">
                  <FormGroup>
                    <Label for="cpf">CPF</Label>
                    <Field
                      type="text"
                      placeholder="CPF do participante"
                      name="cpf"
                      id="cpf"
                      className="form-control"
                      // validate={validateCPF}
                    />
                  </FormGroup>
                </Col>
                <Col sm="12" md="12" lg="12" className="mb-2">
                  <FormGroup>
                    <Label for="email">email</Label>
                    <Field
                      type="text"
                      placeholder="Email do participante"
                      name="email"
                      id="email"
                      className={`
                        form-control
                        ${errors.email && touched.email && 'is-invalid'}
                      `}
                    />
                    {errors.email && touched.email ? (
                      <div className="invalid-feedback">{errors.email}</div>
                    ) : null}
                  </FormGroup>
                </Col>
                <Col sm="12" md="12" lg="12" className="mb-2">
                  <FormGroup>
                    <Label for="phone">Celular</Label>
                    <Field
                      type="text"
                      placeholder="Celular do participante"
                      name="phone"
                      id="phone"
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
                <Col sm="12" md="12" lg="12" className="mb-2">
                  <FormGroup>
                    <Label for="altPhone">Telefone</Label>
                    <Field
                      type="text"
                      placeholder="Telefone do participante"
                      name="altPhone"
                      id="altPhone"
                      className="form-control"
                    />
                  </FormGroup>
                </Col>
              </ModalBody>
              <ModalFooter>
                <Button
                  className="ml-1 my-1"
                  color="danger"
                  onClick={toggleCloseModalEditParticipant}
                >
                  Cancelar
                </Button>{' '}
                <Button className="ml-1 my-1 btn-success" type="submit">
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
                    'Editar participante'
                  )}
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </Modal>
    </>
  );
}
