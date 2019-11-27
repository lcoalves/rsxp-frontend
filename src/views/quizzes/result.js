// import external modules
import React from 'react';

import { Card, CardBody, Button, Label } from 'reactstrap';
import { Link } from 'react-router-dom';

import { css } from '@emotion/core';

export default function Result() {
  const storageResult = localStorage.getItem('@result');
  const results = JSON.parse(storageResult);

  const total = results.reduce((result, currentValue) => result + currentValue);

  return parseInt(total) > 4 ? (
    <div className="bg-static-pages-result-1 d-flex flex-column justify-content-end align-items-center">
      <Card className="bg-light mb-4">
        <CardBody className="d-flex flex-column align-items-center">
          <Label className="black">PARABÉNS!</Label>
          <Label className="black">Voce nasceu para ser um programador</Label>
        </CardBody>
      </Card>
      <Button color="success" className="btn-default btn-raised mb-4">
        <Link to="/cadastro" className="white font-medium-1">
          Conheça mais!
        </Link>
      </Button>
    </div>
  ) : (
    <div className="bg-static-pages-result d-flex flex-column justify-content-end align-items-center">
      <Card className="bg-light mb-4">
        <CardBody className="d-flex flex-column align-items-center">
          <Label className="black">Muito bom</Label>
          <Label className="black">
            Saiba como a tecnologia pode te ajudar na sua futura profissão.
          </Label>
        </CardBody>
      </Card>
      <Button color="success" className="btn-default btn-raised mb-4">
        <Link to="/cadastro" className="white font-medium-1">
          Conheça mais!
        </Link>
      </Button>
    </div>
  );
}
