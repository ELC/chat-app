import { Component, OnInit,} from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import 'rxjs/add/observable/interval';
import {Observable} from 'rxjs/Rx';

@Component({ 
  selector: 'app-chat',
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent implements OnInit {

  constructor(private http: HttpClient) { }
  
  items = [];
  username = "";
  inputValue;
  itemsJSON;
  DB_URL = 'https://wt-5fc6cb60e41eaeeb967dd305f92ba74a-0.sandbox.auth0-extend.com/express-with-mongo-db'
  start_time = new Date();


  ngOnInit() {
    this.itemsJSON = this.http.get(this.DB_URL);

    this.updateMessages();

    this.http.get('https://randomuser.me/api/').subscribe(data => {
          
      if (!data || !('results' in data)){
        data = {};
      }

      this.username = data['results'][0]['name']['first'];
    });

    Observable.interval(1000).subscribe(() => {
      this.updateMessages();
    });
    
  }

  saveItems(element){
    let json = JSON.stringify(element);
    let headers = new HttpHeaders().set('content-type','application/json');
    this.http.put(this.DB_URL, json, {headers: headers}).subscribe();
  }

  getTime(){
    let time = new Date();
    let hour = time.getHours();
    let hourString = hour.toString();

    if (hour < 10){
      hourString = "0" + hourString;
    }

    let minutes = time.getMinutes();
    let minutesString = minutes.toString()

    if (minutes < 10){
      minutesString = "0" + minutesString;
    }

    return hourString + ":" + minutesString;

  }

  addNew(){
    if (!this.inputValue) {
      return
    }

    let element = {
      name:this.inputValue, 
      user:this.username,
      time:this.getTime(),
      timestamp: new Date(),
    };

    this.saveItems(element);
    this.inputValue = "";
  }

  updateMessages() {
    this.itemsJSON.subscribe(data => {
      
      if (!data){
        return;
      }

      data.reverse();
      
      if (JSON.stringify(data) !== JSON.stringify(this.items)){
        this.items = data.filter(e => new Date(e.timestamp) >= this.start_time);
      }

    });
    
  }

}
