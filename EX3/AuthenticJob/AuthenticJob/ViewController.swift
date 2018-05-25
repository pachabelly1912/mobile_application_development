//
//  ViewController.swift
//  AuthenticJob
//
//  Created by Hoang Quan Tran on 5/23/18.
//  Copyright © 2018 Hoang Quan Tran. All rights reserved.
//

import UIKit
import CoreData
import Alamofire
import Alamofire_SwiftyJSON
import AlamofireObjectMapper
import SwiftyJSON

class ViewController: UIViewController, UITableViewDataSource, UITableViewDelegate, JobDetailViewControllerDelegate {
    
    
    @IBOutlet weak var Button1: UIButton!
    @IBOutlet weak var Button2: UIButton!
    @IBOutlet weak var Button3: UIButton!
    @IBOutlet weak var jobTableView: UITableView!
    
    var listings: [Listing] = []
    
    let activityIndicator: UIActivityIndicatorView  = {
        let aiv = UIActivityIndicatorView(activityIndicatorStyle: .whiteLarge)
        aiv.startAnimating()
        aiv.translatesAutoresizingMaskIntoConstraints = false
        return aiv
    }()
    
    override func viewWillAppear(_ animated: Bool) {
        self.navigationController?.navigationBar.isHidden = true
    }
    
    let vBlack: UIView = {
        let view = UIView()
        view.backgroundColor = UIColor.black.withAlphaComponent(0.3)
        return view
    }()
    
    
    override func viewDidLoad() {
        super.viewDidLoad()
        setUpView()
        jobTableView.tableFooterView = UIView(frame: .zero )
        let nibName = UINib(nibName: "JobTableViewCell", bundle: nil)
        jobTableView.register(nibName, forCellReuseIdentifier: "jobcell")
        jobTableView.delegate = self
        jobTableView.dataSource = self
    }
    
    func getData(type: Int,page: Int){
        showActivityIndicator()
        let url = URL(string: "https://authenticjobs.com/api/?api_key=4256df6d90003b86a0f403c951243574&format=json&&method=aj.jobs.search&type=\(type)&page=\(page)")
       
       
        Alamofire.request(url!, method: .get, parameters: nil, encoding: URLEncoding.default).responseObject(keyPath: "listings") { (data: DataResponse<Job>) in
            switch data.result {
            case .success(let job):
                self.hideActivityIndicator()
                guard let listings = job.listings else { return }
                self.listings = self.listings + listings
                self.jobTableView.reloadData()
            case .failure(let error):
                self.hideActivityIndicator()
                print(error)
            }
        }
        self.jobTableView.reloadData()
    }
    
    func hideActivityIndicator(){
        vBlack.removeFromSuperview()
    }
    
    func showActivityIndicator(){
        guard let window = UIApplication.shared.keyWindow else { return }
        window.addSubview(vBlack)
        vBlack.frame = window.frame
    }
    
    func setUpActivity(){
        self.vBlack.addSubview(activityIndicator)
        activityIndicator.anchorCenterXToSuperview()
        activityIndicator.anchorCenterYToSuperview()
    }
    
    func setUpView(){
        self.view.backgroundColor = UIColor(red: 49/255, green: 172/255, blue: 227/255, alpha: 1)
        jobTableView.backgroundColor = UIColor(red: 49/255, green: 172/255, blue: 227/255, alpha: 1)
        Button1.layer.cornerRadius = 10
        Button2.layer.cornerRadius = 10
        Button3.layer.cornerRadius = 10
    }
    
    func tableView(_ tableView: UITableView, numberOfRowsInSection section: Int) -> Int {
        return listings.count
    }
    
    func tableView(_ tableView: UITableView, heightForRowAt indexPath: IndexPath) -> CGFloat {
        return 110
    }
    
    func tableView(_ tableView: UITableView, cellForRowAt indexPath: IndexPath) -> UITableViewCell {
        let cell =  jobTableView.dequeueReusableCell(withIdentifier: "jobcell", for: indexPath) as! JobTableViewCell
        let model = listings[indexPath.row]
        cell.setDataForCell(listing: model)
        return cell
    }
    
    @IBAction func BtnAction1(_ sender: Any) {
        self.listings = []
        var page = 1
        var type = 1
        while page < 6 {
            getData(type: type,page: page)
            page = page + 1
            self.jobTableView.reloadData()
        }
    }
    @IBAction func BtnAction2(_ sender: Any) {
        self.listings = []
        var page = 1
        var type = 5
        while page < 6 {
            getData(type: type,page: page)
            page = page + 1
            self.jobTableView.reloadData()
        }
    }
    
    var listJob :[Listing]  = []
    
    
    
    @IBAction func BtnAction3(_ sender: Any) {
        self.listings = listJob
        self.jobTableView.reloadData()
    }
    
    func tableView(_ tableView: UITableView, didSelectRowAt indexPath: IndexPath) {
        
        let jobDetailViewController:JobDetailViewController = UIStoryboard(name: "Main", bundle: nil).instantiateViewController(withIdentifier: "JobDetailViewController") as! JobDetailViewController
        jobDetailViewController.listingJob = listings[indexPath.row]
        jobDetailViewController.setUpView()
        jobDetailViewController.delegate = self
        self.navigationController?.pushViewController(jobDetailViewController, animated: true)
    }
    
//    override func prepare(for segue: UIStoryboardSegue, sender: Any?) {
//        if segue.identifier == "saveJobSegue"{
//            let sendingNewData: JobDetailViewController = segue.destination as! JobDetailViewController
//            sendingNewData.delegate = self
//        }
//    }
    
    func saveJob(listing: Listing) {
        listJob.append(listing)
    }
}

