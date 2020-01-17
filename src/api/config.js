let backendHost;
let backendStorage;
const apiVersion = 'v1';

const hostname = window && window.location && window.location.hostname;

if(hostname === 'artist.revibe.tech') {
  // backendHost = 'https://api.revibe.tech'; // production environment
  backendHost = "http://prod-env.myrpupud2p.us-east-2.elasticbeanstalk.com/"
  backendStorage = "https://revibe-media.s3.amazonaws.com/media/images/"

}
else {
  backendHost = 'http://test-env.myrpupud2p.us-east-2.elasticbeanstalk.com/'; // test environment
  backendStorage = "https://revibe-media-test.s3.amazonaws.com/media/images/"
}

export const API_HOST = `${backendHost}${apiVersion}/`;
export const API_STORAGE = backendStorage;
