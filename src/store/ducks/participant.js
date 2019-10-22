/**
 * Action Types
 */
export const Types = {
  CREATE_REQUEST: 'CREATE_PARTICIPANT_REQUEST',
  CREATE_SUCCESS: 'CREATE_PARTICIPANT_SUCCESS',
  CREATE_FAILURE: 'CREATE_PARTICIPANT_FAILURE',
  ADD_REQUEST: 'ADD_PARTICIPANT_REQUEST',
  ADD_SUCCESS: 'ADD_PARTICIPANT_SUCCESS',
  ADD_FAILURE: 'ADD_PARTICIPANT_FAILURE',
  DELETE_REQUEST: 'DELETE_PARTICIPANT_REQUEST',
  DELETE_SUCCESS: 'DELETE_PARTICIPANT_SUCCESS',
  DELETE_FAILURE: 'DELETE_PARTICIPANT_FAILURE',
  SEARCH_REQUEST: 'SEARCH_PARTICIPANT_REQUEST',
  SEARCH_SUCCESS: 'SEARCH_PARTICIPANT_SUCCESS',
  SEARCH_FAILURE: 'SEARCH_PARTICIPANT_FAILURE',
  SET_QUITTER_REQUEST: 'SET_QUITTER_REQUEST',
  SET_QUITTER_SUCCESS: 'SET_QUITTER_SUCCESS',
  SET_QUITTER_FAILURE: 'SET_QUITTER_FAILURE',
  EDIT_REQUEST: 'EDIT_PARTICIPANT_REQUEST',
  EDIT_SUCCESS: 'EDIT_PARTICIPANT_SUCCESS',
  EDIT_FAILURE: 'EDIT_PARTICIPANT_FAILURE',
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
    // CRIAR PARTICIPANTE NOVO
    case Types.CREATE_REQUEST:
      return { ...state, loading: true };
    case Types.CREATE_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
      };
    case Types.CREATE_FAILURE:
      return {
        ...state,
        error: true,
        loading: false,
      };

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

    // MUDAR PARTICIPANTE DESISTENTE / NAO DESISTENTE
    case Types.SET_QUITTER_REQUEST:
      return { ...state, loading: true };
    case Types.SET_QUITTER_SUCCESS:
      return {
        ...state,
        error: false,
        loading: false,
      };
    case Types.SET_QUITTER_FAILURE:
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
  //CREATE PARTICIPANT
  createParticipantRequest: (name, cpf, email, sex, password, event_id) => ({
    type: Types.CREATE_REQUEST,
    payload: {
      name,
      cpf,
      email,
      sex,
      password,
      event_id,
    },
  }),

  createParticipantSuccess: () => ({
    type: Types.CREATE_SUCCESS,
  }),

  createParticipantFailure: () => ({
    type: Types.CREATE_FAILURE,
  }),

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
  deleteParticipantRequest: participant_id => ({
    type: Types.DELETE_REQUEST,
    payload: {
      participant_id,
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

  // SET PARTICIPANTE DESISTENTE/NAO DESISTENTE
  setQuitterParticipantRequest: (participant_id, is_quitter) => ({
    type: Types.SET_QUITTER_REQUEST,
    payload: {
      participant_id,
      is_quitter,
    },
  }),

  setQuitterParticipantSuccess: () => ({
    type: Types.SET_QUITTER_SUCCESS,
  }),

  setQuitterParticipantFailure: () => ({
    type: Types.SET_QUITTER_FAILURE,
  }),

  editParticipantRequest: data => ({
    type: Types.EDIT_REQUEST,
    payload: {
      data,
    },
  }),
  editParticipantSuccess: () => ({
    type: Types.EDIT_SUCCESS,
  }),
  editParticipantFailure: () => ({
    type: Types.EDIT_FAILURE,
  }),
};
