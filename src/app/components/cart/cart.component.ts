import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { CartService } from 'src/app/services/cart.service';
import { LoadService } from 'src/app/services/load.service';


@Component({
  selector: 'app-cart',
  templateUrl: './cart.component.html',
  styleUrls: ['./cart.component.css']
})
export class CartComponent {

  dataCart:any;
  urlCash:any;
  arrayOfAdd:any[] = [];
  

  constructor(private _CartService:CartService,private _LoadService:LoadService){}

  //========== start on init ==========
  ngOnInit(){
    this._LoadService.isTrue();
    this._CartService.getProductFromCart().subscribe({
      next:(response)=>{
        this.dataCart = response;
        this._LoadService.isFalse();
      },
      error:(err)=>{
        console.log('cart > getProductFromCart' , err);
        this._LoadService.isFalse();
      }
    })
  }


  //========== start update count ==========
  update(id:any , count:number){
    this.arrayOfAdd.push(id);
    this._CartService.updateProductFromCart(id,count).subscribe({
      next:(response)=>{
        this.dataCart = response;
        this.arrayOfAdd.splice(this.arrayOfAdd.indexOf(id),1);
      },
      error:(err)=>{
        console.log('cart > update' , err);
        this.arrayOfAdd.splice(this.arrayOfAdd.indexOf(id),1);
      }
    })
  }

  //========= delete one cart ==========

  remove(id:any){
    this.arrayOfAdd.push(id);
    this._CartService.deleteProductFromCart(id).subscribe({
      next:(response)=>{
        this.dataCart = response;
        this._CartService.numOfCartItems.next(response.numOfCartItems);
        this.arrayOfAdd.splice(this.arrayOfAdd.indexOf(id),1);
        if(this._CartService.numOfCartItems.value ==0){

          this.dataCart = null;
        }
      },
      error:(err)=>{
        console.log('cart > remove' , err);
        this.arrayOfAdd.splice(this.arrayOfAdd.indexOf(id),1);
      }
    })
  }

  //========= delete All cart ==========

  deleteAll(){
    this.arrayOfAdd.push('remove');
    this._CartService.deleteAllProductFromCart().subscribe({
      next:(response)=>{
        this.dataCart = null;
        this._CartService.numOfCartItems.next(0);
        this.arrayOfAdd.splice(this.arrayOfAdd.indexOf('remove'),1);

      },
      error:(err)=>{
        console.log('cart > remove' , err);
        this.arrayOfAdd.splice(this.arrayOfAdd.indexOf('remove'),1);
      }
    })
  }

  //========== check out ==========

  checkForm:FormGroup = new FormGroup({
    details:new FormControl(null),
    phone:new FormControl(null),
    city:new FormControl(null),
  });


  urlDirect(url:any){
    window.location.href = url;
  }

  checkOut(checkForm:FormGroup , id:any){
    console.log(checkForm.value , id);
    
    this._CartService.chechkOutFunc(checkForm.value,id).subscribe({
      next:(response)=>{
        this.urlCash = response;
        this.urlDirect(this.urlCash.session.url)
        
      },
      error:(err)=>{
        console.log('cart > check out',err);
        
      }})

  }



}
