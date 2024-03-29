import React, { useEffect } from 'react';
import { useDispatch, useSelector } from 'react-redux';

import CustomTabs from '~/components/tabs/default';
import ContentHeader from '~/components/contentHead/contentHeader';
import { Card, CardBody, Row, Col } from 'reactstrap';

import { Creators as CertificateActions } from '~/store/ducks/certificate';

import CertificateTable from './table';

export default function AdminCertificate() {
  const data = useSelector(state => state.certificate.allData);

  const dispatch = useDispatch();

  useEffect(() => {
    dispatch(CertificateActions.allCertificateRequest());
  }, []);

  return (
    <>
      <ContentHeader>Layout certificados</ContentHeader>
      <Row className="row-eq-height">
        <Col sm="12">
          <Card>
            <CardBody>
              <div className="d-flex justify-content-between"></div>
              <CustomTabs TabContent={<CertificateTable data={data} />} />
            </CardBody>
          </Card>
        </Col>
      </Row>
    </>
  );
}
