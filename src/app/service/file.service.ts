import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { UploadFileModel } from '../model/common/CommonModule';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  saveFile(file: FormData): Observable<UploadFileModel> {
    return this.http.post<UploadFileModel>(`${environment.backendAddress}/file`,file);
  }
}
