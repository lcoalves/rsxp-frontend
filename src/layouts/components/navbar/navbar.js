import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  Form,
  Media,
  Collapse,
  Navbar,
  Nav,
  NavItem,
  UncontrolledDropdown,
  DropdownToggle,
  DropdownMenu,
  DropdownItem,
} from 'reactstrap';

import PerfectScrollbar from 'react-perfect-scrollbar';

import {
  Mail,
  Menu,
  MoreVertical,
  Check,
  Bell,
  User,
  AlertTriangle,
  Lock,
  X,
  LogOut,
} from 'react-feather';

import { useSelector } from 'react-redux';
import ReactCountryFlag from 'react-country-flag';
import { Creators as LoginActions } from '~/store/ducks/login';

export default function ThemeNavbar({ toggleSidebarMenu }) {
  const [isOpen, setOpen] = useState(false);

  const user_type = localStorage.getItem('@dashboard/user_type');

  const data = useSelector(state => state.profile.data);

  function handleClick() {
    toggleSidebarMenu('open');
  }

  function toggle() {
    setOpen(!isOpen);
  }

  return (
    <Navbar className="navbar navbar-expand-lg navbar-light bg-faded">
      <div className="container-fluid px-0">
        <div className="navbar-header">
          <Menu
            size={14}
            className="navbar-toggle d-lg-none float-left"
            onClick={handleClick}
            data-toggle="collapse"
          />
          <Form className="navbar-form mt-1 float-left" role="search" />
          {/* <Moon size={20} color="#333" className="m-2 cursor-pointer"/> */}
          <MoreVertical
            className="mt-1 navbar-toggler black no-border float-right"
            size={50}
            onClick={toggle}
          />
        </div>

        <div className="navbar-container">
          <Collapse isOpen={isOpen} navbar>
            <Nav className="ml-auto float-right" navbar>
              <UncontrolledDropdown nav inNavbar className="pr-1">
                <DropdownToggle nav>
                  <ReactCountryFlag code="br" svg /> Português
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem>
                    <ReactCountryFlag code="br" svg /> Português
                  </DropdownItem>
                  {/* <DropdownItem>
                    <ReactCountryFlag code="us" svg /> English
                  </DropdownItem> */}
                </DropdownMenu>
              </UncontrolledDropdown>

              {/* <NavItem className="pr-1">
                <Link to="/email/" className="nav-link">
                  <Mail size={20} color="#333" />
                </Link>
              </NavItem>

              <UncontrolledDropdown nav inNavbar className="pr-1">
                <DropdownToggle nav>
                  <span className="notification-bell-blink" />
                  <Bell
                    size={21}
                    className="text-dark notification-danger animate-shake"
                  />
                </DropdownToggle>
                <DropdownMenu right className="notification-dropdown">
                  <div className="p-2 text-center  border-bottom-grey border-bottom-lighten-2">
                    <h6 className="mb-0 text-bold-500">Notifications</h6>
                  </div>
                  <PerfectScrollbar className="noti-list bg-grey bg-lighten-5">
                    <Media className="px-3 pt-2 pb-2 media  border-bottom-grey border-bottom-lighten-3">
                      <Media left top href="#">
                        <Media
                          object
                          src={userImage2}
                          alt="Generic placeholder image"
                          className="rounded-circle width-35"
                        />
                      </Media>
                      <Media body>
                        <h6 className="mb-0 text-bold-500 font-small-3">
                          Selina sent you mail
                          <span className="text-bold-300 font-small-2 text-muted float-right">
                            9:00 A.M
                          </span>
                        </h6>
                        <span className="font-small-3 line-height-2">
                          Cras sit amet nibh libero, in gravida nulla.
                        </span>
                      </Media>
                    </Media>
                    <Media className="px-3 pt-2 pb-2 media  border-bottom-grey border-bottom-lighten-3">
                      <Media left middle href="#" className="mr-2">
                        <span className="bg-success rounded-circle width-35 height-35 d-block">
                          <Check
                            size={30}
                            className="p-1 white margin-left-3"
                          />
                        </span>
                      </Media>
                      <Media body>
                        <h6 className="mb-1 text-bold-500 font-small-3">
                          <span className="success">
                            Report generated successfully!
                          </span>
                          <span className="text-bold-300 font-small-2 text-muted float-right">
                            10:15 A.M
                          </span>
                        </h6>
                        <span className="font-small-3 line-height-2">
                          Consectetur adipisicing elit sed do eiusmod.
                        </span>
                      </Media>
                    </Media>
                    <Media className="px-3 pt-2 pb-2 media  border-bottom-grey border-bottom-lighten-3">
                      <Media left middle href="#" className="mr-2">
                        <span className="bg-warning rounded-circle width-35 height-35 d-block">
                          <AlertTriangle
                            size={30}
                            className="p-1 white margin-left-3"
                          />
                        </span>
                      </Media>
                      <Media body>
                        <h6 className="mb-1 text-bold-500 font-small-3">
                          <span className="warning">Warning notificatoin</span>
                          <span className="text-bold-300 font-small-2 text-muted float-right">
                            11:00 A.M
                          </span>
                        </h6>
                        <p className="font-small-3 line-height-2">
                          Lorem ipsum dolor sit amet consectetur adipisicing
                          elit sed do eiusmod tempor.
                        </p>
                      </Media>
                    </Media>
                    <Media className="px-3 pt-2 pb-2 media  border-bottom-grey border-bottom-lighten-3">
                      <Media left top href="#">
                        <Media
                          object
                          src={userImage3}
                          alt="Generic placeholder image"
                          className="rounded-circle width-35"
                        />
                      </Media>
                      <Media body>
                        <h6 className="mb-0 text-bold-500 font-small-3">
                          John started task
                          <span className="text-bold-300 font-small-2 text-muted float-right">
                            5:00 P.M
                          </span>
                        </h6>
                        <span className="font-small-3 line-height-2">
                          Sit amet consectetur adipisicing elit sed.
                        </span>
                      </Media>
                    </Media>
                    <Media className="px-3 pt-2 pb-2 media  border-bottom-grey border-bottom-lighten-3">
                      <Media left middle href="#" className="mr-2">
                        <span className="bg-danger rounded-circle width-35 height-35 d-block">
                          <X size={30} className="p-1 white margin-left-3" />
                        </span>
                      </Media>
                      <Media body>
                        <h6 className="mb-1 text-bold-500 font-small-3">
                          <span className="danger">Error notificarion</span>
                          <span className="text-bold-300 font-small-2 text-muted float-right">
                            12:15 P.M
                          </span>
                        </h6>
                        <span className="font-small-3 line-height-2">
                          Consectetur adipisicing elit sed do eiusmod.
                        </span>
                      </Media>
                    </Media>
                    <Media className="px-3 pt-2 pb-2 media  border-bottom-grey border-bottom-lighten-3">
                      <Media left top href="#">
                        <Media
                          object
                          src={userImage4}
                          alt="Generic placeholder image"
                          className="rounded-circle width-35"
                        />
                      </Media>
                      <Media body>
                        <h6 className="mb-0 text-bold-500 font-small-3">
                          Lisa started task
                          <span className="text-bold-300 font-small-2 text-muted float-right">
                            6:00 P.M
                          </span>
                        </h6>
                        <span className="font-small-3 line-height-2">
                          Sit amet consectetur adipisicing elit sed.
                        </span>
                      </Media>
                    </Media>
                  </PerfectScrollbar>
                  <div className="p-1 text-center border-top-grey border-top-lighten-2">
                    <Link to="/">View All</Link>
                  </div>
                </DropdownMenu>
              </UncontrolledDropdown> */}

              <UncontrolledDropdown nav inNavbar className="pr-1">
                <DropdownToggle nav>
                  {data.file ? (
                    <img
                      src={data.file.url}
                      alt="logged-in-user"
                      className="rounded-circle width-35 height-35"
                    />
                  ) : (
                    <img
                      src={`${
                        user_type === 'entity'
                          ? 'https://cdn.pixabay.com/photo/2015/10/05/22/37/blank-profile-picture-973460_960_720.png'
                          : 'https://i.imgur.com/KQZkd2um.png'
                      }`}
                      alt="logged-in-user"
                      className="rounded-circle width-35 height-35"
                    />
                  )}
                </DropdownToggle>
                <DropdownMenu right>
                  <DropdownItem disabled>
                    {user_type === 'entity' ? (
                      <span className="font-small-3">{data.name}</span>
                    ) : (
                      <span className="font-small-3">
                        {data.corporate_name}
                      </span>
                    )}
                  </DropdownItem>
                  <DropdownItem divider />

                  <Link to="/perfil" className="p-0">
                    <DropdownItem>
                      <User size={14} className="mr-1" /> Meu perfil
                    </DropdownItem>
                  </Link>
                  {/* <Link to="/email" className="p-0">
                      <DropdownItem>
                        <Inbox size={14} className="mr-1" /> Email
                      </DropdownItem>
                    </Link>
                    <Link to="/contacts" className="p-0">
                      <DropdownItem>
                        <Phone size={14} className="mr-1" /> Contacts
                      </DropdownItem>
                    </Link>
                    <Link to="/calendar" className="p-0">
                      <DropdownItem>
                        <Calendar size={14} className="mr-1" /> Calendar
                      </DropdownItem>
                    </Link> */}
                  <DropdownItem divider />
                  {/* <Link to="/lockscreen" className="p-0">
                    <DropdownItem>
                      <Lock size={14} className="mr-1" /> Travar tela
                    </DropdownItem>
                  </Link> */}
                  <DropdownItem>
                    <LogOut size={14} className="mr-1" /> Sair
                  </DropdownItem>
                </DropdownMenu>
              </UncontrolledDropdown>
            </Nav>
          </Collapse>
        </div>
      </div>
    </Navbar>
  );
}
