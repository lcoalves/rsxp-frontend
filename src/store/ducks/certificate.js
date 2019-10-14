/**
 * Action Types
 */
export const Types = {
  REQUEST: "CERTIFICATE_REQUEST",
  SUCCESS: "CERTIFICATE_SUCCESS",
  FAILURE: "CERTIFICATE_FAILURE"
};

/**
 * Reducers
 */
const INITIAL_STATE = {
  loading: false,
  error: false,
  data: {}
};

export default function certificate(state = INITIAL_STATE, action) {
  switch (action.type) {
    case Types.REQUEST:
      return { ...state, loading: true };
    case Types.SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
        data: action.payload.data
      };
    case Types.FAILURE:
      return {
        ...state,
        error: true,
        loading: false
      };
    default:
      return state;
  }
}

/**
 * Actions Creators
 */
export const Creators = {
  certificateRequest: data => ({
    type: Types.REQUEST,
    payload: {
      data
    }
  }),
  certificateSuccess: data => ({
    type: Types.SUCCESS,
    payload: {
      data
    }
  }),
  certificateFailure: () => ({
    type: Types.FAILURE
  })
};
