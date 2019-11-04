import React from 'react';
import { useDispatch } from 'react-redux';

import history from '~/app/history';

import { toastr } from 'react-redux-toastr';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import { List } from 'react-feather';

import { Creators as EventActions } from '~/store/ducks/event';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default function LeaderTableGroups({ data }) {
  const dispatch = useDispatch();

  function handleEdit(e, column) {
    if (e === undefined) {
      return;
    }

    if (column === 'Ações') {
      if (e.original.participants_count === 0) {
        toastr.confirm(`Tem certeza de que quer deletar o grupo?`, {
          onOk: () => dispatch(EventActions.deleteEventRequest(e.original.id)),
          onCancel: () => {},
        });
        return;
      } else {
        return;
      }
    }

    const id = e.original.id;

    localStorage.setItem('@dashboard/editGroupActiveTab', '1');

    history.push(`/eventos/grupo/${id}/editar`);
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
          Header: 'Código',
          accessor: 'id',
          width: 110,
          Filter: ({ filter, onChange }) => (
            <input
              onChange={event => onChange(event.target.value)}
              value={filter ? filter.value : ''}
              style={{
                width: '100%',
                color: 'white',
              }}
            />
          ),
        },
        {
          Header: 'Data do pedido',
          id: 'created_at',
          width: 100,
          accessor: d => d.created_at,
        },
        {
          Header: 'Valor',
          id: 'shipping_cost',
          accessor: d => d.shipping_cost,
          width: 100,
        },
        {
          Header: 'Frete',
          id: 'shipping_name',
          accessor: d => d.shipping_name,
          width: 170,
        },
        {
          Header: 'Total',
          id: 'shipping_name',
          accessor: d => d.shipping_name,
          width: 170,
        },
        {
          Header: 'Pagamento',
          id: 'payment_name',
          accessor: d => d.payment_name,
          width: 150,
        },
        {
          Header: 'Status',
          id: 'status.name',
          accessor: d => d.status.name,
          width: 150,
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
                  <DropdownItem onClick={() => {}}>Cancelar</DropdownItem>
                  <DropdownItem onClick={() => {}}>Editar</DropdownItem>
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

          onClick: () => handleEdit(rowInfo, column.Header),
        };
      }}
      className="-striped -highlight"
    />
  );
}
