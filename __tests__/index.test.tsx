import "@testing-library/jest-dom";
import { render } from "@testing-library/react";
import Home from "../src/app/page";

jest.mock("next/navigation", () => ({
  useRouter: () => ({
    route: "/",
    pathname: "/",
    query: "",
    asPath: "/",
  }),
}));

describe("Home", () => {
  it("renders without crashing", () => {
    render(<Home />);
  });
});
