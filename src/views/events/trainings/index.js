import React, { useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import CustomTabs from '../../../components/tabs/default';
import ContentHeader from '../../../components/contentHead/contentHeader';
import ContentSubHeader from '../../../components/contentHead/contentSubHeader';
import { Card, CardBody, Row, Col, Button, Badge } from 'reactstrap';

import { Creators as EventActions } from '../../../store/ducks/event';

// import GroupTabs from "./tabs";
import MyTrainingsTable from './myTrainingsTable';
import ParticipantTable from './participantTable';
import TrainedTable from './trainedTable';

// Table example pages
export default function Trainings() {
  const allData = useSelector(state => state.event.allData);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(EventActions.allEventRequest());
  }, []);

  return (
    <>
      <ContentHeader>Treinamentos</ContentHeader>
      <ContentSubHeader>
        Aqui você visualiza os treinamentos que lidera, participa e líderes que
        treinou (caso você seja um treinador)
      </ContentSubHeader>
      <Row className="row-eq-height">
        <Col sm="12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between">
                <Badge color="info" className="align-self-center">
                  Meus treinamentos
                </Badge>
                <div>
                  <div className="d-none d-sm-none d-md-none d-lg-block">
                    <Link to="/eventos/treinamento/criar">
                      <Button
                        color="success"
                        className="btn-raised mb-0 font-small-3"
                      >
                        <i className="fa fa-plus" /> Criar novo treinamento
                      </Button>{' '}
                    </Link>
                  </div>
                  <div>
                    <Link to="/eventos/treinamento/criar">
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
                TabContent={<MyTrainingsTable data={allData.leader} />}
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between">
                <Badge color="info" className="align-self-center">
                  Grupos que participo
                </Badge>
              </div>
              <CustomTabs
                TabContent={<ParticipantTable data={allData.participant} />}
              />
            </CardBody>
          </Card>
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between">
                <Badge color="info" className="align-self-center">
                  Líderes que eu treinei
                </Badge>
              </div>
              <CustomTabs
                TabContent={<TrainedTable data={allData.myTrainers} />}
              />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
