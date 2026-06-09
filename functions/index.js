const { onDocumentCreated, onDocumentUpdated } = require('firebase-functions/v2/firestore');
const { initializeApp }    = require('firebase-admin/app');
const { getFirestore }     = require('firebase-admin/firestore');
const webpush              = require('web-push');

initializeApp();

const VAPID_PUBLIC  = 'BJmTB2kh9NiPFFvCFf0TLoHBRjjYRb8Z7zWWod6orY5BpaY1es7wrNsriqi4eiOUz-AmIogjR_6CpwwkPQ2WtQE';
const VAPID_PRIVATE = '8cA6jWP69xa61B4vZYnQxwHQRDagBCSgVIDi1kf0fwE';

webpush.setVapidDetails('mailto:akos.levardy@innovatrics.com', VAPID_PUBLIC, VAPID_PRIVATE);

async function notify(title, body) {
  const snap    = await getFirestore().collection('push_subscriptions').get();
  const payload = JSON.stringify({ title, body });

  await Promise.all(snap.docs.map(async doc => {
    try {
      await webpush.sendNotification(doc.data().subscription, payload);
    } catch (err) {
      if (err.statusCode === 404 || err.statusCode === 410) {
        await doc.ref.delete();
      }
    }
  }));
}

exports.onDateAdded = onDocumentCreated('dates/{id}', event => {
  const d = event.data.data();
  return notify('New date idea added! 🗓️', d.text);
});

exports.onMovieHomeAdded = onDocumentCreated('movies_home/{id}', event => {
  const m = event.data.data();
  return notify('New movie added! 🎬', m.text);
});

exports.onMovieCinemaAdded = onDocumentCreated('movies_cinema/{id}', event => {
  const m = event.data.data();
  return notify('New movie added! 🎬', m.text);
});

exports.onDateDone = onDocumentUpdated('dates/{id}', event => {
  const before = event.data.before.data();
  const after  = event.data.after.data();
  if (!before.done && after.done)
    return notify(after.text, 'done Hehe 💕');
  return null;
});

exports.onMovieHomeDone = onDocumentUpdated('movies_home/{id}', event => {
  const before = event.data.before.data();
  const after  = event.data.after.data();
  if (!before.done && after.done)
    return notify(after.text || after.title || 'A movie', 'done Hehe 💕');
  return null;
});

exports.onMovieCinemaDone = onDocumentUpdated('movies_cinema/{id}', event => {
  const before = event.data.before.data();
  const after  = event.data.after.data();
  if (!before.done && after.done)
    return notify(after.text || after.title || 'A movie', 'done Hehe 💕');
  return null;
});
