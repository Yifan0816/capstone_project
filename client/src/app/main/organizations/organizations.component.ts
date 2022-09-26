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

  creatAnimalTypeForm() {
    this.animalTypeForm = this.fb.group({
      AnimalTypeId: [''],
      AnimalTypeName: ['', Validators.required],
      Capacity: ['', Validators.required],
      Animals: [''],
    });
  }

  toggleDeletionDialog(): void {
    this.isDeleting = !this.isDeleting;
  }

  toggleEditingState(animalTypeId: number): void {
    this.isEditing = !this.isEditing;
    this.getAnimalType(animalTypeId);

  }

  toggleAddingNewType(): void {
    this.isAddNewAnimalType = !this.isAddNewAnimalType;
    this.animalTypeForm.reset();
  }

  // When hit Edit button, only that card should be under edit, currently all cards went to edit
  deleteAnimalType(animalTypeId: number): void {
    this.isEditing = !this.isEditing;
    console.log('deleteAnimalType() called');
    this.groupService.deleteAnimalTypeById(animalTypeId).subscribe({
      error: (error) => console.log(error),
      complete: () => window.location.reload(),
    });
  }

  getAnimalType(animalTypeId: number): void {
    this.groupService.getAnimalTypeById(animalTypeId).subscribe({
      next: (animalType) => this.setRetrievedToForm(animalType),
      error: (error) => console.log(error),
      complete: () => console.log(`getAnimalType() called`),
    });
  }

  setRetrievedToForm(animalType: Animaltype): void {
    this.animalType = animalType;
    this.animalTypeForm.setValue({
      AnimalTypeId: this.animalType.AnimalTypeId,
      AnimalTypeName: this.animalType.AnimalTypeName,
      Capacity: this.animalType.Capacity,
      Animals: this.animalType.Animals,
    });
  }

  submitAnimalType(animalType: Animaltype, animalTypeId: number): void {
    animalType.ShelterId = parseInt(
      this.activatedRoute.snapshot.paramMap.get('id')!
    );
    if (this.animalTypeForm.invalid) {
      console.log(`submitAnimalType: this.animalTypeForm.invalid = true`);
      return;
    }
    if (animalType.AnimalTypeId === null || animalType.AnimalTypeId < 1 ) {
      this.addAnimalType(animalType);
      // what's the difference between reload here and reload on completion
      window.location.reload();
    }
    else {
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

  calProgressBar(animalsLength: number, capacity: number): number {
    return animalsLength / capacity * 100;
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
