//
//  APIURL.swift
//  VinovaAMS
//
//  Created by Hoang Quan Tran on 7/24/17.
//  Copyright © 2017 Hoang Quan Tran. All rights reserved.
//

import Foundation

struct APIURL {
    static let baseURL = "https://authenticjobs.com/api/?api_key=4256df6d90003b86a0f403c951243574&format=json&method="
    static let login =  "auth/login"
    static let contactTeam = "contact/teams/"
    static let alloRequest = "requests/allocation_requests"
    static let historyRequest = "requests/confirmed_requests"
    static let confirmRequest = "requests/confirm_request"
    static let searchRequest = "requests"
    //static let employeeContact = ""
    static let userDetail = "users/"
    //static let contactTeam = "contact/teams"
    static let categories = "categories"
    static let items = "categories/"
    static let item = "items/"
    
    static let myAsset = "requests/sent_requests?page="
    static let search = "items?search="
    static let borrowItem = "requests/send_request"
    static let filterAsset = "requests/sent_requests?filter="
}

