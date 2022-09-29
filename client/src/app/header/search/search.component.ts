import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupsService } from 'src/app/service/groups.service';
import { Animaltype } from 'src/models/animaltypes';
import { Shelter } from 'src/models/shelter';
import {
  NavigationStart,
  NavigationEnd,
  NavigationError,
  NavigationCancel,
  RoutesRecognized,
} from '@angular/router';

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

  constructor(
    private groupsService: GroupsService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        console.log(event);
        this.isLeaving = true;
        this.searchResult = [];
      }
      if (event instanceof NavigationEnd) {
        console.log(event);
        this.isLeaving = false;
        console.log(this.route.snapshot);
        //
      }
      // NavigationEnd
      // NavigationCancel
      // NavigationError
      // RoutesRecognized
    });
  }

  routeTo(animalType: Animaltype) {
    this.router.navigate(
      [
        `/shelters/${animalType.ShelterId}/animaltypes/${animalType.AnimalTypeId}`,
      ],
      {
        relativeTo: this.route,
      }
    );
    // window.location.reload();
  }

  getAllAnimalTypes(): void {
    this.groupsService.getAllAnimalTypes().subscribe({
      next: (res) => (this.animalTypes = res)
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
  }

  ngOnInit(): void {
    this.getAllAnimalTypes();
  }
}
