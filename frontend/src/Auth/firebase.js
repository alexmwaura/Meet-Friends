import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";
import "firebase/storage";
import Config from "../config/config"
firebase.initializeApp(Config)

export default firebase