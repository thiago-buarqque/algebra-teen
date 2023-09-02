import { v4 as uuidv4, validate as uuidValidate } from "uuid";
import { FirebaseApp, initializeApp } from "firebase/app";
import { Auth, getAuth } from "firebase/auth";
import {
  Firestore,
  getFirestore,
  doc,
  query,
  collection,
  getDocs,
  QueryDocumentSnapshot,
  DocumentData,
  setDoc,
  updateDoc,
  serverTimestamp,
  QueryFieldFilterConstraint,
  getDoc,
  DocumentSnapshot,
  deleteDoc,
  onSnapshot,
  writeBatch
} from "firebase/firestore";
import { TData, IDataBaseProps } from "./types";
import { MESSAGES } from "./constants";
import { DEV_MODE } from "./constants";
import { config } from "./config";
import { generateRandomId } from "../lesson/LessonCreator/util";

export type TResultError = { error: Error | null };
export type TResultSuccess = { error: null; data: TData };

export class DataBase {
  app: FirebaseApp;
  auth: Auth;
  database: Firestore;
  props: IDataBaseProps;

  constructor(props: IDataBaseProps) {
    this.app = initializeApp(config);
    this.auth = getAuth(this.app);
    this.database = getFirestore(this.app);
    this.props = props;
  }

  public async getById(id: string, callback:(doc: DocumentSnapshot<DocumentData>) => void) {
    let docRef = null;

    docRef = await getDoc(
      doc(this.database, `${this.props.path}/${id}`))

    callback(docRef)
  }

  public async addMultiple(data: any[]) {
    const batch = writeBatch(this.database);

    data.forEach(obj => {
      if(!obj.id) {
        obj.id = generateRandomId()
      }
      
      batch.set(doc(this.database, `${this.props.path}/${obj.id}`), obj)
    })

    await batch.commit();
  }

  public async getByIdLive(id: string, callback:(doc: DocumentSnapshot<DocumentData>) => void) {     
    return onSnapshot(doc(this.database, `${this.props.path}/${id}`), callback);
  }

  public async create(data: any, id?: string) {
    return await this._createOrUpdate(data, false, id);
  }

  public async update(data: any, id?: string) {
    return await this._createOrUpdate(data, true, id);
  }

  private async _createOrUpdate(
    data: any,
    update: boolean,
    id?: string
  ): Promise<TResultSuccess | TResultError> {
    if (!this.auth.currentUser) {
      return this._error(MESSAGES.PLEASE_AUTH_USER);
    }

    try {
      id = id ?? uuidv4();
      const createDate = Date.now();

      const documentReference = doc(this.database, `${this.props.path}/${id}`)
      if (!update) {
        await setDoc(documentReference, {
          ...data,
          createDate,
          id,
        });
      } else {
        await updateDoc(documentReference, {
          ...data,
          updateDate: serverTimestamp(),
        });
      }

      return this._success(MESSAGES.DATA_CREATED, { id });
    } catch (error) {
      if (!this.auth.currentUser) {
        return this._error(MESSAGES.DATA_CREATED_FAIL);
      }

      console.log(error);
      return this._error(MESSAGES.AN_ERROR_OCCURRED);
    }
  }

  public async delete(callback: (() => void) | null, ...conditions: QueryFieldFilterConstraint[]) {
    this.listData((refs) => {
      refs.forEach(document => {
        const data = document.data()
        console.log("Data", data.id)
        deleteDoc(doc(this.database, this.props.path +"/"+data.id))
      })
      if(callback) {
        callback()
      }
    }, ...conditions)
  }

  public async listData(
    callback: (data: QueryDocumentSnapshot<DocumentData>[]) => void,
    ...conditions: QueryFieldFilterConstraint[]
  ) {
    let querySnapshot = null;
    if (conditions) {
      querySnapshot = await getDocs(
        query(collection(this.database, this.props.path), ...conditions)
      );
    } else {
      querySnapshot = await getDocs(
        query(collection(this.database, this.props.path))
      );
    }

    callback(querySnapshot.docs);
  }

  private _error(message: string): Promise<TResultError> {
    this._log(message);

    return Promise.resolve({ error: new Error(message) });
  }

  private _success(message: string, data: TData): Promise<TResultSuccess> {
    this._log(message);

    return Promise.resolve({ error: null, data });
  }

  private _isValidToWrite(id: string) {
    if (!this.auth.currentUser) {
      this._error(MESSAGES.PLEASE_AUTH_USER);

      return false;
    }

    if (!uuidValidate(id)) {
      this._error(MESSAGES.PLEASE_INSERT_CORRECT_ID);

      return false;
    }

    return true;
  }

  get isKnownUser(): boolean {
    return !!this.auth.currentUser && !this.auth.currentUser.isAnonymous;
  }

  private _log(...params: any) {
    if (!DEV_MODE) {
      return;
    }
  }
}

// @ts-ignore
window.DataBase = DataBase