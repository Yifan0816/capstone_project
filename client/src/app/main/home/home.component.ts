import { Component, OnInit } from '@angular/core';
import { OrganizationsService } from 'src/app/service/organizations.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  // TODO: return organization page with param.
  // implement service, pull details of org from jsopn-server
  getRoute(shelterId: number): string {
    return `shelters/${shelterId}`;
  }

  allShelters!: any;
  errorMessage!: string;
  images: any[] = [
    {
      previewImageSrc: '../../assets/homepage/1.jpg',
      thumbnailImageSrc: '../../assets/homepage/1.jpg',
      alt: 'Description for Image 1',
      title: 'Title 1',
    },
    {
      previewImageSrc: '../../assets/homepage/2.jpg',
      thumbnailImageSrc: '../../assets/homepage/2.jpg',
      alt: 'Description for Image 1',
      title: 'Title 1',
    },
    {
      previewImageSrc: '../../assets/homepage/3.jpg',
      thumbnailImageSrc: '../../assets/homepage/3.jpg',
      alt: 'Description for Image 1',
      title: 'Title 1',
    },
    {
      previewImageSrc: '../../assets/homepage/3.jpg',
      thumbnailImageSrc: '../../assets/homepage/3.jpg',
      alt: 'Description for Image 1',
      title: 'Title 1',
    },
    {
      previewImageSrc: '../../assets/homepage/4.jpg',
      thumbnailImageSrc: '../../assets/homepage/4.jpg',
      alt: 'Description for Image 1',
      title: 'Title 1',
    },
    {
      previewImageSrc: '../../assets/homepage/5.png',
      thumbnailImageSrc: '../../assets/homepage/5.png',
      alt: 'Description for Image 1',
      title: 'Title 1',
    },
    {
      previewImageSrc: '../../assets/homepage/6.jpg',
      thumbnailImageSrc: '../../assets/homepage/6.jpg',
      alt: 'Description for Image 1',
      title: 'Title 1',
    },
  ];

  responsiveOptions: any[] = [
    {
      breakpoint: '1024px',
      numVisible: 5,
    },
    {
      breakpoint: '768px',
      numVisible: 3,
    },
    {
      breakpoint: '560px',
      numVisible: 1,
    },
  ];

  constructor(private orgService: OrganizationsService) {}

  ngOnInit(): void {
    this.allShelters = this.orgService.getAllShelters().subscribe({
      next: (res: any) => {
        this.allShelters = res;
        console.log(this.allShelters);
      },
      error: (err: any) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err));
      },
      complete: () => {
        console.log(`called getAllOrganizations()`);
      },
    });
  }
}
