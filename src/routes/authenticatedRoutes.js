/*!

=========================================================
* Black Dashboard PRO React - v1.0.0
=========================================================

* Product Page: https://www.creative-tim.com/product/black-dashboard-pro-react
* Copyright 2019 Creative Tim (https://www.creative-tim.com)

* Coded by Creative Tim

=========================================================

* The above copyright notice and this permission notice shall be included in all copies or substantial portions of the Software.

*/

import Dashboard from "views/Dashboard";
import Contributions from "views/Contributions";
import Uploads from "views/Uploads";
import Profile from "views/Profile";

const routes = [
  {
    path: "/dashboard",
    name: "Dashboard",
    icon: "tim-icons icon-chart-bar-32",
    component: Dashboard,
    layout: ""
  },
  {
    path: "/uploads",
    name: "Uploads",
    icon: "tim-icons icon-cloud-upload-94",
    component: Uploads,
    layout: ""
  },
  {
    path: "/contributions",
    name: "Contributions",
    icon: "tim-icons icon-vector",
    component: Contributions,
    layout: ""
  },
  {
    path: "/profile",
    name: "Profile",
    icon: "tim-icons icon-single-02",
    component: Profile,
    layout: ""
  },
];

export default routes;
