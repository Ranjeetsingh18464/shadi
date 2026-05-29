const functions = require('firebase-functions');
const admin = require('firebase-admin');
const cors = require('cors')({ origin: true });

admin.initializeApp();

const db = admin.firestore();

// ============= AUTH TRIGGERS =============

// Send welcome notification on new user signup
exports.onUserCreated = functions.auth.user().onCreate(async (user) => {
  await db.collection('notifications').add({
    userId: user.uid,
    title: 'Welcome to lakh_khushiya.com!',
    body: 'Complete your profile to start finding matches.',
    type: 'system',
    read: false,
    createdAt: admin.firestore.FieldValue.serverTimestamp(),
  });
});

// Cleanup user data on delete
exports.onUserDeleted = functions.auth.user().onDelete(async (user) => {
  const batch = db.batch();

  // Delete user document
  batch.delete(db.collection('users').doc(user.uid));

  // Delete conversations
  const conversations = await db.collection('conversations')
    .where('participants', 'array-contains', user.uid)
    .get();
  conversations.forEach(doc => batch.delete(doc.ref));

  // Delete messages
  const messages = await db.collection('messages')
    .where('senderId', '==', user.uid)
    .get();
  messages.forEach(doc => batch.delete(doc.ref));

  await batch.commit();
});

// ============= PAYMENT FUNCTIONS =============

// Create payment intent (example for Stripe)
exports.createPaymentIntent = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');

  const { amount, currency = 'INR', planType } = data;

  try {
    // Integrate Stripe here
    // const paymentIntent = await stripe.paymentIntents.create({ amount, currency });
    // return { clientSecret: paymentIntent.client_secret };

    return { success: true, message: 'Payment intent created' };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// Verify payment and activate subscription
exports.verifyPayment = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');

  const { paymentId, planType, transactionId } = data;

  try {
    // Verify payment with gateway
    // const payment = await stripe.paymentIntents.retrieve(paymentId);

    // Update user subscription
    await db.collection('users').doc(context.auth.uid).update({
      accountType: planType,
      subscriptionId: transactionId,
      subscriptionStart: admin.firestore.FieldValue.serverTimestamp(),
      subscriptionEnd: admin.firestore.Timestamp.fromDate(
        new Date(Date.now() + 365 * 24 * 60 * 60 * 1000)
      ),
    });

    // Log payment
    await db.collection('payments').add({
      userId: context.auth.uid,
      amount: data.amount,
      planType,
      transactionId,
      status: 'completed',
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============= ADMIN FUNCTIONS =============

// Generate daily analytics report
exports.generateDailyReport = functions.pubsub.schedule('0 0 * * *').onRun(async (context) => {
  const today = new Date().toISOString().split('T')[0];

  const usersSnapshot = await db.collection('users').get();
  const premiumSnapshot = await db.collection('users').where('accountType', '==', 'premium').get();

  const report = {
    date: today,
    totalUsers: usersSnapshot.size,
    totalPremium: premiumSnapshot.size,
    newUsers: 0, // Would need daily tracking
    revenue: premiumSnapshot.size * 4999,
    generatedAt: admin.firestore.FieldValue.serverTimestamp(),
  };

  await db.collection('analytics').doc(today).set(report);
  return null;
});

// ============= MODERATION FUNCTIONS =============

// Auto-detect fake profiles
exports.detectFakeProfiles = functions.firestore
  .document('users/{userId}')
  .onUpdate(async (change, context) => {
    const before = change.before.data();
    const after = change.after.data();

    // Check for suspicious patterns
    if (after.profileComplete && !before.profileComplete) {
      const flags = [];

      // Incomplete profile
      if (!after.photoURL && !after.photos?.length) flags.push('no_photo');
      if (!after.about || after.about.length < 20) flags.push('short_bio');
      if (!after.education) flags.push('no_education');
      if (!after.profession) flags.push('no_profession');

      // Suspicious activity
      if (flags.length >= 3) {
        await db.collection('reports').add({
          userId: context.params.userId,
          reason: 'Potential fake profile',
          details: `Flags: ${flags.join(', ')}`,
          reportedAt: admin.firestore.FieldValue.serverTimestamp(),
          status: 'pending',
        });
      }
    }
  });

// ============= MATCHING FUNCTIONS =============

// Calculate compatibility score
exports.calculateCompatibility = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');

  const { profileId1, profileId2 } = data;

  try {
    const [profile1, profile2] = await Promise.all([
      db.collection('users').doc(profileId1).get(),
      db.collection('users').doc(profileId2).get(),
    ]);

    if (!profile1.exists || !profile2.exists) {
      throw new functions.https.HttpsError('not-found', 'Profile not found');
    }

    const p1 = profile1.data();
    const p2 = profile2.data();

    let score = 0;
    let total = 0;

    if (p1.religion === p2.religion) { score += 15; total += 15; }
    if (p1.caste === p2.caste) { score += 10; total += 10; }
    if (p1.motherTongue === p2.motherTongue) { score += 10; total += 10; }
    if (p1.manglik === p2.manglik) { score += 10; total += 10; }
    if (p1.maritalStatus === p2.maritalStatus) { score += 5; total += 5; }
    if (p1.education === p2.education) { score += 10; total += 10; }
    if (Math.abs((p1.age || 0) - (p2.age || 0)) <= 3) { score += 10; total += 10; }
    if (p1.country === p2.country) { score += 5; total += 5; }
    if (p1.state === p2.state) { score += 5; total += 5; }

    return {
      compatibility: total > 0 ? Math.round((score / total) * 100) : 0,
      matchedFields: {
        religion: p1.religion === p2.religion,
        caste: p1.caste === p2.caste,
        motherTongue: p1.motherTongue === p2.motherTongue,
        manglik: p1.manglik === p2.manglik,
        education: p1.education === p2.education,
      }
    };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============= NOTIFICATION FUNCTIONS =============

// Send push notification
exports.sendNotification = functions.https.onCall(async (data, context) => {
  if (!context.auth) throw new functions.https.HttpsError('unauthenticated', 'Must be logged in');

  const { userId, title, body, type } = data;

  try {
    await db.collection('notifications').add({
      userId,
      title,
      body,
      type: type || 'general',
      read: false,
      createdAt: admin.firestore.FieldValue.serverTimestamp(),
    });

    return { success: true };
  } catch (error) {
    throw new functions.https.HttpsError('internal', error.message);
  }
});

// ============= CLEANUP FUNCTIONS =============

// Clean up expired subscriptions daily
exports.cleanupExpiredSubscriptions = functions.pubsub.schedule('0 2 * * *').onRun(async (context) => {
  const now = admin.firestore.Timestamp.now();

  const expiredUsers = await db.collection('users')
    .where('subscriptionEnd', '<', now)
    .where('accountType', '==', 'premium')
    .get();

  const batch = db.batch();
  expiredUsers.forEach(doc => {
    batch.update(doc.ref, {
      accountType: 'free',
      subscriptionId: null,
      subscriptionEnd: null,
    });
  });

  await batch.commit();
  console.log(`Cleaned up ${expiredUsers.size} expired subscriptions`);
  return null;
});
