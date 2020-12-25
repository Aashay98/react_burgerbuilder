import { configure, shallow } from "enzyme";
import Adapter from "enzyme-adapter-react-16";
import NavigationItems from "./NavigationItems";
import React from "react";
import NavigationItem from "./NavigationItem/NavigationItem";

configure({ adapter: new Adapter() });
describe("NavigationItems ", () => {
	let wrapper;
	beforeEach(() => {
		wrapper = shallow(<NavigationItems />);
	});
	it("it should render two NavigationItems elements if not authenticated", () => {
		expect(wrapper.find(NavigationItem)).toHaveLength(2);
	});
	it("it should render three NavigationItems elements if authenticated", () => {
		wrapper.setProps({ isAuth: true });
		expect(wrapper.find(NavigationItem)).toHaveLength(3);
	});
	it("if it contains a logout button", () => {
		wrapper.setProps({ isAuth: true });
		expect(
			wrapper.contains(
				<NavigationItem link="/logout">LogOut</NavigationItem>,
			),
		).toEqual(true);
	});
});
