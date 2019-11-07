import React from 'react';
import { useDispatch } from 'react-redux';

import history from '../../../app/history';
import moment from 'moment';

import { toastr } from 'react-redux-toastr';
import { UncontrolledTooltip } from 'reactstrap';

import { Creators as EventActions } from '~/store/ducks/event';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

import { Trash2 } from 'react-feather';

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
          Header: 'ID',
          accessor: 'id',
          width: 90,
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
          Header: 'Descrição',
          id: 'defaultEvent.name',
          accessor: d => d.defaultEvent.name,
        },
        {
          Header: 'Ministério',
          id: 'defaultEvent.ministery.name',
          width: 100,
          accessor: d => d.defaultEvent.ministery.name,
        },
        {
          Header: 'Inscritos',
          accessor: 'participants_count',
          width: 100,
        },
        {
          Header: 'Início',
          id: 'start_date',
          accessor: d => {
            return d.start_date;
          },
          Cell: row => moment(row.value).format('DD/MM/YYYY'),
          filterAll: true,
          width: 120,
        },
        {
          Header: 'Igreja',
          id: 'organization.fantasy_name',
          accessor: 'organization.fantasy_name',
          width: 220,
        },
        {
          Header: 'Status',
          accessor: 'status',
          id: 'status',
          width: 150,
        },
        {
          Header: 'Ações',
          accessor: 'delete',
          id: 'delete',
          width: 90,
          filterable: false,
          Cell: instance => {
            if (instance.original.participants_count === 0) {
              return (
                <div
                  className="d-flex align-content-center justify-content-center p-1 line-height-1"
                  id={`delete-${instance.original.id}`}
                >
                  <Trash2 size={14} color={'#f00'} className="m-auto" />
                  <UncontrolledTooltip
                    placement="left"
                    target={`delete-${instance.original.id}`}
                  >
                    Deletar evento
                  </UncontrolledTooltip>
                </div>
              );
            } else {
              return (
                <div
                  className="d-flex align-content-center justify-content-center p-1 line-height-1"
                  id={`delete-${instance.original.id}`}
                >
                  <Trash2 size={14} color={'#D3D3D3'} className="m-auto" />
                  <UncontrolledTooltip
                    placement="left"
                    target={`delete-${instance.original.id}`}
                  >
                    O evento não pode ser deletado pois possui participantes
                    inscritos
                  </UncontrolledTooltip>
                </div>
              );
            }
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
