/**
 * Action Types
 */
export const Types = {
  REQUEST: 'PROFILE_REQUEST',
  SUCCESS: 'PROFILE_SUCCESS',
  FAILURE: 'PROFILE_FAILURE',

  EDIT_REQUEST: 'EDIT_PROFILE_REQUEST',
  EDIT_SUCCESS: 'EDIT_PROFILE_SUCCESS',
  EDIT_FAILURE: 'EDIT_PROFILE_FAILURE',
};

/**
 * Reducers
 */
const INITIAL_STATE = {
  loading: false,
  error: false,
  data: {},
};

export default function profile(state = INITIAL_STATE, action) {
  switch (action.type) {
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
    default:
      return state;
  }
}

/**
 * Actions Creators
 */
export const Creators = {
  profileRequest: () => ({
    type: Types.REQUEST,
  }),
  profileSuccess: data => ({
    type: Types.SUCCESS,
    payload: {
      data,
    },
  }),
  profileFailure: () => ({
    type: Types.FAILURE,
  }),

  editProfileRequest: data => ({
    type: Types.EDIT_REQUEST,
    payload: {
      data,
    },
  }),
  editProfileSuccess: () => ({
    type: Types.EDIT_SUCCESS,
  }),
  editProfileFailure: () => ({
    type: Types.EDIT_FAILURE,
  }),
};
