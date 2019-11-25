import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';

@Injectable({
    providedIn: 'root'
})
export class BackendApiService {

    constructor(
        private http: HttpClient
    ) {}

    getData(params: string): Observable<any> {
        return this.http.get(`${environment.url}/${params}`);
    }
}
