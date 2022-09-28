import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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

  ShelterId!: any;
  shelter!: Shelter;
  errorMessage!: string;
  isSheltersLoading = true;
  isAnimalTypesLoading = true;

  isEditing = false;
  isAddNewAnimalType = false;
  isDeleting = false;
  editingId!: number;
  deletingId!: number;

  animalTypeForm!: FormGroup;
  animalType!: Animaltype;
  animalTypes!: Animaltype[];


  getRoute(animalTypeId: number) {
    return `animaltypes/${animalTypeId}`;
  }

  creatAnimalTypeForm() {
    this.animalTypeForm = this.fb.group({
      AnimalTypeId: [''],
      AnimalTypeName: ['', Validators.required],
      Capacity: ['', Validators.required],
      Animals: [''],
    });
  }

  enableDeletingDialog(animalTypeId: number): void {
    this.toggleDeletionDialog();
    this.deletingId = animalTypeId;
  }
  toggleDeletionDialog(): void {
    this.isDeleting = !this.isDeleting;

  }

  toggleEditing(): void {
    console.log("toggleEditing() called");
    this.isEditing = !this.isEditing;
  }

  enableEditingState(animalTypeId: number): void {
    console.log("editing animal type id: "+animalTypeId);
    this.toggleEditing();
    this.getAnimalType(animalTypeId);
    this.editingId = animalTypeId;
  }

  toggleAddingNewType(): void {
    this.isAddNewAnimalType = !this.isAddNewAnimalType;
    this.animalTypeForm.reset();
  }


  deleteAnimalType(animalTypeId: number): void {
    this.isEditing = !this.isEditing;
    console.log('deleteAnimalType() called');
    this.groupService.deleteAnimalTypeById(animalTypeId).subscribe({
      error: (error) => console.log(error),
      complete: () => {
        if(this.ShelterId == 0) {
          this.getAllAnimalTypes();
        } else {
          this.getAllAnimalTypesByShelter();
        }

        },
    });
  }

  // After Edit button hit
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

  // After Save button hit
  submitAnimalType(animalType: Animaltype): void {
    animalType.ShelterId = this.ShelterId;
    animalType.ShelterName = this.shelter.ShelterName;
    if (this.animalTypeForm.invalid) {
      console.log(`submitAnimalType: this.animalTypeForm.invalid = true`);
      return;
    }

    if (animalType.AnimalTypeId === null || animalType.AnimalTypeId < 1 ) {
      this.toggleAddingNewType();
      this.addAnimalType(animalType);
    }
    else {
      this.toggleEditing();
      this.updateAnimalType(animalType);
    }
  }

  addAnimalType(animalType: Animaltype): void {
    this.groupService.addNewAnimalType(animalType).subscribe({
      error: (error) => console.log(error),
      complete: () => {
        if(this.ShelterId == 0) {
          this.getAllAnimalTypes();
        } else {
          this.getAllAnimalTypesByShelter();
        }

        },
    });
  }

  updateAnimalType(animalType: Animaltype): void {
    this.groupService.updateAnimalType(animalType).subscribe({
      error: (error) => console.log(error),
      complete: () => {
        if(this.ShelterId == 0) {
          this.getAllAnimalTypes();
        } else {
          this.getAllAnimalTypesByShelter();
        }

        },
    });
  }

  calProgressBar(animalsLength: number, capacity: number): number {
    return animalsLength / capacity * 100;
  }

  getAllAnimalTypesByShelter(): void{
    this.groupService.getAllAnimalTypesByShelter(this.ShelterId).subscribe({
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

  getShelterDetails(): void {
    this.orgService.getShelterById(this.ShelterId).subscribe({
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
  }

  makeShelter(): void {
    this.shelter = {
      ShelterName: "All Animal Types",
      ShelterId: 0,
      Description: ""
    };
    
  }

  getAllAnimalTypes(): void {
    this.groupService.getAllAnimalTypes().subscribe({
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

  ngOnInit(): void {
    this.ShelterId = this.activatedRoute.snapshot.paramMap.get('id');

    if(this.ShelterId) {
      this.getShelterDetails();
      this.getAllAnimalTypesByShelter();
    } else {
      this.makeShelter();
      this.getAllAnimalTypes();
    }


  }

}
