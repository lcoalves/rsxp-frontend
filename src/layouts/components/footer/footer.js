import React from 'react';
import { ShoppingCart, Heart } from 'react-feather';

import templateConfig from '../../../templateConfig';

const Footer = props => (
  <footer>
    {templateConfig.buyNow ? (
      <a
        href="https://pixinvent.com/demo/apex-react-redux-bootstrap-admin-dashboard-template/landing-page/"
        className="btn btn-floating btn-buynow gradient-pomegranate btn-round shadow-z-3 px-3 white"
        target="_blank"
        rel="noopener noreferrer"
      >
        <ShoppingCart size={14} />
        {'  '}Buy Now
      </a>
    ) : (
      ''
    )}
    <div className="container-fluid">
      <p className="text-center">
        © 2019 Desenvolvido com amor no
        <a
          href="https://rocketseat.com.br/experience"
          rel="noopener noreferrer"
          target="_blank"
          className="text-danger"
        >
          {' '}
          RSXP / Shawee Hackatons
        </a>{' '}
        <Heart size={16} />
      </p>
    </div>
  </footer>
);

export default Footer;
