import React, { useEffect } from 'react';
import styled from 'styled-components';
import globals from '../utils/globals';

import Plyr from 'plyr';

import { Col } from 'reactstrap';

export default function Video() {
  useEffect(() => {
    const options = {};
    const player = new Plyr('#plyr-player', options);

    return () => {
      if (player.length > 0) {
        for (const playerEl of player) {
          playerEl.destroy();
        }
      }
    };
  }, []);

  return (
    <Col xl="6" lg="5" md="12" xs="12" className="d-flex flex-grow-1 m-3 p-0">
      <div
        id="plyr-player"
        data-plyr-provider="vimeo"
        data-plyr-embed-id="127186403"
      />
    </Col>
  );
}
