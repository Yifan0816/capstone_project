import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute, Router } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
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
    private fb: FormBuilder,
    private router: Router,
    private route: ActivatedRoute,
    private messageService: MessageService,
    private titleService: Title
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

  routeTo(animalType: Animaltype) {
    this.router.navigate([
      `shelters/${animalType.ShelterId}/animaltypes/${animalType.AnimalTypeId}`,
    ]);
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
    console.log('toggleEditing() called');
    this.isEditing = !this.isEditing;
  }

  enableEditingState(animalTypeId: number): void {
    console.log('editing animal type id: ' + animalTypeId);
    this.toggleEditing();
    this.getAnimalType(animalTypeId);
    this.editingId = animalTypeId;
  }

  toggleAddingNewType(): void {
    this.isAddNewAnimalType = !this.isAddNewAnimalType;
    this.animalTypeForm.reset();
  }

  validationBeforeDelete(animalType: Animaltype): boolean {
    return animalType.Animals.length == 0 ? true : false;
  }

  deleteAnimalType(animalType: Animaltype): void {
    if (!this.validationBeforeDelete(animalType)) {
      this.popErrorToast({
        severity: 'error',
        summary: `Animal Type ${animalType.AnimalTypeName} still have ${animalType.Animals.length} animals!`,
        detail: 'Delete all the animals before delete this animal Type!',
      });
      this.toggleDeletionDialog();
      return;
    }
    this.isEditing = !this.isEditing;
    console.log('deleteAnimalType() called');
    this.groupService.deleteAnimalTypeById(animalType.AnimalTypeId).subscribe({
      error: (error) => {
        console.log(error);
        this.popErrorToast({
          severity: 'error',
          summary: `Error Occurd Deleting Animal Type ${animalType.AnimalTypeId}`,
          detail: 'Problem with server!',
        });
      },
      complete: () => {
        if (this.ShelterId == 0) {
          this.getAllAnimalTypes();
        } else {
          this.getAllAnimalTypesByShelter();
        }
        this.popErrorToast({
          severity: 'success',
          summary: `Successfully Deleted Animal Type ${animalType.AnimalTypeName}`,
          detail: '',
        });
      },
    });
  }

  // After Edit button hit
  getAnimalType(animalTypeId: number): void {
    this.groupService.getAnimalTypeById(animalTypeId).subscribe({
      next: (animalType) => this.setRetrievedToForm(animalType),
      error: (error) => {
        console.log(error);
        this.popErrorToast({
          severity: 'error',
          summary: `Error Occurd Getting Animal Type ${animalTypeId}`,
          detail: 'Problem with server!',
        });
      },
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
      this.popErrorToast({
        severity: 'error',
        summary: 'Invalid New Animal Type',
        detail: 'Invalid value entered!',
      });
      return;
    }

    if (animalType.AnimalTypeId === null || animalType.AnimalTypeId < 1) {
      this.toggleAddingNewType();
      this.addAnimalType(animalType);
    } else {
      this.toggleEditing();
      this.updateAnimalType(animalType);
    }
  }

  addAnimalType(animalType: Animaltype): void {
    this.groupService.addNewAnimalType(animalType).subscribe({
      error: (error) => {
        console.log(error);
        this.popErrorToast({
          severity: 'error',
          summary: 'Error Occurd Adding New Animal Type',
          detail: 'Trouble with server!',
        });
      },
      complete: () => {
        if (this.ShelterId == 0) {
          this.getAllAnimalTypes();
        } else {
          this.getAllAnimalTypesByShelter();
        }
        this.popSuccessToast({
          severity: 'success',
          summary: `Successfully Added Animal Type ${animalType.AnimalTypeName}`,
          detail: '',
        });
      },
    });
  }

updateCapacityValidation(animalType: Animaltype): boolean {
return animalType.Capacity >= animalType.Animals.length ? true: false;
}

  updateAnimalType(animalType: Animaltype): void {

    if(!this.updateCapacityValidation(animalType)) {
      this.popErrorToast({
        severity: 'error',
        summary: `Cannot Update Animal Type ${animalType.AnimalTypeName}`,
        detail: 'Updated capacity smaller than current animal occupancy!',
      });
      return;
    }
    this.groupService.updateAnimalType(animalType).subscribe({
      error: (error) => {
        console.log(error);
        this.popErrorToast({
          severity: 'error',
          summary: 'Error Occurd Updating Animal Type',
          detail: 'Trouble with server!',
        });
      },
      complete: () => {
        if (this.ShelterId == 0) {
          this.getAllAnimalTypes();
        } else {
          this.getAllAnimalTypesByShelter();
        }
        this.popSuccessToast({
          severity: 'success',
          summary: `Successfully Updated Animal Type ${animalType.AnimalTypeName}`,
          detail: '',
        });
      },
    });
  }

  calProgressBar(animalsLength: number, capacity: number): number {
    return (animalsLength / capacity) * 100;
  }

  getAllAnimalTypesByShelter(): void {
    this.groupService.getAllAnimalTypesByShelter(this.ShelterId).subscribe({
      next: (res: any) => {
        this.animalTypes = res;
        console.log(this.animalTypes);
      },
      error: (err: any) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err));
        this.popErrorToast({
          severity: 'error',
          summary: 'Error Occurd Getting Animal Types by Shelter',
          detail: 'Trouble with server!',
        });
      },
      complete: () => {
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
        this.popErrorToast({
          severity: 'error',
          summary: 'Error Occurd Getting Shelter Details',
          detail: 'Trouble with server!',
        });
      },
      complete: () => {
        this.isSheltersLoading = false;
      },
    });
  }

  makeShelter(): void {
    this.shelter = {
      ShelterName: 'All Animal Types',
      ShelterId: 0,
      Description: '',
    };
  }

  getAllAnimalTypes(): void {
    this.groupService.getAllAnimalTypes().subscribe({
      next: (res: any) => {
        this.animalTypes = res;
      },
      error: (err: any) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err));
        this.popErrorToast({
          severity: 'error',
          summary: 'Error Occurd Getting All Animal Types',
          detail: 'Trouble with server!',
        });
      },
      complete: () => {
        this.isAnimalTypesLoading = false;
      },
    });
  }

  popErrorToast(message: Message) {
    this.messageService.add(message);
  }

  popSuccessToast(message: Message) {
    this.messageService.add(message);
  }


  ngOnInit(): void {
    this.ShelterId = this.activatedRoute.snapshot.paramMap.get('id');
    this.titleService.setTitle('Animal Adoption - Animal Types');
    if (this.ShelterId) {
      this.getShelterDetails();
      this.getAllAnimalTypesByShelter();
    } else {
      this.makeShelter();
      this.getAllAnimalTypes();
    }
  }
}
