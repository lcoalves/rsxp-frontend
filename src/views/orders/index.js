import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { useDispatch, useSelector } from 'react-redux';

import { Formik, Field, Form, FieldArray } from 'formik';

import CustomTabs from '~/components/tabs/default';
import ContentHeader from '~/components/contentHead/contentHeader';
import ContentSubHeader from '~/components/contentHead/contentSubHeader';
import { Card, CardBody, Row, Col, Button, Badge } from 'reactstrap';

import OrderTable from './table';

// Table example pages
export default function Groups() {
  const data = useSelector(state => state.profile.data);
  const defaultData = useSelector(state => state.defaultEvent.data);

  const dispatch = useDispatch();

  return (
    <>
      <ContentHeader>Pedidos</ContentHeader>
      <ContentSubHeader>Aqui você visualiza os seus pedidos.</ContentSubHeader>
      <Row className="row-eq-height">
        <Col sm="12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between">
                <Badge color="info" className="align-self-center">
                  Meus pedidos
                </Badge>
                <div>
                  <div className="d-none d-sm-none d-md-none d-lg-block">
                    <Link to="/pedidos/criar">
                      <Button
                        color="success"
                        className="btn-raised mb-0 font-small-3"
                      >
                        <i className="fa fa-plus" /> Solicitar material
                      </Button>{' '}
                    </Link>
                  </div>
                  <div>
                    <Link to="/pedidos/criar">
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
              <CustomTabs TabContent={<OrderTable data={data.orders} />} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
