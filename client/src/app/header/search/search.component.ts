import { Component, OnInit } from '@angular/core';
import { GroupsService } from 'src/app/service/groups.service';
import { Animaltype } from 'src/models/animaltypes';
import { Shelter } from 'src/models/shelter';

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

  constructor(
    private groupsService: GroupsService,
  ) {}

  getRoute(animalType: Animaltype): string {
    return `/shelters/${animalType.ShelterId}/animaltypes/${animalType.AnimalTypeId}`;
  }
  getAllAnimalTypes(): void {
    this.groupsService.getAllAnimalTypes().subscribe({
      next: (res) => (this.animalTypes = res),
    });
  }

  filterFilteredAnimalTypes(event:any):any {
    let filtered: any[] = [];
    this.animalTypes.forEach(type=> {
      if(type.AnimalTypeName.toLowerCase().includes(event.target.value.toLowerCase())) {
        filtered.push(type);
      }
    });
    this.searchResult = [...filtered];
  }


  ngOnInit(): void {
    this.getAllAnimalTypes();
  }
}
