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
import Account from "views/Account";
import Feedback from "views/Feedback";

const routes = [
  {
    path: "/dashboard/stats",
    name: "Stats",
    icon: "tim-icons icon-chart-bar-32",
    component: Dashboard,
    layout: "",
    toolTipMessage: "Page to view metrics"
  },
  {
    path: "/dashboard/uploads",
    name: "Uploads",
    icon: "tim-icons icon-cloud-upload-94",
    component: Uploads,
    layout: "",
    toolTipMessage: "Upload/Edit songs & albums"
  },
  {
    path: "/dashboard/contributions",
    name: "Contributions",
    icon: "tim-icons icon-vector",
    component: Contributions,
    layout: "",
    toolTipMessage: "View/Edit contributions"
  },
  {
    path: "/dashboard/account",
    name: "Account",
    icon: "tim-icons icon-single-02",
    component: Account,
    layout: "",
    toolTipMessage: "View/Edit profile"
  },
  {
    path: "/dashboard/feedback",
    name: "Feedback",
    icon: "tim-icons icon-notes",
    component: Feedback,
    layout: "",
    toolTipMessage: "Tell us what you think!"
  },
];

export default routes;
