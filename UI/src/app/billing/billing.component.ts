import { Component, OnInit } from '@angular/core';
import { Http } from '@angular/http';
import * as io from "socket.io-client";
@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.css']
})
export class BillingComponent implements OnInit {

  socket = io('http://localhost:8000');
  constructor(private http: Http) { }
  rows = [];
  filtered = [];
  newdata = [];
  ngOnInit() {
    this.socket.on('address', function (data) {
      console.log(data);
      this.load();
    }.bind(this));
    this.load();

  }
  load = function () {
    this.http.get('http://localhost:8000/load').subscribe(data => {
      this.rows = JSON.parse(data["_body"]);
    });
  }
  search = function (event) {
    this.filtered = [];
    var sr = event.query;
    for (let i = 0; i < this.rows.length; i++) {
      let brand = this.rows[i].product_code;
      if (brand.toLowerCase().indexOf(sr.toLowerCase()) == 0) {
        this.filtered.push(brand);
      }
    }
    for (let i = 0; i < this.rows.length; i++) {
      let brand1 = this.rows[i].product_name;
      if (brand1.toLowerCase().indexOf(sr.toLowerCase()) == 0) {
        this.filtered.push(brand1);
      }
    }
  }

  addedproducts = function () {
    var name = this.val;
    for (let i = 0; i < this.newdata.length; i++) {
      if (name == this.newdata[i].product_code||name == this.newdata[i].product_name) {
        return alert("Already added to the cart");
      }
    }
    for (let i = 0; i < this.rows.length; i++) {
      let brand = this.rows[i].product_code;
      const body = { product_code:brand, product_name:this.rows[i].product_name , product_price: this.rows[i].product_price, product_gst: this.rows[i].product_gst };
      this.hundred = 100;
      if (name == brand) {
        this.newdata.push(body);
      }
    }

    for (let i = 0; i < this.rows.length; i++) {
      let brand1= this.rows[i].product_name;
      const body = { product_code: this.rows[i].product_code, product_name:brand1 , product_price: this.rows[i].product_price, product_gst: this.rows[i].product_gst };
      this.hundred = 100;
      if (name == brand1) {
        this.newdata.push(body);
      }
    }
  }
  total = 0;
  editquantity = function () {
    this.total = 0;
    for (let i of this.newdata) {
      if (i.quantity) {
        this.total += i.product_price * Number(i.quantity) * i.product_gst / 100 + i.product_price * Number(i.quantity);
      }
    }
  }

}