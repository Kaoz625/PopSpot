const {
  queryRef,
  executeQuery,
  mutationRef,
  executeMutation,
  validateArgs,
} = require("firebase/data-connect");

const connectorConfig = {
  connector: "example",
  service: "popspot",
  location: "us-east4",
};
exports.connectorConfig = connectorConfig;

const createIdeaRef = (dcOrVars, vars) => {
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
exports.createIdeaRef = createIdeaRef;

exports.createIdea = function createIdea(dcOrVars, vars) {
  return executeMutation(createIdeaRef(dcOrVars, vars));
};

const listResourcesRef = (dc) => {
  const { dc: dcInstance } = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, "ListResources");
};
listResourcesRef.operationName = "ListResources";
exports.listResourcesRef = listResourcesRef;

exports.listResources = function listResources(dc) {
  return executeQuery(listResourcesRef(dc));
};

const updateUserBioRef = (dcOrVars, vars) => {
  const { dc: dcInstance, vars: inputVars } = validateArgs(
    connectorConfig,
    dcOrVars,
    vars,
  );
  dcInstance._useGeneratedSdk();
  return mutationRef(dcInstance, "UpdateUserBio", inputVars);
};
updateUserBioRef.operationName = "UpdateUserBio";
exports.updateUserBioRef = updateUserBioRef;

exports.updateUserBio = function updateUserBio(dcOrVars, vars) {
  return executeMutation(updateUserBioRef(dcOrVars, vars));
};

const getMyIdeasRef = (dc) => {
  const { dc: dcInstance } = validateArgs(connectorConfig, dc, undefined);
  dcInstance._useGeneratedSdk();
  return queryRef(dcInstance, "GetMyIdeas");
};
getMyIdeasRef.operationName = "GetMyIdeas";
exports.getMyIdeasRef = getMyIdeasRef;

exports.getMyIdeas = function getMyIdeas(dc) {
  return executeQuery(getMyIdeasRef(dc));
};
