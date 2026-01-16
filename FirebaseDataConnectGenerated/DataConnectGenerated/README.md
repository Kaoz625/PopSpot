This Swift package contains the generated Swift code for the connector `example`.

You can use this package by adding it as a local Swift package dependency in your project.

# Accessing the connector

Add the necessary imports

```
import FirebaseDataConnect
import DataConnectGenerated

```

The connector can be accessed using the following code:

```
let connector = DataConnect.exampleConnector

```


## Connecting to the local Emulator
By default, the connector will connect to the production service.

To connect to the emulator, you can use the following code, which can be called from the `init` function of your SwiftUI app

```
connector.useEmulator()
```

# Queries

## ListResourcesQuery


### Using the Query Reference
```
struct MyView: View {
   var listResourcesQueryRef = DataConnect.exampleConnector.listResourcesQuery.ref(...)

  var body: some View {
    VStack {
      if let data = listResourcesQueryRef.data {
        // use data in View
      }
      else {
        Text("Loading...")
      }
    }
    .task {
        do {
          let _ = try await listResourcesQueryRef.execute()
        } catch {
        }
      }
  }
}
```

### One-shot execute
```
DataConnect.exampleConnector.listResourcesQuery.execute(...)
```


## GetMyIdeasQuery


### Using the Query Reference
```
struct MyView: View {
   var getMyIdeasQueryRef = DataConnect.exampleConnector.getMyIdeasQuery.ref(...)

  var body: some View {
    VStack {
      if let data = getMyIdeasQueryRef.data {
        // use data in View
      }
      else {
        Text("Loading...")
      }
    }
    .task {
        do {
          let _ = try await getMyIdeasQueryRef.execute()
        } catch {
        }
      }
  }
}
```

### One-shot execute
```
DataConnect.exampleConnector.getMyIdeasQuery.execute(...)
```


# Mutations
## CreateIdeaMutation

### Variables

#### Required
```swift

let title: String = ...
let problem: String = ...
let solution: String = ...
let targetMarket: String = ...
```
 

#### Optional
```swift

let businessModelCanvas: String = ...
let competitorAnalysis: String = ...
let initialFinancials: String = ...
```

### One-shot execute
```
DataConnect.exampleConnector.createIdeaMutation.execute(...)
```

## UpdateUserBioMutation

### Variables
 

#### Optional
```swift

let bio: String = ...
```

### One-shot execute
```
DataConnect.exampleConnector.updateUserBioMutation.execute(...)
```

