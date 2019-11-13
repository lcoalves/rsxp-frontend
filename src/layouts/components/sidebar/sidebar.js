// import external modules
import React, { Component, Fragment } from "react";
import classnames from "classnames";
import PerfectScrollbar from "react-perfect-scrollbar";
// Styling
import "../../../assets/scss/components/sidebar/sidebar.scss";
// import internal(own) modules
import SideMenuContent from "./sidemenu/sidemenu";
import SidebarHeader from "./sidebarHeader/sidebarHeader";
import { FoldedContentConsumer } from "../../../utility/context/toggleContentContext";
import templateConfig from "../../../templateConfig";
import Customizer from "../../../components/customizer/customizer";

import { bindActionCreators } from "redux";
import { connect } from "react-redux";
import { Creators as CustomizerActions } from "../../../store/ducks/customizer";

class Sidebar extends Component {
  state = {
    collapsedSidebar: templateConfig.sidebar.collapsed,
    width: window.innerWidth
  };
  updateWidth = () => {
    this.setState(prevState => ({
      width: window.innerWidth
    }));
  };

  handleCollapsedSidebar = collapsedSidebar => {
    this.setState({ collapsedSidebar });
  };

  componentDidMount() {
    if (window !== "undefined") {
      window.addEventListener("resize", this.updateWidth, false);
    }
  }

  componentWillUnmount() {
    if (window !== "undefined") {
      window.removeEventListener("resize", this.updateWidth, false);
    }
  }
  handleMouseEnter = e => {
    this.setState(prevState => ({
      collapsedSidebar: false
    }));
  };

  handleMouseLeave = e => {
    this.setState(prevState => ({
      collapsedSidebar: true
    }));
  };

  render() {
    const { imgUrl, color, collapsed } = this.props;

    return (
      <Fragment>
        <FoldedContentConsumer>
          {context => (
            <div
              data-active-color="white"
              data-background-color={
                color === "" ? templateConfig.sidebar.backgroundColor : color
              }
              className={classnames(
                "app-sidebar",
                {
                  "": !this.state.collapsedSidebar,
                  collapsed: this.state.collapsedSidebar
                },
                {
                  "hide-sidebar":
                    this.state.width < 991 &&
                    this.props.sidebarState === "close",
                  "": this.props.sidebarState === "open"
                }
              )}
              onMouseEnter={
                context.foldedContent ? this.handleMouseEnter : null
              }
              onMouseLeave={
                context.foldedContent ? this.handleMouseLeave : null
              }
            >
              <SidebarHeader
                toggleSidebarMenu={this.props.toggleSidebarMenu}
                sidebarBgColor={color}
              />
              <PerfectScrollbar className="sidebar-content">
                <SideMenuContent
                  collapsedSidebar={this.state.collapsedSidebar}
                  toggleSidebarMenu={this.props.toggleSidebarMenu}
                />
              </PerfectScrollbar>

              {/* {this.props.img === '' ? ( */}
              {templateConfig.sidebar.backgroundImage ? (
                imgUrl === "" ? (
                  <div
                    className="sidebar-background"
                    style={{
                      backgroundImage:
                        "url('" +
                        templateConfig.sidebar.backgroundImageURL +
                        "')"
                    }}
                  />
                ) : (
                  <div
                    className="sidebar-background"
                    style={{
                      backgroundImage: "url('" + imgUrl + "')"
                    }}
                  />
                )
              ) : imgUrl === "" ? (
                <div className="sidebar-background" />
              ) : (
                <div
                  className="sidebar-background"
                  style={{
                    backgroundImage: "url('" + imgUrl + "')"
                  }}
                />
              )}
            </div>
          )}
        </FoldedContentConsumer>
        <Customizer
          sidebarBgColor={color}
          sidebarImageUrl={imgUrl}
          sidebarCollapsed={collapsed}
          handleSidebarSize={this.props.handleSidebarSize}
          handleLayout={this.props.handleLayout}
          handleCollapsedSidebar={this.props.collapsed}
        />
      </Fragment>
    );
  }
}

const mapStateToProps = state => ({
  img: state.customizer.img,
  imgUrl: state.customizer.imgUrl,
  color: state.customizer.color,
  collapsed: state.customizer.collapsed,
  size: state.customizer.size
});

const mapDispatchToProps = dispatch =>
  bindActionCreators(CustomizerActions, dispatch);

export default connect(
  mapStateToProps,
  mapDispatchToProps
)(Sidebar);
