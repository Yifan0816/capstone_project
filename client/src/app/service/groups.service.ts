import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { Animaltype } from 'src/models/animaltypes';

@Injectable({
  providedIn: 'root'
})
export class GroupsService {


  dataUrl = 'http://localhost:8082/api'

  jsonContentTypeHeaders = {
    headers: new HttpHeaders().set('Content-Type', 'application/json'),
  }

  constructor(private http: HttpClient) { }

  getAllAnimalTypes(): Observable<Animaltype[]> {
    const results: Observable<Animaltype[]> = this.http.get<Animaltype[]>(this.dataUrl+`/animaltypes`);
    return results;
  }

  getAllAnimalTypesByShelter(shelterId: number): Observable<Animaltype[]> {
    const results: Observable<Animaltype[]> = this.http.get<Animaltype[]>(this.dataUrl+`/animaltypes/byshelter/${shelterId}`);
    return results;
  }

  addNewAnimalType(animalType: Animaltype): Observable<Animaltype> {
    const results: Observable<Animaltype> = this.http.post<Animaltype>(
      this.dataUrl+"/animaltypes",
      animalType,
      this.jsonContentTypeHeaders
    );
    // console.log(`addAnimalType(${animalType}) returned ${results}`);
    return results;
  }

  deleteAnimalTypeById(animalTypeId: number): Observable<Animaltype> {
    const results: Observable<Animaltype> = this.http.delete<Animaltype>(this.dataUrl+`/animaltypes/${animalTypeId}`);
    return results;
  }

  updateAnimalType(animalType: Animaltype): Observable<Animaltype> {
    const results: Observable<Animaltype> = this.http.put<Animaltype>(
      this.dataUrl+"/animaltypes",
      animalType,
      this.jsonContentTypeHeaders
    );
    // console.log(`updateAnimalType(${animalType}) returned ${results}`);
    return results;
  }

  getAnimalTypeById(animalTypeId: number): Observable<Animaltype> {
    const results: Observable<Animaltype> = this.http.get<Animaltype>(this.dataUrl+`/animaltypes/${animalTypeId}`);
    return results;
  }
}
