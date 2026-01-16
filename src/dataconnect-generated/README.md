# Generated TypeScript README
This README will guide you through the process of using the generated JavaScript SDK package for the connector `example`. It will also provide examples on how to use your generated SDK to call your Data Connect queries and mutations.

**If you're looking for the `React README`, you can find it at [`dataconnect-generated/react/README.md`](./react/README.md)**

***NOTE:** This README is generated alongside the generated SDK. If you make changes to this file, they will be overwritten when the SDK is regenerated.*

# Table of Contents
- [**Overview**](#generated-javascript-readme)
- [**Accessing the connector**](#accessing-the-connector)
  - [*Connecting to the local Emulator*](#connecting-to-the-local-emulator)
- [**Queries**](#queries)
  - [*ListResources*](#listresources)
  - [*GetMyIdeas*](#getmyideas)
- [**Mutations**](#mutations)
  - [*CreateIdea*](#createidea)
  - [*UpdateUserBio*](#updateuserbio)

# Accessing the connector
A connector is a collection of Queries and Mutations. One SDK is generated for each connector - this SDK is generated for the connector `example`. You can find more information about connectors in the [Data Connect documentation](https://firebase.google.com/docs/data-connect#how-does).

You can use this generated SDK by importing from the package `@dataconnect/generated` as shown below. Both CommonJS and ESM imports are supported.

You can also follow the instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#set-client).

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
```

## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code.
You can also follow the emulator instructions from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#instrument-clients).

```typescript
import { connectDataConnectEmulator, getDataConnect } from 'firebase/data-connect';
import { connectorConfig } from '@dataconnect/generated';

const dataConnect = getDataConnect(connectorConfig);
connectDataConnectEmulator(dataConnect, 'localhost', 9399);
```

After it's initialized, you can call your Data Connect [queries](#queries) and [mutations](#mutations) from your generated SDK.

# Queries

There are two ways to execute a Data Connect Query using the generated Web SDK:
- Using a Query Reference function, which returns a `QueryRef`
  - The `QueryRef` can be used as an argument to `executeQuery()`, which will execute the Query and return a `QueryPromise`
- Using an action shortcut function, which returns a `QueryPromise`
  - Calling the action shortcut function will execute the Query and return a `QueryPromise`

The following is true for both the action shortcut function and the `QueryRef` function:
- The `QueryPromise` returned will resolve to the result of the Query once it has finished executing
- If the Query accepts arguments, both the action shortcut function and the `QueryRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Query
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each query. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-queries).

## ListResources
You can execute the `ListResources` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
listResources(): QueryPromise<ListResourcesData, undefined>;

interface ListResourcesRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<ListResourcesData, undefined>;
}
export const listResourcesRef: ListResourcesRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
listResources(dc: DataConnect): QueryPromise<ListResourcesData, undefined>;

interface ListResourcesRef {
  ...
  (dc: DataConnect): QueryRef<ListResourcesData, undefined>;
}
export const listResourcesRef: ListResourcesRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the listResourcesRef:
```typescript
const name = listResourcesRef.operationName;
console.log(name);
```

### Variables
The `ListResources` query has no variables.
### Return Type
Recall that executing the `ListResources` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `ListResourcesData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
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
```
### Using `ListResources`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, listResources } from '@dataconnect/generated';


// Call the `listResources()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await listResources();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await listResources(dataConnect);

console.log(data.resources);

// Or, you can use the `Promise` API.
listResources().then((response) => {
  const data = response.data;
  console.log(data.resources);
});
```

### Using `ListResources`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, listResourcesRef } from '@dataconnect/generated';


// Call the `listResourcesRef()` function to get a reference to the query.
const ref = listResourcesRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = listResourcesRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.resources);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.resources);
});
```

## GetMyIdeas
You can execute the `GetMyIdeas` query using the following action shortcut function, or by calling `executeQuery()` after calling the following `QueryRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
getMyIdeas(): QueryPromise<GetMyIdeasData, undefined>;

interface GetMyIdeasRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (): QueryRef<GetMyIdeasData, undefined>;
}
export const getMyIdeasRef: GetMyIdeasRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `QueryRef` function.
```typescript
getMyIdeas(dc: DataConnect): QueryPromise<GetMyIdeasData, undefined>;

interface GetMyIdeasRef {
  ...
  (dc: DataConnect): QueryRef<GetMyIdeasData, undefined>;
}
export const getMyIdeasRef: GetMyIdeasRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the getMyIdeasRef:
```typescript
const name = getMyIdeasRef.operationName;
console.log(name);
```

### Variables
The `GetMyIdeas` query has no variables.
### Return Type
Recall that executing the `GetMyIdeas` query returns a `QueryPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `GetMyIdeasData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface GetMyIdeasData {
  ideas: ({
    id: UUIDString;
    title: string;
    problem: string;
    solution: string;
    targetMarket: string;
  } & Idea_Key)[];
}
```
### Using `GetMyIdeas`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, getMyIdeas } from '@dataconnect/generated';


// Call the `getMyIdeas()` function to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await getMyIdeas();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await getMyIdeas(dataConnect);

console.log(data.ideas);

// Or, you can use the `Promise` API.
getMyIdeas().then((response) => {
  const data = response.data;
  console.log(data.ideas);
});
```

### Using `GetMyIdeas`'s `QueryRef` function

```typescript
import { getDataConnect, executeQuery } from 'firebase/data-connect';
import { connectorConfig, getMyIdeasRef } from '@dataconnect/generated';


// Call the `getMyIdeasRef()` function to get a reference to the query.
const ref = getMyIdeasRef();

// You can also pass in a `DataConnect` instance to the `QueryRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = getMyIdeasRef(dataConnect);

// Call `executeQuery()` on the reference to execute the query.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeQuery(ref);

console.log(data.ideas);

// Or, you can use the `Promise` API.
executeQuery(ref).then((response) => {
  const data = response.data;
  console.log(data.ideas);
});
```

# Mutations

There are two ways to execute a Data Connect Mutation using the generated Web SDK:
- Using a Mutation Reference function, which returns a `MutationRef`
  - The `MutationRef` can be used as an argument to `executeMutation()`, which will execute the Mutation and return a `MutationPromise`
- Using an action shortcut function, which returns a `MutationPromise`
  - Calling the action shortcut function will execute the Mutation and return a `MutationPromise`

The following is true for both the action shortcut function and the `MutationRef` function:
- The `MutationPromise` returned will resolve to the result of the Mutation once it has finished executing
- If the Mutation accepts arguments, both the action shortcut function and the `MutationRef` function accept a single argument: an object that contains all the required variables (and the optional variables) for the Mutation
- Both functions can be called with or without passing in a `DataConnect` instance as an argument. If no `DataConnect` argument is passed in, then the generated SDK will call `getDataConnect(connectorConfig)` behind the scenes for you.

Below are examples of how to use the `example` connector's generated functions to execute each mutation. You can also follow the examples from the [Data Connect documentation](https://firebase.google.com/docs/data-connect/web-sdk#using-mutations).

## CreateIdea
You can execute the `CreateIdea` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
createIdea(vars: CreateIdeaVariables): MutationPromise<CreateIdeaData, CreateIdeaVariables>;

interface CreateIdeaRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars: CreateIdeaVariables): MutationRef<CreateIdeaData, CreateIdeaVariables>;
}
export const createIdeaRef: CreateIdeaRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
createIdea(dc: DataConnect, vars: CreateIdeaVariables): MutationPromise<CreateIdeaData, CreateIdeaVariables>;

interface CreateIdeaRef {
  ...
  (dc: DataConnect, vars: CreateIdeaVariables): MutationRef<CreateIdeaData, CreateIdeaVariables>;
}
export const createIdeaRef: CreateIdeaRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the createIdeaRef:
```typescript
const name = createIdeaRef.operationName;
console.log(name);
```

### Variables
The `CreateIdea` mutation requires an argument of type `CreateIdeaVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface CreateIdeaVariables {
  title: string;
  problem: string;
  solution: string;
  targetMarket: string;
  businessModelCanvas?: string | null;
  competitorAnalysis?: string | null;
  initialFinancials?: string | null;
}
```
### Return Type
Recall that executing the `CreateIdea` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `CreateIdeaData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface CreateIdeaData {
  idea_insert: Idea_Key;
}
```
### Using `CreateIdea`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, createIdea, CreateIdeaVariables } from '@dataconnect/generated';

// The `CreateIdea` mutation requires an argument of type `CreateIdeaVariables`:
const createIdeaVars: CreateIdeaVariables = {
  title: ..., 
  problem: ..., 
  solution: ..., 
  targetMarket: ..., 
  businessModelCanvas: ..., // optional
  competitorAnalysis: ..., // optional
  initialFinancials: ..., // optional
};

// Call the `createIdea()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await createIdea(createIdeaVars);
// Variables can be defined inline as well.
const { data } = await createIdea({ title: ..., problem: ..., solution: ..., targetMarket: ..., businessModelCanvas: ..., competitorAnalysis: ..., initialFinancials: ..., });

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await createIdea(dataConnect, createIdeaVars);

console.log(data.idea_insert);

// Or, you can use the `Promise` API.
createIdea(createIdeaVars).then((response) => {
  const data = response.data;
  console.log(data.idea_insert);
});
```

### Using `CreateIdea`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, createIdeaRef, CreateIdeaVariables } from '@dataconnect/generated';

// The `CreateIdea` mutation requires an argument of type `CreateIdeaVariables`:
const createIdeaVars: CreateIdeaVariables = {
  title: ..., 
  problem: ..., 
  solution: ..., 
  targetMarket: ..., 
  businessModelCanvas: ..., // optional
  competitorAnalysis: ..., // optional
  initialFinancials: ..., // optional
};

// Call the `createIdeaRef()` function to get a reference to the mutation.
const ref = createIdeaRef(createIdeaVars);
// Variables can be defined inline as well.
const ref = createIdeaRef({ title: ..., problem: ..., solution: ..., targetMarket: ..., businessModelCanvas: ..., competitorAnalysis: ..., initialFinancials: ..., });

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = createIdeaRef(dataConnect, createIdeaVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.idea_insert);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.idea_insert);
});
```

## UpdateUserBio
You can execute the `UpdateUserBio` mutation using the following action shortcut function, or by calling `executeMutation()` after calling the following `MutationRef` function, both of which are defined in [dataconnect-generated/index.d.ts](./index.d.ts):
```typescript
updateUserBio(vars?: UpdateUserBioVariables): MutationPromise<UpdateUserBioData, UpdateUserBioVariables>;

interface UpdateUserBioRef {
  ...
  /* Allow users to create refs without passing in DataConnect */
  (vars?: UpdateUserBioVariables): MutationRef<UpdateUserBioData, UpdateUserBioVariables>;
}
export const updateUserBioRef: UpdateUserBioRef;
```
You can also pass in a `DataConnect` instance to the action shortcut function or `MutationRef` function.
```typescript
updateUserBio(dc: DataConnect, vars?: UpdateUserBioVariables): MutationPromise<UpdateUserBioData, UpdateUserBioVariables>;

interface UpdateUserBioRef {
  ...
  (dc: DataConnect, vars?: UpdateUserBioVariables): MutationRef<UpdateUserBioData, UpdateUserBioVariables>;
}
export const updateUserBioRef: UpdateUserBioRef;
```

If you need the name of the operation without creating a ref, you can retrieve the operation name by calling the `operationName` property on the updateUserBioRef:
```typescript
const name = updateUserBioRef.operationName;
console.log(name);
```

### Variables
The `UpdateUserBio` mutation has an optional argument of type `UpdateUserBioVariables`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:

```typescript
export interface UpdateUserBioVariables {
  bio?: string | null;
}
```
### Return Type
Recall that executing the `UpdateUserBio` mutation returns a `MutationPromise` that resolves to an object with a `data` property.

The `data` property is an object of type `UpdateUserBioData`, which is defined in [dataconnect-generated/index.d.ts](./index.d.ts). It has the following fields:
```typescript
export interface UpdateUserBioData {
  user_update?: User_Key | null;
}
```
### Using `UpdateUserBio`'s action shortcut function

```typescript
import { getDataConnect } from 'firebase/data-connect';
import { connectorConfig, updateUserBio, UpdateUserBioVariables } from '@dataconnect/generated';

// The `UpdateUserBio` mutation has an optional argument of type `UpdateUserBioVariables`:
const updateUserBioVars: UpdateUserBioVariables = {
  bio: ..., // optional
};

// Call the `updateUserBio()` function to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await updateUserBio(updateUserBioVars);
// Variables can be defined inline as well.
const { data } = await updateUserBio({ bio: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserBioVariables` argument.
const { data } = await updateUserBio();

// You can also pass in a `DataConnect` instance to the action shortcut function.
const dataConnect = getDataConnect(connectorConfig);
const { data } = await updateUserBio(dataConnect, updateUserBioVars);

console.log(data.user_update);

// Or, you can use the `Promise` API.
updateUserBio(updateUserBioVars).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

### Using `UpdateUserBio`'s `MutationRef` function

```typescript
import { getDataConnect, executeMutation } from 'firebase/data-connect';
import { connectorConfig, updateUserBioRef, UpdateUserBioVariables } from '@dataconnect/generated';

// The `UpdateUserBio` mutation has an optional argument of type `UpdateUserBioVariables`:
const updateUserBioVars: UpdateUserBioVariables = {
  bio: ..., // optional
};

// Call the `updateUserBioRef()` function to get a reference to the mutation.
const ref = updateUserBioRef(updateUserBioVars);
// Variables can be defined inline as well.
const ref = updateUserBioRef({ bio: ..., });
// Since all variables are optional for this mutation, you can omit the `UpdateUserBioVariables` argument.
const ref = updateUserBioRef();

// You can also pass in a `DataConnect` instance to the `MutationRef` function.
const dataConnect = getDataConnect(connectorConfig);
const ref = updateUserBioRef(dataConnect, updateUserBioVars);

// Call `executeMutation()` on the reference to execute the mutation.
// You can use the `await` keyword to wait for the promise to resolve.
const { data } = await executeMutation(ref);

console.log(data.user_update);

// Or, you can use the `Promise` API.
executeMutation(ref).then((response) => {
  const data = response.data;
  console.log(data.user_update);
});
```

