import { Injectable } from '@angular/core';
import { AngularFirestore } from '@angular/fire/compat/firestore';
import { User } from '../models/user';
import { Event } from '../models/event';
import { Escala } from '../models/escala';

@Injectable({
  providedIn: 'root'
})
export class DataService {

  constructor(private afs : AngularFirestore) { }

  //USER
  // add user
  addUser(user: User)
  {
    user.id = this.afs.createId();
    return this.afs.collection('users').add(user);
  }
  // get all users
  getAllUsers()
  {
    //return this.afs.collection('users').snapshotChanges();
    return this.afs.collection('users').valueChanges();  
  }
  // get one users
  getUser(id?: string)
  {
    return this.afs.collection('users', ref => ref.where('id', '==', id)).valueChanges();  
  }
  getUserOfNamePass(name: string, pass: string)
  {
    return this.afs.collection('users', ref => {
      return ref
      .where('user_name', '==', name)
      .where('password', '==', pass)
    }).valueChanges();
  }
  // delete user
  deleteUser(id: string)
  {
    return this.afs.doc(`users/${id}`).delete();
  }
  // update user
  updateUser(user: User, id: string)
  {
    this.afs.doc(`users/${id}`).update(user);
  }

  //PERFIL
  // get all perfis
  getAllPerfis()
  {
    return this.afs.collection('perfis').snapshotChanges();
  }
  getPerfil(type: string)
  {
    return this.afs.collection('perfis', ref => ref.where('type', '==', type)).valueChanges();
  }

  //EVENT
  // add event
  addEvent(event: Event)
  {
    event.id = this.afs.createId();
    return this.afs.collection('events').add(event);
  }
  // get all events
  getAllEvents()
  {
    return this.afs.collection('events').snapshotChanges();
  }
  // get one events
  getEvent(id: string)
  {
    return this.afs.doc(`events/${id}`).get();
  }
  // delete event
  deleteEvent(id: string)
  {
    return this.afs.doc(`events/${id}`).delete();
  }
  // update event
  updateEvent(event: Event, id: string)
  {
    this.afs.doc(`events/${id}`).update(event);
  }

  //ESCALAS
  // add escala
  addEscala(escala: Escala)
  {
    escala.id = this.afs.createId();
    return this.afs.collection('escalas').add(escala);
  }
  /*
  // get all events
  getAllEvents()
  {
    return this.afs.collection('/events').snapshotChanges();
  }
  // get one events
  getEvent(id: string)
  {
    return this.afs.doc(`/events/${id}`).get();
  }
  // delete event
  deleteEvent(id: string)
  {
    return this.afs.doc(`/events/${id}`).delete();
  }
  // update event
  updateEvent(event: Event, id: string)
  {
    this.afs.doc(`events/${id}`).update(event);
  }
  */
}
