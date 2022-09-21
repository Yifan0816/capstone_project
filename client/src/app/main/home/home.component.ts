import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // TODO: return organization page with param.
  // implement service, pull details of org from jsopn-server
  getRoute(orgId: number): string {
    return 'organizations';
  }
  constructor() {}

  ngOnInit(): void {}
}
