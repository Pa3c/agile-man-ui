import { DatePipe } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormControl } from '@angular/forms';
import { DomSanitizer } from '@angular/platform-browser';
import { ActivatedRoute } from '@angular/router';
import { debounceTime, finalize, switchMap, tap } from 'rxjs/operators';
import { Constants } from 'src/app/model/common/CommonModule';
import { User, UserSpecialization } from 'src/app/model/user/UserModule';
import { AppUserService } from 'src/app/service/app-user.service';
import { UserSpecializationService } from 'src/app/service/user-specialization.service';
import { UserService } from 'src/app/service/user.service';

@Component({
  selector: 'app-profile',
  templateUrl: './profile.component.html',
  styleUrls: ['./profile.component.css']
})
export class ProfileComponent implements OnInit {
  user: User;
  tempUser: User = null;
  tempValue: any;
  editMode = false;
  isLoading = false;
  specializations: UserSpecialization[] = [];
  filteredSpecs: UserSpecialization[] = [];
  specsCtrl = new FormControl();


  constructor(private specializationService: UserSpecializationService, private domSanitizer: DomSanitizer, private datePipe: DatePipe, private route: ActivatedRoute, private appUserService: AppUserService, private userService: UserService) { }

  ngOnInit(): void {
    let login: string;
    this.route.params.subscribe(params => login = params['id']);
    this.appUserService.get(login).subscribe((success: User) => {
      this.user = success;
      // let x = atob(this.user.photo);
      // this.domSanitizer.bypassSecurityTrustUrl(x);
      // this.user.photo = x;
      // console.log(this.user);
    })
    this.specializationService.getAllUserSpec(login).subscribe((success: UserSpecialization[]) => {
      this.specializations = success;
      console.log(this.specializations);
    }, error => console.log(error));


    this.specsCtrl.valueChanges.pipe(
      debounceTime(500),
      tap(() => {
        this.filteredSpecs = [];
        this.isLoading = true;
      }),
      switchMap(value => {
        this.tempValue = value;
        if (typeof value == "object") {
          return [];
        }
        return this.specializationService.getFiltered(value)
          .pipe(
            finalize(() => { this.isLoading = false; })
          );
      }
      )).subscribe((data: UserSpecialization[]) => {
        if (data.length > 0) {
          this.filteredSpecs = data;
        } else {
          let spec = new UserSpecialization();
          spec.id = this.tempValue;
          spec.skill = 0;
          this.filteredSpecs = [spec];
        }
        console.log(this.filteredSpecs);
        this.tempValue = null;
      });
  }

  showEditMode() {
    this.tempUser = new User();
    this.editMode = true;
    Object.assign(this.tempUser, this.user);
  }
  cancelEditMode() {
    console.log(this.tempUser);

    this.editMode = false;
    this.tempUser = null;
  }
  saveEditMode() {

    this.tempUser.birthday = this.datePipe.transform(new Date(this.tempUser.birthday), Constants.dtFormat);
    this.appUserService.update(this.tempUser).subscribe(
      (success: User) => {
        this.user = success;
        // this.user.photo = atob(this.user.photo);
        // this.domSanitizer.bypassSecurityTrustUrl(this.user.photo);
        console.log(this.user);
        this.cancelEditMode();
      },
      error => {
        console.log(error);
        this.cancelEditMode();
      });

  }

  selectedSpec(event: any) {
    console.log(event);

    this.specializationService.addUserSpec(this.user.login, event.option.value).subscribe((success: UserSpecialization) => {
      this.specializations.push(success)
      console.log(this.specializations);

    }, error => { console.log(error); this.specsCtrl.setValue(null); });
  }

  updateProfilePicture(files: FileList) {
    console.log("TO DO ");

    // const file = files.item(0);
    // if (file.size > 2000000) {
    //   console.log("Too large file !");
    //   return;
    // }
    // const reader = new FileReader();
    // reader.readAsDataURL(file);
    // reader.onload = () => {
    //   this.editMode = false;
    //   this.tempUser.photo = btoa(reader.result as string);
    //   console.log();

    //   // this.editMode = false;
    // }
    // reader.onerror = function (error) {
    //   console.log('Error: ', error);
    // };
  }

  deleteUserSpecialization(spec: UserSpecialization) {
    this.specializationService.deleteUserSpec(spec.id, this.user.login).subscribe(success => {
      const index = this.specializations.findIndex(x => x.id == spec.id);
      this.specializations.splice(index, 1);
    })
  }

  updateSpec(value: number, specIndex) {
    const spec = this.specializations[specIndex];
    this.specializations[specIndex].skill = spec.skill == value ? 0 : value;
    this.specializationService.updateUserSpec(this.user.login,spec).subscribe(success=>console.log(success),error=>console.log(error));
  }
}
