import React, { Component, Fragment } from "react";

import CustomTabs from "../../components/tabs/default";
import ContentHeader from "../../components/contentHead/contentHeader";
import ContentSubHeader from "../../components/contentHead/contentSubHeader";
import { Card, CardBody, CardTitle, Row, Col } from "reactstrap";

//Prism
// eslint-disable-next-line
import Prism from "prismjs"; //Include JS
import "prismjs/themes/prism-okaidia.css"; //Include CSS

import TableExtended from "./table";

class Trainings extends Component {
  render() {
    return (
      <Fragment>
        <ContentHeader>Pedidos</ContentHeader>
        <ContentSubHeader>
          Lorem ipsum dolor sit amet, consectetur adipiscing elit.
        </ContentSubHeader>
        <Row>
          <Col sm="12">
            <Card>
              <CardBody>
                <CardTitle>Meus Pedidos</CardTitle>
                <CustomTabs TabContent={<TableExtended />} />
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default Trainings;
