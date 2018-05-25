//
//  JobTableViewCell.swift
//  AuthenticJob
//
//  Created by Hoang Quan Tran on 5/23/18.
//  Copyright © 2018 Hoang Quan Tran. All rights reserved.
//

import UIKit
import SDWebImage

class JobTableViewCell: UITableViewCell {
    @IBOutlet weak var nameOfJob: UILabel!
    @IBOutlet weak var companyLogoImage: UIImageView!
    @IBOutlet weak var companyName: UILabel!
    @IBOutlet weak var bottomLabel: UILabel!
    
    
    override func awakeFromNib() {
        bottomLabel.backgroundColor = UIColor(red: 49/255, green: 172/255, blue: 227/255, alpha: 1)
        super.awakeFromNib()
        self.companyLogoImage.layer.masksToBounds = true
        self.companyLogoImage.layer.cornerRadius = 10
        // Initialization code
    }

    override func setSelected(_ selected: Bool, animated: Bool) {
        super.setSelected(selected, animated: animated)

        // Configure the view for the selected state
    }
    
    func setDataForCell(listing: Listing){
        self.nameOfJob.text = listing.title ?? ""
        let url = URL(string: (listing.company?.logo)!)
        self.companyLogoImage.sd_setImage(with: url)
        if(self.companyLogoImage.image == nil){
            self.companyLogoImage.image = UIImage(named: "job")
        }
        self.companyName.text = "Company: " + (listing.company?.name)!
    }
}
