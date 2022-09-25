import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GroupsService } from 'src/app/service/groups.service';
import { OrganizationsService } from 'src/app/service/organizations.service';
import { Animaltypes } from 'src/models/animaltypes';
import { Shelter } from 'src/models/shelter';

@Component({
  selector: 'app-organizations',
  templateUrl: './organizations.component.html',
  styleUrls: ['./organizations.component.css'],
})
export class OrganizationsComponent implements OnInit {
  constructor(
    private orgService: OrganizationsService,
    private groupService: GroupsService,
    private activatedRoute: ActivatedRoute,
  ) {}

  id!: any;
  shelter!: Shelter;
  errorMessage!: string;
  isSheltersLoading = true;
  isAnimalTypesLoading = true;
  animalTypes!: Animaltypes[];
  isEditing = false;
  isAddNewAnimalType = false;


// TODO need to take value from text input and finish CRUD here
  cancelEditing(): void {
    this.isEditing = !this.isEditing;
  }

  updateAnimalType(animalTypeId: number): void {
    this.isEditing = !this.isEditing;
  }



  addAnimalType(): void {
    this.isAddNewAnimalType = !this.isAddNewAnimalType;
  }

  cancelAddingNewType(): void {
    this.isAddNewAnimalType = !this.isAddNewAnimalType;
  }

  ngOnInit(): void {
    this.id = this.activatedRoute.snapshot.paramMap.get('id');
    this.orgService.getShelterById(this.id).subscribe({
      next: (res: any) => {
        this.shelter = res;
        console.log(this.shelter);
      },
      error: (err: any) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err));
      },
      complete: () => {
        console.log(`called getShelterById()`);
        this.isSheltersLoading = false;
      },
    });

    this.groupService.getAllAnimalTypesByShelter(this.id).subscribe({
      next: (res: any) => {
        this.animalTypes = res;
        console.log(this.animalTypes);
      },
      error: (err: any) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err));
      },
      complete: () => {
        console.log(`called getAllAnimalTypesByShelter()`);
        this.isAnimalTypesLoading = false;
      },
    });

  }
}
