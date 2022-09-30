import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Title } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { Message, MessageService } from 'primeng/api';
import { AppModule } from 'src/app/app.module';
import { GroupsService } from 'src/app/service/groups.service';
import { MembersService } from 'src/app/service/members.service';
import { Animal } from 'src/models/animal';
import { Animaltype } from 'src/models/animaltypes';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css'],
})
export class GroupsComponent implements OnInit {
  constructor(
    private groupService: GroupsService,
    private memberService: MembersService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder,
    private messageService: MessageService,
    private titleService: Title,
  ) {
    this.creatAnimalDetailsForm();

    this.booleanOptions = [
      { name: 'True', code: 'True' },
      { name: 'False', code: 'False' },
    ];

    this.genderOptions = [
      { name: 'F', code: 'F' },
      { name: 'M', code: 'M' },
    ];
  }
  booleanOptions!: any[];
  genderOptions!: any[];
  animalTypeId!: any;
  animalType!: Animaltype;
  errorMessage!: string;
  isAnimalTypeLoading = true;
  isAnimalsLoading = true;
  animals!: Animal[];
  animal!: Animal;

  isAddNewAnimal = false;
  displayAnimalDetails = false;
  isDeleting = false;

  animalDetailsForm!: FormGroup;

  creatAnimalDetailsForm() {
    this.animalDetailsForm = this.fb.group({
      AnimalId: [''],
      AnimalName: ['', Validators.required],
      Age: ['', Validators.required],
      Gender: [''],
      Breed: ['', Validators.required],
      Color: ['', Validators.required],
      Size: ['', Validators.required],
      Health: ['', Validators.required],
      Charactor: ['', Validators.required],
      WithCats: ['' ],
      WithDogs: ['' ],
      WithChildren: [''],
    });
  }

  toggleDisplayingDetails(): void {
    this.displayAnimalDetails = !this.displayAnimalDetails;
  }

  toggleAddingNewAnimal(): void {
    this.isAddNewAnimal = true;
    this.animalDetailsForm.reset();
  this.toggleDisplayingDetails();

  }

  displayDetails(animalId: number): void {
    this.isAddNewAnimal = false;
    this.toggleDisplayingDetails();
    this.animalDetailsForm.reset();
    this.getAnimalDetails(animalId);
  }

  getAnimalDetails(animalId: number): void {
    this.memberService.getAnimalById(animalId).subscribe({
      next: (animal) => this.setRetrievedToForm(animal),
      error: (error) => {this.errorMessage = error;
        this.popErrorToast({
          severity: 'error',
          summary: `Error Occurd Adding Animal ${animalId}!`,
          detail: 'Problem with server!',
        });},
      // complete: () => console.log('complete' + this.animal),
    });
  }

  setRetrievedToForm(animal: Animal): void {
    this.animal = animal;
    this.animalDetailsForm.setValue({
      AnimalId: this.animal.AnimalId,
      AnimalName: this.animal.AnimalName,
      Age: this.animal.Age,
      Gender: this.animal.Gender,
      Breed: this.animal.Breed,
      Color: this.animal.Color,
      Size: this.animal.Size,
      Health: this.animal.Health,
      Charactor: this.animal.Charactor,
      WithCats: this.animal.WithCats,
      WithDogs: this.animal.WithDogs,
      WithChildren: this.animal.WithChildren,
    });
  }

  toggleDeletionDialog(): void {
    this.isDeleting = !this.isDeleting;
  }

  deleteAnimal(animalId: number) {
    // console.log('deleteAnimal() called');
    this.memberService.deleteAnimalById(animalId, this.animalTypeId).subscribe({
      error: (error) => {
        console.log(error);
        this.popErrorToast({
          severity: 'error',
          summary: `Error Occurd Deleting Animal ${animalId}!`,
          detail: 'Problem with server!',
        });
      },
      complete: () => {
        if (this.animalTypeId == 0) {
          this.getAllAnimals();
        } else {
          this.getAllAnimalsByType();
        }
        this.toggleDeletionDialog();
        this.toggleDisplayingDetails();
        this.popSuccessToast({
          severity: 'success',
          summary: `Successfully Deleted Animal!`,
          detail: '',
        });
      },
    });
  }

  submitAnimalForm(animal: Animal): void {
    animal.Gender = animal.Gender ?? "F";
    animal.WithCats = animal.WithCats ?? "True";
    animal.WithDogs = animal.WithDogs ?? "True";
    animal.WithChildren = animal.WithChildren ?? "True";


    if (this.animalDetailsForm.invalid) {
      console.log(`submitAnimalType: this.animalTypeForm.invalid = true`);
      console.log(this.animalDetailsForm);
      this.popErrorToast({
        severity: 'error',
        summary: 'Invalid New Animal',
        detail: 'Invalid value entered!',
      });
      return;
    }
    if (animal.AnimalId === null || animal.AnimalId < 1) {
      this.addAnimal(animal);
    } else {
      this.updateAnimal(animal);
    }
  }

  addAnimalValidations(): boolean {
    return this.animalType.Animals.length < this.animalType.Capacity ? true: false;
  }

  addAnimal(animal: Animal) {
    console.log(this.addAnimalValidations());
    if(!this.addAnimalValidations()) {
      console.log(this.addAnimalValidations());
      this.popErrorToast({
        severity: 'error',
        summary: 'Cannot Add Animal',
        detail: `${this.animalType.AnimalTypeName} has no space avaliable!`,
      });
      return;
    }

    this.memberService.addNewAnimal(animal, this.animalTypeId).subscribe({
      error: (error) => {
        console.log(error);
        this.popErrorToast({
          severity: 'error',
          summary: `Error Occurd Adding Animal ${animal.AnimalName}!`,
          detail: 'Problem with server!',
        });
      },
      complete: () => {
        if (this.animalTypeId == 0) {
          this.getAllAnimals();
        } else {
          this.getAllAnimalsByType();
        }
        this.toggleDisplayingDetails();
        this.popSuccessToast({
          severity: 'success',
          summary: `Successfully Added Animal ${animal.AnimalName}!`,
          detail: '',
        });
      },
    });
  }

  updateAnimal(animal: Animal) {
    this.memberService.updateAnimal(animal).subscribe({
      error: (error) => {
        console.log(error);
        this.popErrorToast({
          severity: 'error',
          summary: `Error Occurd Updating Animal ${animal.AnimalName}!`,
          detail: 'Problem with server!',
        });
      },
      complete: () => {
        if (this.animalTypeId == 0) {
          this.getAllAnimals();
        } else {
          this.getAllAnimalsByType();
        }
        this.toggleDisplayingDetails();
        this.popSuccessToast({
          severity: 'success',
          summary: `Successfully Updated Animal ${animal.AnimalName}!`,
          detail: '',
        });
      },
    });
  }

  getAnimalTypeDetails(): void {
    this.groupService.getAnimalTypeById(this.animalTypeId).subscribe({
      next: (res: any) => {
        this.animalType = res;
      },
      error: (err: any) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err));
        this.popErrorToast({
          severity: 'error',
          summary: `Error Occurd Getting Animal Details!`,
          detail: 'Problem with server!',
        });
      },
      complete: () => {
        // console.log(`called getShelterById()`);
        this.isAnimalTypeLoading = false;
      },
    });
  }

  getAllAnimalsByType(): void {
    this.memberService.getAllAnimalsByAnimalType(this.animalTypeId).subscribe({
      next: (res: any) => {
        this.animals = res;
      },
      error: (err: any) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err));
        this.popErrorToast({
          severity: 'error',
          summary: `Error Occurd Getting Animals! By Type`,
          detail: 'Problem with server!',
        });
      },
      complete: () => {
        // console.log(`called getAllAnimalTypesByShelter()`);
        this.isAnimalsLoading = false;
      },
    });
  }

  makeAnimalType(): void {
    this.animalType = {
      AnimalTypeId: 0,
      AnimalTypeName: 'All Animals',
      ShelterId: 0,
      ShelterName: '',
      Capacity: 0,
      Animals: [],
    };
    this.isAnimalTypeLoading = false;
  }

  getAllAnimals(): void {
    this.memberService.getAllAnimals().subscribe({
      next: (res: any) => {
        this.animals = res;
      },
      error: (err: any) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err));
        this.popErrorToast({
          severity: 'error',
          summary: `Error Occurd Getting All Animals!`,
          detail: 'Problem with server!',
        });
      },
      complete: () => {
        // console.log(`called getAllAnimalTypesByShelter()`);
        this.isAnimalsLoading = false;
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
    this.animalTypeId = this.activatedRoute.snapshot.paramMap.get('id');
    this.titleService.setTitle('Animal Adoption - Animals');
    if (this.animalTypeId) {
      this.getAnimalTypeDetails();
      this.getAllAnimalsByType();
    } else {
      this.makeAnimalType();
      this.getAllAnimals();
    }
  }
}
