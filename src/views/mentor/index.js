import React, { useEffect } from 'react';

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
  NavLink,
  Badge,
} from 'reactstrap';

import { Plus } from 'react-feather';

import { useSelector, useDispatch } from 'react-redux';
import { Creators as CourseActions } from '~/store/ducks/course';

import svg1 from '../../assets/img/elements/undraw_progressive_app_m9ms.svg';
import svg2 from '../../assets/img/elements/undraw_source_code_xx2e.svg';
import svg3 from '../../assets/img/elements/undraw_design_feedback_dexe.svg';
import cardImg14 from '../../assets/img/photos/14.jpg';
import filipe from '../../assets/img/filipe.jpeg';
import diego from '../../assets/img/diego.jpeg';
import cara from '../../assets/img/cara.jpeg';

export default function Mentor() {
  return (
    <>
      <h1>ESCOLHA O SEU MENTOR</h1>
      <Row className="row-eq-height">
        <Col sm="12" md="4">
          <Card className="text-left">
            <div className="card-img">
              <img width="100%" src={filipe} alt="Card cap 14" />
              <CardTitle>
                <Badge className="float-right" color="light">
                  Filipe Deschamps
                </Badge>
              </CardTitle>
              <NavLink
                to="/cards/extended-card"
                className="btn btn-floating halfway-fab bg-success"
              >
                <Plus size={25} color="#FFF" />
              </NavLink>
            </div>
            <CardBody className="mt-2">
              <CardText>
                Icing powder caramels macaroon. Toffee sugar plum brownie pastry
                gummies jelly gummies.
              </CardText>
              <Badge className="float-right" color="warning">
                Javascript
              </Badge>
              <Badge className="float-right mr-1" color="success">
                Carreiras
              </Badge>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12" md="4">
          <Card className="text-left">
            <div className="card-img">
              <img width="100%" src={diego} alt="Card cap 14" />
              <CardTitle>
                <Badge className="float-right" color="light">
                  Diego Lindão
                </Badge>
              </CardTitle>
              <NavLink
                to="/cards/extended-card"
                className="btn btn-floating halfway-fab bg-success"
              >
                <Plus size={25} color="#FFF" />
              </NavLink>
            </div>
            <CardBody className="mt-2">
              <CardText>
                Icing powder caramels macaroon. Toffee sugar plum brownie pastry
                gummies jelly gummies.
              </CardText>
              <Badge className="float-right" color="warning">
                Javascript
              </Badge>
              <Badge className="float-right mr-1" color="info">
                React
              </Badge>
              <Badge className="float-right mr-1" color="light">
                Mobile
              </Badge>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12" md="4">
          <Card className="text-left">
            <div className="card-img">
              <img width="100%" src={cara} alt="Card cap 14" />
              <CardTitle>
                <Badge className="float-right" color="light">
                  Felipe Fialho
                </Badge>
              </CardTitle>
              <NavLink
                to="/cards/extended-card"
                className="btn btn-floating halfway-fab bg-success"
              >
                <Plus size={25} color="#FFF" />
              </NavLink>
            </div>
            <CardBody className="mt-2">
              <CardText>
                Icing powder caramels macaroon. Toffee sugar plum brownie pastry
                gummies jelly gummies.
              </CardText>
              <Badge className="float-right" color="warning">
                Javascript
              </Badge>
              <Badge className="float-right mr-1" color="danger">
                HTML
              </Badge>
              <Badge className="float-right mr-1" color="info">
                CSS
              </Badge>
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
