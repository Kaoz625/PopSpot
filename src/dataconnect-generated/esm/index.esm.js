import {
  queryRef,
  executeQuery,
  mutationRef,
  executeMutation,
  validateArgs,
} from "firebase/data-connect";

export const connectorConfig = {
  connector: "example",
  service: "popspot",
  location: "us-east4",
};

export const createIdeaRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars } = validateArgs(
    connectorConfig,
    dcOrVars,
    vars,
    true,
  );
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, "CreateIdea", inputVars);
};
createIdeaRef.operationName = "CreateIdea";

export function createIdea(dcOrVars, vars) {
  return executeMutation(createIdeaRef(dcOrVars, vars));
}

export const listResourcesRef = (dc) => {
  const { dc: dcInstance } = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, "ListResources");
};
listResourcesRef.operationName = "ListResources";

export function listResources(dc) {
  return executeQuery(listResourcesRef(dc));
}

export const updateUserBioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars } = validateArgs(
    connectorConfig,
    dcOrVars,
    vars,
  );
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, "UpdateUserBio", inputVars);
};
updateUserBioRef.operationName = "UpdateUserBio";

export function updateUserBio(dcOrVars, vars) {
  return executeMutation(updateUserBioRef(dcOrVars, vars));
}

export const getMyIdeasRef = (dc) => {
  const { dc: dcInstance } = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, "GetMyIdeas");
};
getMyIdeasRef.operationName = "GetMyIdeas";

export function getMyIdeas(dc) {
  return executeQuery(getMyIdeasRef(dc));
}
