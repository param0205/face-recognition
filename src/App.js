import React, { Component } from 'react';
import Particles from 'react-particles-js';
import Signin from './Components/Signin/Signin'; 
import Navigation from './Components/Navigation/Navigation';
import ImageLinkForm from './Components/ImageLinkForm/ImageLinkForm'; 
import Logo from './Components/Logo/Logo'; 
import Rank from './Components/Rank/Rank'; 
import Register from './Components/Register/Register'; 
import Facerecognition from './Components/Facerecognition/Facerecognition';
import './App.css';




    const particlesoptions={
		particles: {
			number:{
				value:100,
				density:{
					enable:true,
					value_area:800
				}
			}
			
		}
	}

  const initialstate={
      input: '',
      imageurl:'',
      box:{},
      route:'Signin' ,
      isSignedIn:false,
       user:{
        id:'',
       name:'',
       email:'',
       enteries:0,
       joined:''
  }
}
              
class App extends Component{
	constructor(){
		super();
		 this.state=initialstate;
			
	}         
             loadUser=(data)=>{
             this.setState({user:{
               id:data.id,
               name:data.name,
               email:data.email,
               enteries:data.enteries,
               joined:data.joined

             }})
             }

          calculateFacelocation=(data)=>{
          	
          	const clarifaiface=data.outputs[0].data.regions[0].region_info.bounding_box;
            const image=document.getElementById('inputimage');
            const width=Number(image.width);
            const height=Number(image.height);
  
            return{
            	leftCol:clarifaiface.left_col*width,
            	topRow:clarifaiface.top_row*height,
            	rightCol:width-(clarifaiface.right_col*width),
            	bottomRow:height-(clarifaiface.bottom_row*height)
            }
          }

          displayfacebox=(box)=>{
          	console.log(box);
          	this.setState({box:box});
          }

		onInputchange =(event)=>{
          this.setState({input:event.target.value});
		}

		onbuttonsubmit=()=>{
             this.setState({imageurl:this.state.input});
            fetch('http://localhost:3000/imageurl',{
            method:'post',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
              input:this.state.input
              })
            })
            .then(response=>response.json())
            .then(response=>{
              if(response){
                fetch('http://localhost:3000/image',{
            method:'put',
            headers:{'Content-Type':'application/json'},
            body:JSON.stringify({
              id:this.state.user.id
              })
            })
                .then(response=>response.json())
                .then(count=>{
                  this.setState(Object.assign(this.state.user,{enteries:count}))
                    })
                  .catch(console.log)
                
               }
               this.displayfacebox(this.calculateFacelocation(response))
             })
            .catch(err=>console.log(err));
          }
           
           onRoutechange=(route)=>{
           	if(route==='signout')
           		{ this.setState(initialstate)}
           	else if (route==='home'){
           		this.setState({isSignedIn:true})
           	}

           	
           	this.setState({route:route})
           }

		
 

	    render(){
	    	const {imageurl,route,box,isSignedIn}=this.state;
        return ( 

        <div className="App">
        <Particles className='particles'
        params={particlesoptions}
        />
        
        <Navigation isSignedIn={isSignedIn} onRoutechange={this.onRoutechange}/>
        { route==='home' 
          ?
         <div>
         <Logo/>
        <Rank 
        name={this.state.user.name}
        enteries={this.state.user.enteries}/>
        <ImageLinkForm 
         onInputchange={this.onInputchange}
         onbuttonsubmit={this.onbuttonsubmit}/>

         <Facerecognition box={box} imageurl={imageurl}/>
          </div>
          :( route ==='Signin'
          ?
          <Signin loadUser={this.loadUser} onRoutechange={this.onRoutechange}/>
           :
          <Register loadUser={this.loadUser} onRoutechange={this.onRoutechange}/>
           )
          }
       
        </div>
        );
    }
}


export default App;