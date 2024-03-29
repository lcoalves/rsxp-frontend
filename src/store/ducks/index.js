import { combineReducers } from 'redux';
import { connectRouter } from 'connected-react-router';

import history from '../../app/history';

import customizer from './customizer';
import calender from './calender';
import chat from './chat';
import contacts from './contacts';
import email from './chat';
import todo from './todo';
import types from './types';

//UDF
import signup from './signup';
import course from './course';
import login from './login';
import profile from './profile';
import address from './address';
import resetPassword from './resetPassword';
import event from './event';
import invite from './invite';
import groupEdit from './groupEdit';
import searchChurch from './searchChurch';
import cep from './cep';
import certificate from './certificate';
import checkout from './checkout';
import lesson from './lesson';
import lessonReport from './lessonReport';
import siteEvent from './siteEvent';
import defaultEvent from './defaultEvent';
import organization from './organization';
import avatar from './avatar';
import organizator from './organizator';
import participant from './participant';
import order from './order';
import shipping from './shipping';
import ministery from './ministery';

import { reducer as toastrReducer } from 'react-redux-toastr';

export default combineReducers({
  toastr: toastrReducer,
  customizer,
  calender,
  chat,
  contacts,
  email,
  todo,
  types,
  signup,
  course,
  login,
  profile,
  address,
  resetPassword,
  event,
  invite,
  groupEdit,
  searchChurch,
  cep,
  certificate,
  checkout,
  lesson,
  lessonReport,
  siteEvent,
  defaultEvent,
  organization,
  avatar,
  organizator,
  participant,
  order,
  shipping,
  ministery,
  router: connectRouter(history),
});
