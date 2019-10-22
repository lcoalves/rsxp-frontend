import React, { Component } from 'react';
import matchSorter from 'match-sorter';
import moment from 'moment';

import { connect } from 'react-redux';
import { bindActionCreators } from 'redux';
import { Creators as CustomizerActions } from '../../store/ducks/customizer';

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

class TableExtended extends Component {
  makeData = () => {
    return [
      {
        id: 1,
        products: 'R$90,00',
        shipping: 'Frete grátis',
        amount: 'R$90,00',
        orderDate: '2019-04-27',
        status: 'Em andamento',
      },
      {
        id: 2,
        products: 'R$420,00',
        shipping: 'R$30,00',
        amount: 'R$450,00',
        orderDate: '2019-08-10',
        status: 'Não iniciado',
      },
      {
        id: 3,
        products: 'R$335,00',
        shipping: 'R$5,00',
        amount: 'R$340,00',
        orderDate: '2019-05-01',
        status: 'Em andamento',
      },
      {
        id: 4,
        products: 'R$90,00',
        shipping: 'R$30,00',
        amount: 'R$120,00',
        orderDate: '2019-04-10',
        status: 'Cancelado',
      },
      {
        id: 5,
        products: 'R$900,00',
        shipping: 'Frete grátis',
        amount: 'R$900,00',
        orderDate: '2019-04-27',
        status: 'Em andamento',
      },
      {
        id: 6,
        products: 'R$270,00',
        shipping: 'R$10,00',
        amount: 'R$280,00',
        orderDate: '2019-04-27',
        status: 'Em andamento',
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
                }}
              />
            ),
          },
          {
            Header: 'Data',
            id: 'orderDate',
            accessor: d => {
              return d.orderDate;
            },
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, {
                keys: ['orderDate'],
              }),
            Filter: ({ filter, onChange }) => (
              <input
                onChange={event => onChange(event.target.value)}
                value={filter ? filter.value : ''}
                style={{
                  width: '100%',
                }}
              />
            ),
            Cell: row => moment(row.value).format('DD/MM/YYYY'),
            filterAll: true,
            width: 110,
          },
          {
            Header: 'Produtos',
            id: 'products',
            width: 150,
            accessor: d => d.products,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ['products'] }),
            filterAll: true,
            Filter: ({ filter, onChange }) => (
              <input
                onChange={event => onChange(event.target.value)}
                value={filter ? filter.value : ''}
                style={{
                  width: '100%',
                }}
              />
            ),
          },
          {
            Header: 'Frete',
            id: 'shipping',
            width: 150,
            accessor: d => d.shipping,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ['shipping'] }),
            filterAll: true,
            Filter: ({ filter, onChange }) => (
              <input
                onChange={event => onChange(event.target.value)}
                value={filter ? filter.value : ''}
                style={{
                  width: '100%',
                }}
              />
            ),
          },
          {
            Header: 'Total',
            id: 'amount',
            width: 150,
            accessor: d => d.amount,
            filterMethod: (filter, rows) =>
              matchSorter(rows, filter.value, { keys: ['amount'] }),
            filterAll: true,
            Filter: ({ filter, onChange }) => (
              <input
                onChange={event => onChange(event.target.value)}
                value={filter ? filter.value : ''}
                style={{
                  width: '100%',
                }}
              />
            ),
          },
          {
            Header: 'Forma pgto.',
            accessor: 'payment',
            id: 'payment',
            filterMethod: (filter, row) => {
              if (filter.value === 'all') {
                return true;
              }
              if (filter.value === 'bol') {
                return row[filter.id] === 'Boleto';
              }
              if (filter.value === 'cre') {
                return row[filter.id] === 'Crédito';
              }
              if (filter.value === 'deb') {
                return row[filter.id] === 'Débito';
              }
              return row[filter.id];
            },
            Filter: ({ filter, onChange }) => (
              <select
                onChange={event => onChange(event.target.value)}
                style={{ width: '100%' }}
                value={filter ? filter.value : 'all'}
              >
                <option value="all">Mostrar todos</option>
                <option value="bol">Boleto</option>
                <option value="cre">Crédito</option>
                <option value="deb">Débito</option>
              </select>
            ),
            width: 150,
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
                style={{ width: '100%' }}
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
                  <DropdownToggle className="overflow-auto">
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

          onClick: () => {},
        })}
        className="-striped -highlight"
      />
    );
  }
}

const mapStateToProps = state => ({
  playlistDetails: state.playlistDetails,
});

const mapDispatchToProps = dispatch =>
  bindActionCreators({ ...CustomizerActions }, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(TableExtended);
