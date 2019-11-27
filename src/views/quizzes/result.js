// import external modules
import React from 'react';

import { Card, CardBody, Button, Label } from 'reactstrap';
import { Link } from "react-router-dom";

import { css } from '@emotion/core';

export default function Result() {
  const storageResult = localStorage.getItem('@result');
  const results = JSON.parse(storageResult);

  const total = results.reduce((result, currentValue) => result + currentValue);

  console.tron.log(total)

  return (
    total > 5 ? (
      <div className="bg-static-pages-result d-flex flex-column justify-content-end align-items-center">
        <Card className="bg-light mb-4">
          <CardBody className="d-flex flex-column align-items-center">
            <Label className="black">Parabains!</Label>
            <Label className="black">Voce tem o perfil do caramba</Label>
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
            <Label className="black">Parabains!</Label>
            <Label className="black">Voce tem o perfil do caramba</Label>
          </CardBody>
        </Card>
        <Button color="success" className="btn-default btn-raised mb-4">
          <Link to="/cadastro" className="white font-medium-1">
            Conheça mais!
          </Link>
        </Button>
      </div>
    )
  );
}
