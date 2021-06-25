import React from "react";
import ReactDOM from "react-dom";

// My components
import Header from "./components/Header";
import HomeGuest from "./components/HomeGuest";
import Footer from "./components/Footer";

function Main() {
  return (
    <>
      <Header />
      <HomeGuest />
      <Footer />
    </>
  );
}

ReactDOM.render(<Main />, document.querySelector("#app"));

if (module.hot) {
  module.hot.accept();
}
