/**
 * Action Types
 */
export const Types = {
  REQUEST: 'COURSE_REQUEST',
  SUCCESS: 'COURSE_SUCCESS',
  FAILURE: 'COURSE_FAILURE',
};

/**
 * Reducers
 */
const INITIAL_STATE = {
  loading: false,
  error: false,
  data: null,
};

export default function course(state = INITIAL_STATE, action) {
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
    default:
      return state;
  }
}

/**
 * Actions Creators
 */
export const Creators = {
  courseRequest: () => ({
    type: Types.REQUEST,
  }),

  courseSuccess: data => ({
    type: Types.SUCCESS,
    payload: {
      data,
    },
  }),

  courseFailure: () => ({
    type: Types.FAILURE,
  }),
};
