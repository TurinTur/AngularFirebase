import { Component, OnDestroy } from '@angular/core';
import { AngularFireDatabase, AngularFireList } from 'angularfire2/database';
import { Subscription } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
//export class AppComponent implements OnDestroy  {
export class AppComponent {

  //subscription: Subscription;
  //courses: any[];
  courses$; // Por convención, $ indica que es un observable
  course$
  author$

  ;
    constructor(private db: AngularFireDatabase) {

        this.courses$ = db.list('/courses').valueChanges();   // Forma alternativa mas breve de hacer todo lo comentado. Paso el observable directamente a la template 
        // html y la pipe async se encarga de desenvolver los valores, y de hacer el unsubscribe cuando es debido.

        this.course$ = db.object('/courses/1').valueChanges();
        this.author$ = db.object('/authors/0').valueChanges();
   
        this.obtenerKey ();
                  
        //db.list('/courses').snapshotChanges().subscribe(console.log); //aqui dentro se pueden sacar las keys.

        /*this.subscription = db.list('/courses').valueChanges().subscribe(
          courses => {                                  // Obtener nodo de cursos. Es una subscripción mas permanente, recibe toda la lista cada vez que haya un cambio en la BD
              this.courses = courses;                   //  no como http.get.subscribe que termina en cuanto recibmos el response. tenemos que desubscribirnos.
              console.log(courses);
          });*/

    }

    /*ngOnDestroy(): void {
      this.subscription.unsubscribe();                  // UNSUBSCRIBE
    }*/

      add(course:HTMLInputElement){

        const coursePush: AngularFireList<{}> = this.db.list('/courses');  // Anotamos la const con AngularFireList<{}> para tener el metodo push
        //coursePush.push(course.value)                 // .then(response => {}); si queremos hacer algo tras la escritura en DB
        coursePush.push({
          name: course.value,
          price: 150,
          islive: true,
          sections: [
            { title: 'Components'},
            { title: 'Directives'},
            { title: 'Templates'}
          ]
        })
        course.value='';
      }

      obtenerKey (){                                              // Ejemplo sacado de la doc de como obtener claves
        this.db.list('/courses').snapshotChanges().
        subscribe(resultado => {
          let temp = resultado.keys();
          //let temp2 =resultado.entries();
          console.log(Array.from(temp));
        });
      }

      update (course){

        const key=2;
       // this.db.object('/courses/'+ key).set(course + ' UPDATED');    // tengo que persistir las keys
        /*this.db.object('/courses/'+ key).set({
          title: course,
          price: 15
        }); */
        this.db.object('/courses/'+ key).update({       // UPDATE es como SET pero solo actualiza o crea las propiedades que se usen, mientras que set 
          title: course,                                // reestablece todo el nodo con la información que se ponga (lo borra y lo crea de nuevo)
          price: 15
        }); 
      }

      remove (course){
        const key = 2;
         this.db.object('/courses/'+ key).remove()
            .then (x=>console.log("borrado key "+ key));   
      }
}
