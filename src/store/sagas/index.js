import { all, takeLatest, put, call } from 'redux-saga/effects';

import { toastr } from 'react-redux-toastr';
import { push } from 'connected-react-router';

import axios from 'axios';
import api from '~/services/api';

import {
  Creators as CustomizerActions,
  Types as CustomizerTypes,
} from '~/store/ducks/customizer';

// UDF
import {
  Creators as SignupActions,
  Types as SignupTypes,
} from '~/store/ducks/signup';

import {
  Creators as LoginActions,
  Types as LoginTypes,
} from '~/store/ducks/login';

import {
  Creators as ResetPasswordActions,
  Types as ResetPasswordTypes,
} from '~/store/ducks/resetPassword';

import {
  Creators as ProfileActions,
  Types as ProfileTypes,
} from '~/store/ducks/profile';

import {
  Creators as EventActions,
  Types as EventTypes,
} from '~/store/ducks/event';

import {
  Creators as OrganizatorActions,
  Types as OrganizatorTypes,
} from '~/store/ducks/organizator';

import {
  Creators as ParticipantActions,
  Types as ParticipantTypes,
} from '~/store/ducks/participant';

import {
  Creators as SearchChurchActions,
  Types as SearchChurchTypes,
} from '~/store/ducks/searchChurch';

import { Creators as CepActions, Types as CepTypes } from '~/store/ducks/cep';

import {
  Creators as CertificateActions,
  Types as CertificateTypes,
} from '~/store/ducks/certificate';

import {
  Creators as CheckoutActions,
  Types as CheckoutTypes,
} from '~/store/ducks/checkout';

import {
  Creators as LessonActions,
  Types as LessonTypes,
} from '~/store/ducks/lesson';

import {
  Creators as SiteEventActions,
  Types as SiteEventTypes,
} from '~/store/ducks/siteEvent';

import {
  Creators as DefaultEventActions,
  Types as DefaultEventTypes,
} from '~/store/ducks/defaultEvent';

import {
  Creators as OrganizationActions,
  Types as OrganizationTypes,
} from '~/store/ducks/organization';

import {
  Creators as AvatarActions,
  Types as AvatarTypes,
} from '~/store/ducks/avatar';

function* signup(action) {
  try {
    const { entity_company, name, email, cpf_cnpj, password } = action.payload;

    if (entity_company === 'pf') {
      yield call(api.post, '/entity', {
        name,
        email,
        cpf: cpf_cnpj,
        password,
      });
    } else {
      yield call(api.post, '/organization', {
        corporate_name: name,
        email,
        cnpj: cpf_cnpj,
        password,
      });
    }

    yield put(SignupActions.signupSuccess());

    if (entity_company === 'pf') {
      yield put(push('/acesso-pf'));
    } else {
      yield put(push('/acesso-pj'));
    }
    toastr.success('Sucesso!', 'Cadastro realizado com sucesso.');
  } catch (err) {
    toastr.error('Falha!', 'Tente cadastrar novamente.');
    yield put(SignupActions.signupFailure());
  }
}

function* login(action) {
  try {
    const { type, email_cpf_cnpj, password } = action.payload;

    const response = yield call(
      api.post,
      `${type === 'entity' ? '/sessions' : '/organization_sessions'}`,
      {
        email_cpf_cnpj,
        password,
      }
    );

    const { token, user } = response.data;

    if (!response.data.error) {
      yield put(LoginActions.loginSuccess(response.data));

      localStorage.setItem('@dashboard/token', token.token);
      localStorage.setItem('@dashboard/user', user.id);
      localStorage.setItem('@dashboard/user_type', type);

      yield put(push('/inicio'));
      type === 'entity'
        ? toastr.success(
            'Sucesso!',
            `Seja bem-vindo ${user.name.split(' ')[0]}.`
          )
        : toastr.success(
            'Sucesso!',
            `Seja bem-vindo ${user.corporate_name.split(' ')[0]}.`
          );
    } else {
      yield put(LoginActions.loginFailure());

      yield put(push('/senha-expirada'));
      toastr.warning(response.data.error.title, response.data.error.message);
    }
  } catch (err) {
    toastr.error(
      err.response.data.error.title,
      err.response.data.error.message
    );
    yield put(LoginActions.loginFailure());
  }
}

function* resetPassword(action) {
  try {
    const { type, email_cpf_cnpj } = action.payload;

    let response;

    if (process.env.NODE_ENV === 'development' && type === 'entity') {
      response = yield call(api.post, '/forgot_password', {
        email_cpf_cnpj,
        redirect_url: 'http://localhost:3000/resetar-senha-pf',
      });
    } else if (
      process.env.NODE_ENV === 'development' &&
      type === 'organization'
    ) {
      response = yield call(api.post, '/forgot_password_pj', {
        email_cpf_cnpj,
        redirect_url: 'http://localhost:3000/resetar-senha-pj',
      });
    } else if (process.env.NODE_ENV === 'production' && type === 'entity') {
      response = yield call(api.post, '/forgot_password', {
        email_cpf_cnpj,
        redirect_url:
          'https://dashboard-eventos-frontend.herokuapp.com/resetar-senha-pf',
      });
    } else if (
      process.env.NODE_ENV === 'production' &&
      type === 'organization'
    ) {
      response = yield call(api.post, '/forgot_password_pj', {
        email_cpf_cnpj,
        redirect_url:
          'https://dashboard-eventos-frontend.herokuapp.com/resetar-senha-pj',
      });
    }

    const { email } = response.data;

    yield put(ResetPasswordActions.resetPasswordSuccess());

    yield put(push('/'));
    toastr.success('Boa!', `Acesse o email ${email}`);
  } catch (err) {
    toastr.error('Oops!', `Houve um erro ao tentar recuperar a senha`);
    yield put(ResetPasswordActions.resetPasswordFailure());
  }
}

function* confirmResetPassword(action) {
  try {
    const { type, token, password } = action.payload;

    if (type === 'entity') {
      yield call(api.put, '/forgot_password', {
        token,
        password,
      });
    } else {
      yield call(api.put, '/forgot_password_pj', {
        token,
        password,
      });
    }

    yield put(ResetPasswordActions.confirmResetPasswordSuccess());

    yield put(push('/'));
    toastr.success('Parabéns!', 'A senha foi alterada com sucesso');
  } catch (err) {
    toastr.error(err.response.data.title, err.response.data.message);
    yield put(ResetPasswordActions.confirmResetPasswordFailure());
  }
}

function* logout() {
  try {
    localStorage.removeItem('@dashboard/token');
    localStorage.removeItem('@dashboard/user');
    localStorage.removeItem('@dashboard/user_type');

    yield put(push('/'));
    toastr.success('Desconectado!', 'Estamos ansiosos para você voltar.');

    yield put(LoginActions.logoutSuccess());
  } catch (err) {
    toastr.error(err.response.data.title, err.response.data.message);
    yield put(LoginActions.logoutFailure());
  }
}

function* profile() {
  try {
    const user_type = localStorage.getItem('@dashboard/user_type');

    const response = yield call(api.get, `/sessions/${user_type}`);

    yield put(ProfileActions.profileSuccess(response.data));
  } catch (err) {
    yield put(ProfileActions.profileFailure());
  }
}

function* editProfile(action) {
  try {
    const { data } = action.payload;

    const user_type = localStorage.getItem('@dashboard/user_type');
    const user = localStorage.getItem('@dashboard/user');

    yield call(
      api.put,
      `${user_type === 'entity' ? `/entity/${user}` : `/organization/${user}`}`,
      data
    );

    yield put(ProfileActions.editProfileSuccess());
    toastr.success('Sucesso!', 'Seu perfil foi atualizado.');
  } catch (err) {
    yield put(ProfileActions.editProfileFailure());
  }
}

function* event(action) {
  try {
    const { id } = action.payload;

    const response = yield call(api.get, `/event/${id}`);

    yield put(EventActions.eventSuccess(response.data));
  } catch (err) {
    yield put(EventActions.eventFailure());
  }
}

function* allEvents() {
  try {
    const user_id = localStorage.getItem('@dashboard/user');
    const user_type = localStorage.getItem('@dashboard/user_type');

    const response = yield call(
      api.get,
      `/${user_type === 'entity' ? 'entity' : 'organization'}/${user_id}`
    );

    yield put(EventActions.allEventSuccess(response.data));
  } catch (err) {
    yield put(EventActions.allEventFailure());
  }
}

function* addInvite(action) {
  try {
    const { event_id, name, email } = action.payload;

    yield call(api.post, '/invite', {
      event_id,
      name,
      email,
      redirect_url: `http://localhost:3000/evento/${event_id}/checkout`,
    });

    yield put(EventActions.confirmInviteSuccess());
    toastr.success('Sucesso!', 'Convite enviado com sucesso.');
  } catch (err) {
    yield put(EventActions.confirmInviteFailure());
  }
}

function* addEvent(action) {
  try {
    const { data } = action.payload;
    const { organizator_id } = data;

    delete data.organizator_id;

    const response = yield call(api.post, '/event', data);
    yield put(EventActions.addEventSuccess());

    yield call(api.post, '/event_organizator', {
      event_id: response.data.id,
      entity_id: organizator_id,
    });
    yield put(OrganizatorActions.addOrganizatorSuccess());

    yield put(push('/eventos/grupos'));
    toastr.success('Sucesso!', 'O grupo foi criado.');
  } catch (err) {
    yield put(EventActions.addEventFailure());
  }
}

function* addOrganizator(action) {
  try {
    const { event_id, entity_id } = action.payload;

    yield call(api.post, '/event_organizator', { event_id, entity_id });

    yield put(OrganizatorActions.addOrganizatorSuccess());

    toastr.confirm('Líder adicionado com sucesso.', {
      onOk: () => window.location.reload(),
      disableCancel: true,
    });
  } catch (err) {
    yield put(OrganizatorActions.addOrganizatorFailure());
  }
}

function* deleteOrganizator(action) {
  try {
    const { event_id, entity_id } = action.payload;

    yield call(api.delete, `/event_organizator/${entity_id}/event/${event_id}`);

    yield put(OrganizatorActions.deleteOrganizatorSuccess());
    window.location.reload();
  } catch (err) {
    yield put(OrganizatorActions.deleteOrganizatorFailure());
  }
}

function* changeOrganizator(action) {
  try {
    const { organizator_id, event_id, entity_id, is_same } = action.payload;

    yield call(
      api.delete,
      `/event_organizator/${organizator_id}/event/${event_id}`
    );
    yield put(OrganizatorActions.deleteOrganizatorSuccess());

    yield call(api.post, '/event_organizator', { event_id, entity_id });
    yield put(OrganizatorActions.addOrganizatorSuccess());

    yield put(OrganizatorActions.changeOrganizatorSuccess());

    toastr.confirm('Líder alterado com sucesso.', {
      onOk: () => window.location.reload(),
      disableCancel: true,
    });

    if (is_same) {
      yield put(push('/eventos/grupos'));
    }
  } catch (err) {
    yield put(OrganizatorActions.changeOrganizatorFailure());
  }
}

function* searchOrganizator(action) {
  try {
    const { organizator_type, cpf, default_event_id } = action.payload;

    const response = yield call(
      api.get,
      `/event_organizator/${organizator_type}/${cpf}/${default_event_id}`
    );

    yield put(OrganizatorActions.searchOrganizatorSuccess(response.data));

    if (response.data.error) {
      yield put(OrganizatorActions.searchOrganizatorFailure());
      toastr.warning(response.data.error.title, response.data.error.message);
    }
  } catch (err) {
    toastr.error(
      err.response.data.error.title,
      err.response.data.error.message
    );
    yield put(OrganizatorActions.searchOrganizatorFailure());
  }
}

function* createParticipant(action) {
  try {
    const { name, cpf, email, sex, password, event_id } = action.payload;

    const response = yield call(api.post, '/entity', {
      name,
      cpf,
      email,
      sex,
      password,
    });

    const entity_id = response.data.id;
    yield put(ParticipantActions.createParticipantSuccess());

    yield call(api.post, '/event_participant', {
      entity_id,
      event_id,
      assistant: false,
    });

    yield put(ParticipantActions.addParticipantSuccess());

    toastr.confirm('Participante cadastrado e adicionado com sucesso.', {
      onOk: () => window.location.reload(),
      disableCancel: true,
    });
  } catch (err) {
    toastr.error('Falha!', 'Tente cadastrar novamente.');
    yield put(ParticipantActions.createParticipantFailure());
  }
}

function* addParticipant(action) {
  try {
    const { event_id, entity_id, assistant } = action.payload;

    const response = yield call(api.post, '/event_participant', {
      entity_id,
      event_id,
      assistant,
    });

    if (response.data.error) {
      yield put(ParticipantActions.addParticipantFailure());
      toastr.warning(response.data.error.title, response.data.error.message);
    } else {
      yield put(ParticipantActions.addParticipantSuccess());

      if (assistant === true) {
        toastr.confirm('Líder em treinamento adicionado com sucesso.', {
          onOk: () => window.location.reload(),
          disableCancel: true,
        });
      } else {
        toastr.confirm('Participante adicionado com sucesso.', {
          onOk: () => window.location.reload(),
          disableCancel: true,
        });
      }
    }
  } catch (err) {
    yield put(ParticipantActions.addParticipantFailure());
  }
}

function* deleteParticipant(action) {
  try {
    const { event_id, entity_id } = action.payload;

    yield call(api.delete, `/event_participant/${entity_id}/event/${event_id}`);

    yield put(ParticipantActions.deleteParticipantSuccess());
    window.location.reload();
  } catch (err) {
    yield put(ParticipantActions.deleteParticipantFailure());
  }
}

function* searchParticipant(action) {
  try {
    const { cpf, default_event_id } = action.payload;

    const response = yield call(
      api.get,
      `/event_participant/${cpf}/${default_event_id}`
    );

    yield put(ParticipantActions.searchParticipantSuccess(response.data));

    if (response.data.error) {
      yield put(ParticipantActions.searchParticipantFailure());
      toastr.warning(response.data.error.title, response.data.error.message);
    }
  } catch (err) {
    toastr.error(
      err.response.data.error.title,
      err.response.data.error.message
    );
    yield put(ParticipantActions.searchParticipantFailure());
  }
}

function* searchChurch(action) {
  try {
    const { church_uf, church_city, church_name } = action.payload;

    const response = yield call(
      api.get,
      `/churchs/${church_uf}/${church_city}/${church_name}`
    );

    if (response.data.error) {
      toastr.error(response.data.error.title, response.data.error.message);
    }

    yield put(SearchChurchActions.searchChurchSuccess(response.data));
  } catch (err) {
    yield put(SearchChurchActions.searchChurchFailure());
  }
}

function* cep(action) {
  try {
    const { cep } = action.payload;

    const response = yield call(
      axios.get,
      `https://viacep.com.br/ws/${cep}/json/`
    );

    yield put(CepActions.cepSuccess(response.data));
    toastr.success('Sucesso!', 'CEP encontrado.');
  } catch (err) {
    toastr.error('Falha!', 'CEP inválido.');
    yield put(CepActions.cepFailure());
  }
}

function* certificate(action) {
  try {
    const { data } = action.payload;

    yield put(CertificateActions.certificateSuccess(data));

    yield put(push(`/eventos/grupo/${data.event_id}/certificados`));
  } catch (err) {
    toastr.error('Falha!', 'Tente novamente');
    yield put(CertificateActions.certificateFailure());
  }
}

function* checkoutLogin(action) {
  try {
    const { email_cpf_cnpj, password, event_id, invite_id } = action.payload;

    const response = yield call(api.post, '/sessions', {
      email_cpf_cnpj,
      password,
    });

    const { user } = response.data;

    if (!response.data.error) {
      yield put(CheckoutActions.checkoutLoginSuccess(response.data));

      localStorage.setItem('@dashboard/checkout_token', response.data.token);
      localStorage.setItem('@dashboard/checkout_user', response.data.user.id);

      if (
        !!user.cep &&
        !!user.uf &&
        !!user.city &&
        !!user.street &&
        !!user.street_number &&
        !!user.neighborhood
      ) {
        !!invite_id
          ? yield put(
              push(
                `/evento/${event_id}/checkout/pagamento/convite/${invite_id}`
              )
            )
          : yield put(push(`/evento/${event_id}/checkout/pagamento`));
      } else {
        !!invite_id
          ? yield put(
              push(`/evento/${event_id}/checkout/endereco/convite/${invite_id}`)
            )
          : yield put(push(`/evento/${event_id}/checkout/endereco`));
      }
    } else {
      yield put(CheckoutActions.checkoutLoginFailure());

      yield put(push('/senha-expirada'));
      toastr.warning(response.data.error.title, response.data.error.message);
    }
  } catch (err) {
    toastr.error(
      err.response.data.error.title,
      err.response.data.error.message
    );
    yield put(CheckoutActions.checkoutLoginFailure());
  }
}

function* checkoutSignup(action) {
  try {
    const {
      firstname,
      lastname,
      email,
      cpf_cnpj,
      password,
      event_id,
      invite_id,
    } = action.payload;

    yield call(api.post, '/users', {
      firstname,
      lastname,
      email,
      cpf_cnpj,
      password,
    });

    yield put(CheckoutActions.checkoutSignupSuccess());

    yield put(push('/'));
    toastr.success('Sucesso!', 'Cadastro realizado com sucesso.');
  } catch (err) {
    toastr.error('Falha!', 'Tente cadastrar novamente.');
    yield put(CheckoutActions.checkoutSignupFailure());
  }
}

function* checkoutPayment(action) {}

function* lesson(action) {
  try {
    const { id } = action.payload;

    const response = yield call(api.get, `/lesson/${id}`);

    yield put(LessonActions.lessonSuccess(response.data));
  } catch (err) {
    toastr.error('Falha!', 'Tente novamente');
    yield put(LessonActions.lessonFailure());
  }
}

function* siteEvent(action) {
  try {
    const { id } = action.payload;

    const response = yield call(api.get, `/site_event/${id}`);

    yield put(SiteEventActions.siteEventSuccess(response.data));
  } catch (err) {
    toastr.error('Falha!', 'Tente novamente');
    yield put(SiteEventActions.siteEventFailure());
  }
}

function* organizatorEvent(action) {
  try {
    let response;
    const { data } = action.payload;
    const user_type = localStorage.getItem('@dashboard/user_type');

    if (user_type === 'entity') {
      response = yield call(api.post, '/organizator_events', data);
    } else {
      response = yield call(api.get, '/default_events');
    }

    yield put(DefaultEventActions.organizatorEventSuccess(response.data));
  } catch (err) {
    toastr.error('Falha!', 'Tente novamente');
    yield put(DefaultEventActions.organizatorEventFailure());
  }
}

//CUSTOMIZAÇÕES DO TEMA
function* customizerBgImage(action) {
  try {
    const { img } = action.payload;

    yield put(CustomizerActions.sidebarImageSuccess(img));
  } catch (err) {
    yield put(CustomizerActions.customizerFailure());
  }
}

function* searchOrganizations(action) {
  try {
    const { cnpj } = action.payload;

    const response = yield call(api.get, `/event_organizations/${cnpj}`);

    yield put(OrganizationActions.searchOrganizationSuccess(response.data));
  } catch (err) {
    toastr.error(
      err.response.data.error.title,
      err.response.data.error.message
    );
    yield put(OrganizationActions.searchOrganizationFailure());
  }
}

function* avatar(action) {
  try {
    const { file, name, size, type } = action.payload;

    const user_type = localStorage.getItem('@dashboard/user_type');
    const user_id = localStorage.getItem('@dashboard/user');

    const data = new FormData();

    data.append('file', file, name);

    const response = yield call(
      api.post,
      `/files/${user_id}/${user_type === 'entity' ? 'entity' : 'organization'}`,
      data
    );

    yield put(AvatarActions.avatarSuccess());
  } catch (err) {
    toastr.error(
      err.response.data.error.title,
      err.response.data.error.message
    );
    yield put(AvatarActions.avatarFailure());
  }
}

function* customizerBgImageUrl(action) {
  try {
    const { imgurl } = action.payload;

    yield put(CustomizerActions.sidebarImageUrlSuccess(imgurl));
  } catch (err) {
    yield put(CustomizerActions.customizerFailure());
  }
}

function* customizerBgColor(action) {
  try {
    const { color } = action.payload;

    yield put(CustomizerActions.sidebarBgColorSuccess(color));
  } catch (err) {
    toastr.error('Falha!', 'Tente novamente');
    yield put(CustomizerActions.customizerFailure());
  }
}

function* customizerSidebarCollapsed(action) {
  try {
    const { collapsed } = action.payload;

    yield put(CustomizerActions.sidebarCollapsedSuccess(collapsed));
  } catch (err) {
    yield put(CustomizerActions.customizerFailure());
  }
}

function* customizerSidebarSize(action) {
  try {
    const { size } = action.payload;

    yield put(CustomizerActions.sidebarSizeSuccess(size));
  } catch (err) {
    yield put(CustomizerActions.customizerFailure());
  }
}

function* customizerLayout(action) {
  try {
    const { layout } = action.payload;

    yield put(CustomizerActions.changeLayoutSuccess(layout));
  } catch (err) {
    yield put(CustomizerActions.customizerFailure());
  }
}

export default function* rootSaga() {
  yield all([
    takeLatest(SignupTypes.REQUEST, signup),
    takeLatest(LoginTypes.REQUEST, login),
    takeLatest(ResetPasswordTypes.REQUEST, resetPassword),
    takeLatest(ResetPasswordTypes.CONFIRM_REQUEST, confirmResetPassword),
    takeLatest(LoginTypes.LOGOUT_REQUEST, logout),
    takeLatest(ProfileTypes.REQUEST, profile),
    takeLatest(ProfileTypes.EDIT_REQUEST, editProfile),

    takeLatest(EventTypes.REQUEST, event),
    takeLatest(EventTypes.ALL_REQUEST, allEvents),
    takeLatest(EventTypes.ADD_INVITE_REQUEST, addInvite),
    takeLatest(EventTypes.ADD_REQUEST, addEvent),

    takeLatest(OrganizatorTypes.ADD_REQUEST, addOrganizator),
    takeLatest(OrganizatorTypes.DELETE_REQUEST, deleteOrganizator),
    takeLatest(OrganizatorTypes.CHANGE_REQUEST, changeOrganizator),
    takeLatest(OrganizatorTypes.SEARCH_REQUEST, searchOrganizator),

    takeLatest(ParticipantTypes.ADD_REQUEST, addParticipant),
    takeLatest(ParticipantTypes.DELETE_REQUEST, deleteParticipant),
    takeLatest(ParticipantTypes.SEARCH_REQUEST, searchParticipant),
    takeLatest(ParticipantTypes.CREATE_REQUEST, createParticipant),

    takeLatest(DefaultEventTypes.REQUEST, organizatorEvent),

    takeLatest(CepTypes.REQUEST, cep),

    takeLatest(OrganizationTypes.REQUEST, searchOrganizations),

    // takeLatest(GroupEditTypes.REQUEST, groupEdit),

    takeLatest(CustomizerTypes.BG_IMAGE_REQUEST, customizerBgImage),
    takeLatest(CustomizerTypes.BG_IMAGE_URL_REQUEST, customizerBgImageUrl),
    takeLatest(CustomizerTypes.BG_COLOR_REQUEST, customizerBgColor),
    takeLatest(
      CustomizerTypes.SIDEBAR_COLLAPSED_REQUEST,
      customizerSidebarCollapsed
    ),
    takeLatest(CustomizerTypes.SIDEBAR_SIZE_REQUEST, customizerSidebarSize),
    takeLatest(CustomizerTypes.LAYOUT_REQUEST, customizerLayout),
    takeLatest(SearchChurchTypes.REQUEST, searchChurch),
    takeLatest(CertificateTypes.REQUEST, certificate),
    takeLatest(CheckoutTypes.CHECKOUT_LOGIN_REQUEST, checkoutLogin),
    takeLatest(CheckoutTypes.CHECKOUT_SIGNUP_REQUEST, checkoutSignup),
    takeLatest(CheckoutTypes.CHECKOUT_REQUEST, checkoutPayment),
    takeLatest(LessonTypes.REQUEST, lesson),
    takeLatest(SiteEventTypes.REQUEST, siteEvent),
    takeLatest(AvatarTypes.REQUEST, avatar),
  ]);
}
