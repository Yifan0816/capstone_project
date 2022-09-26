import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute, ActivatedRouteSnapshot } from '@angular/router';
import { GroupsService } from 'src/app/service/groups.service';
import { OrganizationsService } from 'src/app/service/organizations.service';
import { Animaltype } from 'src/models/animaltypes';
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
    private fb: FormBuilder
  ) {
    this.creatAnimalTypeForm();
  }

  id!: any;
  shelter!: Shelter;
  errorMessage!: string;
  isSheltersLoading = true;
  isAnimalTypesLoading = true;
  animalTypes!: Animaltype[];
  isEditing = false;
  isAddNewAnimalType = false;
  style!: string;
  animalTypeForm!: FormGroup;
  animalType!: Animaltype;
  isDeleting = false;

  toggleDeletionDialog(): void {
    this.isDeleting = !this.isDeleting;
  }

  toggleEditingState(): void {
    this.isEditing = !this.isEditing;
  }

  toggleAddingNewType(): void {
    this.isAddNewAnimalType = !this.isAddNewAnimalType;
  }

  creatAnimalTypeForm() {
    this.animalTypeForm = this.fb.group({
      AnimalTypeId: [''],
      AnimalTypeName: ['', Validators.required],
      Capacity: ['', Validators.required],
      Animals: [''],
    });
  }

  // TODO when update a animalType, when only name is updated, Capacity should copy from old, currently need both name and cap to be entered.
  // When hit Edit button, only that card should be under edit, currently all cards went to edit, but only the one will be edited
  deleteAnimalType(animalTypeId: number): void {
    this.isEditing = !this.isEditing;
    console.log('deleteAnimalType() called');
    this.groupService.deleteAnimalTypeById(animalTypeId).subscribe({
      error: (error) => console.log(error),
      complete: () => window.location.reload(),
    });
  }

  submitAnimalType(animalType: Animaltype, animalTypeId: number): void {
    animalType.AnimalTypeId = animalTypeId;
    animalType.ShelterId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    console.log(`submitAnimalType() called`);
    console.log(animalType);

    console.log('New Animal Type id be like: ' + animalType.AnimalTypeId);
    if (animalType.AnimalTypeId === null || animalType.AnimalTypeId < 1 ) {
      if (this.animalTypeForm.invalid) {
        console.log(`submitAnimalType: this.animalTypeForm.invalid = true`);
        return;
      }
      this.addAnimalType(animalType);
      console.log('addAnimalType() called');
      // what's the difference between reload here and reload on completion
      window.location.reload();
    }
    else {
      console.log("new entered aminal cap: " + animalType.Capacity);
      console.log("new entered aminal cap type: " + typeof animalType.Capacity);
      this.groupService.getAnimalTypeById(animalType.AnimalTypeId).subscribe({
        next: (oldAnimalType) => {
          animalType.AnimalTypeId = oldAnimalType.AnimalTypeId;
          animalType.ShelterId = oldAnimalType.ShelterId;
          animalType.Animals = oldAnimalType.Animals;
          console.log("Copying old animal other stuff");
          if(animalType.Capacity === null || animalType.Capacity === parseInt('')) {
            animalType.Capacity = oldAnimalType.Capacity;
            console.log("Copying old animal cap");
          }
        },
      });
      console.log('updated animal type be like: ' + animalType);
      this.updateAnimalType(animalType);
      window.location.reload();
    }
  }

  addAnimalType(animalType: Animaltype): void {
    this.groupService.addNewAnimalType(animalType).subscribe({
      error: (error) => console.log(error),
    });
  }

  updateAnimalType(animalType: Animaltype): void {
    this.groupService.updateAnimalType(animalType).subscribe({
      error: (error) => console.log(error),
    });
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
