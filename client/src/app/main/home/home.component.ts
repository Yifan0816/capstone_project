import { Component, OnInit } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { OrganizationsService } from 'src/app/service/organizations.service';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  getRoute(shelterId: number): string {
    return `shelters/${shelterId}`;
  }

  allShelters!: any;
  errorMessage!: string;
  images: any[] = [
    {
      previewImageSrc: '../../assets/homepage/1.png',
      thumbnailImageSrc: '../../assets/homepage/1.png',
      alt: 'Description for Image 1',
      title: 'Title 1',
    },
    {
      previewImageSrc: '../../assets/homepage/2.png',
      thumbnailImageSrc: '../../assets/homepage/2.png',
      alt: 'Description for Image 1',
      title: 'Title 1',
    },
    {
      previewImageSrc: '../../assets/homepage/3.png',
      thumbnailImageSrc: '../../assets/homepage/3.png',
      alt: 'Description for Image 1',
      title: 'Title 1',
    },
    {
      previewImageSrc: '../../assets/homepage/4.png',
      thumbnailImageSrc: '../../assets/homepage/4.png',
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
      previewImageSrc: '../../assets/homepage/6.png',
      thumbnailImageSrc: '../../assets/homepage/6.png',
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

  constructor(
    private orgService: OrganizationsService,
    private titleService: Title
  ) {}

  ngOnInit(): void {
    this.titleService.setTitle('Animal Adoption - Get Your Friend Today!');
    this.allShelters = this.orgService.getAllShelters().subscribe({
      next: (res: any) => {
        this.allShelters = res;
      },
      error: (err: any) => {
        this.errorMessage = err;
        console.log((this.errorMessage = err));
      },
    });
  }
}
