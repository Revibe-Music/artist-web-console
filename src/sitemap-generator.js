require("babel-register")({
  presets: ["es2015", "react"]
});

const API_HOST = "https://api.revibe.tech/v1/";
 
const router = require("./sitemap-routes").default;
const Sitemap = require("react-router-sitemap").default;
const axios = require("axios");

async function request(endpoint) {
  return axios({
    url: API_HOST + endpoint,
    method: "GET",
    headers: {
      "Content-Type": "application/json"
    },
    responseType: "json"
  })
}

async function generateSitemap() {
  try {
    const paramsConf = {}

    return (
      new Sitemap(router)
        .applyParams(paramsConf)
        .build("https://artist.revibe.tech")
        .save("./public/sitemap.xml")
    );
  } catch(e) {
    console.log("Error when generating the sitemap!")
    console.log(e)
  }
}

generateSitemap()
.then(() => console.log("Sitemap generated!"))
.catch(err => {
  console.log("Error when generating the sitemap!")
  console.log(err)
})
.finally(() => process.exit())