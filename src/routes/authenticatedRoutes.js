import Dashboard from "views/Stats/Dashboard";

import YourSongs from "views/YourSongs/index";
import Uploads from "views/YourSongs/Uploads";
import Contributions from "views/YourSongs/Contributions";
import AlbumUpload from "views/YourSongs/AlbumUpload";
import EditAlbum from "views/YourSongs/EditAlbum";

import Account from "views/Account/index";
import Relink from "views/Relink/index";

import Feedback from "views/Feedback";
import FAQPage from "views/FAQ";
import ReferralsPage from "views/Referrals/index";

const routes = [
  {
    path: "/dashboard/stats",
    name: "Stats",
    icon: "tim-icons icon-chart-bar-32",
    component: Dashboard,
    layout: "",
    toolTipMessage: "Page to view metrics",
    showInSidebar: true
  },
  {
    path: "/dashboard/uploads",
    name: "Tracks",
    icon: "tim-icons icon-headphones",
    component: YourSongs,
    layout: "",
    toolTipMessage: "Upload/Edit songs & albums",
    showInSidebar: true
  },
  {
    path: "/dashboard/uploads/new",
    name: "Upload Album",
    icon: "tim-icons icon-cloud-upload-94",
    component: AlbumUpload,
    layout: "",
    showInSidebar: false
  },
  {
    path: "/dashboard/uploads/edit/:album_id",
    name: "Edit Album",
    icon: "tim-icons icon-cloud-upload-94",
    component: EditAlbum,
    layout: "",
    showInSidebar: false
  },
  {
    path: "/dashboard/contributions",
    name: "Contributions",
    icon: "tim-icons icon-vector",
    component: Contributions,
    layout: "",
    toolTipMessage: "View/Edit contributions",
    showInSidebar: false
  },
  {
    path: "/dashboard/relink",
    name: "Relink",
    icon: "tim-icons icon-link-72",
    component: Relink,
    layout: "",
    toolTipMessage: "View/Edit profile",
    showInSidebar: true
  },
  {
    path: "/dashboard/account",
    name: "Account",
    icon: "tim-icons icon-single-02",
    component: Account,
    layout: "",
    toolTipMessage: "View/Edit profile",
    showInSidebar: true
  },
  {
    path: "/dashboard/contact",
    name: "Feedback",
    icon: "tim-icons icon-notes",
    component: Feedback,
    layout: "",
    toolTipMessage: "Tell us what you think!",
    showInSidebar: false
  },
  {
    path: "/dashboard/invite",
    name: "Invite",
    icon: "far fa-paper-plane",
    component: ReferralsPage,
    layout: "",
    toolTipMessage: "Invite artists and users!",
    showInSidebar: true
  },
  {
    path: "/dashboard/help",
    name: "Help",
    icon: "fa fa-question",
    component: FAQPage,
    layout: "",
    toolTipMessage: "Need help?",
    showInSidebar: true
  },
];

export default routes;
