import { Utils } from 'manifesto.js';
import ActionTypes from './action-types';
import { fetchInfoResponse } from './infoResponse';

/** */
export function addAuthenticationRequest(windowId, infoId, id) {
  return {
    id,
    infoId,
    type: ActionTypes.ADD_AUTHENTICATION_REQUEST,
    windowId,
  };
}

/** */
export function resolveAuthenticationRequest(id) {
  return ((dispatch, getState) => {
    const { auth } = getState();

    dispatch(fetchAccessTokenRequest(id, auth[id].infoId));
  });
}

/**
 * requestInfoResponse - action creator
 *
 * @param  {String} infoId
 * @memberof ActionCreators
 */
export function requestAccessToken(serviceId, authId, infoIds) {
  return {
    authId,
    infoIds,
    serviceId,
    type: ActionTypes.REQUEST_ACCESS_TOKEN,
  };
}

/**
 * receiveInfoResponse - action creator
 *
 * @param  {String} infoId
 * @param  {Object} manifestJson
 * @memberof ActionCreators
 */
export function receiveAccessToken(serviceId, json) {
  return {
    json,
    serviceId,
    type: ActionTypes.RECEIVE_ACCESS_TOKEN,
  };
}

/**
 * receiveInfoResponseFailure - action creator
 *
 * @param  {String} infoId
 * @param  {String} error
 * @memberof ActionCreators
 */
export function receiveAccessTokenFailure(serviceId, error) {
  return {
    error,
    serviceId,
    type: ActionTypes.RECEIVE_ACCESS_TOKEN_FAILURE,
  };
}

/** */
export function fetchAccessTokenRequest(id, infoIds, providedServices = undefined) {
  return ((dispatch, getState) => {
    const { infoResponses } = getState();

    const infoResponse = infoResponses[infoIds[0]].json;

    const services = providedServices || Utils.getServices(infoResponse);

    const authService = services.find(e => e.id === id);

    if (!authService) return null;

    const accessTokenService = Utils.getService(authService, 'http://iiif.io/api/auth/1/token');

    dispatch(requestAccessToken(accessTokenService.id, authService.id, infoIds));
    return null;
  });
}

/** */
export function resolveAccessTokenRequest({ messageId, ...json }) {
  return ((dispatch, getState) => {
    const { authId, infoIds } = getState().accessTokens[messageId];

    dispatch({
      id: authId,
      ok: !!json.accessToken,
      type: ActionTypes.RESOLVE_AUTHENTICATION_REQUEST,
    });

    if (json.accessToken) {
      dispatch(receiveAccessToken(messageId, json));
      infoIds.forEach(imageId => dispatch(fetchInfoResponse({ imageId })));
    } else {
      dispatch(receiveAccessTokenFailure(messageId, json));
    }
  });
}
