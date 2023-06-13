import { Component, OnInit } from '@angular/core';
import {HttpClient} from '@angular/common/http'
import { interval } from 'rxjs';
import { take } from 'rxjs/operators';
import * as L from 'leaflet'

interface User{
  id?: number;
  name: string;
  latitude: number | null;
  longitude: number | null;
}
@Component({
  selector: 'app-tracking',
  templateUrl: './tracking.component.html',
  styleUrls: ['./tracking.component.css']
})
export class TrackingComponent implements OnInit {

  users: User[] = [
    { name: 'User 1', latitude: null, longitude: null },
    { name: 'User 2', latitude: null, longitude: null },
    { name: 'User 3', latitude: null, longitude: null },
    { name: 'User 4', latitude: null, longitude: null },
    { name: 'User 5', latitude: null, longitude: null }
  ];

  apiUrl = 'http://localhost:3000/users'
  map: L.Map | null = null

  constructor(private http: HttpClient) { }

  ngOnInit() {
    this.createMap()
    this.users.forEach((user) => {
      this.getUsersLocation(user);
    })
    this.updateUserLocationsPeriodically()
  }

  createMap(){
    this.map = L.map('map').setView([0, 0], 2);
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: 'Map data © <a href="https://openstreetmap.org">OpenStreetMap</a> contributors',
      maxZoom:18
    }).addTo(this.map)
  }

  getUsersLocation(user: User) {
      const watchId = navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        user.latitude = latitude;
        user.longitude = longitude;
        this.saveUserLocation(user);
        this.displayUserLocations();
        this.updateUserMarker(user);
      });
  }


  saveUserLocation(user: User){
    if(user.latitude && user.longitude){
      this.http.post<User>(this.apiUrl, user).subscribe((response)=>{
        user.id = response.id
      })
    }
  }

  updateUserLocationsPeriodically(){
    setInterval(()=>{
      this.users.forEach((user) => {
        if(user.latitude && user.longitude){
          this.http.put<User>(`${this.apiUrl}/${user.id}`, user).subscribe()
        }
      })
    }, 300000)
  }

  displayUserLocations() {
    let html = '';
    this.users.forEach((user, index) => {
      if (typeof user.latitude !== null && user.longitude !== null) {
        let mapUrl = `https://maps.google.com/maps?q=${user.latitude},${user.longitude}&output=embed`;
        html += `<br>${user.name}: Latitude=${user.latitude}, Longitude=${user.longitude}`;
      } else {
        html += `<br>${user.name}: Latitude and longitude not available<br>`;
      }
    });
    let details = document.getElementById('details')
    details && (details.innerHTML = html);
  }

  updateUserMarker(user: User){
    if(user.latitude && user.longitude){
      let marker = L.marker([user.latitude, user.longitude]).addTo(this.map!)
      marker.bindPopup(user.name)
    }
  }

}
