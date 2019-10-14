import React from 'react';

import history from '../../../app/history';
import moment from 'moment';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default function LeaderTableGroups({ data }) {
  async function handleEdit(e, column) {
    if (column === 'Ações' || e === undefined) {
      return;
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
          id: 'startDate',
          accessor: d => {
            return d.startDate;
          },
          Cell: row => moment(row.value).format('DD/MM/YYYY'),
          filterAll: true,
          width: 170,
        },
        {
          Header: 'Local',
          accessor: 'address_name',
          id: 'address_name',
        },
        {
          Header: 'Status',
          accessor: 'status',
          id: 'status',
          width: 150,
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
