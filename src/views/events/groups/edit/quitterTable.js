import React from 'react';
import { useDispatch } from 'react-redux';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip,
} from 'reactstrap';
import { toastr } from 'react-redux-toastr';
import { List, Mail } from 'react-feather';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { Creators as ParticipantActions } from '~/store/ducks/participant';

export default function QuitterTable({ data }) {
  const dispatch = useDispatch();

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

  function setInscription(instance) {
    const participant_id = instance.original.pivot.id;

    toastr.confirm(
      `Tem certeza de que quer tornar ${instance.original.name} em inscrito?`,
      {
        onOk: () =>
          dispatch(
            ParticipantActions.setQuitterParticipantRequest(
              participant_id,
              false
            )
          ),
        onCancel: () => {},
      }
    );
  }

  return (
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
          id: 'cellphone',
          accessor: d => d.cellphone,
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
                  <DropdownItem onClick={() => setInscription(instance)}>
                    Tornar inscrito
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

          // onClick: () => console.log('pqqqq'),

          // onClick: () => console.log(rowInfo.original.id)
        };
      }}
      className="-striped -highlight"
    />
  );
}
