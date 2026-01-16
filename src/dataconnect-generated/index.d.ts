import {
  ConnectorConfig,
  DataConnect,
  QueryRef,
  QueryPromise,
  MutationRef,
  MutationPromise,
} from "firebase/data-connect";

export const connectorConfig: ConnectorConfig;

export type TimestampString = string;
export type UUIDString = string;
export type Int64String = string;
export type DateString = string;

export interface CreateIdeaData {
  idea_insert: Idea_Key;
}

export interface CreateIdeaVariables {
  title: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModelCanvas?: string | null;
  competitorAnalysis?: string | null;
  initialFinancials?: string | null;
}

export interface GetMyIdeasData {
  ideas: ({
    id: UUIDString;
    title: string;
    problem: string;
    solution: string;
    targetMarket: string;
  } & Idea_Key)[];
}

export interface Idea_Key {
  id: UUIDString;
  __typename?: "Idea_Key";
}

export interface Investor_Key {
  id: UUIDString;
  __typename?: "Investor_Key";
}

export interface ListResourcesData {
  resources: ({
    id: UUIDString;
    title: string;
    description?: string | null;
    url: string;
    type: string;
    tags?: string[] | null;
  } & Resource_Key)[];
}

export interface Mentor_Key {
  id: UUIDString;
  __typename?: "Mentor_Key";
}

export interface Resource_Key {
  id: UUIDString;
  __typename?: "Resource_Key";
}

export interface UpdateUserBioData {
  user_update?: User_Key | null;
}

export interface UpdateUserBioVariables {
  bio?: string | null;
}

export interface User_Key {
  id: UUIDString;
  __typename?: "User_Key";
}

interface CreateIdeaRef {
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateIdeaVariables): MutationRef<CreateIdeaData, CreateIdeaVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (
    dc: DataConnect,
    vars: CreateIdeaVariables,
  ): MutationRef<CreateIdeaData, CreateIdeaVariables>;
  operationName: string;
}
export const createIdeaRef: CreateIdeaRef;

export function createIdea(
  vars: CreateIdeaVariables,
): MutationPromise<CreateIdeaData, CreateIdeaVariables>;
export function createIdea(
  dc: DataConnect,
  vars: CreateIdeaVariables,
): MutationPromise<CreateIdeaData, CreateIdeaVariables>;

interface ListResourcesRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListResourcesData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<ListResourcesData, undefined>;
  operationName: string;
}
export const listResourcesRef: ListResourcesRef;

export function listResources(): QueryPromise<ListResourcesData, undefined>;
export function listResources(
  dc: DataConnect,
): QueryPromise<ListResourcesData, undefined>;

interface UpdateUserBioRef {
  /* Allow users to create refs without passing in DataConnect */
  (
    vars?: UpdateUserBioVariables,
  ): MutationRef<UpdateUserBioData, UpdateUserBioVariables>;
  /* Allow users to pass in custom DataConnect instances */
  (
    dc: DataConnect,
    vars?: UpdateUserBioVariables,
  ): MutationRef<UpdateUserBioData, UpdateUserBioVariables>;
  operationName: string;
}
export const updateUserBioRef: UpdateUserBioRef;

export function updateUserBio(
  vars?: UpdateUserBioVariables,
): MutationPromise<UpdateUserBioData, UpdateUserBioVariables>;
export function updateUserBio(
  dc: DataConnect,
  vars?: UpdateUserBioVariables,
): MutationPromise<UpdateUserBioData, UpdateUserBioVariables>;

interface GetMyIdeasRef {
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyIdeasData, undefined>;
  /* Allow users to pass in custom DataConnect instances */
  (dc: DataConnect): QueryRef<GetMyIdeasData, undefined>;
  operationName: string;
}
export const getMyIdeasRef: GetMyIdeasRef;

export function getMyIdeas(): QueryPromise<GetMyIdeasData, undefined>;
export function getMyIdeas(
  dc: DataConnect,
): QueryPromise<GetMyIdeasData, undefined>;
