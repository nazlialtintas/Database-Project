import {Injectable} from '@angular/core';
import {HttpClient} from '@angular/common/http';
import {apiUrl} from '../../environments/environment';
import {BehaviorSubject, Observable, of, Subject} from 'rxjs';
import {catchError, tap} from 'rxjs/operators';
import {JwtResponse} from '../response/JwtResponse';
import {CookieService} from 'ngx-cookie-service';
import {User} from '../models/User';
import {ActivatedRoute, Router} from '@angular/router';
import {SignUpRequest} from '../models/SignUpRequest';

@Injectable({
    providedIn: 'root'
})
export class UserService {

    private currentUserSubject: BehaviorSubject<JwtResponse>;
    public currentUser: Observable<JwtResponse>;
    public nameTerms = new Subject<string>();
    public name$ = this.nameTerms.asObservable();
    constructor(private http: HttpClient,
                private router: Router,
                private cookieService: CookieService) {
        const memo = localStorage.getItem('currentUser');
        this.currentUserSubject = new BehaviorSubject<JwtResponse>(JSON.parse(memo));
        this.currentUser = this.currentUserSubject.asObservable();
        cookieService.set('currentUser', memo);
    }

    get currentUserValue() {
       /* if(this.currentUserSubject.value){
            const url = `${apiUrl}/user/logged-in`;
            return this.http.get<any>(url)
            .subscribe(res => 
                this.checkUser(res)
            );
        }*/
        
        return this.currentUserSubject.value;
    }


    login(loginForm): Observable<JwtResponse> {
        const url = `${apiUrl}/user/sign-in`;
        return this.http.post<JwtResponse>(url, loginForm).pipe(
            tap(user => {
                if (user && user.token) {
                    this.cookieService.set('currentUser', JSON.stringify(user));
                    if (loginForm.remembered) {
                        localStorage.setItem('currentUser', JSON.stringify(user));
                    }
                    console.log((user.name));
                    this.nameTerms.next(user.name);
                    this.currentUserSubject.next(user);
                    return user;
                }
            }),
            catchError(this.handleError('Login Failed', null))
        );
    }

    logout() {
        this.currentUserSubject.next(null);
        localStorage.removeItem('currentUser');
        this.cookieService.delete('currentUser');
    }

    signUp(signUpRequest: SignUpRequest): Observable<JwtResponse> {
        const url = `${apiUrl}/user/sign-up`;
        return this.http.post<JwtResponse>(url, signUpRequest);
    }

    update(user: User): Observable<User> {
        const url = `${apiUrl}/user/update`;
        return this.http.post<User>(url, user);    }

    get(): Observable<any> {
        const url = `${apiUrl}/user/profile`;
        return this.http.get<any>(url);
    }


    checkUser(response):void {
        if(!response){
            return;
        }
        if(response.returnCode === 401){
            this.logout();
            this.router.navigate(['/login']);
        }
    }

    addSuggest(email: string, message: string): Observable<any> {
        const url = `${apiUrl}/user/suggest`;
        return this.http.post<any>(url, {
            email: email,
            message: message
        });
    }

    addSupport(message: string): Observable<any> {
        const url = `${apiUrl}/user/support/add/message`;
        return this.http.post<any>(url, {
            message: message
        });
    }

    getSupports(): Observable<any> {
        const url = `${apiUrl}/user/support/messages`;
        return this.http.get<any>(url);
    }


    /**
     * Handle Http operation that failed.
     * Let the app continue.
     * @param operation - name of the operation that failed
     * @param result - optional value to return as the observable result
     */
    private handleError<T>(operation = 'operation', result?: T) {
        return (error: any): Observable<T> => {

            console.log(error); // log to console instead

            // Let the app keep running by returning an empty result.
            return of(result as T);
        };
    }
}
