/**
 * Action Types
 */
export const Types = {
  ADD_REQUEST: 'ADD_INVITE_REQUEST',
  ADD_SUCCESS: 'ADD_INVITE_SUCCESS',
  ADD_FAILURE: 'ADD_INVITE_FAILURE',

  DELETE_REQUEST: 'DELETE_INVITE_REQUEST',
  DELETE_SUCCESS: 'DELETE_INVITE_SUCCESS',
  DELETE_FAILURE: 'DELETE_INVITE_FAILURE',
};

/**
 * Reducers
 */
const INITIAL_STATE = {
  loading: false,
  error: false,
};

export default function invite(state = INITIAL_STATE, action) {
  switch (action.type) {
    // CASE ENVIAR CONVITE
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

    // DELETAR INVITE
    case Types.DELETE_REQUEST:
      return { ...state, loading: true };
    case Types.DELETE_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
      };
    case Types.DELETE_FAILURE:
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
  // INVITE REQUEST
  confirmInviteRequest: (event_id, name, email) => ({
    type: Types.ADD_REQUEST,
    payload: {
      event_id,
      name,
      email,
    },
  }),
  confirmInviteSuccess: () => ({
    type: Types.ADD_SUCCESS,
  }),
  confirmInviteFailure: () => ({
    type: Types.ADD_FAILURE,
  }),

  // DELETAR CONVITE
  deleteInviteRequest: invite_id => ({
    type: Types.DELETE_REQUEST,
    payload: {
      invite_id,
    },
  }),

  deleteInviteSuccess: () => ({
    type: Types.DELETE_SUCCESS,
  }),

  deleteInviteFailure: () => ({
    type: Types.DELETE_FAILURE,
  }),
};
