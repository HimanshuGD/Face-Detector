import React, { Component } from 'react';
import './App.css';
import Navigation from './components/Navigation/Navigation'
import Logo from './components/Logo/Logo';
import ImageLinkForm from './components/ImageLinkForm/ImageLinkForm';
import FaceRecognition from './components/FaceRecognition/FaceRecognition';
import Rank from './components/Rank/Rank';
import ParticlesBg from 'particles-bg';
import Signin from './components/Signin/Signin';
import Register from './components/Register/Register';


// import Clarifai from 'clarifai';

// const app = new Clarifai.App({
//   apiKey:'08f6868a04ee4c059c4bdd36fbbf0ee0'
// });


const returnClarifaiRequestOptions = (imageUrl) => {
  const PAT = '17167b2a6220469e97e0e542570fdec2';
  const USER_ID = 'himuphd';
  const APP_ID = 'test';
  // const MODEL_ID = 'face-detection';
  const IMAGE_URL = imageUrl;
  const raw = JSON.stringify({
    "user_app_id": {
      "user_id": USER_ID,
      "app_id": APP_ID
    },
    "inputs": [
      {
        "data": {
          "image": {
            "url": IMAGE_URL
          }
        }
      }
    ]
  });
  const requestOptions = {
    method: 'POST',
    headers: {
      'Accept': 'application/json',
      'Authorization': 'Key ' + PAT
    },
    body: raw
  };
  return requestOptions;
}

class App extends Component {
  constructor() {
    super();
    this.state =  {
      input: '',
      imageUrl: '',
      box: {},
      route: 'signin',
      isSignIn:false,
      user:{
        id:'',
        name:'',
        email:'',
        entries:0,
        joined:''
      }
    }
  }

  loadUser = (data) => {
    this.setState({user: {
      id: data.id,
      name: data.name,
      email: data.email,
      entries: data.entries,
      joined: data.joined
    }})
  }


  // componentDidMount(){
  //   fetch('http://localhost:3000')
  //     .then(response=>response.json())
  //   //  .then(data=>console.log(data))
  // }


  calculateFaceLocation = (data) => {
    if (!data || !data.outputs || !data.outputs[0].data || !data.outputs[0].data.regions || data.outputs[0].data.regions.length < 1 || !data.outputs[0].data.regions[0].region_info || !data.outputs[0].data.regions[0].region_info.bounding_box) {
      return {};
    }
    const clarifaiFace = data.outputs[0].data.regions[0].region_info.bounding_box;

    const image = document.getElementById('inputimage');
    const width = Number(image.width);
    const height = Number(image.height);
    return {
      leftCol: clarifaiFace.left_col * width,
      topRow: clarifaiFace.top_row * height,
      rightCol: width - (clarifaiFace.right_col * width),
      bottomRow: height - (clarifaiFace.bottom_row * height)
    }
  }

  displayFaceBox = (box) => {
    this.setState({ box: box });
  }

  onInputChange = (event) => {
    this.setState({ input: event.target.value });
  }

  onButtonSubmit = () => {
    this.setState({ imageUrl: this.state.input });
    fetch("https://api.clarifai.com/v2/models/face-detection/outputs", returnClarifaiRequestOptions(this.state.input))
      .then(response => response.json())
      .then(response => {
        if (response) {
          fetch('http://localhost:3000/image', {
            method: 'put',
            headers: {'Content-Type': 'application/json'},
            body: JSON.stringify({
              id: this.state.user.id
            })
          })
            .then(response => response.json())
            .then(count => {
              this.setState({user:{
                entries:count
              }})
            })

        }
        this.displayFaceBox(this.calculateFaceLocation(response))
      })
      .catch(err => console.log(err));
  }

  onRouteChange = (route) => {
    if(route==='signout'){
      this.setState({isSignIn:false})
    }else if(route==='home'){
      this.setState({isSignIn:true})
    }
    this.setState({ route: route});
  }


  render() {
    const {isSignIn,imageUrl,route,box}=this.state;
    return (
      <div className='App'>
        <ParticlesBg type="cobweb" bg={true} />
        <Navigation isSignIn={isSignIn} onRouteChange={this.onRouteChange} />
        {route === 'home'
          ? <div>
              <Logo />
              <Rank 
              name={this.state.user.name}
              entries={this.state.user.entries}
              />
              <ImageLinkForm
                onInputChange={this.onInputChange}
                onButtonSubmit={this.onButtonSubmit}
              />
              <FaceRecognition box={box} imageUrl={imageUrl} />
            </div>
            :(
              route==='signin'
              ?<Signin loadUser={this.loadUser} onRouteChange={this.onRouteChange} />
              :<Register loadUser={this.loadUser} onRouteChange={this.onRouteChange}/>
            )
        }
      </div>
    );
  }
}
export default App;




