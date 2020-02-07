const admin = require('firebase-admin')
const { google } = require('googleapis')
const axios = require('axios')

const MESSAGING_SCOPE = 'https://www.googleapis.com/auth/firebase.messaging'
const SCOPES = [MESSAGING_SCOPE]

const serviceAccount = require('./fcm-3e67f-firebase-adminsdk-tp9kj-4616320b83.json')
const databaseURL = 'https://fcm-3e67f.firebaseio.com'
const URL =
  'https://fcm.googleapis.com/v1/projects/fcm-3e67f/messages:send'
const deviceToken =
  'dzBgg9NvZHsxF3Z3QDcnmo:APA91bE3u9N5sWDzB4XgpTsOh474RSIh2VwiE7UfGTI_v4xdW_Co1UVaoiXB5cLrvueG3_4pYVMrKiNVT6UFsLyBsAuZAzCEB_HATvsu_YfD77twqhQhjGCKZ8MlW0M5Hllls3Qq_MNV'

admin.initializeApp({
  credential: admin.credential.cert(serviceAccount),
  databaseURL: databaseURL
})

function getAccessToken() {
  return new Promise(function(resolve, reject) {
    var key = serviceAccount
    var jwtClient = new google.auth.JWT(
      key.client_email,
      null,
      key.private_key,
      SCOPES,
      null
    )
    jwtClient.authorize(function(err, tokens) {
      if (err) {
        reject(err)
        return
      }
      resolve(tokens.access_token)
    })
  })
}

async function init() {
  const body = {
    message: {
      data: { key: 'value' },
      notification: {
        title: 'NARUEMON',
        body: '610112418040'
      },
      webpush: {
        headers: {
          Urgency: 'high'
        },
        notification: {
          requireInteraction: 'true'
        }
      },
      token: deviceToken
    }
  }

  try {
    const accessToken = await getAccessToken()
    console.log('accessToken: ', accessToken)
    const { data } = await axios.post(URL, JSON.stringify(body), {
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${accessToken}`
      }
    })
    console.log('name: ', data.name)
  } catch (err) {
    console.log('err: ', err.message)
  }
}

init()