import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Shelter } from 'src/models/shelter';

@Injectable({
  providedIn: 'root',
})
export class OrganizationsService {
  dataUrl = 'http://localhost:8082/api';

  jsonContentTypeHeaders = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  };

  constructor(private http: HttpClient) {}

  getAllShelters(): Observable<Shelter[]> {
    const results: Observable<Shelter[]> = this.http.get<Shelter[]>(
      this.dataUrl + '/shelters'
    );
    return results;
  }

  getShelterById(shelterId: number): Observable<Shelter> {
    const results: Observable<Shelter> = this.http.get<Shelter>(
      this.dataUrl + `/shelters/${shelterId}`
    );
    return results;
  }
}
