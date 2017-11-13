import { Component } from '@angular/core';

// Import Firestore
import { AngularFirestore, AngularFirestoreCollection, AngularFirestoreDocument} from 'angularfire2/firestore';

// Import Observable + Map Operator
import { Observable } from 'rxjs/observable';
import 'rxjs/add/operator/map';

// Import Post Interface
import { Post } from '../models/post';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  
  // Define Posts Collection
  postsCol: AngularFirestoreCollection<Post>;
  posts: any;

  // Define Post Document
  postDoc: AngularFirestoreDocument<Post>;
  post: Observable<Post>;

  // Define 2-Way Binding for Form
  title:string;
  content:string;

  // Create Instance of Firestore
  constructor(private afs: AngularFirestore) {

  }

  ngOnInit() {
    // Get All Posts
    this.postsCol = this.afs.collection('posts');

    // Listen for changes + Define Document Id
    this.posts = this.postsCol.snapshotChanges()
      .map(actions => {
        return actions.map(a => {
          const data = a.payload.doc.data() as Post;
          const id = a.payload.doc.id;
          return { id, data };
        })
      }); 
  }

  // Create
  addPost() {
    this.afs.collection('posts').add({'title': this.title, 'content': this.content});
  }

  // Read
  getPost(postId) {
    this.postDoc = this.afs.doc('posts/'+postId);
    this.post = this.postDoc.valueChanges();
  }

  // Delete
  deletePost(postId) {
    this.afs.doc('posts/'+postId).delete();
  }

}
