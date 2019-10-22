import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-accept-invite',
  templateUrl: './accept-invite.component.html',
  styleUrls: ['./accept-invite.component.scss']
})
export class AcceptInviteComponent implements OnInit {
  vriendID: number;

  constructor(private route: ActivatedRoute) { }

  ngOnInit() {
    this.vriendID = +this.route.snapshot.paramMap.get("vriendID");
    console.log(this.vriendID);
  }

}
