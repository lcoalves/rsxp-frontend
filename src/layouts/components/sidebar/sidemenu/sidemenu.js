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
      {/* <SideMenu.MenuMultiItems
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
      </SideMenu.MenuMultiItems> */}
    </SideMenu>
  );
}
