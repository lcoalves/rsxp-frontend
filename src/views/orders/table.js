import React from 'react';
import { useDispatch } from 'react-redux';
import { Link } from 'react-router-dom';

import { format, addDays } from 'date-fns';
import { ptBR } from 'date-fns/locale';

import history from '~/app/history';

import { toastr } from 'react-redux-toastr';
import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  Label,
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

    if (column === 'Link') {
      const url = e.original.transactions[0].boleto_url;
      window.open(url);

      return;
    }

    const id = e.original.id;

    localStorage.setItem('@dashboard/editGroupActiveTab', '1');

    history.push(`/pedido/${id}/editar`);
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
          Header: 'Solicitado em',
          id: 'created_at',
          width: 130,
          accessor: d => d.created_at,
          Cell: row =>
            format(new Date(row.value), 'dd/MM/yyyy', {
              locale: ptBR,
            }),
        },
        {
          Header: 'Recebe até',
          id: 'delivery_estimate_days',
          width: 130,
          accessor: d => d.delivery_estimate_days,
          Cell: row => {
            const estimate_date = row.value + 1;

            return format(
              addDays(new Date(row.row.created_at), estimate_date),
              'dd/MM/yyyy',
              {
                locale: ptBR,
              }
            );
          },
        },
        {
          Header: 'Envio',
          id: 'shipping_name',
          accessor: d => d.shipping_name,
          width: 190,
        },
        {
          Header: 'Valor total',
          id: 'total',
          accessor: d => d.total,
          Cell: row => {
            const currency = row.value.toLocaleString('pt-BR', {
              style: 'currency',
              currency: 'BRL',
            });

            return currency;
          },
          width: 170,
        },
        {
          Header: 'Link',
          id: 'boleto_url',
          accessor: d => d.transactions[0].boleto_url,
          Cell: instance => {
            return <Label className="text-info">BAIXAR BOLETO</Label>;
          },
          width: 150,
        },
        {
          Header: 'Status',
          id: 'status.name',
          accessor: d => d.status.name,
          width: 190,
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
                  <DropdownItem onClick={() => {}}>Editar</DropdownItem>
                  <DropdownItem onClick={() => {}}>Cancelar</DropdownItem>
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
