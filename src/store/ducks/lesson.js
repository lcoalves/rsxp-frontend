/**
 * Action Types
 */
export const Types = {
  REQUEST: 'LESSON_REQUEST',
  SUCCESS: 'LESSON_SUCCESS',
  FAILURE: 'LESSON_FAILURE',
  ALL_REQUEST: 'ALL_LESSON_REQUEST',
  ALL_SUCCESS: 'ALL_LESSON_SUCCESS',
  ALL_FAILURE: 'ALL_LESSON_FAILURE',
};

/**
 * Reducers
 */
const INITIAL_STATE = {
  loading: false,
  error: false,
  data: {
    participants: [],
  },
};

export default function lesson(state = INITIAL_STATE, action) {
  switch (action.type) {
    // REQUISIÇÃO DE UMA LIÇÃO
    case Types.REQUEST:
      return { ...state, loading: true, error: false };
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
  // REQUISIÇÃO DE UMA LIÇÃO
  lessonRequest: id => ({
    type: Types.REQUEST,
    payload: {
      id,
    },
  }),
  lessonSuccess: data => ({
    type: Types.SUCCESS,
    payload: {
      data,
    },
  }),
  lessonFailure: () => ({
    type: Types.FAILURE,
  }),
};