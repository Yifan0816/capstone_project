import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Animaltypes } from 'src/models/animaltypes';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {

  animalType!: Animaltypes;
  dataUrl = 'http://localhost:8082/api'

  jsonContentTypeHeaders = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  }

  constructor(private http: HttpClient) { }

  getAllAnimalTypesByShelter(shelterId: number): Observable<Animaltypes[]> {
    const results: Observable<Animaltypes[]> = this.http.get<Animaltypes[]>(this.dataUrl+`/animaltypes/byshelter/${shelterId}`);
    return results;
  }
}
