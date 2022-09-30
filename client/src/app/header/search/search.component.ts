import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, NavigationEnd } from '@angular/router';
import { GroupsService } from 'src/app/service/groups.service';
import { Animaltype } from 'src/models/animaltypes';

@Component({
  selector: 'app-search',
  templateUrl: './search.component.html',
  styleUrls: ['./search.component.css'],
})
export class SearchComponent implements OnInit {
  searchInput!: any;
  searchResult!: Array<Animaltype>;
  animalTypes!: Animaltype[];
  selectedType!: any;
  isLeaving = false;
  names!: any[];
  previousRoute!: any;
  redirectRoute!: any;

  constructor(
    private groupsService: GroupsService,
    private router: Router,
  ) {
  }

  routeTo(animalType: Animaltype) {
    this.router.navigate([
      `/shelters/${animalType.ShelterId}/animaltypes/${animalType.AnimalTypeId}`,
    ]);
  }

  getAllAnimalTypes(): void {
    this.groupsService.getAllAnimalTypes().subscribe({
      next: (res) => (this.animalTypes = res),
    });
  }

  filterFilteredAnimalTypes(event: any): any {
    let filtered: any[] = [];
    this.animalTypes.forEach((type) => {
      if (
        type.AnimalTypeName.toLowerCase().includes(
          event.target.value.toLowerCase()
        )
      ) {
        filtered.push(type);
      }
    });
    this.searchResult = [...filtered];
    if(event.target.value==""){
      this.searchResult = [];
    }
  }

  ngOnInit(): void {
    this.getAllAnimalTypes();
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        this.searchInput = "";
        this.isLeaving = true;
        this.searchResult = [];
      }

      if (event instanceof NavigationEnd) {
        this.isLeaving = false;
        this.redirectRoute = event.url;
        this.previousRoute = event.url;
      }
    });


  }
}
