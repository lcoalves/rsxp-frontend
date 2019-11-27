import React from 'react';

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
} from 'reactstrap';

import cardImgEle07 from '../../assets/img/elements/07.png';
import cardImgEle11 from '../../assets/img/elements/11.png';
import cardImgEle14 from '../../assets/img/elements/14.png';
import svg1 from '../../assets/img/elements/undraw_stand_out_1oag.svg';
import svg2 from '../../assets/img/elements/undraw_source_code_xx2e.svg';
import svg3 from '../../assets/img/elements/undraw_design_feedback_dexe.svg';

export default function Home() {
  return (
    <>
      <Row className="row-eq-height mt-4">
        <Col sm="12" md="4">
          <Card className="card card-inverse bg-light text-center">
            <CardBody>
              <div className="card-img overlap">
                <img src={svg1} width="190" alt="Card cap 11" className="" />
              </div>
              <CardTitle className="font-medium-5 black">
                O que faz um programador?
              </CardTitle>
              <CardSubtitle className="black">
                Salário, rotina e muito mais
              </CardSubtitle>
              <CardText className="black">
                Donut toffee candy brownie soufflé macaroon.
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12" md="4">
          <Card className="card card-inverse bg-light text-center">
            <CardBody>
              <div className="card-img overlap">
                <img src={svg2} width="190" alt="Card cap 14" className="" />
              </div>
              <CardTitle className="font-medium-5 black">
                Porque programadores são anjos?
              </CardTitle>
              <CardText className="black">
                Donut toffee candy brownie soufflé macaroon.
              </CardText>
            </CardBody>
          </Card>
        </Col>
        <Col sm="12" md="4">
          <Card className="card card-inverse bg-light text-center">
            <CardBody>
              <div className="card-img overlap">
                <img src={svg3} width="190" alt="Card cap 07" className="" />
              </div>
              <CardTitle className="font-medium-5 black">
                Seja um anjo você também!
              </CardTitle>
              <CardText className="black">
                Donut toffee candy brownie soufflé macaroon.
              </CardText>
            </CardBody>
          </Card>
        </Col>{' '}
      </Row>
    </>
  );
}
