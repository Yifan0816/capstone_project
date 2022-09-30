import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { MenuItem } from 'primeng/api';

@Component({
  selector: 'app-nav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css'],
})
export class NavComponent implements OnInit {
  items!: MenuItem[];
  constructor() {}

  getRoute(route: string): string {
    switch (route) {
      case 'allanimaltypes': {
        return `/animaltypes/all`;
      }
      case 'allanimals': {
        return `/animals/all`;
      }

      default: {
        return '';
      }
    }
  }

  ngOnInit(): void {}
}
