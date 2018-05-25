//
//  BaseAPI.swift
//  Music App
//
//  Created by Edward Nguyen on 4/23/17.
//  Copyright © 2017 com.app.music. All rights reserved.
//

import Foundation
import Alamofire
import SwiftyJSON
import ObjectMapper

typealias APIMethod = Alamofire.HTTPMethod


struct APIHandler {
    typealias Success = (_ data: JSON) -> Void
    typealias ErrorBlock = ((_ message: String)->Void)
    
    static func toSuccess<T: Mappable>(data: JSON, _: T.Type) -> [T] {
        let mapper = Mapper<T>()
        let arr: [T] = mapper.mapArray(JSONObject: data.arrayObject) ?? []
        return arr
    }
    
    static func toSuccess<T: Mappable>(data: JSON, _: T.Type) -> T? {
        let mapper = Mapper<T>()
        let obj: T? = mapper.map(JSONObject: data.dictionaryObject)
        return obj
    }
}

public class BaseAPI: NSObject {
    class func handleUrl(_ path: String) -> String {
        var _path = path
        if (!path.hasPrefix("/")) {
            _path = "\(path)"
        }
        
        return "\(APIURL.baseURL)\(_path)"
    }
    
    
    class func baseAPI( path: String, method: HTTPMethod, body: [String : AnyObject]? = nil, header: [String : String]? = nil, success: APIHandler.Success?, fail: @escaping APIHandler.ErrorBlock) {
        Alamofire.request(handleUrl(path), method: method, parameters: body, headers: header ).responseJSON(completionHandler: { (resp) in
            
            switch resp.result {
            case .success(let respData):
                let data = JSON(respData)
                
                //                //check validate
                //                if data["code"].stringValue == "invalid_token" {
                //                    fail(data["message"].stringValue)
                //                    Utils.clearToken()
                //                    break
                //                }
                //                let code = data["status"].boolValue
                //                if !code {
                //                    fail(data["message"].stringValue)
                //                    break
                //                }
                
                success?(data)
                break
            case.failure(let error):
                debugPrint(error)
                fail(error.localizedDescription)
                break
            }
        })
    }
    
    
}
