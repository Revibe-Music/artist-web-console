import branch from 'branch-sdk'

let API_KEY
const hostname = window && window.location && window.location.hostname, isLiveSite = hostname === "artist.revibe.tech";

if(isLiveSite)
  API_KEY = "key_live_hcNx1fPYpjfbxHnpxmCF0dhawsaUvKMg"
else
  API_KEY = "key_test_chVy1aR5nhohrMhizivwKgmaDAjPzKC5"

// Initialize Branch
branch.init(API_KEY)

export const setIdentity = (userId) => {
  // This should be the users actual id that will never change
  branch.setIdentity(userId)
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
const createLink = async (campaign, channel, feature, stage, tags, alias, data={}) => {
  var linkData = {
    campaign: campaign,
    channel: channel,
    feature: feature,
    stage: stage,
    tags: tags,
    alias: alias,
    data: data
  };

  try {
    var link = await branch.link(linkData)

    return link
  } catch(err) {
    throw err
  }
}

export const createArtistReferralLink = async (channel, userId, username) => {
  var canonicalId = `revibe:artist:${userId}`
  var data = {
    "$canonical_identifier": canonicalId,
    "$og_title": `ksfkdjfk`,
    "$og_desc": `dfsfdfwe`,
    "$og_image_url": ``,
  }
  
  try {
    var link = createLink(undefined, channel, "artist-referral", "None", [ "Revibe Artists" ])
  } catch(err) {
    throw err
  }
} 