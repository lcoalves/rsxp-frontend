import React, { useEffect } from 'react';

import {
  Row,
  Col,
  Card,
  CardBody,
  CardTitle,
  CardSubtitle,
  CardText,
} from 'reactstrap';

import { useSelector, useDispatch } from 'react-redux';
import { Creators as CourseActions } from '~/store/ducks/course';

import svg1 from '../../assets/img/elements/undraw_progressive_app_m9ms.svg';
import svg2 from '../../assets/img/elements/undraw_source_code_xx2e.svg';
import svg3 from '../../assets/img/elements/undraw_design_feedback_dexe.svg';

export default function Home() {
  const data = useSelector(state => state.course.data);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(CourseActions.courseRequest());
  }, []);

  return (
    data !== null && (
      <>
        <h2 className="mb-2">ASSISTA AS LIÇÕES:</h2>
        <Row className="row-eq-height mt-4">
          {data.map((course, index) => (
            <Col sm="12" md="4">
              <Card className="card card-inverse text-center card-hovered">
                <a href={`/licao/${course.id}`}>
                  <CardBody>
                    <div className="card-img overlap">
                      <img
                        src={svg1}
                        width="190"
                        alt="Card cap 11"
                        className=""
                      />
                    </div>
                    <CardTitle className="font-medium-5">
                      Lição {index + 1}: {course.description}
                    </CardTitle>
                    <CardSubtitle>Salário, rotina e muito mais</CardSubtitle>
                    <CardText>
                      Donut toffee candy brownie soufflé macaroon.
                    </CardText>
                  </CardBody>
                </a>
              </Card>
            </Col>
          ))}
        </Row>
      </>
    )
  );
}
