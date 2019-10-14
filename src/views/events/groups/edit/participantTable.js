import React, { Component } from 'react';

import {
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
  UncontrolledTooltip,
} from 'reactstrap';
import { List, Mail } from 'react-feather';

// Import React Table
import ReactTable from 'react-table';
import 'react-table/react-table.css';

export default class GroupEditParticipantTable extends Component {
  render() {
    const { data } = this.props;

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
            id: 'subscription',
            accessor: d => d.subscription,
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
            Header: 'Telefone',
            id: 'phone',
            accessor: d => d.phone,
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
                    <DropdownItem
                      onClick={() => {
                        // console.log(instance.original);
                      }}
                    >
                      Remover
                    </DropdownItem>
                    <DropdownItem>Tornar desistente</DropdownItem>
                    <DropdownItem>Enviar email</DropdownItem>
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
}
