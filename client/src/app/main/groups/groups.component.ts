import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
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
    private fb: FormBuilder
  ) {
    this.creatAnimalDetailsForm();
  }

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
      AnimalName: [''],
      Age: [''],
      Gender: [''],
      Breed: [''],
      Color: [''],
      Size: [''],
      Health: [''],
      Charactor: [''],
      WithCats: [''],
      WithDogs: [''],
      WithChildren: [''],
    });
  }

  toggleAddingNewAnimal(): void {
    this.isAddNewAnimal = !this.isAddNewAnimal;
    this.displayAnimalDetails = !this.displayAnimalDetails;
    this.animalDetailsForm.reset();
  }

  displayDetails(animalId: number): void {
    this.displayAnimalDetails = !this.displayAnimalDetails;
    this.animalDetailsForm.reset();
    this.getAnimalDetails(animalId);
    console.log(this.animal);
  }

  getAnimalDetails(animalId: number): void {
    this.memberService.getAnimalById(animalId).subscribe({
      next: (animal) => this.setRetrievedToForm(animal),
      error: (error) => (this.errorMessage = error),
      complete: () => console.log('complete' + this.animal),
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
    console.log('deleteAnimal() called');
    this.memberService.deleteAnimalById(animalId, this.animalTypeId).subscribe({
      error: (error) => console.log(error),
      complete: () => {
        if(this.animalTypeId == 0) {
          this.getAllAnimals();
        } else {
          this.getAllAnimalsByType();
        }
        },
    });
  }

  submitAnimalForm(animal: Animal): void {
    if (this.animalDetailsForm.invalid) {
      console.log(`submitAnimalType: this.animalTypeForm.invalid = true`);
      return;
    }
    if (animal.AnimalId === null || animal.AnimalId < 1) {
      this.addAnimal(animal);
      // what's the difference between reload here and reload on completion
      window.location.reload();
    } else {
      this.updateAnimal(animal);
      window.location.reload();
    }
  }

  addAnimal(animal: Animal) {
    this.memberService.addNewAnimal(animal, this.animalTypeId).subscribe({
      error: (error) => console.log(error),
      complete: () => {
        if(this.animalTypeId == 0) {
          this.getAllAnimals();
        } else {
          this.getAllAnimalsByType();
        }

        },
    });
  }

  updateAnimal(animal: Animal) {
    this.memberService.updateAnimal(animal).subscribe({
      error: (error) => console.log(error),
      complete: () => {
        if(this.animalTypeId == 0) {
          this.getAllAnimals();
        } else {
          this.getAllAnimalsByType();
        }

        },
    });
  }


  getAnimalTypeDetails():void {
    this.groupService.getAnimalTypeById(this.animalTypeId).subscribe({
      next: (res: any) => {
        this.animalType = res;
      },
      error: (err: any) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err));
      },
      complete: () => {
        console.log(`called getShelterById()`);
        this.isAnimalTypeLoading = false;
      },
    });
  }

  getAllAnimalsByType(): void {
    this.memberService
    .getAllAnimalsByAnimalType(this.animalTypeId)
    .subscribe({
      next: (res: any) => {
        this.animals = res;
      },
      error: (err: any) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err));
      },
      complete: () => {
        console.log(`called getAllAnimalTypesByShelter()`);
        this.isAnimalsLoading = false;
      },
    });
  }

  makeAnimalType(): void {
    this.animalType =   {
      AnimalTypeId: 0,
      AnimalTypeName: "All Animals",
      ShelterId: 0,
      ShelterName: "",
      Capacity: 0,
      Animals: []
    };
  }

  getAllAnimals(): void {
    this.memberService.getAllAnimals()
    .subscribe({
      next: (res: any) => {
        this.animals = res;
      },
      error: (err: any) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err));
      },
      complete: () => {
        console.log(`called getAllAnimalTypesByShelter()`);
        this.isAnimalsLoading = false;
      }
    });
  }

  ngOnInit(): void {
    this.animalTypeId = this.activatedRoute.snapshot.paramMap.get('id');

    if (this.animalTypeId) {
      this.getAnimalTypeDetails();
      this.getAllAnimalsByType();

    } else {
      this.makeAnimalType();
      this.getAllAnimals();
    }
  }
}
