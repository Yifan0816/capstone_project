import { Component, OnInit } from '@angular/core';
import { FormBuilder } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { GroupsService } from 'src/app/service/groups.service';
import { MembersService } from 'src/app/service/members.service';
import { Animal } from 'src/models/animal';
import { Animaltype } from 'src/models/animaltypes';

@Component({
  selector: 'app-groups',
  templateUrl: './groups.component.html',
  styleUrls: ['./groups.component.css']
})
export class GroupsComponent implements OnInit {
  constructor(
    private groupService: GroupsService,
    private memberService: MembersService,
    private activatedRoute: ActivatedRoute,
    private fb: FormBuilder) { }

    animalTypeId!: any;
    animalType!: Animaltype;
    errorMessage!: string;
    isAnimalTypeLoading = true;
    isAnimalsLoading = true;
    animals!: Animal[];

    isAddNewAnimal = false;

    toggleAddingNewAnimal(): void {
      this.isAddNewAnimal = !this.isAddNewAnimal;
    }

  ngOnInit(): void {

    this.animalTypeId = this.activatedRoute.snapshot.paramMap.get('id');
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

    this.memberService.getAllAnimalsByAnimalType(this.animalTypeId).subscribe({
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

}
