import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { GroupsService } from 'src/app/service/groups.service';
import { Animaltype } from 'src/models/animaltypes';
import { NavigationStart, NavigationEnd } from '@angular/router';

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
  isLeaving = false;
  names!: any[];
  previousRoute!: any;
  redirectRoute!: any;

  constructor(
    private groupsService: GroupsService,
    private router: Router,
    private activatedRoute: ActivatedRoute
  ) {

  }

  routeTo(animalType: Animaltype) {
    this.router.navigate([
      `/shelters/${animalType.ShelterId}/animaltypes/${animalType.AnimalTypeId}`,
    ]);
    // this.router.navigate([this.redirectRoute]);
    // console.log(`routeTo called with : ${this.redirectRoute}`);
    // this.router.navigateByUrl(this.redirectRoute);
  }

  getAllAnimalTypes(): void {
    this.groupsService.getAllAnimalTypes().subscribe({
      next: (res) => (this.animalTypes = res),
    });
  }

  filterFilteredAnimalTypes(event: any): any {
    let filtered: any[] = [];
    this.animalTypes.forEach((type) => {
      if (
        type.AnimalTypeName.toLowerCase().includes(
          event.target.value.toLowerCase()
        )
      ) {
        filtered.push(type);
      }
    });
    this.searchResult = [...filtered];
  }

  ngOnInit(): void {
    this.getAllAnimalTypes();
    this.router.events.forEach((event) => {
      if (event instanceof NavigationStart) {
        console.log(event);

        this.searchInput = "";
        this.isLeaving = true;
        this.searchResult = [];
        console.log("prev route:" + this.previousRoute);
        window.location.reload();
      }

      if (event instanceof NavigationEnd) {
        this.isLeaving = false;
        console.log(event);
        this.redirectRoute = event.url;
        // window.location.reload();
        // if (this.previousRoute.length() > 5 && this.redirectRoute.length() > 5) {
        //   console.log(`previous url length ${this.previousRoute.length()}`);
        //   console.log(`redirect url length ${this.redirectRoute.length()}`);
        //   window.location.reload();
        // }
        this.previousRoute = event.url;

        // console.log("redirect route:" + this.redirectRoute);
        // console.log(this.previousRoute);
        // console.log(this.redirectRoute);
        // console.log(event.urlAfterRedirects);


      }

      // this.router.navigateByUrl(this.redirectRoute);

      this.activatedRoute.params.subscribe( (data) => {

        console.log("paramMap:");
        console.log(this.activatedRoute.snapshot.paramMap);
        // const id = this.activatedRoute.snapshot.paramMap.get('token');
        // console.log('router subscription fired token:' + token);
        // if(null == token) return;
        // this.getDetail();   //do whatever you need to do
      })

    });

  }
}
