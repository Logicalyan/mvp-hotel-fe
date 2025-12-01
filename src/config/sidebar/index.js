import adminNav from "./admin";
import customerNav from "./customer";
import hotelNav from "./hotel";
// import staffNav from "./staff";

export function getSidebar(role, hotelId) {
    switch (role) {
        case "admin":
            return adminNav;

        case "customer":
            return customerNav;

        case "hotel":
            return hotelNav(hotelId); // butuh hotel_id

        default:
            return [];
    }
}
