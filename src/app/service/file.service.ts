import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from 'src/environments/environment';
import { FileInfo } from '../model/comment/CommentModule';
import { UploadFileModel } from '../model/common/CommonModule';

@Injectable({
  providedIn: 'root'
})
export class FileService {

  constructor(private http: HttpClient) { }

  saveFile(formData: FormData): Observable<UploadFileModel> {
    console.log("saveFile");

    return this.http.post<UploadFileModel>(`${environment.backendAddress}/file`,formData);
  }
}
