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
  confirmDelete = false;

  confirmDeletion(animalType: Animaltype): void {
    console.log('confirmDeletion() called, dialog should be visible');
    this.toggleDeletionDialog();
  }

  toggleDeletionDialog(): void {
    this.confirmDelete = !this.confirmDelete;
  }

  creatAnimalTypeForm() {
    this.animalTypeForm = this.fb.group({
      AnimalTypeId: [''],
      AnimalTypeName: ['', Validators.required],
      Capacity: ['', Validators.required],
      Animals: [''],
    });
  }

  // getStyleForAvaliableBtn(isEditing: boolean): string {
  //   return isEditing ? 'hideButton' : 'avalBtn';
  // }

  // TODO finish dialog details
  // TODO update a animalType
  // When hit Edit button, only that card should be under edit, currently all cards went to edit
  deleteAnimalType(animalTypeId: number): void {
    this.isEditing = !this.isEditing;
    console.log('deleteAnimalType() called');
    this.groupService.deleteAnimalTypeById(animalTypeId).subscribe({
      error: (error) => console.log(error),
      complete: () => window.location.reload(),
    });
  }

  // updateAnimalType(animalTypeId: number): void {
  //   this.isEditing = !this.isEditing;
  // }

  submitAnimalType(animalType: Animaltype): void {
    this.isAddNewAnimalType = !this.isAddNewAnimalType;
    animalType.ShelterId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    console.log(`submitAnimalType() called`);
    console.log(animalType);
    if (this.animalTypeForm.invalid) {
      console.log(`submitAnimalType: this.animalTypeForm.invalid = true`);
      return;
    }
    //insert
    console.log('New Animal Type id be like: ' + animalType.AnimalTypeId);
    if (animalType.AnimalTypeId === null || animalType.AnimalTypeId < 1) {
      this.addAnimalType(animalType);
      console.log('addAnimalType() called');
      // what's the difference between reload here and reload on completion
      window.location.reload();
    }
    //update
    else {
      // let oldAnimalType: Animaltype;
      console.log('before copying from old animal type' + animalType);
      this.groupService.getAnimalTypeById(animalType.AnimalTypeId).subscribe({
        next: (oldAnimalType) => {
          animalType.AnimalTypeId = oldAnimalType.AnimalTypeId;
          animalType.ShelterId = oldAnimalType.ShelterId;
          animalType.Animals = oldAnimalType.Animals;
        },
      });
      console.log('updated animal type be like: ' + animalType);
      this.updateAnimalType(animalType);
      // window.location.reload();
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
