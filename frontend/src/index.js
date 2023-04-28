// import React from 'react';
// import ReactDOM from 'react-dom/client';
// import './index.css';
// import App from './App';
// import reportWebVitals from './reportWebVitals';
// import 'tachyons';



// const root = ReactDOM.createRoot(document.getElementById('root'));
// root.render(
//   <React.StrictMode>
//     <App />
//   </React.StrictMode>
// );



// reportWebVitals();



 

import React from 'react';
import { createRoot } from 'react-dom/client';
import './index.css';
import App from './App';
// import registerServiceWorker from './registerServiceWorker';
import 'tachyons';

const root = createRoot(document.getElementById('root'));

root.render(<App />)

