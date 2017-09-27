import { Component, OnInit } from '@angular/core';
import { AuthService } from '../../services/auth.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: Object;

  constructor(private authService: AuthService, private router: Router) { }

  ngOnInit() {
    let profile = JSON.parse(this.authService.loadProfile());
    if(profile)
      this.user = profile;

    this.getProfile();
  }

  getProfile() {
    this.authService.getProfile().subscribe(profile => {
      this.user = profile.user;
      this.authService.storeProfile(profile.user);
    },
    err => {
      console.log(err);
      return false;
    });
  }
}
