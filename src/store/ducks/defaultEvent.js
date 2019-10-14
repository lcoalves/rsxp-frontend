/**
 * Action Types
 */
export const Types = {
  REQUEST: 'ORGANIZATOR_EVENT_REQUEST',
  SUCCESS: 'ORGANIZATOR_EVENT_SUCCESS',
  FAILURE: 'ORGANIZATOR_EVENT_FAILURE',
};

/**
 * Reducers
 */
const INITIAL_STATE = {
  loading: false,
  error: false,
  data: null,
};

export default function defaultEvent(state = INITIAL_STATE, action) {
  switch (action.type) {
    // CASE CARREGAR A TABELA DE TODOS OS EVENTOS
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

    default:
      return state;
  }
}

/**
 * Actions Creators
 */
export const Creators = {
  // CREATORS PARA TODOS OS EVENTOS
  organizatorEventRequest: data => ({
    type: Types.REQUEST,
    payload: {
      data,
    },
  }),

  organizatorEventSuccess: data => ({
    type: Types.SUCCESS,
    payload: {
      data,
    },
  }),

  organizatorEventFailure: () => ({
    type: Types.FAILURE,
  }),
};
