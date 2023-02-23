import { Injectable } from '@angular/core';
import { ApiService } from '../api/api.service';
import { StorageService } from '../storage/storage.service';
import { Pagination } from '../../components/shared/Pagination';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private getUserProfile = 'User/GetUser';
  private getUsersEndpoint = 'User/GetAll';
  private postLoginEndpoint = 'User/Login';
  private postLogoutEndpoint = 'User/Logoff';
  private changeProfileEndpoint = 'User/ChangeUserProfile';
  private postRegisterEndpoint = 'User/Register';
  private deleteEndpoint = 'User/Delete';
  private getByIdEndpoint = 'User/GetById';

  constructor(private apiService: ApiService, private storageService: StorageService) { }

  getUser() {
    return this.apiService.get(this.getUserProfile);
  }
  getAll(pagination?: Pagination) {
    let url = `${this.getUsersEndpoint}`;

    if (pagination != null) {
      url = `${url}?$skip=${pagination.Skip}&$top=${pagination.PageSize}`;
    }
    return this.apiService.get(url);
  }

  changeProfile(data) {
    return this.apiService.put(this.changeProfileEndpoint, data);
  }

  registerUser(data) {
    return this.apiService.post(this.postRegisterEndpoint, data);
  }

  postLogin(data) {
    return this.apiService.post(this.postLoginEndpoint, data);
  }

  postLogout() {
    return this.apiService.post(this.postLogoutEndpoint, null);
  }

  isLoggedIn() {
    return !!this.storageService.getAuthToken();
  }

  logOut() {
    return this.storageService.removeAuthToken();
  }
  deleteUser(id) {
    var data = this.apiService.get(this.getByIdEndpoint + '/' + id);
    return this.apiService.delete(this.deleteEndpoint + '/' + id, data);
  }
}
