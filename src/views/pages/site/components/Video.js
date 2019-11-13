import React from 'react';

import Plyr from 'react-plyr';

import { Col } from 'reactstrap';

export default function Video() {
  return (
    <Col
      xl="6"
      lg="5"
      md="12"
      xs="12"
      className="d-flex align-items-start flex-grow-1 m-3 p-0"
    >
      <Plyr type="vimeo" videoId="127186403" />
    </Col>
  );
}
