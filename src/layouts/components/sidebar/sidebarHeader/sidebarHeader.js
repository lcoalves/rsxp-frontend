// import external modules
import React, { Component } from 'react';
import { NavLink } from 'react-router-dom';
import { X } from 'react-feather';
// import internal(own) modules
import { FoldedContentConsumer } from '../../../../utility/context/toggleContentContext';
import Logo from '../../../../assets/img/logo.png';
import LogoDark from '../../../../assets/img/logo.png';
import templateConfig from '../../../../templateConfig';

class SidebarHeader extends Component {
  handleClick = e => {
    this.props.toggleSidebarMenu('close');
  };

  render() {
    return (
      <FoldedContentConsumer>
        {context => (
          <div className="sidebar-header">
            <div className="logo clearfix">
              <NavLink to="/" className="logo-text float-left">
                <div className="logo-img">
                  {templateConfig.sidebar.backgroundColor === 'white' ? (
                    this.props.sidebarBgColor === '' ||
                    this.props.sidebarBgColor === 'white' ? (
                      <img src={LogoDark} alt="logo" />
                    ) : (
                      <img src={Logo} alt="logo" />
                    )
                  ) : this.props.sidebarBgColor === 'white' ? (
                    <img src={LogoDark} alt="logo" />
                  ) : (
                    <img src={Logo} alt="logo" />
                  )}
                </div>
              </NavLink>

              <span
                href=""
                className="nav-close d-block d-md-block d-lg-none d-xl-none"
                id="sidebarClose"
              >
                <X onClick={this.handleClick} size={20} />
              </span>
            </div>
          </div>
        )}
      </FoldedContentConsumer>
    );
  }
}

export default SidebarHeader;
