// import external modules
import React from 'react';
import { Motion, spring } from 'react-motion';
import { Card, CardBody, Button, Label } from 'reactstrap';
import { User, ArrowRightCircle } from 'react-feather';

import history from '~/app/history';

import logo from '~/assets/img/logo-big.png';

export default function Login() {
  function handleQuiz2() {
    history.push('/quiz/2');
  }

  return (
    <div className="bg-static-pages-image-quiz1 d-flex flex-column flex-1 p-0 flex-lg-row">
      <div className="fit min-full-height-vh color-overlay" />
      <div
        className="d-none d-lg-flex flex-column flex-grow-0 text-white width-75-per p-2 p-lg-5"
        style={{ zIndex: 1 }}
      >
        <Label className="d-none d-lg-block fit width-800 font-large-3 mb-3 line-height-1">
          Primeira pergunta
        </Label>
        <Label className="d-none d-lg-block fit width-700 font-medium-1">
          Se alguem grita quéota, o que vc faz?
        </Label>
      </div>
      <Motion
        defaultStyle={{ x: +200, opacity: 0 }}
        style={{ x: spring(0), opacity: spring(1) }}
      >
        {style => (
          <Card
            style={{
              transform: `translateX(${style.x}px)`,
              opacity: style.opacity,
            }}
            className="fit min-full-height-vh m-2 m-lg-0 min-width-25-per rounded-0"
          >
            <CardBody className="d-flex flex-column justify-content-center">
              <Label className="font-medium-3 text-dark text-bold-400 text-center text-uppercase mb-4">
                Alternativas
              </Label>
              <Button
                outline
                type="submit"
                color="default"
                className="btn-default height-100 icon-light-hover font-medium-2"
                onClick={() => handleQuiz2()}
              >
                <div className="d-flex justify-content-around align-items-center">
                  <div>1</div>
                  <div>
                    <h5 className="mb-0">Pergunta se a pessoa é doente</h5>
                  </div>
                </div>
              </Button>
              <Button
                outline
                type="submit"
                color="default"
                className="btn-default height-100 icon-light-hover font-medium-2"
                onClick={() => handleQuiz2()}
              >
                <div className="d-flex justify-content-around align-items-center">
                  <div>2</div>
                  <div>
                    <h5 className="mb-0">Não diz nada</h5>
                  </div>
                </div>
              </Button>
              <Button
                outline
                type="submit"
                color="default"
                className="btn-default height-100 icon-light-hover font-medium-2"
                onClick={() => handleQuiz2()}
              >
                <div className="d-flex justify-content-around align-items-center">
                  <div>3</div>
                  <div>
                    <h5 className="mb-0">Grita quéota junto</h5>
                  </div>
                </div>
              </Button>
            </CardBody>
          </Card>
        )}
      </Motion>
    </div>
  );
}
