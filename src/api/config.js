let backendHost;
let backendStorage;
const apiVersion = 'v1';

const hostname = window && window.location && window.location.hostname;

if(hostname === 'artist.revibe.tech') {
  backendHost = "https://api.revibe.tech/"
}
else {
  backendHost = 'http://test-env.myrpupud2p.us-east-2.elasticbeanstalk.com/'; // test environment
}

export const API_HOST = `${backendHost}${apiVersion}/`;
export const API_STORAGE = backendStorage;
