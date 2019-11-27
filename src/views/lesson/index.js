// // import external modules
import React, { useState, Fragment } from 'react';
import { Card, CardBody } from 'reactstrap';
import moment from 'moment';
import SwipeableViews from 'react-swipeable-views';
import TimeLine from 'react-horizontal-timeline';

import Plyr from 'react-plyr';

export default function Lesson() {
  const [value, setValue] = useState(0);
  const [previous, setPrevious] = useState(0);
  const [showConfigurator, setShowConfigurator] = useState(false);
  const [dates, setDates] = useState([
    moment(new Date(2019, 1, 16), 'DD-MM-YYYY'),
    moment(new Date(2019, 2, 28), 'DD-MM-YYYY'),
    moment(new Date(2019, 3, 20), 'DD-MM-YYYY'),
    moment(new Date(2019, 5, 20), 'DD-MM-YYYY'),
    moment(new Date(2019, 7, 9), 'DD-MM-YYYY'),
    moment(new Date(2019, 8, 30), 'DD-MM-YYYY'),
    moment(new Date(2019, 9, 15), 'DD-MM-YYYY'),
    moment(new Date(2019, 11, 1), 'DD-MM-YYYY'),
  ]);
  const [title, setTitle] = useState([
    'Qual é o salário de um desenvolvedor?',
    'O que faz um desenvolvedor?',
    'Como você pode se tornar um desenvolvedor?',
    'Você nasceu pra isso?',
    'Event Title 4 Here',
    'Event Title 5 Here',
    'Event Title 6 Here',
    'Event Title 7 Here',
    'Event Title 8 Here',
  ]);
  const [content, setContent] = useState(
    'De acordo com o site Love Mondays, a média salarial do Desenvolvedor Full Stack é de R$ 4.850,00. Porém, isso vai depender muito do nível de conhecimento do profissional em questão. Na mesma fonte, há ofertas que prometem o salário de R$ 1.574,00 (estágio ou júnior) e outras que chegam a até R$ 10.940,00 (sênior). Vale ressaltar que algumas outras características acabam não sendo consideradas nessas médias salarias. A possibilidade de crescimento profissional, a maturidade e cultura incentivada, o porte da empresa e os benefícios oferecidos são detalhes que podem fazer toda a diferença na hora de se escolher um novo emprego.'
  );

  return (
    <Fragment>
      <Card>
        <CardBody className="p-5">
          {/* Bounding box for the Timeline */}
          <div
            className="horizontal-timeline-wrapper"
            style={{ height: '100px', margin: '0 0 2rem 0' }}
          >
            <TimeLine
              fillingMotion={{
                stiffness: 150,
                damping: 25,
              }}
              index={value}
              indexClick={index => {
                setValue(index);
                setPrevious(value);
              }}
              isKeyboardEnabled={true}
              isTouchEnabled={true}
              labelWidth={100}
              linePadding={100}
              maxEventPadding={120}
              minEventPadding={20}
              slidingMotion={{
                stiffness: 150,
                damping: 25,
              }}
              styles={{
                background: '#f8f8f8',
                foreground: '#009da0',
                outline: '#dfdfdf',
              }}
              values={dates}
              isOpenEnding={true}
              isOpenBeginning={true}
            />
          </div>
          <div>
            <SwipeableViews
              index={value}
              onChangeIndex={(value, previous) => {
                setValue(value);
                setPrevious(previous);
              }}
              resistance
            >
              {title.map((title, i) => {
                return (
                  <div key={i}>
                    <h2 className="text-bold-600">{title}</h2>
                    <em>- 16.11.2019</em>
                    <p className="mb-3 mt-3">{content}</p>
                    <h4>Fique encantando com essa história</h4>
                    <Plyr
                      type="vimeo" // or "vimeo"
                      videoId="368778370"
                    />
                  </div>
                );
              })}
            </SwipeableViews>
          </div>
        </CardBody>
      </Card>
    </Fragment>
  );
}
