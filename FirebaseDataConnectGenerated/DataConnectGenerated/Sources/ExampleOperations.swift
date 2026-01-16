import Foundation

import FirebaseCore
import FirebaseDataConnect




















// MARK: Common Enums

public enum OrderDirection: String, Codable, Sendable {
  case ASC = "ASC"
  case DESC = "DESC"
  }

public enum SearchQueryFormat: String, Codable, Sendable {
  case QUERY = "QUERY"
  case PLAIN = "PLAIN"
  case PHRASE = "PHRASE"
  case ADVANCED = "ADVANCED"
  }


// MARK: Connector Enums

// End enum definitions









public class CreateIdeaMutation{

  let dataConnect: DataConnect

  init(dataConnect: DataConnect) {
    self.dataConnect = dataConnect
  }

  public static let OperationName = "CreateIdea"

  public typealias Ref = MutationRef<CreateIdeaMutation.Data,CreateIdeaMutation.Variables>

  public struct Variables: OperationVariable {
  
        
        public var
title: String

  
        
        public var
problem: String

  
        
        public var
solution: String

  
        
        public var
targetMarket: String

  
        @OptionalVariable
        public var
businessModelCanvas: String?

  
        @OptionalVariable
        public var
competitorAnalysis: String?

  
        @OptionalVariable
        public var
initialFinancials: String?


    
    
    
    public init (
        
title: String
,
        
problem: String
,
        
solution: String
,
        
targetMarket: String

        
        
        ,
        _ optionalVars: ((inout Variables)->())? = nil
        ) {
        self.title = title
        self.problem = problem
        self.solution = solution
        self.targetMarket = targetMarket
        

        
        if let optionalVars {
            optionalVars(&self)
        }
        
    }

    public static func == (lhs: Variables, rhs: Variables) -> Bool {
      
        return lhs.title == rhs.title && 
              lhs.problem == rhs.problem && 
              lhs.solution == rhs.solution && 
              lhs.targetMarket == rhs.targetMarket && 
              lhs.businessModelCanvas == rhs.businessModelCanvas && 
              lhs.competitorAnalysis == rhs.competitorAnalysis && 
              lhs.initialFinancials == rhs.initialFinancials
              
    }

    
public func hash(into hasher: inout Hasher) {
  
  hasher.combine(title)
  
  hasher.combine(problem)
  
  hasher.combine(solution)
  
  hasher.combine(targetMarket)
  
  hasher.combine(businessModelCanvas)
  
  hasher.combine(competitorAnalysis)
  
  hasher.combine(initialFinancials)
  
}

    enum CodingKeys: String, CodingKey {
      
      case title
      
      case problem
      
      case solution
      
      case targetMarket
      
      case businessModelCanvas
      
      case competitorAnalysis
      
      case initialFinancials
      
    }

    public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      
      try codecHelper.encode(title, forKey: .title, container: &container)
      
      
      
      try codecHelper.encode(problem, forKey: .problem, container: &container)
      
      
      
      try codecHelper.encode(solution, forKey: .solution, container: &container)
      
      
      
      try codecHelper.encode(targetMarket, forKey: .targetMarket, container: &container)
      
      
      if $businessModelCanvas.isSet { 
      try codecHelper.encode(businessModelCanvas, forKey: .businessModelCanvas, container: &container)
      }
      
      if $competitorAnalysis.isSet { 
      try codecHelper.encode(competitorAnalysis, forKey: .competitorAnalysis, container: &container)
      }
      
      if $initialFinancials.isSet { 
      try codecHelper.encode(initialFinancials, forKey: .initialFinancials, container: &container)
      }
      
    }

  }

  public struct Data: Decodable, Sendable {



public var 
idea_insert: IdeaKey

  }

  public func ref(
        
title: String
,
problem: String
,
solution: String
,
targetMarket: String

        
        ,
        _ optionalVars: ((inout CreateIdeaMutation.Variables)->())? = nil
        ) -> MutationRef<CreateIdeaMutation.Data,CreateIdeaMutation.Variables>  {
        var variables = CreateIdeaMutation.Variables(title:title,problem:problem,solution:solution,targetMarket:targetMarket)
        
        if let optionalVars {
            optionalVars(&variables)
        }
        

        let ref = dataConnect.mutation(name: "CreateIdea", variables: variables, resultsDataType:CreateIdeaMutation.Data.self)
        return ref as MutationRef<CreateIdeaMutation.Data,CreateIdeaMutation.Variables>
   }

  @MainActor
   public func execute(
        
title: String
,
problem: String
,
solution: String
,
targetMarket: String

        
        ,
        _ optionalVars: (@MainActor (inout CreateIdeaMutation.Variables)->())? = nil
        ) async throws -> OperationResult<CreateIdeaMutation.Data> {
        var variables = CreateIdeaMutation.Variables(title:title,problem:problem,solution:solution,targetMarket:targetMarket)
        
        if let optionalVars {
            optionalVars(&variables)
        }
        
        
        let ref = dataConnect.mutation(name: "CreateIdea", variables: variables, resultsDataType:CreateIdeaMutation.Data.self)
        
        return try await ref.execute()
        
   }
}






public class ListResourcesQuery{

  let dataConnect: DataConnect

  init(dataConnect: DataConnect) {
    self.dataConnect = dataConnect
  }

  public static let OperationName = "ListResources"

  public typealias Ref = QueryRefObservation<ListResourcesQuery.Data,ListResourcesQuery.Variables>

  public struct Variables: OperationVariable {

    
    
  }

  public struct Data: Decodable, Sendable {




public struct Resource: Decodable, Sendable ,Hashable, Equatable, Identifiable {
  


public var 
id: UUID



public var 
title: String



public var 
description: String?



public var 
url: String



public var 
type: String



public var 
tags: [String]?


  
  public var resourceKey: ResourceKey {
    return ResourceKey(
      
      id: id
    )
  }

  
public func hash(into hasher: inout Hasher) {
  
  hasher.combine(id)
  
}
public static func == (lhs: Resource, rhs: Resource) -> Bool {
    
    return lhs.id == rhs.id 
        
  }

  

  
  enum CodingKeys: String, CodingKey {
    
    case id
    
    case title
    
    case description
    
    case url
    
    case type
    
    case tags
    
  }

  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    
    self.id = try codecHelper.decode(UUID.self, forKey: .id, container: &container)
    
    
    
    self.title = try codecHelper.decode(String.self, forKey: .title, container: &container)
    
    
    
    self.description = try codecHelper.decode(String?.self, forKey: .description, container: &container)
    
    
    
    self.url = try codecHelper.decode(String.self, forKey: .url, container: &container)
    
    
    
    self.type = try codecHelper.decode(String.self, forKey: .type, container: &container)
    
    
    self.tags = try codecHelper.decode([String]?.self, forKey: .tags, container: &container)
    
    
  }
}
public var 
resources: [Resource]

  }

  public func ref(
        
        ) -> QueryRefObservation<ListResourcesQuery.Data,ListResourcesQuery.Variables>  {
        var variables = ListResourcesQuery.Variables()
        

        let ref = dataConnect.query(name: "ListResources", variables: variables, resultsDataType:ListResourcesQuery.Data.self, publisher: .observableMacro)
        return ref as! QueryRefObservation<ListResourcesQuery.Data,ListResourcesQuery.Variables>
   }

  @MainActor
   public func execute(
        
        ) async throws -> OperationResult<ListResourcesQuery.Data> {
        var variables = ListResourcesQuery.Variables()
        
        
        let ref = dataConnect.query(name: "ListResources", variables: variables, resultsDataType:ListResourcesQuery.Data.self, publisher: .observableMacro)
        
        let refCast = ref as! QueryRefObservation<ListResourcesQuery.Data,ListResourcesQuery.Variables>
        return try await refCast.execute()
        
   }
}






public class UpdateUserBioMutation{

  let dataConnect: DataConnect

  init(dataConnect: DataConnect) {
    self.dataConnect = dataConnect
  }

  public static let OperationName = "UpdateUserBio"

  public typealias Ref = MutationRef<UpdateUserBioMutation.Data,UpdateUserBioMutation.Variables>

  public struct Variables: OperationVariable {
  
        @OptionalVariable
        public var
bio: String?


    
    
    
    public init (
        
        
        
        _ optionalVars: ((inout Variables)->())? = nil
        ) {
        

        
        if let optionalVars {
            optionalVars(&self)
        }
        
    }

    public static func == (lhs: Variables, rhs: Variables) -> Bool {
      
        return lhs.bio == rhs.bio
              
    }

    
public func hash(into hasher: inout Hasher) {
  
  hasher.combine(bio)
  
}

    enum CodingKeys: String, CodingKey {
      
      case bio
      
    }

    public func encode(to encoder: Encoder) throws {
      var container = encoder.container(keyedBy: CodingKeys.self)
      let codecHelper = CodecHelper<CodingKeys>()
      
      if $bio.isSet { 
      try codecHelper.encode(bio, forKey: .bio, container: &container)
      }
      
    }

  }

  public struct Data: Decodable, Sendable {



public var 
user_update: UserKey?

  }

  public func ref(
        
        
        
        _ optionalVars: ((inout UpdateUserBioMutation.Variables)->())? = nil
        ) -> MutationRef<UpdateUserBioMutation.Data,UpdateUserBioMutation.Variables>  {
        var variables = UpdateUserBioMutation.Variables()
        
        if let optionalVars {
            optionalVars(&variables)
        }
        

        let ref = dataConnect.mutation(name: "UpdateUserBio", variables: variables, resultsDataType:UpdateUserBioMutation.Data.self)
        return ref as MutationRef<UpdateUserBioMutation.Data,UpdateUserBioMutation.Variables>
   }

  @MainActor
   public func execute(
        
        
        
        _ optionalVars: (@MainActor (inout UpdateUserBioMutation.Variables)->())? = nil
        ) async throws -> OperationResult<UpdateUserBioMutation.Data> {
        var variables = UpdateUserBioMutation.Variables()
        
        if let optionalVars {
            optionalVars(&variables)
        }
        
        
        let ref = dataConnect.mutation(name: "UpdateUserBio", variables: variables, resultsDataType:UpdateUserBioMutation.Data.self)
        
        return try await ref.execute()
        
   }
}






public class GetMyIdeasQuery{

  let dataConnect: DataConnect

  init(dataConnect: DataConnect) {
    self.dataConnect = dataConnect
  }

  public static let OperationName = "GetMyIdeas"

  public typealias Ref = QueryRefObservation<GetMyIdeasQuery.Data,GetMyIdeasQuery.Variables>

  public struct Variables: OperationVariable {

    
    
  }

  public struct Data: Decodable, Sendable {




public struct Idea: Decodable, Sendable ,Hashable, Equatable, Identifiable {
  


public var 
id: UUID



public var 
title: String



public var 
problem: String



public var 
solution: String



public var 
targetMarket: String


  
  public var ideaKey: IdeaKey {
    return IdeaKey(
      
      id: id
    )
  }

  
public func hash(into hasher: inout Hasher) {
  
  hasher.combine(id)
  
}
public static func == (lhs: Idea, rhs: Idea) -> Bool {
    
    return lhs.id == rhs.id 
        
  }

  

  
  enum CodingKeys: String, CodingKey {
    
    case id
    
    case title
    
    case problem
    
    case solution
    
    case targetMarket
    
  }

  public init(from decoder: any Decoder) throws {
    var container = try decoder.container(keyedBy: CodingKeys.self)
    let codecHelper = CodecHelper<CodingKeys>()

    
    
    self.id = try codecHelper.decode(UUID.self, forKey: .id, container: &container)
    
    
    
    self.title = try codecHelper.decode(String.self, forKey: .title, container: &container)
    
    
    
    self.problem = try codecHelper.decode(String.self, forKey: .problem, container: &container)
    
    
    
    self.solution = try codecHelper.decode(String.self, forKey: .solution, container: &container)
    
    
    
    self.targetMarket = try codecHelper.decode(String.self, forKey: .targetMarket, container: &container)
    
    
  }
}
public var 
ideas: [Idea]

  }

  public func ref(
        
        ) -> QueryRefObservation<GetMyIdeasQuery.Data,GetMyIdeasQuery.Variables>  {
        var variables = GetMyIdeasQuery.Variables()
        

        let ref = dataConnect.query(name: "GetMyIdeas", variables: variables, resultsDataType:GetMyIdeasQuery.Data.self, publisher: .observableMacro)
        return ref as! QueryRefObservation<GetMyIdeasQuery.Data,GetMyIdeasQuery.Variables>
   }

  @MainActor
   public func execute(
        
        ) async throws -> OperationResult<GetMyIdeasQuery.Data> {
        var variables = GetMyIdeasQuery.Variables()
        
        
        let ref = dataConnect.query(name: "GetMyIdeas", variables: variables, resultsDataType:GetMyIdeasQuery.Data.self, publisher: .observableMacro)
        
        let refCast = ref as! QueryRefObservation<GetMyIdeasQuery.Data,GetMyIdeasQuery.Variables>
        return try await refCast.execute()
        
   }
}


