import React, { Component } from 'react';
import matchSorter from 'match-sorter';
import moment from 'moment';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';
import { List } from 'react-feather';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default class TableExtended extends Component {
  makeData = () => {
    return [
      {
        id: 1,
        description: 'Grupo semanal Homem ao máximo',
        ministery: 'CMN',
        inscriptions: 9,
        startDate: '2019-04-27',
        status: 'Em andamento',
        locale: 'PIB de Marília',
        actions: 1,
      },
      {
        id: 2,
        description:
          'Como proteger a pureza dos seus filhos asdas asdsad asdadasd asdsadada adssad',
        ministery: 'GFI',
        inscriptions: 14,
        startDate: '2019-08-10',
        status: 'Não iniciado',
        locale: 'Primeira Igreja de Betânia',
        actions: 1,
      },
      {
        id: 3,
        description: 'Grupo semanal Crown finanças',
        ministery: 'CROWN',
        inscriptions: 6,
        startDate: '2019-05-01',
        status: 'Em andamento',
        locale: 'Holliness Pompéia',
        actions: 1,
      },
      {
        id: 4,
        description: 'Grupo semanal Habitudes',
        ministery: 'PG',
        inscriptions: 9,
        startDate: '2019-04-10',
        status: 'Cancelado',
        locale: 'Universidade da Família',
        actions: 1,
      },
      {
        id: 5,
        description: 'Grupo semanal Homem ao máximo',
        ministery: 'CMN',
        inscriptions: 9,
        startDate: '2019-04-27',
        status: 'Em andamento',
        locale: 'PIB de Marília',
        actions: 1,
      },
      {
        id: 6,
        description: 'Grupo semanal Homem ao máximo',
        ministery: 'CMN',
        inscriptions: 9,
        startDate: '2019-04-27',
        status: 'Em andamento',
        locale: 'Universidade da Família',
        actions: 1,
      },
    ];
  };

  render() {
    return (
      <ReactTable
        data={this.makeData()}
        filterable
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
            id: 'description',
            accessor: d => d.description,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ['description'] }),
            filterAll: true,
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
            Header: 'Ministério',
            id: 'ministery',
            width: 100,
            accessor: d => d.ministery,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ['ministery'] }),
            filterAll: true,
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
            Header: 'Inscritos',
            accessor: 'inscriptions',
            width: 100,
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
            Header: 'Início',
            id: 'startDate',
            accessor: d => {
              return d.startDate;
            },
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, {
                keys: ['startDate'],
              }),
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
            Cell: row => moment(row.value).format('DD/MM/YYYY'),
            filterAll: true,
            width: 170,
          },
          {
            Header: 'Local',
            accessor: 'locale',
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
            Header: 'Status',
            accessor: 'status',
            id: 'status',
            filterMethod: (filter, row) => {
              if (filter.value === 'all') {
                return true;
              }
              if (filter.value === 'not') {
                return row[filter.id] === 'Não iniciado';
              }
              if (filter.value === 'run') {
                return row[filter.id] === 'Em andamento';
              }
              if (filter.value === 'fin') {
                return row[filter.id] === 'Finalizado';
              }
              if (filter.value === 'can') {
                return row[filter.id] === 'Cancelado';
              }
              return row[filter.id];
            },
            Filter: ({ filter, onChange }) => (
              <select
                onChange={event => onChange(event.target.value)}
                style={{ width: '100%', color: '#fff' }}
                value={filter ? filter.value : 'all'}
              >
                <option value="all">Mostrar todos</option>
                <option value="not">Não iniciado</option>
                <option value="run">Em andamento</option>
                <option value="fin">Finalizado</option>
                <option value="can">Cancelado</option>
              </select>
            ),
            width: 150,
          },
          {
            Header: 'Ações',
            accessor: 'actions',
            id: 'actions',
            width: 110,
            filterable: false,
            sortable: false,
            Cell: instance => {
              return (
                <UncontrolledDropdown>
                  <DropdownToggle className="bg-transparent overflow-auto">
                    <List size={14} />
                  </DropdownToggle>
                  <DropdownMenu className="overflow-visible">
                    <DropdownItem
                      onClick={() => {
                        // console.log(instance.original);
                      }}
                    >
                      Editar
                    </DropdownItem>
                    <DropdownItem>Organizadores</DropdownItem>
                    <DropdownItem>Participantes</DropdownItem>
                    <DropdownItem>Crachás</DropdownItem>
                    <DropdownItem>Certificados</DropdownItem>
                  </DropdownMenu>
                </UncontrolledDropdown>
              );
            },
          },
        ]}
        defaultPageSize={5}
        getTdProps={(state, rowInfo, column, instance) => ({
          style: {
            cursor: 'pointer',
            overflow: column.id === 'actions' ? 'visible' : 'hidden',
          },

          // onClick: () => console.log(column),
        })}
        className="-striped -highlight"
      />
    );
  }
}
