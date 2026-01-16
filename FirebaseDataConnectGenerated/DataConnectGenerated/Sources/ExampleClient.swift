
import Foundation

import FirebaseCore
import FirebaseDataConnect
public extension DataConnect {

  static let exampleConnector: ExampleConnector = {
    let dc = DataConnect.dataConnect(connectorConfig: ExampleConnector.connectorConfig, callerSDKType: .generated)
    return ExampleConnector(dataConnect: dc)
  }()

}

public class ExampleConnector {

  let dataConnect: DataConnect

  public static let connectorConfig = ConnectorConfig(serviceId: "popspot", location: "us-east4", connector: "example")

  init(dataConnect: DataConnect) {
    self.dataConnect = dataConnect

    // init operations 
    self.createIdeaMutation = CreateIdeaMutation(dataConnect: dataConnect)
    self.listResourcesQuery = ListResourcesQuery(dataConnect: dataConnect)
    self.updateUserBioMutation = UpdateUserBioMutation(dataConnect: dataConnect)
    self.getMyIdeasQuery = GetMyIdeasQuery(dataConnect: dataConnect)
    
  }

  public func useEmulator(host: String = DataConnect.EmulatorDefaults.host, port: Int = DataConnect.EmulatorDefaults.port) {
    self.dataConnect.useEmulator(host: host, port: port)
  }

  // MARK: Operations
public let createIdeaMutation: CreateIdeaMutation
public let listResourcesQuery: ListResourcesQuery
public let updateUserBioMutation: UpdateUserBioMutation
public let getMyIdeasQuery: GetMyIdeasQuery


}
