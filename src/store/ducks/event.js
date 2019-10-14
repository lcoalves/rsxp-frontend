/**
 * Action Types
 *
 * GROUPS_REQUEST 3x
 *
 * GROUP_EDIT_REQUEST 3x
 *
 * GROUP_ADD_INVITE_REQUEST 3x
 */
export const Types = {
  ADD_REQUEST: 'ADD_REQUEST',
  ADD_SUCCESS: 'ADD_SUCCESS',
  ADD_FAILURE: 'ADD_FAILURE',

  ALL_REQUEST: 'ALL_EVENT_REQUEST',
  ALL_SUCCESS: 'ALL_EVENT_SUCCESS',
  ALL_FAILURE: 'ALL_EVENT_FAILURE',

  REQUEST: 'EVENT_REQUEST',
  SUCCESS: 'EVENT_SUCCESS',
  FAILURE: 'EVENT_FAILURE',

  EDIT_REQUEST: 'EVENT_EDIT_REQUEST',
  EDIT_SUCCESS: 'EVENT_EDIT_SUCCESS',
  EDIT_FAILURE: 'EVENT_EDIT_FAILURE',

  ADD_INVITE_REQUEST: 'EVENT_ADD_INVITE_REQUEST',
  ADD_INVITE_SUCCESS: 'EVENT_ADD_INVITE_SUCCESS',
  ADD_INVITE_FAILURE: 'EVENT_ADD_INVITE_FAILURE',

  INVITE_REQUEST: 'INVITE_REQUEST',
  INVITE_SUCCESS: 'INVITE_SUCCESS',
  INVITE_FAILURE: 'INVITE_FAILURE',
};

/**
 * Reducers
 */
const INITIAL_STATE = {
  loading: false,
  error: false,
  // Listagem de todos os eventos
  allData: {
    participant: [],
    leader: [],
    trainer: [],
    myTrainers: [],
    facilitate: [],
    coordinate: [],
  },
  // Dados de um evento
  data: null,
};

export default function groupEdit(state = INITIAL_STATE, action) {
  switch (action.type) {
    // CASE CARREGAR A TABELA DE TODOS OS EVENTOS
    case Types.ALL_REQUEST:
      return { ...state, loading: true };
    case Types.ALL_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        allData: action.payload.allData,
      };
    case Types.ALL_FAILURE:
      return {
        ...state,
        error: true,
        loading: false,
      };

    // CASE CARREGAR UM EVENTO PELO ID
    case Types.REQUEST:
      return { ...state, loading: true };
    case Types.SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        data: action.payload.data,
      };
    case Types.FAILURE:
      return {
        ...state,
        error: true,
        loading: false,
      };

    // CASE EDITAR EVENTO
    case Types.EDIT_REQUEST:
      return { ...state, loading: true };
    case Types.EDIT_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
      };
    case Types.EDIT_FAILURE:
      return {
        ...state,
        error: true,
        loading: false,
      };

    // CASE ADICIONAR EVENTO
    case Types.EVENT_ADD_INVITE_REQUEST:
      return { ...state, loading: true };
    case Types.EVENT_ADD_INVITE_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
      };
    case Types.EVENT_ADD_INVITE_FAILURE:
      return {
        ...state,
        error: true,
        loading: false,
      };

    // CASE CONFIRMAR CONVITE
    case Types.INVITE_REQUEST:
      return { ...state, loading: true };
    case Types.INVITE_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
      };
    case Types.INVITE_FAILURE:
      return {
        ...state,
        error: true,
        loading: false,
      };

    // CASE CONFIRMAR CONVITE
    case Types.ADD_REQUEST:
      return { ...state, loading: true };
    case Types.ADD_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
      };
    case Types.ADD_FAILURE:
      return {
        ...state,
        error: true,
        loading: false,
      };

    default:
      return state;
  }
}

/**
 * Actions Creators
 */
export const Creators = {
  // CREATORS PARA TODOS OS EVENTOS
  allEventRequest: () => ({
    type: Types.ALL_REQUEST,
  }),
  allEventSuccess: allData => ({
    type: Types.ALL_SUCCESS,
    payload: {
      allData,
    },
  }),
  allEventFailure: () => ({
    type: Types.ALL_FAILURE,
  }),

  // CREATORS PARA CARREGAR UM EVENTO PELO ID
  eventRequest: id => ({
    type: Types.REQUEST,
    payload: {
      id,
    },
  }),
  eventSuccess: data => ({
    type: Types.SUCCESS,
    payload: {
      data,
    },
  }),
  eventFailure: () => ({
    type: Types.FAILURE,
  }),

  // CREATORS PARA EDITAR UM EVENTO
  eventEditRequest: id => ({
    type: Types.EDIT_REQUEST,
    payload: {
      id,
    },
  }),
  eventEditSuccess: () => ({
    type: Types.EDIT_SUCCESS,
  }),
  eventEditFailure: () => ({
    type: Types.EDIT_FAILURE,
  }),

  // CREATORS PARA ADICIONAR UM EVENTO eventAddRequest
  confirmInviteRequest: (event_id, name, email) => ({
    type: Types.ADD_INVITE_REQUEST,
    payload: {
      event_id,
      name,
      email,
    },
  }),
  // confirmInviteSuccess
  confirmInviteSuccess: () => ({
    type: Types.ADD_INVITE_SUCCESS,
  }),
  //confirmInviteFailure
  confirmInviteFailure: () => ({
    type: Types.ADD_INVITE_FAILURE,
  }),

  addEventRequest: data => ({
    type: Types.ADD_REQUEST,
    payload: {
      data,
    },
  }),

  addEventSuccess: () => ({
    type: Types.ADD_SUCCESS,
  }),

  addEventFailure: () => ({
    type: Types.ADD_FAILURE,
  }),
};