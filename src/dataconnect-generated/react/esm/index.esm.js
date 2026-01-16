import {
  createIdeaRef,
  listResourcesRef,
  updateUserBioRef,
  getMyIdeasRef,
  connectorConfig,
} from "../../esm/index.esm.js";
import { validateArgs, CallerSdkTypeEnum } from "firebase/data-connect";
import {
  useDataConnectQuery,
  useDataConnectMutation,
  validateReactArgs,
} from "@tanstack-query-firebase/react/data-connect";

export function useCreateIdea(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(
    connectorConfig,
    dcOrOptions,
    options,
  );
  function refFactory(vars) {
    return createIdeaRef(dcInstance, vars);
  }
  return useDataConnectMutation(
    refFactory,
    inputOpts,
    CallerSdkTypeEnum.GeneratedReact,
  );
}

export function useListResources(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts } = validateReactArgs(
    connectorConfig,
    dcOrOptions,
    options,
  );
  const ref = listResourcesRef(dcInstance);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}
export function useUpdateUserBio(dcOrOptions, options) {
  const { dc: dcInstance, vars: inputOpts } = validateArgs(
    connectorConfig,
    dcOrOptions,
    options,
  );
  function refFactory(vars) {
    return updateUserBioRef(dcInstance, vars);
  }
  return useDataConnectMutation(
    refFactory,
    inputOpts,
    CallerSdkTypeEnum.GeneratedReact,
  );
}

export function useGetMyIdeas(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts } = validateReactArgs(
    connectorConfig,
    dcOrOptions,
    options,
  );
  const ref = getMyIdeasRef(dcInstance);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
}
