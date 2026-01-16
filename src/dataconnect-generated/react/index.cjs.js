const {
  createIdeaRef,
  listResourcesRef,
  updateUserBioRef,
  getMyIdeasRef,
  connectorConfig,
} = require("../index.cjs.js");
const { validateArgs, CallerSdkTypeEnum } = require("firebase/data-connect");
const {
  useDataConnectQuery,
  useDataConnectMutation,
  validateReactArgs,
} = require("@tanstack-query-firebase/react/data-connect");

exports.useCreateIdea = function useCreateIdea(dcOrOptions, options) {
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
};

exports.useListResources = function useListResources(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts } = validateReactArgs(
    connectorConfig,
    dcOrOptions,
    options,
  );
  const ref = listResourcesRef(dcInstance);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
};
exports.useUpdateUserBio = function useUpdateUserBio(dcOrOptions, options) {
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
};

exports.useGetMyIdeas = function useGetMyIdeas(dcOrOptions, options) {
  const { dc: dcInstance, options: inputOpts } = validateReactArgs(
    connectorConfig,
    dcOrOptions,
    options,
  );
  const ref = getMyIdeasRef(dcInstance);
  return useDataConnectQuery(ref, inputOpts, CallerSdkTypeEnum.GeneratedReact);
};
