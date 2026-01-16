import {
  CreateIdeaData,
  CreateIdeaVariables,
  ListResourcesData,
  UpdateUserBioData,
  UpdateUserBioVariables,
  GetMyIdeasData,
} from "../";
import {
  UseDataConnectQueryResult,
  useDataConnectQueryOptions,
  UseDataConnectMutationResult,
  useDataConnectMutationOptions,
} from "@tanstack-query-firebase/react/data-connect";
import { UseQueryResult, UseMutationResult } from "@tanstack/react-query";
import { DataConnect } from "firebase/data-connect";
import { FirebaseError } from "firebase/app";

export function useCreateIdea(
  options?: useDataConnectMutationOptions<
    CreateIdeaData,
    FirebaseError,
    CreateIdeaVariables
  >,
): UseDataConnectMutationResult<CreateIdeaData, CreateIdeaVariables>;
export function useCreateIdea(
  dc: DataConnect,
  options?: useDataConnectMutationOptions<
    CreateIdeaData,
    FirebaseError,
    CreateIdeaVariables
  >,
): UseDataConnectMutationResult<CreateIdeaData, CreateIdeaVariables>;

export function useListResources(
  options?: useDataConnectQueryOptions<ListResourcesData>,
): UseDataConnectQueryResult<ListResourcesData, undefined>;
export function useListResources(
  dc: DataConnect,
  options?: useDataConnectQueryOptions<ListResourcesData>,
): UseDataConnectQueryResult<ListResourcesData, undefined>;

export function useUpdateUserBio(
  options?: useDataConnectMutationOptions<
    UpdateUserBioData,
    FirebaseError,
    UpdateUserBioVariables | void
  >,
): UseDataConnectMutationResult<UpdateUserBioData, UpdateUserBioVariables>;
export function useUpdateUserBio(
  dc: DataConnect,
  options?: useDataConnectMutationOptions<
    UpdateUserBioData,
    FirebaseError,
    UpdateUserBioVariables | void
  >,
): UseDataConnectMutationResult<UpdateUserBioData, UpdateUserBioVariables>;

export function useGetMyIdeas(
  options?: useDataConnectQueryOptions<GetMyIdeasData>,
): UseDataConnectQueryResult<GetMyIdeasData, undefined>;
export function useGetMyIdeas(
  dc: DataConnect,
  options?: useDataConnectQueryOptions<GetMyIdeasData>,
): UseDataConnectQueryResult<GetMyIdeasData, undefined>;
