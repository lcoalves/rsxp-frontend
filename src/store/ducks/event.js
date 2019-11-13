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

  DELETE_REQUEST: 'EVENT_DELETE_REQUEST',
  DELETE_SUCCESS: 'EVENT_DELETE_SUCCESS',
  DELETE_FAILURE: 'EVENT_DELETE_FAILURE',
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

export default function event(state = INITIAL_STATE, action) {
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

  // DELETE EVENT
  deleteEventRequest: event_id => ({
    type: Types.DELETE_REQUEST,
    payload: {
      event_id,
    },
  }),

  deleteEventSuccess: () => ({
    type: Types.DELETE_SUCCESS,
  }),

  deleteEventFailure: () => ({
    type: Types.DELETE_FAILURE,
  }),
};
