//
//  JobDetailViewController.swift
//  AuthenticJob
//
//  Created by Hoang Quan Tran on 5/25/18.
//  Copyright © 2018 Hoang Quan Tran. All rights reserved.
//

import UIKit
protocol JobDetailViewControllerDelegate {
    func saveJob(listing: Listing)
}
class JobDetailViewController: UIViewController {
    
    @IBOutlet weak var applyHerebtn: UIButton!
    @IBOutlet weak var clickHereBtn: UIButton!
    @IBOutlet weak var jobTitleLabel: UILabel!
    @IBOutlet weak var jobTypeLabel: UILabel!
    @IBOutlet weak var companyNameLabel: UILabel!
    @IBOutlet weak var addressLabel: UILabel!
    @IBOutlet weak var countryLabel: UILabel!
    var user: String!
    var url : String!
    var urlApply: String!
    var listingJob: Listing!
    
    var delegate:JobDetailViewControllerDelegate? = nil
    
    override func viewDidLoad() {
        super.viewDidLoad()
        let saveBtn = UIBarButtonItem(barButtonSystemItem: .save, target: self, action: #selector(saveJobDetail))
        self.navigationItem.rightBarButtonItem = saveBtn
        
    }
    
    override func viewWillAppear(_ animated: Bool) {
        self.navigationController?.navigationBar.isHidden = false
    }
    
    
    func setUpView(){
        self.title = "Job Detail"
        self.url = listingJob.url
        self.urlApply = listingJob.apply_url
        self.view.backgroundColor = UIColor(red: 49/255, green: 172/255, blue: 227/255, alpha: 1)
        jobTitleLabel.text = listingJob.title
        jobTitleLabel.layoutIfNeeded()
        jobTitleLabel.sizeToFit()
        if (listingJob.type?.name != nil){
            jobTypeLabel.text = "Type: " + (listingJob.type?.name)!
        } else {
            jobTypeLabel.text = "Type: Full/Part-Time"
        }
        jobTypeLabel.layoutIfNeeded()
        jobTypeLabel.sizeToFit()
        
        if (listingJob.company?.name != nil){
            companyNameLabel.text = "Company name: " + (listingJob.company?.name)!
        } else {
            companyNameLabel.text = "Company name: "
        }
        companyNameLabel.layoutIfNeeded()
        companyNameLabel.sizeToFit()
        
        if (listingJob.company?.location?.city != nil){
            addressLabel.text = "City : " + (listingJob.company?.location?.city)!
        } else {
            addressLabel.text = "City : "
        }
        addressLabel.layoutIfNeeded()
        addressLabel.sizeToFit()
        
        if (listingJob.company?.location?.country != nil){
            countryLabel.text = "Country : " + (listingJob.company?.location?.country)!
        } else {
            countryLabel.text = "Country : "
        }
        countryLabel.layoutIfNeeded()
        countryLabel.sizeToFit()
        
        clickHereBtn.layer.cornerRadius = 10
        applyHerebtn.layer.cornerRadius = 10
        
    }
    
    @objc func saveJobDetail(){
        if delegate != nil {
            self.delegate?.saveJob(listing: self.listingJob)
            self.navigationController?.popViewController(animated: true)
        }
    }
    
    
    @IBAction func clickHereBtnAction(_ sender: Any) {
        if let url = URL(string: self.url) {
            UIApplication.shared.open(url, options: [:])
        }
    }
    
    @IBAction func applyHereAction(_ sender: Any) {
        if let url = URL(string: self.urlApply) {
            UIApplication.shared.open(url, options: [:])
        }
    }
    
}
