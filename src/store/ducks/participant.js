/**
 * Action Types
 */
export const Types = {
  ADD_REQUEST: 'ADD_PARTICIPANT_REQUEST',
  ADD_SUCCESS: 'ADD_PARTICIPANT_SUCCESS',
  ADD_FAILURE: 'ADD_PARTICIPANT_FAILURE',
  DELETE_REQUEST: 'DELETE_PARTICIPANT_REQUEST',
  DELETE_SUCCESS: 'DELETE_PARTICIPANT_SUCCESS',
  DELETE_FAILURE: 'DELETE_PARTICIPANT_FAILURE',
  SEARCH_REQUEST: 'SEARCH_PARTICIPANT_REQUEST',
  SEARCH_SUCCESS: 'SEARCH_PARTICIPANT_SUCCESS',
  SEARCH_FAILURE: 'SEARCH_PARTICIPANT_FAILURE',
};

/**
 * Reducers
 */
const INITIAL_STATE = {
  loading: false,
  loadingSearch: false,
  error: false,
  data: null,
};

export default function participant(state = INITIAL_STATE, action) {
  switch (action.type) {
    // ADICIONAR PARTICIPANTE
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

    // DELETAR PARTICIPANTE
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

    // SEARCH PARTICIPANT
    case Types.SEARCH_REQUEST:
      return { ...state, loadingSearch: true, error: false };
    case Types.SEARCH_SUCCESS:
      return {
        ...state,
        error: false,
        loadingSearch: false,
        data: action.payload.data,
      };
    case Types.SEARCH_FAILURE:
      return {
        ...state,
        error: true,
        loadingSearch: false,
      };

    default:
      return state;
  }
}

/**
 * Actions Creators
 */
export const Creators = {
  //ADD PARTICIPANTE
  addParticipantRequest: (entity_id, event_id, assistant) => ({
    type: Types.ADD_REQUEST,
    payload: {
      entity_id,
      event_id,
      assistant,
    },
  }),

  addParticipantSuccess: () => ({
    type: Types.ADD_SUCCESS,
  }),

  addParticipantFailure: () => ({
    type: Types.ADD_FAILURE,
  }),

  //DELETE PARTICIPANTE
  deleteParticipantRequest: (event_id, entity_id) => ({
    type: Types.DELETE_REQUEST,
    payload: {
      event_id,
      entity_id,
    },
  }),

  deleteParticipantSuccess: () => ({
    type: Types.DELETE_SUCCESS,
  }),

  deleteParticipantFailure: () => ({
    type: Types.DELETE_FAILURE,
  }),

  // SEarch organizator
  searchParticipantRequest: (cpf, default_event_id) => ({
    type: Types.SEARCH_REQUEST,
    payload: {
      cpf,
      default_event_id,
    },
  }),

  searchParticipantSuccess: data => ({
    type: Types.SEARCH_SUCCESS,
    payload: {
      data,
    },
  }),

  searchParticipantFailure: () => ({
    type: Types.SEARCH_FAILURE,
  }),
};
