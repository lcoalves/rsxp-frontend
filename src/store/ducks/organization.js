/**
 * Action Types
 */
export const Types = {
  REQUEST: 'SEARCH_ORGANIZATION_REQUEST',
  SUCCESS: 'SEARCH_ORGANIZATION_SUCCESS',
  FAILURE: 'SEARCH_ORGANIZATION_FAILURE',
};

/**
 * Reducers
 */
const INITIAL_STATE = {
  loading: false,
  error: false,
  data: null,
};

export default function organization(state = INITIAL_STATE, action) {
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
        data: null,
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
  searchOrganizationRequest: cnpj => ({
    type: Types.REQUEST,
    payload: {
      cnpj,
    },
  }),

  searchOrganizationSuccess: data => ({
    type: Types.SUCCESS,
    payload: {
      data,
    },
  }),

  searchOrganizationFailure: () => ({
    type: Types.FAILURE,
  }),
};
