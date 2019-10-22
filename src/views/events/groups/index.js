import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import CustomTabs from '../../../components/tabs/default';
import ContentHeader from '../../../components/contentHead/contentHeader';
import ContentSubHeader from '../../../components/contentHead/contentSubHeader';
import { Card, CardBody, Row, Col, Button, Badge } from 'reactstrap';

import { Creators as EventActions } from '../../../store/ducks/event';

// import GroupTabs from "./tabs";
import LeaderTable from './leaderTable';
import ParticipantTable from './participantTable';
// import TrainedLeadersTable from './trainedLeadersTable';

// Table example pages
export default function Groups() {
  const allData = useSelector(state => state.event.allData);

  const user_type = localStorage.getItem('@dashboard/user_type');

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(EventActions.allEventRequest());
  }, []);

  return (
    <>
      <ContentHeader>Grupos</ContentHeader>
      <ContentSubHeader>
        Aqui você visualiza os grupos que lidera.
      </ContentSubHeader>
      <Row className="row-eq-height">
        <Col sm="12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between">
                <Badge color="info" className="align-self-center">
                  {user_type === 'entity'
                    ? 'Grupos que sou líder'
                    : 'Grupos que sou responsável'}
                </Badge>
                <div>
                  <div className="d-none d-sm-none d-md-none d-lg-block">
                    <Link to="/eventos/grupo/criar">
                      <Button
                        color="success"
                        className="btn-raised mb-0 font-small-3"
                      >
                        <i className="fa fa-plus" /> Criar novo grupo
                      </Button>{' '}
                    </Link>
                  </div>
                  <div>
                    <Link to="/eventos/grupo/criar">
                      <Button
                        color="success"
                        className="btn-raised mb-0 d-lg-none"
                      >
                        <i className="fa fa-plus" />
                      </Button>
                    </Link>
                  </div>
                </div>
              </div>
              <CustomTabs
                TabContent={
                  <LeaderTable
                    data={
                      user_type === 'entity'
                        ? allData.organizators
                        : allData.events
                    }
                  />
                }
              />
            </CardBody>
          </Card>
          {/* <Card>
            <CardBody>
              <div className="d-flex justify-content-between">
                <Badge color="info" className="align-self-center">
                  {user_type === 'entitys'
                    ? 'Grupos que participo'
                    : 'Grupos com membros inscritos'}
                </Badge>
              </div>
              <CustomTabs
                TabContent={<ParticipantTable data={allData.participants} />}
              />
            </CardBody>
          </Card> */}
          {/* <Card>
            <CardBody>
              <div className="d-flex justify-content-between">
                <Badge color="info" className="align-self-center">
                  Líderes que eu treinei
                </Badge>
              </div>
              <CustomTabs
                TabContent={<TrainedLeadersTable data={allData.myTrainers} />}
              />
            </CardBody>
          </Card> */}
        </Col>
      </Row>
    </>
  );
}
