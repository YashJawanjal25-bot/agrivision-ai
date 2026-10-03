import { auth, isFirebaseConfigured } from "../firebase/config";

/**
 * AgriVision AI — History Service
 *
 * Provides resilient two-tier persistence:
 * 1. Firebase Firestore (Cloud persistence for multi-device access)
 * 2. localStorage (Instant local cache and fallback)
 */

const LOCAL_STORAGE_KEY_PREFIX = "agrivision_history_";

function getStorageKey(userId) {
  return `${LOCAL_STORAGE_KEY_PREFIX}${userId || "guest"}`;
}

// ─── SAVE ────────────────────────────────────────────────────────────────────

/**
 * Saves a prediction record for the active user.
 * Writes to BOTH Firestore (if configured) AND localStorage (as local cache).
 */
export async function saveScanHistory(scanData, userId) {
  const effectiveUid = auth?.currentUser?.uid || userId || "guest";

  const record = {
    id: "SCN-" + Date.now().toString(36).toUpperCase() + Math.random().toString(36).substring(2, 5).toUpperCase(),
    userId: effectiveUid,
    timestamp: new Date().toISOString(),
    plant: scanData.plant || "Unknown Crop",
    disease: scanData.disease || "Unspecified Condition",
    class_name: scanData.class_name || "Unknown",
    confidence: typeof scanData.confidence === "number"
      ? `${(scanData.confidence * 100).toFixed(1)}%`
      : scanData.confidence || "90.0%",
    confidenceScore: typeof scanData.confidence === "number" ? scanData.confidence : 0.9,
    symptoms: Array.isArray(scanData.symptoms) ? scanData.symptoms : [],
    causes: Array.isArray(scanData.causes) ? scanData.causes : [],
    treatment: Array.isArray(scanData.treatment) ? scanData.treatment : [],
    prevention: Array.isArray(scanData.prevention) ? scanData.prevention : [],
    agricultural_advice: Array.isArray(scanData.agricultural_advice)
      ? scanData.agricultural_advice.join(" ")
      : scanData.agricultural_advice || scanData.agriculturalAdvice || "",
    top_predictions: scanData.top_predictions || [],
    isReal: Boolean(scanData.isRealPrediction !== false),
  };

  let savedDocId = null;

  // 1. Save to Firestore if Firebase is active and user is authenticated
  if (isFirebaseConfigured && auth?.currentUser) {
    try {
      const { getFirestore, collection, addDoc } = await import("firebase/firestore");
      const { app } = await import("../firebase/config");
      const db = getFirestore(app);

      const docRef = await addDoc(collection(db, "predictions"), {
        ...record,
        userId: auth.currentUser.uid,
      });
      savedDocId = docRef.id;
      record.docId = docRef.id;
      console.log("[History] Successfully saved to Firestore with ID:", savedDocId);
    } catch (err) {
      console.warn("[History] Firestore save warning:", err.code || err.message);
      if (err.code === "permission-denied") {
        throw new Error("Firestore permission denied. Please verify your Firestore security rules are published.");
      }
    }
  }

  // 2. ALWAYS save to localStorage cache (prevents empty history if Firestore has indexing/network latency)
  try {
    const key = getStorageKey(effectiveUid);
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    // Avoid duplicate IDs
    const updated = [record, ...existing.filter((item) => item.id !== record.id)];
    localStorage.setItem(key, JSON.stringify(updated));
    console.log("[History] Cached to localStorage under key:", key);
  } catch (err) {
    console.error("[History] LocalStorage caching error:", err);
  }

  return record;
}

// ─── LOAD ────────────────────────────────────────────────────────────────────

/**
 * Retrieves all scan history for a user, newest first.
 * Queries Firestore WITHOUT requiring a composite index, and falls back gracefully to localStorage.
 */
export async function getUserHistory(userId) {
  const firebaseUser = auth?.currentUser;
  const effectiveUid = firebaseUser?.uid || userId || "guest";

  // 1. Try Firestore if user is authenticated
  if (isFirebaseConfigured && firebaseUser) {
    try {
      const { getFirestore, collection, query, where, getDocs } = await import("firebase/firestore");
      const { app } = await import("../firebase/config");
      const db = getFirestore(app);

      // Simple query with ONLY where clause (does NOT require any composite index)
      const q = query(
        collection(db, "predictions"),
        where("userId", "==", firebaseUser.uid)
      );

      const snap = await getDocs(q);
      const firestoreRecords = snap.docs.map((doc) => ({
        docId: doc.id,
        ...doc.data(),
      }));

      if (firestoreRecords.length > 0) {
        // Sort newest first client-side
        firestoreRecords.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));

        // Sync back to local storage cache
        try {
          const key = getStorageKey(effectiveUid);
          localStorage.setItem(key, JSON.stringify(firestoreRecords));
        } catch (e) {
          // ignore cache write error
        }

        console.log(`[History] Loaded ${firestoreRecords.length} records from Firestore.`);
        return firestoreRecords;
      }
    } catch (err) {
      console.warn("[History] Firestore query warning:", err.code || err.message);
    }
  }

  // 2. Fallback to localStorage cache
  try {
    const key = getStorageKey(effectiveUid);
    const stored = JSON.parse(localStorage.getItem(key) || "[]");
    stored.sort((a, b) => new Date(b.timestamp || 0) - new Date(a.timestamp || 0));
    console.log(`[History] Loaded ${stored.length} records from localStorage.`);
    return stored;
  } catch (err) {
    console.error("[History] LocalStorage read error:", err);
    return [];
  }
}

// ─── DELETE ──────────────────────────────────────────────────────────────────

/**
 * Deletes a scan record by ID.
 */
export async function deleteScanRecord(recordId, userId) {
  const firebaseUser = auth?.currentUser;
  const effectiveUid = firebaseUser?.uid || userId || "guest";

  // 1. Delete from Firestore if docId exists
  if (isFirebaseConfigured && firebaseUser && recordId) {
    try {
      const { getFirestore, doc, deleteDoc } = await import("firebase/firestore");
      const { app } = await import("../firebase/config");
      const db = getFirestore(app);
      await deleteDoc(doc(db, "predictions", recordId));
      console.log("[History] Deleted from Firestore:", recordId);
    } catch (err) {
      console.warn("[History] Firestore delete warning:", err.code || err.message);
    }
  }

  // 2. Delete from localStorage
  try {
    const key = getStorageKey(effectiveUid);
    const existing = JSON.parse(localStorage.getItem(key) || "[]");
    const updated = existing.filter((item) => item.id !== recordId && item.docId !== recordId);
    localStorage.setItem(key, JSON.stringify(updated));
    return true;
  } catch (err) {
    console.error("[History] LocalStorage delete error:", err);
    return false;
  }
}
