// import React from 'react';
// import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
// import Navbar from './components/Navbar';
// import Footer from './components/Footer';
// import Home from './pages/Home';
// import RecipeDetails from './pages/RecipeDetails';
// import Login from './pages/Login';
// import Register from './pages/Register';

// function App() {
//   return (
//     <Router>
//       <div className="min-h-screen bg-ctp-base flex flex-col">
//         <Routes>
//           <Route path="/login" element={<Login />} />
//           <Route path="/register" element={<Register />} />
//           <Route
//             path="/*"
//             element={
//               <div className="flex flex-col min-h-screen">
//                 <Navbar />
//                 <div className="flex-1">
//                   <Routes>
//                     <Route path="/" element={<Home />} />
//                     <Route path="/recipe/:id" element={<RecipeDetails />} />
//                   </Routes>
//                 </div>
//                 <Footer />
//               </div>
//             }
//           />
//         </Routes>
//       </div>
//     </Router>
//   );
// }

// export default App;


import React from "react";
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Home from "./pages/Home";
import RecipeDetails from "./pages/RecipeDetails";
import Login from "./pages/Login";
import Register from "./pages/Register";
import ProtectedRoute from "./components/ProtectedRoute";

function App() {
  return (
    <Router>
      <div className="min-h-screen bg-ctp-base flex flex-col">
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Protected layout */}
          <Route
            path="/*"
            element={
              <ProtectedRoute>
                <div className="flex flex-col min-h-screen">
                  <Navbar />
                  <div className="flex-1">
                    <Routes>
                      <Route path="/" element={<Home />} />
                      <Route path="/recipe/:id" element={<RecipeDetails />} />
                    </Routes>
                  </div>
                  <Footer />
                </div>
              </ProtectedRoute>
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;
