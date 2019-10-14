// import external modules
import React, { Fragment, Component } from 'react';

import { Row, Col, Card, CardBody, CardTitle } from 'reactstrap';

import CustomTabs from '../../components/tabs/profileTabs';
import TabsBorderBottomPF from './tabs';
import TabsBorderBottomPJ from './tabsPJ';

const user_type = localStorage.getItem('@dashboard/user_type');

class Profile extends Component {
  state = {
    activeTab: '1',
  };

  toggle = tab => {
    if (this.state.activeTab !== tab) {
      this.setState({
        activeTab: tab,
      });
    }
  };

  render() {
    return (
      <Fragment>
        <Row>
          <Col md="12" lg="12">
            <Card>
              <CardBody>
                {user_type === 'entity' ? (
                  <>
                    <CardTitle>Meu perfil</CardTitle>
                    <CustomTabs TabContent1={<TabsBorderBottomPF />} />
                  </>
                ) : (
                  <>
                    <CardTitle>Minha empresa</CardTitle>
                    <CustomTabs TabContent1={<TabsBorderBottomPJ />} />
                  </>
                )}
              </CardBody>
            </Card>
          </Col>
        </Row>
      </Fragment>
    );
  }
}

export default Profile;
