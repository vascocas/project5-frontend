import React from "react";
import { BrowserRouter as Router } from "react-router-dom";
import { render } from "@testing-library/react";
import Register from "./Register";

test("renders Register component", () => {
  render(
    <Router>
      <Register />
    </Router>
  );
});
