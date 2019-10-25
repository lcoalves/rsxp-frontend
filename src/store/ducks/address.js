/**
 * Action Types
 */
export const Types = {
  REQUEST: 'ADDRESS_REQUEST',
  SUCCESS: 'ADDRESS_SUCCESS',
  FAILURE: 'ADDRESS_FAILURE',
};

/**
 * Reducers
 */
const INITIAL_STATE = {
  loading: false,
  error: false,
};

export default function address(state = INITIAL_STATE, action) {
  switch (action.type) {
    case Types.REQUEST:
      return { ...state, loading: true };
    case Types.SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
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
  addressRequest: (addressesPost, addressesPut) => ({
    type: Types.REQUEST,
    payload: {
      addressesPost,
      addressesPut,
    },
  }),
  addressSuccess: () => ({
    type: Types.SUCCESS,
  }),
  addressFailure: () => ({
    type: Types.FAILURE,
  }),
};
