// import external modules
import React from 'react';

import { Home, Globe, Package, ChevronRight, Lock } from 'react-feather';
import { NavLink } from 'react-router-dom';

import { useSelector } from 'react-redux';

// Styling
import '../../../../assets/scss/components/sidebar/sidemenu/sidemenu.scss';
// import internal(own) modules
import SideMenu from '../sidemenuHelper';

export default function SideMenuContent({
  toggleSidebarMenu,
  collapsedSidebar,
}) {
  const data = useSelector(state => state.profile.data);

  return (
    <SideMenu className="sidebar-content" toggleSidebarMenu={toggleSidebarMenu}>
      <SideMenu.MenuSingleItem>
        <NavLink to="/inicio" activeclassname="active">
          <i className="menu-icon">
            <Home size={18} />
          </i>
          <span className="menu-item-text">Início</span>
        </NavLink>
      </SideMenu.MenuSingleItem>
      <SideMenu.MenuMultiItems
        name="Eventos"
        Icon={<Globe size={18} />}
        ArrowRight={<ChevronRight size={14} />}
        collapsedSidebar={collapsedSidebar}
      >
        <NavLink
          to="/eventos/grupos"
          exact
          className="item"
          activeclassname="active"
        >
          <span className="menu-item-text">Grupos</span>
        </NavLink>
        <NavLink
          to="/eventos/treinamentos"
          exact
          className="item"
          activeclassname="active"
        >
          <span className="menu-item-text">Treinamentos</span>
        </NavLink>
        <NavLink
          to="/eventos/seminarios"
          exact
          className="item"
          activeclassname="active"
        >
          <span className="menu-item-text">Seminários</span>
        </NavLink>
      </SideMenu.MenuMultiItems>

      <SideMenu.MenuSingleItem>
        <NavLink to="/pedidos" activeclassname="active">
          <i className="menu-icon">
            <Package size={18} />
          </i>
          <span className="menu-item-text">Pedidos</span>
        </NavLink>
      </SideMenu.MenuSingleItem>

      {data.admin ? (
        <SideMenu.MenuMultiItems
          name="Admin"
          Icon={<Lock size={18} />}
          ArrowRight={<ChevronRight size={14} />}
          collapsedSidebar={collapsedSidebar}
        >
          <NavLink
            to="/admin/eventos"
            exact
            className="item"
            activeclassname="active"
          >
            <span className="menu-item-text">Evento padrão</span>
          </NavLink>
          <NavLink
            to="/admin/licoes"
            exact
            className="item"
            activeclassname="active"
          >
            <span className="menu-item-text">Lições</span>
          </NavLink>
          <NavLink
            to="/admin/ministerios"
            exact
            className="item"
            activeclassname="active"
          >
            <span className="menu-item-text">Ministérios</span>
          </NavLink>
          <NavLink
            to="/admin/certificados"
            exact
            className="item"
            activeclassname="active"
          >
            <span className="menu-item-text">Certificados</span>
          </NavLink>
          <NavLink
            to="/admin/produtos"
            exact
            className="item"
            activeclassname="active"
          >
            <span className="menu-item-text">Produtos</span>
          </NavLink>
          <NavLink
            to="/admin/kits"
            exact
            className="item"
            activeclassname="active"
          >
            <span className="menu-item-text">Kits</span>
          </NavLink>
        </SideMenu.MenuMultiItems>
      ) : (
        <></>
      )}
    </SideMenu>
  );
}
