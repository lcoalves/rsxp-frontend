import React from 'react';
import { useDispatch } from 'react-redux';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { toastr } from 'react-redux-toastr';
import { List, Mail } from 'react-feather';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { Creators as InviteActions } from '~/store/ducks/invite';

export default function InvitedTable({ data }) {
  const dispatch = useDispatch();

  function removeInvite(instance) {
    const invite_id = instance.original.id;

    toastr.confirm('Tem certeza de que deseja apagar o convite?', {
      onOk: () => dispatch(InviteActions.deleteInviteRequest(invite_id)),
      onCancel: () => {},
    });
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
          Header: 'Id convite',
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
          Header: 'Email',
          id: 'email',
          accessor: d => d.email,
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
                  <DropdownItem onClick={() => removeInvite(instance)}>
                    Remover
                  </DropdownItem>
                  <DropdownItem>Reenviar email</DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            );
          },
        },
      ]}
      defaultPageSize={5}
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
