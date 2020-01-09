let backendHost;
const apiVersion = 'v1';

const hostname = window && window.location && window.location.hostname;

if(hostname === 'artist.revibe.tech') {
  // backendHost = 'https://api.revibe.tech'; // production environment
  backendHost = "http://prod-env.myrpupud2p.us-east-2.elasticbeanstalk.com/"
} else {
  backendHost = 'http://test-env.myrpupud2p.us-east-2.elasticbeanstalk.com/'; // test environment
}

export const API_ROOT = `${backendHost}${apiVersion}/`;
