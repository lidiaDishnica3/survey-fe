import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class StorageService {

  constructor() { }

  setStorage(item, data) {
    return localStorage.setItem(item, data);
  }

  getStorage(item) {
    return localStorage.getItem(item);
  }

  removeStorage(item) {
    return localStorage.removeItem(item);
  }

  setAuthToken(token) {
    return this.setStorage('token', token);
  }

  getAuthToken() {
    return this.getStorage('token');
  }

  removeAuthToken() {
    return this.removeStorage('token');
  }

  clearALl(){
    localStorage.clear();
  }

}
