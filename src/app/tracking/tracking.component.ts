import { Component, OnInit } from '@angular/core';

interface User{
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

  constructor() { }

  ngOnInit() {
    this.getUsersLocation();

  }

  getUsersLocation() {
    this.users.forEach((user: User, index: number) => {
      const watchId = navigator.geolocation.watchPosition((position) => {
        const { latitude, longitude } = position.coords;
        this.users[index].latitude = latitude;
        this.users[index].longitude = longitude;
        this.displayUserLocations();
      });
    });
  }

  displayUserLocations() {
    let html = '';
    this.users.forEach((user, index) => {
      if (typeof user.latitude !== null && user.longitude !== null) {
        let mapUrl = `https://maps.google.com/maps?q=${user.latitude},${user.longitude}&output=embed`;
        html += `<br>${user.name}: Latitude=${user.latitude}, Longitude=${user.longitude}<br><iframe width="700" height="300" src=${mapUrl}></iframe><br>`;
      } else {
        html += `<br>${user.name}: Latitude and longitude not available<br>`;
      }
    });
    let details = document.getElementById('details')
    details && (details.innerHTML = html);
  }

}
