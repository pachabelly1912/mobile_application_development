import Foundation
import ObjectMapper

struct Job: Mappable {
    var listings: [Listing]?
//    var company: Company?
//    var url: String?
    var stat: String?
    
    
    init?(map: Map) {
        
    }
    // Mappable
    mutating func mapping(map: Map) {
        listings <- map["listing"]
//        company <- map["company"]
//        url <- map["url"]
        stat <- map["stat"]
    }
}



//------

struct Listing: Mappable {
    var id: Int?
    var title: String?
    var description: String?
    var perks: String?
    var howto_apply: String?
    var type: Type?
    var company: Company?
    var apply_url: String?
    var url: String?
    
    init?(map: Map) {
        
    }
    // Mappable
    mutating func mapping(map: Map) {
        id <- map["id"]
        title <- map["title"]
        description <- map["description"]
        perks <- map["perks"]
        howto_apply <- map["howto_apply"]
        type <- map["type"]
        company <- map["company"]
        apply_url <- map["apply_url"]
        url <- map["url"]
    }
}

//------

struct Company:Mappable {
    var location:Location?
    var logo: String?
    var id: String?
    var name: String?
    var url: String?
    var type: Int?
    
    init?(map: Map) {
    }
    // Mappable
    mutating func mapping(map: Map) {
        location <- map["location"]
        logo <- map["logo"]
        id <- map["id"]
        name <- map["name"]
        url <- map["url"]
        type <- map["type"]
    }
}



//------

struct Location:Mappable {

    var id: String?
    var name: String?
    var city: String?
    var country: String?
    var lat: String?
    var lng: String?
    var state: String?
    
    init?(map: Map) {
    }
    // Mappable
    mutating func mapping(map: Map) {
        id <- map["id"]
        name <- map["name"]
        city <- map["city"]
        country <- map["country"]
        lat <- map["lat"]
        lng <- map["lng"]
        state <- map["state"]
    }
}



//------

struct Type:Mappable {
    
    var id: String?
    var name: String?
    
    init?(map: Map) {
    }
    // Mappable
    mutating func mapping(map: Map) {
        id <- map["id"]
        name <- map["name"]
    }
}

//------
//
//struct CompanyListing:Mappable {
//    var id: String?
//    var name: String?
//    var url: String?
//    var type: Int?
//
//    init?(map: Map) {
//    }
//    // Mappable
//    mutating func mapping(map: Map) {
//        id <- map["id"]
//        name <- map["name"]
//        url <- map["url"]
//        type <- map["type"]
//    }
//}
//








