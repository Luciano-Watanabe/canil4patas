import { collection, getDocs, getDoc, addDoc, updateDoc, deleteDoc, doc, setDoc } from "firebase/firestore";
import { db } from './firebase';
import { Dog, Client, ScheduledMessage, Settings } from '../types';

// --- Dogs Service ---
const dogsCollectionRef = collection(db, "dogs");

export const getDogs = async (): Promise<Dog[]> => {
  const data = await getDocs(dogsCollectionRef);
  return data.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Dog[];
};

export const addDog = async (dogData: Omit<Dog, 'id'>) => {
  return await addDoc(dogsCollectionRef, dogData);
};

export const updateDog = async (id: string, dogData: Partial<Omit<Dog, 'id'>>) => {
  const dogDoc = doc(db, "dogs", id);
  return await updateDoc(dogDoc, dogData);
};

export const deleteDog = async (id: string) => {
  const dogDoc = doc(db, "dogs", id);
  return await deleteDoc(dogDoc);
};

// --- Clients Service ---
const clientsCollectionRef = collection(db, "clients");

export const getClients = async (): Promise<Client[]> => {
  const data = await getDocs(clientsCollectionRef);
  return data.docs.map(doc => ({ ...doc.data(), id: doc.id })) as Client[];
};

export const addClient = async (clientData: Omit<Client, 'id'>) => {
    return await addDoc(clientsCollectionRef, clientData);
};

export const deleteClient = async (id: string) => {
    const clientDoc = doc(db, "clients", id);
    return await deleteDoc(clientDoc);
};

// --- Schedules Service ---
const schedulesCollectionRef = collection(db, "schedules");

export const getSchedules = async (): Promise<ScheduledMessage[]> => {
    const data = await getDocs(schedulesCollectionRef);
    return data.docs.map(doc => ({...doc.data(), id: doc.id})) as ScheduledMessage[];
};

export const addSchedule = async (scheduleData: Omit<ScheduledMessage, 'id'>) => {
    return await addDoc(schedulesCollectionRef, scheduleData);
};

export const deleteSchedule = async (id: string) => {
    const scheduleDoc = doc(db, "schedules", id);
    return await deleteDoc(scheduleDoc);
};


// --- Settings Service ---
const settingsDocRef = doc(db, "settings", "config");

export const getSettings = async (): Promise<Settings> => {
    const docSnap = await getDoc(settingsDocRef);
    if (docSnap.exists()) {
        return docSnap.data() as Settings;
    } else {
        // Return a default value if settings don't exist
        return { whatsappNumber: '5511912345678' };
    }
};

export const updateSettings = async (settingsData: Settings) => {
    // Use setDoc with merge to create or update the document
    return await setDoc(settingsDocRef, settingsData, { merge: true });
};
