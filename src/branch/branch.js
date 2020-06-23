import branch from 'branch-sdk'

let API_KEY
const hostname = window && window.location && window.location.hostname, isLiveSite = hostname === "artist.revibe.tech";

if(isLiveSite)
  API_KEY = "key_live_hcNx1fPYpjfbxHnpxmCF0dhawsaUvKMg"
else
  API_KEY = "key_test_chVy1aR5nhohrMhizivwKgmaDAjPzKC5"

const getLinkBySiteState = () => {
  return isLiveSite ? "https://artist.revibe.tech/" : `http://${hostname === "localhost" ? "localhost:3000" : hostname}/`
}

// Initialize Branch
branch.init(API_KEY)

export const setIdentity = (userId) => {
  // This should be the users actual id that will never change
  var userIdStr = `${userId}`

  branch.setIdentity(userIdStr, (err, data) => {
    if(err) console.log(err)
  })
}

export const logout = () => {
  // Call this on logout to clear user data
  branch.logout()
}

/**
 * Create Link
 * --------------
 * Creates a deep link with the specified parameters (WIP)
 * 
 * @returns {String} link
 * @throws error
 */
const createLink = (linkData={}) => {
  return new Promise((resolve, reject) => {
    branch.link(linkData, (err, link) => {
      if(err) reject(err)
      else resolve(link)
    })
  })
}

export const createArtistReferralLink = async (channel, userId) => {
  var canonicalId = `referral:artist:${userId}`

  var linkData = {
    channel: channel,
    campaign: "artist-invite",
    feature: "referral",
    tags: [ "revibe-artists", "auto" ],
    data: {
      "$canonical_identifier": canonicalId,
      "$og_title": `Join Revibe`,
      "$og_description": `Revibe lets you run your entire music career in one place!`,
      "$og_image_url": ``,
      "$web_only": true,
      "$desktop_url": `${getLinkBySiteState()}account/register?uid=${userId}`
    }
  };
  
  try {
    var link = await createLink(linkData)

    return link
  } catch(err) {
    throw err
  }
} 

export const createFanReferralLink = async (channel, userId, displayName) => {
  var canonicalId = `referral:artist:${userId}`

  var linkData = {
    channel: channel,
    campaign: "artist-invite",
    feature: "referral",
    tags: [ "revibe-music", "auto" ],
    data: {
      "$canonical_identifier": canonicalId,
      "$og_title": `Join Revibe Music`,
      "$og_description": `Stream ${displayName}'s music on Revibe Music!`,
      "$og_image_url": ``
    }
  };
  
  try {
    var link = await createLink(linkData)

    return link
  } catch(err) {
    throw err
  }
}