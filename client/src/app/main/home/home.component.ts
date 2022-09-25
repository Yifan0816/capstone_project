import { Component, OnInit } from '@angular/core';
import { OrganizationsService } from 'src/app/service/organizations.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // TODO: return organization page with param.
  // implement service, pull details of org from jsopn-server
  getRoute(shelterId: number): string {
    return `shelters/${shelterId}`;
  }

  allShelters!: any;
  errorMessage!: string;

  constructor(private orgService: OrganizationsService) {}

  ngOnInit(): void {
    this.allShelters = this.orgService.getAllShelters().subscribe({
      next: (res: any) => {
        this.allShelters = res;
        console.log(this.allShelters);
      },
      error: (err: any) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err));
      },
      complete: () => {
        console.log(`called getAllOrganizations()`);
      },
    });
  }
}
